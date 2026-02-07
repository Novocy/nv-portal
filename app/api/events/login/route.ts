import { NextResponse } from 'next/server';
import { HubSpotEventsClient } from '@/lib/hubspot/events';

const loginEventCache = new Map<string, number>();
const IDEMPOTENCY_WINDOW_MS = 60_000;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, loginTimestamp } = body ?? {};

    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    const now = Date.now();
    const cacheKey = `login:${email}`;

    const lastSentAt = loginEventCache.get(cacheKey) ?? 0;

    // Idempotency guard
    if (now - lastSentAt < IDEMPOTENCY_WINDOW_MS) {
      return NextResponse.json({ ok: true, deduped: true });
    }

    loginEventCache.set(cacheKey, now);

    const hubspot = new HubSpotEventsClient();

    await hubspot.sendLoginEvent({
      email,
      loginTimestamp,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('HubSpot login event failed:', err);
    return NextResponse.json({ ok: true });
  }
}
