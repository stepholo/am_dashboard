"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "@/components/Logo";
import { SECTIONS } from "@/lib/constants";
import UserNav from "./UserNav";
import type { UserProfile, DashboardLink } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, where } from "firebase/firestore";
import { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";
import { ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

function SidebarSectionLinks({ sectionSlug, onLinkClick }: { sectionSlug: string; onLinkClick: () => void }) {
    const db = useFirestore();
    const linksQuery = useMemo(() => {
        if (!db) return null;
        return query(collection(db, 'dashboardLinks'), where('section', '==', sectionSlug), orderBy('order'));
    }, [db, sectionSlug]);

    const { data: links, isLoading } = useCollection<DashboardLink>(linksQuery);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 py-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-1 py-1">
            {links?.map(link => (
                <Link 
                    href={`/${sectionSlug}?linkId=${link.id}`} 
                    key={link.id} 
                    className="group flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    onClick={onLinkClick}
                >
                    <ChevronsRight className="h-4 w-4 flex-shrink-0 text-sidebar-accent-foreground/50 transition-transform group-hover:translate-x-1" />
                    <span className="truncate">{link.name}</span>
                </Link>
            ))}
        </div>
    )
}

export default function AppSidebar({ user }: { user: UserProfile }) {
  const pathname = usePathname();
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleLinkClick = () => {
    // Close mobile sidebar when a link is clicked
    setOpenMobile(false);
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-8 w-auto text-primary" />
          <span className="text-xl font-semibold tracking-tight font-headline group-data-[collapsible=icon]:hidden">
            TractorLink
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarMenu className="flex-1 p-2">
        <Accordion type="single" collapsible defaultValue={pathname.split('/')[1]}>
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = pathname.startsWith(`/${section.slug}`);
            return (
              <AccordionItem key={section.slug} value={section.slug} className="border-b-0">
                 <SidebarMenuItem>
                    <AccordionTrigger 
                      className={cn(
                        "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>svg:last-child]:h-4 [&>svg:last-child]:w-4 [&>svg:last-child]:shrink-0",
                        isActive ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "",
                        isCollapsed ? "!size-8 !p-2 justify-center" : "",
                      )}
                    >
                        <Link href={`/${section.slug}`} className="flex flex-1 items-center gap-2" onClick={(e) => isCollapsed && e.preventDefault()}>
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className={cn("truncate", isCollapsed && "hidden")}>{section.name}</span>
                        </Link>
                    </AccordionTrigger>
                 </SidebarMenuItem>
                 {!isCollapsed && (
                    <AccordionContent className="pl-8 pr-2">
                       <SidebarSectionLinks sectionSlug={section.slug} onLinkClick={handleLinkClick} />
                    </AccordionContent>
                 )}
              </AccordionItem>
            );
          })}
        </Accordion>
      </SidebarMenu>

      <SidebarFooter>
        <UserNav user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
