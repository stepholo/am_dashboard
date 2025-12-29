
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  writeBatch,
  doc,
  Firestore,
} from 'firebase/firestore';
import type { DashboardLink } from '../types';
import { seedData } from '../data';
import { placeholderImages } from '../placeholder-images';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

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

const getRandomPlaceholderImage = () => {
    if (placeholderImages.length === 0) return { imageUrl: '', imageHint: '' };
    const randomIndex = Math.floor(Math.random() * placeholderImages.length);
    const { imageUrl, imageHint } = placeholderImages[randomIndex];
    return { imageUrl, imageHint };
}

// Add a new link
export function addLink(db: Firestore, link: Omit<DashboardLink, 'id'>) {
    const linksCollection = collection(db, 'dashboardLinks');
    const { imageUrl, imageHint } = getRandomPlaceholderImage();
    const newLink = { ...link, imageUrl, imageHint };
    addDocumentNonBlocking(linksCollection, newLink);
}

// Update an existing link
export function updateLink(db: Firestore, id: string, data: Partial<DashboardLink>) {
    const linkDoc = doc(db, 'dashboardLinks', id);
    updateDocumentNonBlocking(linkDoc, data);
}

// Delete a link
export function deleteLink(db: Firestore, id: string) {
    const linkDoc = doc(db, 'dashboardLinks', id);
    deleteDocumentNonBlocking(linkDoc);
}


// User specific links
export function addUserLink(db: Firestore, userId: string, link: Partial<Omit<DashboardLink, 'id'>>) {
    const userLinksCollection = collection(db, 'users', userId, 'dashboardLinks');
    const { imageUrl, imageHint } = getRandomPlaceholderImage();
    const newLink = { ...link, imageUrl, imageHint };
    addDocumentNonBlocking(userLinksCollection, newLink);
}

export function updateUserLink(db: Firestore, userId: string, linkId: string, data: Partial<DashboardLink>) {
    const linkDoc = doc(db, 'users', userId, 'dashboardLinks', linkId);
    updateDocumentNonBlocking(linkDoc, data);
}

export function deleteUserLink(db: Firestore, userId: string, linkId: string) {
    const linkDoc = doc(db, 'users', userId, 'dashboardLinks', linkId);
    deleteDocumentNonBlocking(linkDoc);
}
