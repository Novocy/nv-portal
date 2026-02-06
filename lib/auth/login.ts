import { supabase } from '@/lib/supabaseClient';

export async function signInWithEmailPassword(email: string, password: string) {
  const cleanEmail = email.trim();
  const cleanPassword = password.trim();

  if (!cleanEmail || !cleanPassword) {
    throw new Error('Email and password are required');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: cleanPassword,
  });

  if (error) {
    throw error;
  }

  // Fire-and-forget login event
  const user = data?.user;
  if (user?.email && user?.id) {
    fetch('/api/events/login', {
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
  }

  return data;
}

export async function signInWithGoogle(redirectTo?: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo ?? `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
