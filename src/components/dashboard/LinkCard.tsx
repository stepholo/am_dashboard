"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { MoreVertical, ExternalLink, Columns, Tv, Pencil, Trash2 } from 'lucide-react';
import type { DashboardLink } from '@/lib/types';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
import AddLinkButton from '../admin/AddLinkButton';
import { deleteLink } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';

export default function LinkCard({ link, onUpdate }: { link: DashboardLink; onUpdate: () => void; }) {
  const { openInSinglePane, openInSplitPane } = useDashboard();
  const { user } = useAuth();
  const { toast } = useToast();
  const db = useFirestore();

  const handleOpen = () => {
    switch (link.type) {
      case 'embed':
        openInSinglePane(link.url, link.name);
        break;
      case 'external':
        window.open(link.url, '_blank');
        break;
      case 'protocol':
        window.location.href = link.url;
        break;
    }
  };

  const handleDelete = async () => {
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
    <Card className="flex h-32 flex-col justify-between shadow-md transition-shadow hover:shadow-xl">
      <CardHeader className="flex-row items-start justify-between pb-2">
        <CardTitle className="text-base font-medium leading-snug">
          {link.name}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {link.type === 'embed' && (
              <>
                <DropdownMenuItem onClick={() => openInSinglePane(link.url, link.name)}>
                  <Tv className="mr-2 h-4 w-4" />
                  <span>Open on Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openInSplitPane(link.url, link.name)}>
                  <Columns className="mr-2 h-4 w-4" />
                  <span>Open in Split Screen</span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={() => window.open(link.url, '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>Open in New Tab</span>
            </DropdownMenuItem>
            {user?.role === 'admin' && (
                <>
                    <DropdownMenuSeparator />
                    <AddLinkButton linkToEdit={link} onLinkAdded={onUpdate} trigger={
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
      <CardFooter>
        <Button onClick={handleOpen} className="w-full">
          Open
        </Button>
      </CardFooter>
    </Card>
  );
}
