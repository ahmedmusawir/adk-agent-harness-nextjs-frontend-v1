/**
 * Unit tests for POST /api/agent/run (BIM-001 thin proxy).
 * Intent (Rule K9): the route forwards verbatim, passes status/auth through,
 * and speaks HTTP on failure (500 config fault, 502 upstream fault) — so the
 * service layer above it can own the contract-level sentinel.
 */

import { POST } from '@/app/api/agent/run/route';

const WRAPPER = 'https://wrapper.example.test';

const fetchMock = jest.fn();

function makeRequest(
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
) {
  return new Request('http://localhost/api/agent/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

const RUN_BODY = {
  agent_name: 'jarvis_agent',
  message: 'hello',
  user_id: 'u-1',
  session_id: null,
};

describe('POST /api/agent/run', () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env.ADK_WRAPPER_URL;

  beforeEach(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
    process.env.ADK_WRAPPER_URL = WRAPPER;
  });

  afterAll(() => {
    global.fetch = originalFetch;
    if (originalEnv === undefined) delete process.env.ADK_WRAPPER_URL;
    else process.env.ADK_WRAPPER_URL = originalEnv;
  });

  it('forwards the body verbatim to {ADK_WRAPPER_URL}/run_agent with a timeout signal', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ response: 'hi', session_id: 's-1' }), {
        status: 200,
      }),
    );

    await POST(makeRequest(RUN_BODY));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${WRAPPER}/run_agent`);
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify(RUN_BODY));
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("returns the wrapper's JSON and status verbatim (200)", async () => {
    const wrapperJson = { response: 'hi from ADK', session_id: 's-1' };
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(wrapperJson), { status: 200 }),
    );

    const res = await POST(makeRequest(RUN_BODY));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual(wrapperJson);
  });

  it('passes non-2xx wrapper statuses through untouched', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ detail: 'validation error' }), {
        status: 422,
      }),
    );

    const res = await POST(makeRequest(RUN_BODY));

    expect(res.status).toBe(422);
    await expect(res.json()).resolves.toEqual({ detail: 'validation error' });
  });

  it('passes through the Authorization header when present', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 200 }));

    await POST(makeRequest(RUN_BODY, { Authorization: 'Bearer tok-123' }));

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe('Bearer tok-123');
  });

  it('omits the Authorization header when absent', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 200 }));

    await POST(makeRequest(RUN_BODY));

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers).not.toHaveProperty('Authorization');
  });

  it('returns 502 { error } when the wrapper is unreachable', async () => {
    fetchMock.mockRejectedValue(new Error('connect ECONNREFUSED'));

    const res = await POST(makeRequest(RUN_BODY));

    expect(res.status).toBe(502);
    const json = await res.json();
    expect(typeof json.error).toBe('string');
    expect(json.error).toContain('ECONNREFUSED');
  });

  it('returns 500 { error } and makes zero HTTP calls when ADK_WRAPPER_URL is unset', async () => {
    delete process.env.ADK_WRAPPER_URL;

    const res = await POST(makeRequest(RUN_BODY));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: 'ADK_WRAPPER_URL is not configured',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
