'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isDriver: boolean;
  isClient: boolean;
  signUp: (
    email: string,
    password: string,
    username: string,
    role: 'client' | 'driver'
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (newPassword: string, code?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isAdmin: false,
  isDriver: false,
  isClient: false,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const role = user?.user_metadata?.role;
  const isAdmin = role === 'admin';
  const isDriver = role === 'driver';
  const isClient = role === 'client';

  // Load session + listen for changes
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error('Session error:', error);
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    loadSession();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔐 Signup with role + username
  const signUp = async (
    email: string,
    password: string,
    username: string,
    role: 'client' | 'driver'
  ) => {
    const { data: existingUser } = await supabase
      .from('profiles')
      .select()
      .eq('username', username)
      .single();

    if (existingUser) throw new Error('Username already taken');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, role },
      },
    });

    if (error) throw error;

    // Insert user into DB
    await supabase.from('users').insert({
      id: data.user?.id,
      email,
      username,
      role,
    });

    if (role === 'driver') {
      await supabase.from('drivers').insert({
        user_id: data.user?.id,
        vehicle_number: '',
        verified: false,
      });
    }
  };

  // 🔐 Sign In
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  // 🔐 Sign in with Google
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  // 🚪 Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = '/auth';
  };

  // 🔑 Forgot password
  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
  };

  // 🔄 Reset password
  const resetPassword = async (newPassword: string, code?: string) => {
    const { error } = await supabase.auth.updateUser(
      { password: newPassword },
      {
        emailRedirectTo: `${window.location.origin}/auth`,
        token: code,
      } as any
    );
    if (error) throw new Error(error.message);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAdmin,
        isDriver,
        isClient,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        forgotPassword,
        resetPassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 🔁 Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
