"use client";

import { useEffect, useState } from 'react';
import { getLinksForSection } from '@/lib/firebase/firestore';
import type { DashboardLink } from '@/lib/types';
import LinkCard from './LinkCard';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import AddLinkButton from '../admin/AddLinkButton';
import { useFirestore } from '@/firebase';

export default function DashboardClient({ sectionSlug, sectionName }: { sectionSlug: string; sectionName: string }) {
  const { user, loading: authLoading } = useAuth();
  const db = useFirestore();
  const [links, setLinks] = useState<DashboardLink[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    if (!db) return;
    setLoading(true);
    const fetchedLinks = await getLinksForSection(db, sectionSlug);
    setLinks(fetchedLinks);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && db) {
        fetchLinks();
    }
  }, [sectionSlug, db, authLoading]);

  return (
    <div className="flex flex-col gap-6">
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
