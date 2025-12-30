
"use client";

import React, { useState, useEffect } from 'react';
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
import { addLink, updateLink, addUserLink, updateUserLink } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { DashboardLink, UserProfile } from '@/lib/types';
import { Plus } from 'lucide-react';
import { Firestore } from 'firebase/firestore';
import { Textarea } from '../ui/textarea';
import { initialSections } from '@/lib/constants';

interface LinkEditorProps {
    db: Firestore;
    user: UserProfile | null;
    section?: string;
    linkToEdit?: DashboardLink | null;
    onLinkAdded: () => void;
    trigger?: React.ReactNode;
}

export default function AddLinkButton({ db, user, section, linkToEdit, onLinkAdded, trigger }: LinkEditorProps) {
  const [open, setOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [linkSection, setLinkSection] = useState('');
  const [type, setType] = useState<'embed' | 'external' | 'protocol'>('embed');
  const [openType, setOpenType] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const isEditing = !!linkToEdit;
  const isPersonalLink = section === 'personal-links';

  useEffect(() => {
    if (open) {
      setName(isEditing ? linkToEdit.name : '');
      setUrl(isEditing ? linkToEdit.url : '');
      setDescription(isEditing ? (linkToEdit as any).description || '' : '');
      setLinkSection(isEditing ? linkToEdit.section : (isPersonalLink ? 'personal-links' : section || ''));
      setType(isEditing ? (linkToEdit.type as any) : 'embed');
      setOpenType(isEditing ? linkToEdit.openType || 'dashboard' : 'dashboard');
    }
  }, [open, isEditing, linkToEdit, section, isPersonalLink]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) {
      toast({ variant: 'destructive', title: 'You must be logged in to add a link.' });
      return;
    }
    setLoading(true);

    const linkData: Partial<DashboardLink> = {
        name,
        url,
        type,
        openType: type === 'embed' ? openType : 'new-tab',
        order: (linkToEdit as any)?.order ?? 999,
    };

    try {
        if (isPersonalLink) {
            linkData.description = description;
            if (isEditing && linkToEdit) {
                updateUserLink(db, user.uid, linkToEdit.id, linkData);
                toast({ title: 'Personal link update initiated.' });
            } else {
                addUserLink(db, user.uid, linkData);
                toast({ title: 'Personal link creation initiated.' });
            }
        } else {
             if (user.role !== 'admin') {
                toast({ variant: 'destructive', title: 'Only admins can modify shared links.'});
                setLoading(false);
                return;
            }
            linkData.section = linkSection;
            if (isEditing && linkToEdit) {
                updateLink(db, linkToEdit.id, linkData);
                toast({ title: 'Link update initiated.' });
            } else {
                addLink(db, linkData as Omit<DashboardLink, 'id'>); 
                toast({ title: 'Link creation initiated.' });
            }
        }
        
        onLinkAdded();
        setOpen(false);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: `Error processing link`,
            description: (error as Error).message,
        });
    } finally {
        setLoading(false);
    }
  };

  const dialogTrigger = trigger ? (
      <DialogTrigger asChild onClick={() => setOpen(true)}>{trigger}</DialogTrigger>
  ) : (
      <Button size="sm" onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Link</Button>
  )

  const isEmbeddable = type === 'embed';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {dialogTrigger}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Edit ${isPersonalLink ? 'Personal' : ''} Link` : `Add New ${isPersonalLink ? 'Personal' : ''} Link`}</DialogTitle>
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
            
            {isPersonalLink && (
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="col-span-3" />
                </div>
            )}

            {!isPersonalLink && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="section" className="text-right">Section</Label>
                    <Select value={linkSection} onValueChange={setLinkSection}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                        <SelectContent>
                            {initialSections?.filter(s => s.slug !== 'personal-links').map(s => <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                 <Select value={type} onValueChange={(v) => setType(v as 'embed' | 'external' | 'protocol')}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="embed">Embeddable (e.g. Google Sheet)</SelectItem>
                        <SelectItem value="external">External Portal</SelectItem>
                        <SelectItem value="protocol">App Protocol (e.g. ms-phone:)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isEmbeddable && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="openType" className="text-right">Open In</Label>
                    <Select value={openType} onValueChange={setOpenType}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select open type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dashboard">Dashboard</SelectItem>
                            <SelectItem value="split-screen">Split Screen</SelectItem>
                            <SelectItem value="new-tab">New Tab</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

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
