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

export default function DashboardClient({ sectionSlug, sectionName }: { sectionSlug: string; sectionName: string }) {
  const { viewMode } = useDashboard();
  const { user } = useAuth();
  const [links, setLinks] = useState<DashboardLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      const fetchedLinks = await getLinksForSection(sectionSlug);
      setLinks(fetchedLinks);
      setLoading(false);
    };
    fetchLinks();
  }, [sectionSlug]);

  if (viewMode !== 'grid') {
    return <ContentView />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight font-headline">{sectionName}</h1>
        {user?.role === 'admin' && <AddLinkButton section={sectionSlug} onLinkAdded={() => getLinksForSection(sectionSlug).then(setLinks)} />}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {links.map(link => (
            <LinkCard key={link.id} link={link} onUpdate={() => getLinksForSection(sectionSlug).then(setLinks)} />
          ))}
        </div>
      )}
    </div>
  );
}
