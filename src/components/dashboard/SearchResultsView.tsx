
"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { DashboardLink } from "@/lib/types";
import { useMemo } from "react";
import LinkListItem from "./LinkListItem";
import { Table, TableBody, TableHeader, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import EmptyState from "./EmptyState";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

export default function SearchResultsView() {
  const { searchQuery, showGrid } = useDashboard();
  const db = useFirestore();

  const allLinksQuery = useMemoFirebase(
    () => (db ? query(collection(db, "dashboardLinks"), orderBy("name")) : null),
    [db]
  );
  const { data: allLinks, isLoading } = useCollection<DashboardLink>(allLinksQuery);
  
  const personalLinksQuery = useMemoFirebase(
    // NOTE: This part needs a user ID to be truly functional.
    // For now, we'll assume a placeholder or that the logic will be adapted
    // when a user is properly authenticated and their ID is available.
    () => (db ? query(collection(db, "users", "placeholder-user-id", "dashboardLinks"), orderBy("name")) : null),
    [db]
  );
  const { data: personalLinks, isLoading: isLoadingPersonal } = useCollection<DashboardLink>(personalLinksQuery);

  const filteredLinks = useMemo(() => {
    if (!searchQuery) return [];
    const combinedLinks = [...(allLinks || []), ...(personalLinks || [])];
    
    return combinedLinks.filter(
      (link) =>
        link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allLinks, personalLinks]);
  
  const refreshLinks = () => {};

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={showGrid}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold tracking-tight">
                Search Results for "{searchQuery}"
            </h1>
      </div>

      {(isLoading || isLoadingPersonal) ? (
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
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : filteredLinks.length > 0 ? (
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
              {filteredLinks.map((link) => (
                <LinkListItem key={link.id} link={link} isPersonal={!!personalLinks?.find(pl => pl.id === link.id)} onUpdate={refreshLinks} />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState message="No links found matching your search query." />
      )}
    </div>
  );
}
