
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  Firestore,
} from 'firebase/firestore';
import type { DashboardLink } from '../types';
import { placeholderImages } from '../placeholder-images';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

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
