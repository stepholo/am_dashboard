"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth as useFirebaseCoreAuth } from '@/firebase';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ALLOWED_DOMAIN } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/Logo';

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
            <div className="mx-auto mb-4 h-12 w-auto text-primary">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 402 163" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
                    <g fill="currentColor">
                        <path d="M 64.39 121.99 C 38.75 118.29 20.63 97.38 20.63 71.50 C 20.63 42.97 42.97 20.63 71.50 20.63 C 99.98 20.63 122.23 42.94 122.23 71.50 C 122.23 81.14 120.34 88.50 115.52 97.56 C 112.51 103.23 112.42 105.54 114.92 113.75 C 115.99 117.29 116.38 120.00 115.82 120.00 C 115.27 120.00 111.45 119.02 107.33 117.82 L 99.84 115.64 L 90.17 118.77 C 79.55 122.20 72.20 123.12 64.39 121.99ZM 58.76 92.58 C 62.21 89.42 62.50 88.73 62.50 83.66 C 62.50 79.22 62.03 77.67 60.08 75.58 L 57.65 73.00 L 74.66 73.00 C 84.01 73.00 91.94 72.73 92.26 72.40 C 92.59 72.07 92.62 71.17 92.32 70.40 C 91.89 69.27 88.32 69.00 73.89 69.00 C 63.63 69.00 56.00 68.61 56.00 68.08 C 56.00 67.57 62.19 66.92 69.75 66.63 C 77.31 66.34 84.17 66.08 85.00 66.04 C 87.61 65.92 100.00 67.22 100.00 67.61 C 100.00 68.81 93.41 82.62 92.54 83.23 C 91.97 83.64 85.79 83.98 78.81 83.98 C 70.59 83.99 65.88 84.39 65.43 85.11 C 64.31 86.93 67.13 87.97 73.25 87.98 C 78.09 88.00 79.00 88.28 79.00 89.78 C 79.00 90.76 79.70 92.56 80.56 93.78 C 83.62 98.15 91.00 95.53 91.00 90.06 C 91.00 88.12 91.72 87.17 93.75 86.39 C 96.27 85.43 99.07 80.34 103.70 68.33 C 103.95 67.68 103.22 66.22 102.08 65.08 C 100.46 63.46 98.74 63.00 94.25 63.00 L 88.50 63.00 L 88.50 55.65 C 88.50 48.21 87.25 45.00 84.35 45.00 C 82.09 45.00 80.77 50.04 81.29 56.75 L 81.77 63.00 L 68.88 63.00 C 57.33 63.00 55.79 63.21 54.00 65.00 C 52.90 66.10 52.00 67.62 52.00 68.39 C 52.00 69.20 50.46 70.07 48.32 70.47 C 43.99 71.28 38.44 76.39 37.40 80.53 C 36.32 84.84 38.90 91.03 42.90 93.72 C 48.21 97.28 54.09 96.86 58.76 92.58ZM 46.33 91.56 C 38.08 87.92 39.67 76.60 48.80 74.02 C 52.31 73.03 52.66 73.15 55.75 76.47 C 63.22 84.51 56.12 95.89 46.33 91.56ZM 84.25 92.30 C 82.18 91.53 82.75 88.00 84.94 88.00 C 86.01 88.00 87.19 88.49 87.56 89.10 C 88.42 90.49 85.91 92.91 84.25 92.30Z"/>
                    </g>
                </svg>
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
