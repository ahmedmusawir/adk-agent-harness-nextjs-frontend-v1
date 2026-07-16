/**
 * POST /api/agent/run — thin proxy to the Python ADK wrapper (BIM-001).
 *
 * Forwards the request body verbatim to {ADK_WRAPPER_URL}/run_agent and returns
 * the wrapper's JSON + status verbatim. Zero intelligence by design: session
 * create/retry logic stays in the wrapper until Phase B (BIM-002) ports it here.
 *
 * @see agent_docs/CURRENT_APP/BIM001/DATA_CONTRACT_AMENDMENT.md §A1.2
 */

import { NextResponse } from 'next/server';

// Wrapper's run_agent can take up to 60s internally; client budget is 90s.
// maxDuration keeps a future serverless host from imposing a shorter default.
export const maxDuration = 90;

const RUN_TIMEOUT_MS = 90_000;

export async function POST(req: Request) {
  const wrapperUrl = process.env.ADK_WRAPPER_URL;
  if (!wrapperUrl) {
    return NextResponse.json(
      { error: 'ADK_WRAPPER_URL is not configured' },
      { status: 500 },
    );
  }

  const body = await req.text();
  const auth = req.headers.get('authorization'); // reserved auth slot (Brief §7)

  try {
    const upstream = await fetch(`${wrapperUrl}/run_agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Authorization: auth } : {}),
      },
      body,
      signal: AbortSignal.timeout(RUN_TIMEOUT_MS),
    });
    return new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
