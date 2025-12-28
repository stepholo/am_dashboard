
"use client";

import { Suspense } from 'react';
import type { DashboardLink } from '@/lib/types';
import LinkCard from './LinkCard';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import AddLinkButton from '../admin/AddLinkButton';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { DashboardProvider } from '@/context/DashboardContext';
import ContentView from './ContentView';
import { useDashboard } from '@/hooks/useDashboard';
import { collection, query, orderBy } from 'firebase/firestore';

function DashboardGrid() {
  const { user } = useAuth();
  const db = useFirestore();
  const { viewMode } = useDashboard();
  
  const linksQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'dashboardLinks'), orderBy('order', 'asc'));
  }, [db]);
  
  const { data: allLinks, isLoading: linksLoading } = useCollection<DashboardLink>(linksQuery);

  const fetchLinks = () => {
    // This function can be used to trigger a re-fetch if useCollection doesn't automatically update
  }
  
  const linksBySection = allLinks?.reduce((acc, link) => {
    if (!acc[link.section]) {
      acc[link.section] = [];
    }
    acc[link.section].push(link);
    return acc;
  }, {} as Record<string, DashboardLink[]>);

  if (viewMode !== 'grid') {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6">
      {linksBySection && Object.entries(linksBySection).map(([sectionSlug, links]) => (
        <div key={sectionSlug} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight font-headline capitalize">{sectionSlug.replace(/-/g, ' ')}</h1>
            {user?.role === 'admin' && db && <AddLinkButton db={db} section={sectionSlug} onLinkAdded={fetchLinks} />}
          </div>
          
          {linksLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(links?.length || 4)].map((_, i) => <Skeleton key={i} className="h-[280px] rounded-lg" />)}
              </div>
          ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {links?.map(link => (
                  <LinkCard key={link.id} link={link} onUpdate={fetchLinks} />
              ))}
              </div>
          )}
        </div>
      ))}
      {linksLoading && !linksBySection && (
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-[280px] rounded-lg" />)}
         </div>
      )}
    </div>
  );
}

function DashboardContentArea() {
    const { viewMode } = useDashboard();
    if (viewMode === 'grid') {
        return <DashboardGrid />;
    }
    return <ContentView />;
}

export default function DashboardClient({ sectionSlug, sectionName }: { sectionSlug: string; sectionName: string; }) {
    return (
        <DashboardProvider>
           <Suspense fallback={<p>Loading...</p>}>
             <DashboardContentArea />
           </Suspense>
        </DashboardProvider>
    )
}
