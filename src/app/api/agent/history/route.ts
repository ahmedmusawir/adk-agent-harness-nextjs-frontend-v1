/**
 * POST /api/agent/history — thin proxy to the Python ADK wrapper (BIM-001).
 *
 * Forwards the request body verbatim to {ADK_WRAPPER_URL}/get_history and
 * returns the wrapper's JSON + status verbatim. The service layer (not this
 * route) unwraps `.history` — routes speak HTTP, services speak contract.
 *
 * @see agent_docs/CURRENT_APP/BIM001/DATA_CONTRACT_AMENDMENT.md §A1.2
 */

import { NextResponse } from 'next/server';

const HISTORY_TIMEOUT_MS = 30_000;

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
    const upstream = await fetch(`${wrapperUrl}/get_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Authorization: auth } : {}),
      },
      body,
      signal: AbortSignal.timeout(HISTORY_TIMEOUT_MS),
    });
    return new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
