
"use client";

import { useState } from 'react';
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
import { LogOut, ChevronsLeft, Bug } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';
import { useAuth } from '@/firebase';
import { cn } from '@/lib/utils';
import BugReporter from '../admin/BugReporter';

export default function UserNav({ user }: { user: UserProfile }) {
  const { state, toggleSidebar } = useSidebar();
  const auth = useAuth();
  const isCollapsed = state === 'collapsed';
  const [isBugReporterOpen, setIsBugReporterOpen] = useState(false);

  const handleSignOut = () => {
    if (auth) {
      firebaseSignOut(auth);
    }
  };

  const userAvatar = (
    <Avatar className={cn("h-9 w-9", isCollapsed && "h-10 w-10")}>
      <AvatarImage src={user.photoURL} alt={user.displayName} />
      <AvatarFallback>
        {user.displayName
          .split(' ')
          .map((n) => n[0])
          .join('')}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <>
      <div className={cn(
        "flex w-full items-center",
        isCollapsed ? "flex-col-reverse gap-2" : "justify-between"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isCollapsed ? (
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                {userAvatar}
              </Button>
            ) : (
              <Button variant="ghost" className="flex items-center gap-3 rounded-md p-2 w-full justify-start h-auto">
                {userAvatar}
                <div className="flex flex-col items-start">
                    <span className="text-sm font-medium leading-none">{user.displayName}</span>
                    <span className="text-xs leading-none text-muted-foreground">{user.email}</span>
                </div>
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setIsBugReporterOpen(true)}>
              <Bug className="mr-2 h-4 w-4" />
              <span>Report a Bug</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSidebar}>
          <ChevronsLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <BugReporter isOpen={isBugReporterOpen} setIsOpen={setIsBugReporterOpen} />
    </>
  );
}
