"use client";

import { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import type { DashboardLink } from '@/lib/types';
import LinkCard from './LinkCard';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import AddLinkButton from '../admin/AddLinkButton';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { DashboardProvider } from '@/context/DashboardContext';
import ContentView from './ContentView';
import { useDashboard } from '@/hooks/useDashboard';
import { collection, query, where, orderBy } from 'firebase/firestore';

function DashboardGrid({ sectionSlug, sectionName, initialLinkId }: { sectionSlug: string; sectionName: string; initialLinkId?: string; }) {
  const { user } = useAuth();
  const db = useFirestore();
  
  const linksQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'dashboardLinks'), where('section', '==', sectionSlug), orderBy('order', 'asc'));
  }, [db, sectionSlug]);
  
  const { data: links, isLoading: linksLoading, error } = useCollection<DashboardLink>(linksQuery);
  const { viewMode, openInSinglePane } = useDashboard();
  const [hasOpenedInitial, setHasOpenedInitial] = useState(false);

  useEffect(() => {
    const openInitialLink = async () => {
        if (db && initialLinkId && links && !hasOpenedInitial) {
            const link = links.find(l => l.id === initialLinkId);
            if (link && link.type === 'embed') {
                openInSinglePane(link.url, link.name);
                setHasOpenedInitial(true);
            } else if (link) { // for external/protocol links
                window.open(link.url, '_blank');
                setHasOpenedInitial(true);
            }
        }
    };
    openInitialLink();
  }, [initialLinkId, links, db, openInSinglePane, hasOpenedInitial]);


  const fetchLinks = () => {
    // This function can be used to trigger a re-fetch if useCollection doesn't automatically update
    // For now, we let useCollection handle real-time updates
  }
  
  return (
    <>
        <div className={`flex-col gap-6 ${viewMode !== 'grid' ? 'hidden' : 'flex'}`}>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight font-headline">{sectionName}</h1>
                {user?.role === 'admin' && db && <AddLinkButton db={db} section={sectionSlug} onLinkAdded={fetchLinks} />}
            </div>
            
            {linksLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-[280px] rounded-lg" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {links?.map(link => (
                    <LinkCard key={link.id} link={link} onUpdate={fetchLinks} />
                ))}
                </div>
            )}
        </div>
        <ContentView />
    </>
  );
}

export default function DashboardClient({ sectionSlug, sectionName, initialLinkId }: { sectionSlug: string; sectionName: string; initialLinkId?: string; }) {
    return (
        <DashboardProvider>
            <DashboardGrid sectionSlug={sectionSlug} sectionName={sectionName} initialLinkId={initialLinkId} />
        </DashboardProvider>
    )
}
