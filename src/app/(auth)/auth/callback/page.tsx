'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.slice(1));
      const type = params.get('type');
      const access_token = params.get('access_token');

      if (!access_token) {
        router.push('/auth?error=Invalid or expired token');
        return;
      }

      if (type === 'recovery') {
        // ✅ If password reset
        router.push('/auth/reset-password');
      } else {
        // ✅ For OAuth (e.g., Google) login success
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          router.push('/auth?error=Session not found');
        } else {
          const role = data.session.user?.user_metadata?.role;

          if (role === 'admin') {
            router.push('/admin');
          } else if (role === 'driver') {
            router.push('/driver/dashboard');
          } else {
            router.push('/client/home');
          }
        }
      }
    };

    handleAuthRedirect();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="mt-2 text-sm text-muted-foreground">Finalizing login...</p>
      </div>
    </div>
  );
}
