
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";

export default function Header() {
  const { user, loading } = useAuth();
  const { isFullScreen } = useDashboard();

  return (
    <header className={cn("sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:h-16 sm:px-6", isFullScreen && "hidden")}>
       <SidebarTrigger className="md:hidden" />
       <div className="flex flex-1 items-center justify-end">
        {/* Admin controls removed */}
       </div>
    </header>
  );
}
