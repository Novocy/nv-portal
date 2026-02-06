import { NextResponse } from 'next/server';
import { HubSpotClient } from '@/lib/hubspot/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, loginTimestamp } = body ?? {};

    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    const hs = new HubSpotClient();

    await hs.sendLoginEvent({
      email,
      loginTimestamp,
    });

    // Analytics should never block auth flows
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Intentionally swallow errors (log if you want)
    console.error('Login event failed:', err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
