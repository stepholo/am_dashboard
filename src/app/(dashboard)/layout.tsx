
"use client";

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AppSidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Logo from '@/components/Logo';
import { DashboardProvider } from '@/context/DashboardContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
         <div className="flex flex-col items-center gap-4">
            <Logo className="h-16 w-auto" />
            <p className="text-muted-foreground">Loading TractorLink...</p>
        </div>
      </div>
    );
  }


  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DashboardProvider>
          <SidebarProvider>
              <AppSidebar user={user} />
              <SidebarInset>
                <div className="flex flex-1 flex-col">
                  <Header />
                  <main className="flex-1 p-4 sm:p-6 flex flex-col">{children}</main>
                </div>
              </SidebarInset>
          </SidebarProvider>
      </DashboardProvider>
    </Suspense>
  );
}
