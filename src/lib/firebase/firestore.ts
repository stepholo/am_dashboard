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
  deleteDoc,
  Firestore
} from 'firebase/firestore';
import type { DashboardLink } from '../types';
import { seedData } from '../data';

// Function to seed initial data
export async function seedLinks(db: Firestore) {
  const linksCollection = collection(db, 'dashboardLinks');
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
export async function getLinksForSection(db: Firestore, section: string): Promise<DashboardLink[]> {
  const linksCollection = collection(db, 'dashboardLinks');
  
  const q = query(
    linksCollection,
    where('section', '==', section),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DashboardLink));
}

// Add a new link
export async function addLink(db: Firestore, link: Omit<DashboardLink, 'id'>) {
    const linksCollection = collection(db, 'dashboardLinks');
    return await addDoc(linksCollection, link);
}

// Update an existing link
export async function updateLink(db: Firestore, id: string, data: Partial<DashboardLink>) {
    const linkDoc = doc(db, 'dashboardLinks', id);
    return await updateDoc(linkDoc, data);
}

// Delete a link
export async function deleteLink(db: Firestore, id: string) {
    const linkDoc = doc(db, 'dashboardLinks', id);
    return await deleteDoc(linkDoc);
}
