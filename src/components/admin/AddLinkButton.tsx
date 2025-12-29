
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
import { SECTIONS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import type { DashboardLink, UserProfile } from '@/lib/types';
import { Plus } from 'lucide-react';
import { Firestore } from 'firebase/firestore';
import { Textarea } from '../ui/textarea';

interface LinkEditorProps {
    db: Firestore;
    user: UserProfile | null;
    section?: string;
    linkToEdit?: DashboardLink | null;
    onLinkAdded: () => void;
    trigger?: React.ReactNode;
}

export default function AddLinkButton({ db, user, section, linkToEdit = null, onLinkAdded, trigger }: LinkEditorProps) {
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
      const currentSection = isPersonalLink ? 'personal-links' : (linkToEdit?.section || section || SECTIONS[0].slug);
      setName(linkToEdit?.name || '');
      setUrl(linkToEdit?.url || '');
      setDescription((linkToEdit as any)?.description || '');
      setLinkSection(currentSection);
      setType((linkToEdit?.type as any) || 'embed');
      setOpenType(linkToEdit?.openType || 'dashboard');
    }
  }, [open, linkToEdit, section, isPersonalLink]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) {
      toast({
        variant: 'destructive',
        title: 'You must be logged in to add a link.',
      });
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
                await updateUserLink(db, user.uid, linkToEdit.id, linkData);
                toast({ title: 'Personal link updated successfully' });
            } else {
                await addUserLink(db, user.uid, linkData);
                toast({ title: 'Personal link added successfully' });
            }
        } else {
             if (user.role !== 'admin') {
                toast({ variant: 'destructive', title: 'Only admins can modify shared links.'});
                setLoading(false);
                return;
            }
            linkData.section = linkSection;
            if (isEditing && linkToEdit) {
                await updateLink(db, linkToEdit.id, linkData);
                toast({ title: 'Link updated successfully' });
            } else {
                await addLink(db, linkData as Omit<DashboardLink, 'id'>); 
                toast({ title: 'Link added successfully' });
            }
        }
        
        onLinkAdded();
        setOpen(false);
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
                            {SECTIONS.filter(s => s.slug !== 'personal-links').map(s => <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>)}
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

    