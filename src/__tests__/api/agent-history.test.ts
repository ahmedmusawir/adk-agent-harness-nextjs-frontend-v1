/**
 * Unit tests for POST /api/agent/history (BIM-001 thin proxy).
 * Intent (Rule K9): same verbatim-forward guarantees as /api/agent/run —
 * the route never unwraps `.history`; that is chatService's job.
 */

import { POST } from '@/app/api/agent/history/route';

const WRAPPER = 'https://wrapper.example.test';

const fetchMock = jest.fn();

function makeRequest(
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
) {
  return new Request('http://localhost/api/agent/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

const HISTORY_BODY = {
  agent_name: 'jarvis_agent',
  user_id: 'u-1',
  session_id: 's-1',
};

describe('POST /api/agent/history', () => {
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

  it('forwards the body verbatim to {ADK_WRAPPER_URL}/get_history with a timeout signal', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ history: [] }), { status: 200 }),
    );

    await POST(makeRequest(HISTORY_BODY));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${WRAPPER}/get_history`);
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify(HISTORY_BODY));
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("returns the wrapper's JSON verbatim without unwrapping .history", async () => {
    const wrapperJson = {
      history: [
        { role: 'user', content: 'hi' },
        { role: 'assistant', content: 'hello there' },
      ],
    };
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(wrapperJson), { status: 200 }),
    );

    const res = await POST(makeRequest(HISTORY_BODY));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual(wrapperJson);
  });

  it('passes through the Authorization header when present', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 200 }));

    await POST(makeRequest(HISTORY_BODY, { Authorization: 'Bearer tok-123' }));

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe('Bearer tok-123');
  });

  it('returns 502 { error } when the wrapper is unreachable', async () => {
    fetchMock.mockRejectedValue(new Error('fetch failed'));

    const res = await POST(makeRequest(HISTORY_BODY));

    expect(res.status).toBe(502);
    const json = await res.json();
    expect(typeof json.error).toBe('string');
  });

  it('returns 500 { error } and makes zero HTTP calls when ADK_WRAPPER_URL is unset', async () => {
    delete process.env.ADK_WRAPPER_URL;

    const res = await POST(makeRequest(HISTORY_BODY));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: 'ADK_WRAPPER_URL is not configured',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
