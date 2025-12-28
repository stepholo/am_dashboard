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
  Firestore,
  getDoc,
} from 'firebase/firestore';
import type { DashboardLink } from '../types';
import { seedData } from '../data';

// This flag will be stored in Firestore to prevent re-seeding.
const SEED_FLAG_DOC = 'internal/seedingFlags';

// Function to seed initial data. This will delete all existing links.
export async function seedInitialData(db: Firestore) {
    const linksCollectionRef = collection(db, 'dashboardLinks');
    const existingLinksSnap = await getDocs(query(linksCollectionRef));

    const batch = writeBatch(db);

    // Delete all existing links to ensure a clean slate
    existingLinksSnap.forEach(doc => {
        batch.delete(doc.ref);
    });

    // Add all links from the seed data with the correct image info and order
    seedData.forEach((link, index) => {
        const docRef = doc(linksCollectionRef);
        batch.set(docRef, { 
            ...link, 
            imageUrl: link.imageUrl || '',
            imageHint: link.imageHint || '',
            order: index 
        });
    });
    
    // Set a marker to indicate seeding is done to prevent re-seeding.
    const seedMarkerRef = doc(db, SEED_FLAG_DOC);
    batch.set(seedMarkerRef, { updatedWithImagesOn: new Date().toISOString() });

    await batch.commit();
    console.log('Database seeding complete.');
}


// Get all links for a specific section, and seed if empty
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
