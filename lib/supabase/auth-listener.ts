'use client';

import { supabase } from './supabaseClient';

let initialized = false;
const DEDUPE_WINDOW_MS = 60_000; // 1 minute

export function initAuthAnalyticsListener() {
  if (initialized) return;
  initialized = true;

  supabase.auth.onAuthStateChange((event, session) => {
    if (event !== 'SIGNED_IN' || !session?.user) return;

    const user = session.user;
    const now = Date.now();
    const key = `auth-login:${user.id}`;

    const lastLoggedAt = Number(localStorage.getItem(key) ?? 0);

    // Cross-tab + refresh dedupe
    if (now - lastLoggedAt < DEDUPE_WINDOW_MS) return;

    localStorage.setItem(key, String(now));

    const createdAt = user.created_at ? new Date(user.created_at).getTime() : null;

    const lastSignInAt = user.last_sign_in_at ? new Date(user.last_sign_in_at).getTime() : null;

    const isFirstLogin =
      createdAt !== null && (lastSignInAt === null || Math.abs(createdAt - lastSignInAt) < 1000);

    const endpoint = isFirstLogin ? '/api/events/firstlogin' : '/api/events/login';

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        userUuid: user.id,
        loginTimestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // intentionally ignored
    });
  });
}
