
"use client";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { SECTIONS } from "@/lib/constants";
import { usePathname } from 'next/navigation';
import { Suspense } from "react";

function SectionPageContent() {
  const pathname = usePathname();
  const sectionSlug = pathname.split('/')[1];

  const sectionInfo = SECTIONS.find(s => s.slug === sectionSlug);

  if (!sectionInfo) {
    // This can be a notFound() call or a loading/error state
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
