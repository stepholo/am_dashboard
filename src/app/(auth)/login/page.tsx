"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth as useFirebaseCoreAuth } from '@/firebase';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { ALLOWED_DOMAIN } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const auth = useFirebaseCoreAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Authentication service is not ready.',
        description: 'Please try again in a moment.',
      });
      return;
    }
    const firebaseUser = await signInWithGoogle(auth);
    if (firebaseUser && firebaseUser.email && !firebaseUser.email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: `Please sign in with a @${ALLOWED_DOMAIN} email address.`,
      });
    }
  };
  
  if (loading || user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Logo className="h-16 w-auto" />
            <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-10 w-auto">
                <Logo />
            </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button onClick={handleSignIn} className="w-full" size="lg" disabled={!auth}>
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308.6 102.3 282.7 90 248 90c-82.3 0-149.3 67-149.3 149.3s67 149.3 149.3 149.3c90.8 0 133.5-62.2 137.9-93.5h-138v-78h255.4c1.4 9.6 2.2 20.2 2.2 31.4z"></path></svg>
              Sign in with Google
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Authorized users with an @{ALLOWED_DOMAIN} account only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
