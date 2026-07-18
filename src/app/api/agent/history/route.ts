/**
 * POST /api/agent/history — native ADK connector (BIM-002; upstream is now
 * the ADK bundle's api_server directly — the Python wrapper is retired).
 *
 * External contract FROZEN and identical to A1: accepts GetHistoryRequest →
 * `{ history: Message[] }` (the service unwraps `.history`, unchanged);
 * 500 config fault, 502 upstream fault; Authorization passed through (R2).
 * Internals GET the native session and normalize its events per A2.3 §4.
 *
 * @see agent_docs/CURRENT_APP/BIM002/DATA_CONTRACT_AMENDMENT_A2.md
 */

import { NextResponse } from 'next/server';

import type { GetHistoryRequest } from '@/types';

import { normalizeHistory, sessionUrl } from '../_lib/adk';

const HISTORY_TIMEOUT_MS = 30_000;

export async function POST(req: Request) {
  const baseUrl = process.env.ADK_BUNDLE_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: 'ADK_BUNDLE_URL is not configured' },
      { status: 500 },
    );
  }

  const auth = req.headers.get('authorization'); // reserved auth slot (R2)

  try {
    const body = (await req.json()) as GetHistoryRequest;
    const upstream = await fetch(
      sessionUrl(baseUrl, body.agent_name, body.user_id, body.session_id),
      {
        method: 'GET',
        headers: { ...(auth ? { Authorization: auth } : {}) },
        signal: AbortSignal.timeout(HISTORY_TIMEOUT_MS),
      },
    );
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `History fetch failed: ${upstream.status}` },
        { status: 502 },
      );
    }
    const session: unknown = await upstream.json();
    return NextResponse.json(
      { history: normalizeHistory(session) },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
