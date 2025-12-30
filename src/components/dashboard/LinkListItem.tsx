
"use client";

import {
  TableRow,
  TableCell,
} from '@/components/ui/table';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, ExternalLink, Pencil, Trash2, LayoutDashboard } from 'lucide-react';
import type { DashboardLink } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { deleteLink, deleteUserLink } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { useDashboard } from '@/hooks/useDashboard';

export default function LinkListItem({ link, onUpdate, isPersonal = false, onEdit }: { link: DashboardLink; onUpdate: () => void; isPersonal?: boolean; onEdit: () => void; }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const db = useFirestore();
  const { openInDashboard } = useDashboard();

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
  }
  
  const canEdit = isPersonal || user?.role === 'admin';

  return (
    <TableRow>
        <TableCell className="font-medium">{link.name}</TableCell>
        <TableCell className="hidden md:table-cell text-sm text-muted-foreground truncate max-w-sm">
            {link.description}
        </TableCell>
        <TableCell className="text-right">
             <div className="flex items-center justify-end gap-2">
                <Button onClick={handleOpen} size="sm">Open</Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                         {link.type === 'embed' && (
                            <DropdownMenuItem onClick={() => openInDashboard({ id: link.id, url: link.url, name: link.name })}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Open in Dashboard</span>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => window.open(link.url, '_blank')}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span>Open in New Tab</span>
                        </DropdownMenuItem>
                        {canEdit && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onEdit(); }}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                
                                <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
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
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
             </div>
        </TableCell>
    </TableRow>
  );
}
