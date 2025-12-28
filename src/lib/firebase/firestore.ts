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
    const linksCollectionRef = collection(db, 'dashboardLinks');
    const q = query(linksCollectionRef, orderBy('order', 'asc'));
    const existingLinksSnap = await getDocs(q);
    const existingLinks = existingLinksSnap.docs.map(d => ({ ...d.data(), id: d.id })) as DashboardLink[];

    // If there's no data, seed it all.
    if (existingLinks.length === 0) {
        console.log('No links found, seeding initial data...');
        const batch = writeBatch(db);
        seedData.forEach((link, index) => {
            const docRef = doc(linksCollectionRef);
            batch.set(docRef, { ...link, order: index });
        });
        await batch.commit();
        console.log('Initial seeding complete.');
        return;
    }

    // If data exists, check if it needs updating (e.g., missing imageUrl)
    const linksToUpdate = existingLinks.filter(link => !link.imageUrl);
    if (linksToUpdate.length > 0) {
        console.log('Found links without images, updating...');
        const batch = writeBatch(db);
        
        // Create a map of existing links by name/section for easy lookup
        const existingMap = new Map(existingLinks.map(l => [`${l.section}-${l.name}`, l]));

        seedData.forEach(seedLink => {
            const mapKey = `${seedLink.section}-${seedLink.name}`;
            const existingLink = existingMap.get(mapKey);
            if (existingLink && !existingLink.imageUrl && seedLink.imageUrl) {
                 const docRef = doc(db, 'dashboardLinks', existingLink.id);
                 batch.update(docRef, { 
                    imageUrl: seedLink.imageUrl,
                    imageHint: seedLink.imageHint
                 });
            }
        });

        await batch.commit();
        console.log('Updated links with images.');
    } else {
        console.log('All links are up-to-date, skipping seed.');
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
