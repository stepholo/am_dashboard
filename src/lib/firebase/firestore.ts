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
import type { DashboardLink } from '../types';
import { seedData } from '../data';

// Function to seed initial data or update existing data
export async function seedInitialData(db: Firestore) {
    const seedMarkerRef = doc(db, 'internal', 'seedMarker');
    const seedMarkerSnap = await getDoc(seedMarkerRef);

    // If data has been seeded and updated, do nothing.
    if (seedMarkerSnap.exists() && seedMarkerSnap.data().updatedWithImages) {
        console.log('All links are up-to-date, skipping seed.');
        return;
    }

    const linksCollectionRef = collection(db, 'dashboardLinks');
    const q = query(linksCollectionRef);
    const existingLinksSnap = await getDocs(q);
    const existingLinks = existingLinksSnap.docs.map(d => ({ ...d.data(), id: d.id })) as DashboardLink[];

    const batch = writeBatch(db);

    // If there's no data, seed it all.
    if (existingLinks.length === 0) {
        console.log('No links found, seeding initial data...');
        seedData.forEach((link, index) => {
            const docRef = doc(linksCollectionRef);
            batch.set(docRef, { ...link, order: index });
        });
    } else { // If data exists, check if it needs updating (e.g., missing imageUrl)
        console.log('Found existing links, checking for image updates...');
        const existingMap = new Map(existingLinks.map(l => [`${l.section}-${l.name}`, l]));

        seedData.forEach(seedLink => {
            const mapKey = `${seedLink.section}-${seedLink.name}`;
            const existingLink = existingMap.get(mapKey);
            // If the link exists in DB but doesn't have an image, or the image is different, update it.
            if (existingLink && (!existingLink.imageUrl || existingLink.imageUrl !== seedLink.imageUrl)) {
                 const docRef = doc(db, 'dashboardLinks', existingLink.id);
                 // Use set with merge to add/update fields without overwriting the whole doc
                 batch.set(docRef, {
                    imageUrl: seedLink.imageUrl,
                    imageHint: seedLink.imageHint
                 }, { merge: true });
            }
        });
    }

    // Mark that seeding and image update process has been completed.
    batch.set(seedMarkerRef, { seeded: true, updatedWithImages: true }, { merge: true });

    await batch.commit();
    console.log('Initial seeding/update complete.');
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
