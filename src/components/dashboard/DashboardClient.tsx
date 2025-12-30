
"use client";

import { useState } from 'react';
import type { DashboardLink } from '@/lib/types';
import LinkCard from './LinkCard';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import LinkEditorDialog from '../admin/AddLinkButton';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import ContentView from './ContentView';
import { useDashboard } from '@/hooks/useDashboard';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Plus } from 'lucide-react';
import LinkListItem from './LinkListItem';
import { Table, TableBody, TableHeader, TableHead, TableRow, TableCell } from '@/components/ui/table';
import SearchResultsView from './SearchResultsView';

export default function DashboardClient({ sectionSlug, sectionName }: { sectionSlug: string; sectionName: string; }) {
    const { user } = useAuth();
    const db = useFirestore();
    const { viewMode: globalViewMode } = useDashboard();
    
    const [localViewMode, setLocalViewMode] = useState<'grid' | 'list'>('grid');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<DashboardLink | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

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
    }, [db, sectionSlug, user, refreshKey]);
    
    const { data: links, isLoading } = useCollection<DashboardLink>(linksQuery);

    const refreshLinks = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    const handleAddLink = () => {
        setEditingLink(null);
        setIsEditorOpen(true);
    };

    const handleEditLink = (link: DashboardLink) => {
        setEditingLink(link);
        setIsEditorOpen(true);
    }

    if (globalViewMode === 'search') {
        return <SearchResultsView />;
    }

    if (globalViewMode !== 'grid') {
        return <ContentView />;
    }
    
    const canAddLinks = user?.role === 'admin' || sectionSlug === 'personal-links';

    return (
        <div className="flex flex-1 flex-col">
            {db && user && (
                <LinkEditorDialog
                    db={db}
                    user={user}
                    section={sectionSlug}
                    onLinkAdded={refreshLinks}
                    isOpen={isEditorOpen}
                    setIsOpen={setIsEditorOpen}
                    linkToEdit={editingLink}
                />
            )}
            <div className="flex flex-col gap-8 p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight font-headline capitalize">{sectionName}</h1>
                        {canAddLinks && (
                            <Button size="sm" onClick={handleAddLink}><Plus className="mr-2 h-4 w-4" />Add Link</Button>
                        )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-2 ml-auto">
                            <Button variant={localViewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setLocalViewMode('grid')}>
                                <LayoutGrid className="h-5 w-5" />
                                <span className="sr-only">Grid View</span>
                            </Button>
                             <Button variant={localViewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setLocalViewMode('list')}>
                                <List className="h-5 w-5" />
                                 <span className="sr-only">List View</span>
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        localViewMode === 'grid' ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[280px] rounded-lg" />)}
                            </div>
                        ) : (
                             <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="hidden md:table-cell">Description</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[...Array(4)].map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-48" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )
                    ) : (
                        localViewMode === 'grid' ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {links?.map(link => (
                                    <LinkCard 
                                        key={link.id} 
                                        link={link} 
                                        isPersonal={sectionSlug === 'personal-links'} 
                                        onUpdate={refreshLinks}
                                        onEdit={() => handleEditLink(link)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="hidden md:table-cell">Description</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {links?.map(link => (
                                            <LinkListItem 
                                                key={link.id} 
                                                link={link} 
                                                isPersonal={sectionSlug === 'personal-links'} 
                                                onUpdate={refreshLinks}
                                                onEdit={() => handleEditLink(link)}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
