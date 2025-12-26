import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  writeBatch,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './config';
import type { DashboardLink } from '../types';
import { seedData } from '../data';

const linksCollection = collection(db, 'links');

// Function to seed initial data
export async function seedLinks() {
  const q = query(linksCollection);
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log('No links found, seeding initial data...');
    const batch = writeBatch(db);
    seedData.forEach((link, index) => {
      const docRef = doc(linksCollection);
      batch.set(docRef, { ...link, order: index });
    });
    await batch.commit();
    console.log('Seeding complete.');
  } else {
    console.log('Links collection already contains data, skipping seed.');
  }
}

// Get all links for a specific section
export async function getLinksForSection(section: string): Promise<DashboardLink[]> {
  // One-time seed check for convenience in this portfolio project
  await seedLinks(); 

  const q = query(
    linksCollection,
    where('section', '==', section),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DashboardLink));
}

// Add a new link
export async function addLink(link: Omit<DashboardLink, 'id'>) {
    return await addDoc(linksCollection, link);
}

// Update an existing link
export async function updateLink(id: string, data: Partial<DashboardLink>) {
    const linkDoc = doc(db, 'links', id);
    return await updateDoc(linkDoc, data);
}

// Delete a link
export async function deleteLink(id: string) {
    const linkDoc = doc(db, 'links', id);
    return await deleteDoc(linkDoc);
}
