
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
import { useToast } from '@/hooks/use-toast';
import type { Section } from '@/lib/types';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { addSection, updateSection } from '@/lib/firebase/firestore';


export default function ManageSectionsDialog() {
  const [open, setOpen] = useState(false);
  const db = useFirestore();
  const { data: sections, isLoading } = useCollection<Section>(db ? query(collection(db, 'sections'), orderBy('order', 'asc')) : null);
  const [localSections, setLocalSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (sections) {
      setLocalSections(sections);
    }
  }, [sections]);

  const handleNameChange = (slug: string, newName: string) => {
    setLocalSections(prev => prev.map(s => s.slug === slug ? { ...s, name: newName } : s));
  };
  
  const handleAddNew = () => {
    const newSlug = `new-section-${localSections.length}`;
    const newSection: Section = {
      id: newSlug,
      slug: newSlug,
      name: 'New Section',
      icon: 'Settings', // Default icon
      order: localSections.length
    };
    setLocalSections(prev => [...prev, newSection]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    setLoading(true);

    try {
        for (const section of localSections) {
            // Check if it's a new section (they have temporary IDs)
            if (section.id.startsWith('new-section-')) {
                const {id, ...sectionData} = section;
                await addSection(db, sectionData);
            } else {
                // It's an existing section, update it
                await updateSection(db, section.id, { name: section.name });
            }
        }
        toast({ title: 'Sections updated successfully!' });
        setOpen(false);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error updating sections',
            description: (error as Error).message
        })
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Settings className="mr-2 h-4 w-4" />Manage Sections</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Sections</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {isLoading ? <p>Loading sections...</p> : 
              localSections.map((section) => (
                <div key={section.slug} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`section-name-${section.slug}`} className="text-right">
                    {section.slug}
                  </Label>
                  <Input
                    id={`section-name-${section.slug}`}
                    value={section.name}
                    onChange={(e) => handleNameChange(section.slug, e.target.value)}
                    className="col-span-3"
                    disabled={section.slug === 'personal-links'}
                  />
                </div>
              ))
            }
            <Button type="button" variant="outline" size="sm" onClick={handleAddNew} className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add New Section
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
