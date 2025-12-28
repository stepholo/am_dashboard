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
  setDoc,
} from 'firebase/firestore';
import type { DashboardLink } from '@/lib/types';
import { seedData } from '@/lib/data';

// Function to seed initial data or update existing data
export async function seedInitialData(db: Firestore) {
    const seedMarkerRef = doc(db, 'internal', 'seedMarker');
    const seedMarkerSnap = await getDoc(seedMarkerRef);

    // If data has been seeded and updated with images, do nothing.
    if (seedMarkerSnap.exists() && seedMarkerSnap.data().updatedWithImages) {
        console.log('All links are up-to-date, skipping seed.');
        return;
    }

    console.log('Links are missing image data. Re-seeding database...');

    const linksCollectionRef = collection(db, 'dashboardLinks');
    const existingLinksSnap = await getDocs(query(linksCollectionRef));

    const batch = writeBatch(db);

    // Delete all existing links to ensure a clean slate
    existingLinksSnap.forEach(doc => {
        batch.delete(doc.ref);
    });

    // Add all links from the seed data with the correct image info
    seedData.forEach((link, index) => {
        const docRef = doc(linksCollectionRef);
        batch.set(docRef, { ...link, order: index });
    });

    // Mark that seeding and image update process has been completed.
    batch.set(seedMarkerRef, { seeded: true, updatedWithImages: true }, { merge: true });

    await batch.commit();
    console.log('Database re-seeding complete.');
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
