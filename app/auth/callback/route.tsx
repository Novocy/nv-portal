import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { HubSpotClient } from '@/lib/hubspot/client';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user?.email && data.user.id) {
      // Fire-and-forget login event
      try {
        const hs = new HubSpotClient();

        await hs.sendLoginEvent({
          email: data.user.email,
          loginTimestamp: new Date().toISOString(),
        });
      } catch (err) {
        // Never block auth on analytics
        console.error('HubSpot login event failed:', err);
      }
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
