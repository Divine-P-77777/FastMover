'use client';

import React from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '@/store/store';

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>{children}</AuthProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
