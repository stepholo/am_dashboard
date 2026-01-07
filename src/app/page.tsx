
import { Suspense } from 'react';
import HomeClient from './HomeClient';
import Logo from '@/components/Logo';

export default function Home() {
  return (
    <Suspense fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Logo className="h-16 w-auto" />
                <p className="text-muted-foreground">Loading AM Dashboard...</p>
            </div>
        </div>
    }>
      <HomeClient />
    </Suspense>
  );
}
