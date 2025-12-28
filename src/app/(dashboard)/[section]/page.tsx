import DashboardClient from "@/components/dashboard/DashboardClient";
import { SECTIONS } from "@/lib/constants";
import { notFound } from "next/navigation";

export default function SectionPage({ 
    params,
    searchParams 
}: { 
    params: { section: string };
    searchParams?: { linkId?: string };
}) {
  const sectionInfo = SECTIONS.find(s => s.slug === params.section);

  if (!sectionInfo) {
    notFound();
  }

  return (
    <DashboardClient 
        sectionSlug={params.section} 
        sectionName={sectionInfo.name} 
        initialLinkId={searchParams?.linkId}
    />
  );
}

export function generateStaticParams() {
    return SECTIONS.map(section => ({
        section: section.slug
    }))
}
