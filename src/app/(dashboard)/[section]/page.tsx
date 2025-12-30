
"use client";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { usePathname } from 'next/navigation';
import { Suspense } from "react";
import { initialSections } from "@/lib/constants";

function SectionPageContent() {
  const pathname = usePathname();
  const sectionSlug = pathname.split('/')[1];

  const sectionInfo = initialSections.find(s => s.slug === sectionSlug);

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
