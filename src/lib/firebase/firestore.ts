
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  writeBatch,
  doc,
  Firestore,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import type { DashboardLink, Section } from '../types';
import { seedData } from '../data';
import { placeholderImages } from '../placeholder-images';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { initialSections } from '../constants';


export async function seedInitialData(db: Firestore) {
    const sectionsCollectionRef = collection(db, 'sections');
    const sectionsSnap = await getDocs(query(sectionsCollectionRef));
    const linksCollectionRef = collection(db, 'dashboardLinks');
    const linksSnap = await getDocs(query(linksCollectionRef));
    
    const batch = writeBatch(db);

    // Only seed if both are empty
    if (sectionsSnap.empty && linksSnap.empty) {
        console.log('No data found. Seeding initial sections and links...');
        
        // Seed Sections
        initialSections.forEach(section => {
            const sectionRef = doc(sectionsCollectionRef, section.slug);
            batch.set(sectionRef, section);
        });

        // Seed Links
        seedData.forEach((link, index) => {
            const docRef = doc(linksCollectionRef);
            batch.set(docRef, { 
                ...link, 
                imageUrl: link.imageUrl || '',
                imageHint: link.imageHint || '',
                order: index 
            });
        });
        
        await batch.commit();
        console.log('Database seeding complete.');
    } else {
        console.log('Data already exists. Skipping initial seed.');
    }
}


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

// Section Management
export async function addSection(db: Firestore, sectionData: Omit<Section, 'id'>) {
    const sectionsCollection = collection(db, 'sections');
    // create slug from name
    const slug = sectionData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const dataWithSlug = { ...sectionData, slug };
    return await addDoc(sectionsCollection, dataWithSlug);
}

export async function updateSection(db: Firestore, id: string, data: Partial<Section>) {
    const sectionDoc = doc(db, 'sections', id);
    return await updateDoc(sectionDoc, data);
}
