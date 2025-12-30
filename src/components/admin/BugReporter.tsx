
'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface BugReporterProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function BugReporter({ isOpen, setIsOpen }: BugReporterProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const db = useFirestore();
  const pathname = usePathname();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) {
      toast({ variant: 'destructive', title: 'You must be logged in to report a bug.' });
      return;
    }
    if (!description.trim()) {
      toast({ variant: 'destructive', title: 'Please describe the bug.' });
      return;
    }
    setLoading(true);

    try {
      const bugReport = {
        description,
        url: window.location.href, // Get the full URL
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
        status: 'open',
      };
      await addDoc(collection(db, 'bugReports'), bugReport);
      
      toast({
        title: 'Bug Report Submitted',
        description: 'Thank you for your feedback! Our team will look into it.',
      });
      setIsOpen(false);
      setDescription('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Submitting Report',
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report a Bug</DialogTitle>
          <DialogDescription>
            Found an issue? Please describe it below and our team will take a look.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="description">Bug Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us what went wrong..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
              />
               <p className="text-xs text-muted-foreground">
                Your current page URL ({pathname}) will be automatically included.
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
