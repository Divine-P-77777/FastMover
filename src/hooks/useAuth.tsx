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
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (newPassword: string, code?: string) => Promise<void>;
  signInAsDriver: (username: string, password: string) => Promise<void>;
  signInAsAdmin: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isAdmin: false,
  isDriver: false,
  isClient: false,
  signUp: async () => { },
  signIn: async () => { },
  signInWithGoogle: async () => { },
  signOut: async () => { },
  forgotPassword: async () => { },
  resetPassword: async () => { },
  signInAsDriver: async () => { },
  signInAsAdmin: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const role = user?.user_metadata?.role;
  const isAdmin = role === 'admin';
  const isDriver = role === 'driver';
  const isClient = role === 'client';

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

  // ✅ CLIENT SIGN UP only
  const signUp = async (email: string, password: string, username: string) => {
    if (!email || !password || !username) {
      throw new Error('All fields are required.');
    }

    // Check for existing user with same username
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) throw new Error('Username already taken');

    // ✅ Check if email is already used (possibly via Google OAuth)
    const { data: existingEmail } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingEmail) {
      throw new Error('Email already registered. Try signing in with Google.');
    }

    // Signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, role: 'client' },
      },
    });

    if (error) throw error;

    // Create entry in custom 'users' table
    // await supabase.from('users').insert({
    //   id: data.user?.id,
    //   email,
    //   username,
    //   role: 'client',
    // });
  };


  // for client 
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  // ✅ CUSTOM PARTNER SIGN-IN (uses custom table)
  const signInAsDriver = async (username: string, password: string) => {
    const { data, error } = await supabase
      .from('partner_credentials')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      throw new Error('Invalid credentials');
    }

    // Optionally: manually sign in user to Supabase (if you're syncing)
    // Or: store a session yourself if doing custom auth
    return data;
  };

  // ✅ GOOGLE SIGN IN (only for client)
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  // ✅ ADMIN SIGN IN (with role check)
  const signInAsAdmin = async (email: string, password: string) => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);

    const userId = authData.user?.id;

    // Check user role in `users` table
    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    const allowedRoles = ['admin', 'host_admin'];

    if (roleError || !userData || !allowedRoles.includes(userData.role)) {
      await supabase.auth.signOut();
      throw new Error('Access denied: Admins only');
    }
  };


  // ✅ LOGOUT
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = '/auth';
  };

  // ✅ FORGOT PASSWORD
  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
  };

  // ✅ RESET PASSWORD
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
        signInAsDriver,
        signInAsAdmin
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
