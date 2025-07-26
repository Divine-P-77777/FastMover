'use client';

import React, { useState } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '@/store/store';
import { SessionProvider } from 'next-auth/react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export function Provider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <SessionProvider>
            <SessionContextProvider supabaseClient={supabaseClient}>
              {children}
            </SessionContextProvider>
          </SessionProvider>
        </AuthProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
