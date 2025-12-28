"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AppSidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Logo from '@/components/Logo';
import { useFirestore } from '@/firebase';
import { seedInitialData } from '@/lib/firebase/firestore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const db = useFirestore();
  const [seeding, setSeeding] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && db) {
      seedInitialData(db).catch(err => {
        console.error("Seeding failed:", err);
        setError("Failed to initialize app data. Please refresh.");
      }).finally(() => {
        setSeeding(false);
      });
    }
  }, [user, db]);

  const isLoading = authLoading || seeding;

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
         <div className="flex flex-col items-center gap-4">
            <Logo className="h-16 w-auto" />
            <p className="text-muted-foreground">{error ? error : "Loading TractorLink..."}</p>
        </div>
      </div>
    );
  }


  return (
    <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
            <Header />
            <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}
