"use client";

import { signOut as firebaseSignOut } from '@/lib/firebase/auth';
import type { UserProfile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, ChevronsLeftRight } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';
import { useAuth as useFirebaseAuth } from '@/firebase';

export default function UserNav({ user }: { user: UserProfile }) {
  const { state } = useSidebar();
  const { auth } = useFirebaseAuth();

  const handleSignOut = () => {
    firebaseSignOut(auth);
  }

  if (state === 'collapsed') {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL} alt={user.displayName} />
                    <AvatarFallback>
                        {user.displayName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
  }

  return (
    <div className="flex w-full items-center justify-between rounded-md p-2 hover:bg-sidebar-accent">
        <div className="flex items-center gap-3">
             <Avatar className="h-9 w-9">
                <AvatarImage src={user.photoURL} alt={user.displayName} />
                <AvatarFallback>
                    {user.displayName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">{user.displayName}</span>
                <span className="text-xs leading-none text-muted-foreground">{user.email}</span>
            </div>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronsLeftRight className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                 <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
