
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "@/components/Logo";
import UserNav from "./UserNav";
import type { UserProfile, DashboardLink, Section } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, orderBy, where } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";
import { ChevronsRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import * as Icons from 'lucide-react';

function SidebarSectionLinks({ sectionSlug, onLinkClick }: { sectionSlug: string; onLinkClick: () => void }) {
    const db = useFirestore();
    const { user } = useAuth();
    const { openInDashboard } = useDashboard();

    const linksQuery = useMemoFirebase(() => {
        if (!db) return null;
        if (sectionSlug === 'personal-links') {
            if (!user) return null;
            return query(collection(db, 'users', user.uid, 'dashboardLinks'), orderBy('name'));
        }
        return query(collection(db, 'dashboardLinks'), where('section', '==', sectionSlug), orderBy('order'));
    }, [db, sectionSlug, user]);

    const { data: links, isLoading } = useCollection<DashboardLink>(linksQuery);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 py-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
            </div>
        )
    }
    
    const handleLinkOpen = (link: DashboardLink) => {
        if (link.type === 'embed') {
            openInDashboard({ id: link.id, name: link.name, url: link.url });
        } else if (link.type === 'protocol') {
            window.location.href = link.url;
        } else {
            window.open(link.url, '_blank');
        }
        onLinkClick();
    }

    return (
        <div className="flex flex-col gap-1 py-1">
            {links?.map(link => (
                <button 
                    key={link.id} 
                    className="group flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-left"
                    onClick={() => handleLinkOpen(link)}
                >
                    <ChevronsRight className="h-4 w-4 flex-shrink-0 text-sidebar-accent-foreground/50 transition-transform group-hover:translate-x-1" />
                    <span className="truncate">{link.name}</span>
                </button>
            ))}
        </div>
    )
}

const getIcon = (iconName: string): LucideIcon => {
  const Icon = (Icons as any)[iconName];
  if (Icon) {
    return Icon;
  }
  return Icons.Settings; // Fallback icon
};


export default function AppSidebar({ user }: { user: UserProfile }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
  const db = useFirestore();
  const { data: sections, isLoading: sectionsLoading } = useCollection<Section>(db ? query(collection(db, 'sections'), orderBy('order', 'asc')) : null);

  const handleLinkClick = () => {
    // Close mobile sidebar when a link is clicked
    setOpenMobile(false);
  }

  const handleSectionClick = (slug: string) => {
      router.push(`/${slug}`);
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-8 w-auto text-primary" />
          <span className="text-xl font-semibold tracking-tight font-headline group-data-[collapsible=icon]:hidden">
            AM Dashboard
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarMenu className="flex-1 p-2">
        <Accordion type="single" collapsible defaultValue={pathname.split('/')[1]}>
          {sectionsLoading ? (
            [...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full mb-1" />)
          ) : (
            sections?.map((section) => {
              const Icon = getIcon(section.icon);
              const isActive = pathname.startsWith(`/${section.slug}`);
              return (
                <AccordionItem key={section.slug} value={section.slug} className="border-b-0">
                   <SidebarMenuItem>
                      <AccordionTrigger 
                        onClick={() => !isCollapsed && handleSectionClick(section.slug)}
                        className={cn(
                          "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>svg:last-child]:h-4 [&>svg:last-child]:w-4 [&>svg:last-child]:shrink-0",
                          isActive ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "",
                          isCollapsed ? "!size-8 !p-2 justify-center" : "",
                        )}
                      >
                          <div onClick={() => handleSectionClick(section.slug)} className="flex flex-1 items-center gap-2">
                              <Icon className="h-4 w-4 shrink-0" />
                              <span className={cn("truncate", isCollapsed && "hidden")}>{section.name}</span>
                          </div>
                      </AccordionTrigger>
                   </SidebarMenuItem>
                   {!isCollapsed && (
                      <AccordionContent className="pl-8 pr-2">
                         <SidebarSectionLinks sectionSlug={section.slug} onLinkClick={handleLinkClick} />
                      </AccordionContent>
                   )}
                </AccordionItem>
              );
            })
          )}
        </Accordion>
      </SidebarMenu>

      <SidebarFooter>
        <UserNav user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
