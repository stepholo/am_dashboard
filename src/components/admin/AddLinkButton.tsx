"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addLink, updateLink } from '@/lib/firebase/firestore';
import { SECTIONS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import type { DashboardLink } from '@/lib/types';
import { Plus } from 'lucide-react';

interface LinkEditorProps {
    section?: string;
    linkToEdit?: DashboardLink | null;
    onLinkAdded: () => void;
    trigger?: React.ReactNode;
}

export default function AddLinkButton({ section, linkToEdit = null, onLinkAdded, trigger }: LinkEditorProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(linkToEdit?.name || '');
  const [url, setUrl] = useState(linkToEdit?.url || '');
  const [linkSection, setLinkSection] = useState(linkToEdit?.section || section || SECTIONS[0].slug);
  const [type, setType] = useState<'embed' | 'external' | 'protocol'>(linkToEdit?.type || 'embed');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isEditing = !!linkToEdit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        if (isEditing) {
            await updateLink(linkToEdit.id, { name, url, section: linkSection, type });
            toast({ title: 'Link updated successfully' });
        } else {
            await addLink({ name, url, section: linkSection, type, order: 999 }); // Order can be managed more robustly
            toast({ title: 'Link added successfully' });
        }
        onLinkAdded();
        setOpen(false);
        // Reset form
        setName('');
        setUrl('');
    } catch (error) {
        toast({
            variant: 'destructive',
            title: `Error ${isEditing ? 'updating' : 'adding'} link`,
            description: (error as Error).message,
        });
    } finally {
        setLoading(false);
    }
  };

  const dialogTrigger = trigger ? (
      <DialogTrigger asChild>{trigger}</DialogTrigger>
  ) : (
      <Button size="sm"><Plus className="mr-2 h-4 w-4" />Add Link</Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {dialogTrigger}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Link' : 'Add New Link'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">URL</Label>
                <Input id="url" value={url} onChange={e => setUrl(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="section" className="text-right">Section</Label>
                <Select value={linkSection} onValueChange={setLinkSection}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                        {SECTIONS.map(s => <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                 <Select value={type} onValueChange={(v) => setType(v as 'embed' | 'external' | 'protocol')}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="embed">Embeddable (Google Sheet)</SelectItem>
                        <SelectItem value="external">External Portal</SelectItem>
                        <SelectItem value="protocol">App Protocol (ms-phone:)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            </div>
            <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
