"use client";

import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { MoreVertical, ExternalLink, Pencil, Trash2, LayoutDashboard, Rows } from 'lucide-react';
import type { DashboardLink } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import AddLinkButton from '../admin/AddLinkButton';
import { deleteLink } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { useDashboard } from '@/hooks/useDashboard';


export default function LinkCard({ link, onUpdate }: { link: DashboardLink; onUpdate: () => void; }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const db = useFirestore();
  const { openInSinglePane, openInSplitPane } = useDashboard();

  const handleOpen = () => {
    if (link.type === 'embed') {
      openInSinglePane(link.url, link.name);
    } else if (link.type === 'protocol') {
        window.location.href = link.url;
    } else {
        window.open(link.url, '_blank');
    }
  };

  const handleDelete = async () => {
    if (!db) {
        toast({ variant: 'destructive', title: "Database connection not found." });
        return;
    }
    if (window.confirm(`Are you sure you want to delete "${link.name}"?`)) {
        try {
            await deleteLink(db, link.id);
            toast({ title: "Link deleted successfully" });
            onUpdate();
        } catch (error) {
            toast({ variant: 'destructive', title: "Error deleting link", description: (error as Error).message });
        }
    }
  }

  return (
    <Card className="flex flex-col justify-between shadow-md transition-shadow hover:shadow-xl overflow-hidden">
        {link.imageUrl && (
            <CardContent className="p-0">
                <div className="relative h-32 w-full">
                    <Image 
                        src={link.imageUrl}
                        alt={link.name}
                        fill
                        className="object-cover"
                        data-ai-hint={link.imageHint}
                    />
                </div>
            </CardContent>
        )}
      <div className='flex flex-col flex-1 justify-between p-4'>
        <CardHeader className="flex-row items-start justify-between pb-2 p-0">
            <CardTitle className="text-base font-medium leading-snug">
            {link.name}
            </CardTitle>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 -mt-1 -mr-1">
                <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                 {link.type === 'embed' && (
                  <>
                    <DropdownMenuItem onClick={() => openInSinglePane(link.url, link.name)}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Open in Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openInSplitPane(link.url, link.name)}>
                      <Rows className="mr-2 h-4 w-4" />
                      <span>Open in Split Screen</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={() => window.open(link.url, '_blank')}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <span>Open in New Tab</span>
                </DropdownMenuItem>
                {user?.role === 'admin' && db && (
                    <>
                        <DropdownMenuSeparator />
                        <AddLinkButton db={db} linkToEdit={link} onLinkAdded={onUpdate} trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                        } />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
            </DropdownMenu>
        </CardHeader>
        <CardFooter className="p-0 pt-4">
            <Button onClick={handleOpen} className="w-full">
            Open
            </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
