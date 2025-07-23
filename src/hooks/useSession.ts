// hooks/useSession.ts
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import type { Session } from '@supabase/supabase-js';

export function useSession(): Session | null {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for auth state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return session;
}
