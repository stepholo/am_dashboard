"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
       <SidebarTrigger className="md:hidden" />
    </header>
  );
}
