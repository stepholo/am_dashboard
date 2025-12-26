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
} from "@/components/ui/sidebar";
import Logo from "@/components/Logo";
import { SECTIONS } from "@/lib/constants";
import UserNav from "./UserNav";
import type { UserProfile } from "@/lib/types";

export default function AppSidebar({ user }: { user: UserProfile }) {
  const pathname = usePathname();

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
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <SidebarMenuItem key={section.slug}>
              <Link href={`/${section.slug}`} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(`/${section.slug}`)}
                  tooltip={{ children: section.name }}
                >
                  <Icon />
                  <span>{section.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>

      <SidebarFooter>
        <UserNav user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
