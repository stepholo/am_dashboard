"use client";

import type { DashboardLink } from '@/lib/types';
import LinkCard from './LinkCard';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import AddLinkButton from '../admin/AddLinkButton';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import ContentView from './ContentView';
import { useDashboard } from '@/hooks/useDashboard';
import { collection, query, orderBy, where } from 'firebase/firestore';

export default function DashboardClient({ sectionSlug, sectionName }: { sectionSlug: string; sectionName: string; }) {
    const { user } = useAuth();
    const db = useFirestore();
    const { viewMode } = useDashboard();

    const linksQuery = useMemoFirebase(() => {
        if (!db) return null;
        if (sectionSlug === 'personal-links') {
            if (!user) return null;
            return query(collection(db, 'users', user.uid, 'dashboardLinks'), orderBy('name', 'asc'));
        }
        return query(
            collection(db, 'dashboardLinks'),
            where('section', '==', sectionSlug),
            orderBy('order', 'asc')
        );
    }, [db, sectionSlug, user]);
    
    const { data: links, isLoading: linksLoading } = useCollection<DashboardLink>(linksQuery);

    const fetchLinks = () => {
        // This function can be used to trigger a re-fetch if useCollection doesn't automatically update
    }

    if (viewMode !== 'grid') {
        return <ContentView />;
    }
    
    const canAddLinks = user?.role === 'admin' || sectionSlug === 'personal-links';

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-col gap-8 p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight font-headline capitalize">{sectionName}</h1>
                        {canAddLinks && db && <AddLinkButton db={db} section={sectionSlug} onLinkAdded={fetchLinks} />}
                    </div>
                    
                    {linksLoading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[280px] rounded-lg" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {links?.map(link => (
                                <LinkCard key={link.id} link={link} onUpdate={fetchLinks} isPersonal={sectionSlug === 'personal-links'} />
                            ))}
                        </div>
                    )}
                </div>

                {linksLoading && !links && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-[280px] rounded-lg" />)}
                    </div>
                )}
            </div>
        </div>
    );
}
