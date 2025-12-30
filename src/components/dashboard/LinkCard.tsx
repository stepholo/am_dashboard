
"use client";

import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreVertical, ExternalLink, Pencil, Trash2, LayoutDashboard } from 'lucide-react';
import type { DashboardLink } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { deleteLink, deleteUserLink } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { useDashboard } from '@/hooks/useDashboard';
import { useState } from 'react';


export default function LinkCard({ link, onUpdate, isPersonal = false, onEdit }: { link: DashboardLink; onUpdate: () => void; isPersonal?: boolean; onEdit: () => void; }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const db = useFirestore();
  const { openInDashboard } = useDashboard();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleOpen = () => {
    if (link.type === 'embed') {
        if (link.openType === 'new-tab') {
            window.open(link.url, '_blank');
        } else {
            openInDashboard({ id: link.id, url: link.url, name: link.name });
        }
    } else if (link.type === 'protocol') {
        window.location.href = link.url;
    } else {
        window.open(link.url, '_blank');
    }
  };

  const handleDelete = () => {
    if (!db || !user) {
        toast({ variant: 'destructive', title: "Database connection not found or user not logged in." });
        return;
    }
    
    if (isPersonal) {
        deleteUserLink(db, user.uid, link.id);
    } else {
        if (user.role !== 'admin') {
            toast({ variant: 'destructive', title: "You don't have permission to delete this link." });
            return;
        }
        deleteLink(db, link.id);
    }
    
    toast({ title: `"${link.name}" was successfully deleted.` });
    onUpdate();
    setIsAlertOpen(false);
  }
  
  const canEdit = isPersonal || user?.role === 'admin';

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
            <div className="flex-1">
                <CardTitle className="text-base font-medium leading-snug">
                {link.name}
                </CardTitle>
                {link.description && <CardDescription className="text-xs mt-1">{link.description}</CardDescription>}
            </div>
            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 -mt-1 -mr-1 ml-2">
                    <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {link.type === 'embed' && (
                      <>
                        <DropdownMenuItem onClick={() => openInDashboard({ id: link.id, url: link.url, name: link.name })}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Open in Dashboard</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={() => window.open(link.url, '_blank')}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>Open in New Tab</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onEdit(); }}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => { e.preventDefault(); setIsAlertOpen(true)}}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
        </CardHeader>
        <CardFooter className="p-0 pt-4">
            <Button onClick={handleOpen} className="w-full">
            Open
            </Button>
        </CardFooter>
      </div>
       <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the link named "{link.name}".
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                      Delete
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </Card>
  );
}
