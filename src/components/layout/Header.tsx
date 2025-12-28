"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { seedInitialData } from "@/lib/firebase/firestore";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Database, Loader } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";

function AdminControls() {
    const db = useFirestore();
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = useState(false);

    const handleSeed = async () => {
        if (!db) {
            toast({ variant: "destructive", title: "Seeding failed", description: "Database not available." });
            return;
        };
        if (window.confirm("Are you sure you want to re-seed the database? This will delete and recreate all links.")) {
            setIsSeeding(true);
            try {
                await seedInitialData(db, true); // force re-seed
                toast({ title: "Database seeded successfully!" });
                window.location.reload(); // Reload to see changes
            } catch (error) {
                console.error("Seeding failed:", error);
                toast({ variant: "destructive", title: "Seeding failed", description: (error as Error).message });
            } finally {
                setIsSeeding(false);
            }
        }
    }

    return (
        <Button size="sm" variant="outline" onClick={handleSeed} disabled={isSeeding}>
            {isSeeding ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
            {isSeeding ? "Seeding..." : "Seed Data"}
        </Button>
    )
}

export default function Header() {
  const { user, loading } = useAuth();
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
       <SidebarTrigger className="md:hidden" />
       <div className="flex flex-1 items-center justify-end">
        {loading ? (
            <Skeleton className="h-9 w-28" />
        ) : (
            user?.role === 'admin' && <AdminControls />
        )}
       </div>
    </header>
  );
}
