
"use client";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { usePathname } from 'next/navigation';
import { Suspense } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Section } from "@/lib/types";

function SectionPageContent() {
  const pathname = usePathname();
  const sectionSlug = pathname.split('/')[1];

  const db = useFirestore();
  
  const sectionsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'sections'), where('slug', '==', sectionSlug));
  }, [db, sectionSlug]);

  const { data: sections, isLoading } = useCollection<Section>(sectionsQuery);
  const sectionInfo = sections?.[0];

  if (isLoading) {
    return <p className="p-4">Loading section...</p>
  }

  if (!sectionInfo) {
    return <div className="p-4">Section not found</div>;
  }

  return (
    <DashboardClient 
        sectionSlug={sectionSlug} 
        sectionName={sectionInfo.name} 
    />
  );
}


export default function SectionPage() {
  return (
    <Suspense fallback={<p>Loading section...</p>}>
      <SectionPageContent />
    </Suspense>
  );
}
