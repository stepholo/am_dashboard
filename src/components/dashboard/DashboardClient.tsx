"use client";

import { useEffect, useState } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { getLinksForSection } from '@/lib/firebase/firestore';
import type { DashboardLink } from '@/lib/types';
import ContentView from './ContentView';
import LinkCard from './LinkCard';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import AddLinkButton from '../admin/AddLinkButton';
import { useFirestore } from '@/firebase';

export default function DashboardClient({ sectionSlug, sectionName }: { sectionSlug: string; sectionName: string }) {
  const { viewMode } = useDashboard();
  const { user, loading: authLoading } = useAuth();
  const db = useFirestore();
  const [links, setLinks] = useState<DashboardLink[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    if (!db || !user) return;
    setLoading(true);
    // Pass the user's admin status to the function
    const fetchedLinks = await getLinksForSection(db, sectionSlug, user.role === 'admin');
    setLinks(fetchedLinks);
    setLoading(false);
  };

  useEffect(() => {
    // Only fetch links once the user's auth state is determined
    if (!authLoading && user) {
        fetchLinks();
    } else if (!authLoading && !user) {
        // If user is not logged in and we're done checking, stop loading.
        setLoading(false);
    }
  }, [sectionSlug, db, user, authLoading]);

  return (
    <div className="flex flex-col gap-6">
      {viewMode !== 'grid' && <ContentView />}
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight font-headline">{sectionName}</h1>
        {user?.role === 'admin' && db && <AddLinkButton db={db} section={sectionSlug} onLinkAdded={fetchLinks} />}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-[280px] rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {links.map(link => (
            <LinkCard key={link.id} link={link} onUpdate={fetchLinks} />
          ))}
        </div>
      )}
    </div>
  );
}
