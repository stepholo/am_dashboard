"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { seedInitialData } from "@/lib/firebase/firestore";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Database } from "lucide-react";

function AdminControls() {
    const db = useFirestore();
    const { toast } = useToast();

    const handleSeed = async () => {
        if (!db) return;
        if (window.confirm("Are you sure you want to re-seed the database? This will delete and recreate all links.")) {
            try {
                await seedInitialData(db, true); // force re-seed
                toast({ title: "Database seeded successfully!" });
                window.location.reload(); // Reload to see changes
            } catch (error) {
                console.error("Seeding failed:", error);
                toast({ variant: "destructive", title: "Seeding failed", description: (error as Error).message });
            }
        }
    }

    return (
        <Button size="sm" variant="outline" onClick={handleSeed}>
            <Database className="mr-2 h-4 w-4" />
            Seed Data
        </Button>
    )
}

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
       <SidebarTrigger className="md:hidden" />
       <div className="flex flex-1 items-center justify-end">
        {user?.role === 'admin' && <AdminControls />}
       </div>
    </header>
  );
}
