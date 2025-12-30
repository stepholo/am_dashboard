
"use client";

import { useUser, useFirestore, useAuth as useFirebaseAuth } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '@/lib/types';
import { ADMIN_EMAIL, ALLOWED_DOMAIN } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { signOut } from '@/lib/firebase/auth';
import { seedInitialData } from '@/lib/firebase/firestore';

export const useAuth = () => {
    const { user: firebaseUser, isUserLoading } = useUser();
    const firestore = useFirestore();
    const auth = useFirebaseAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleAuth = async (fbUser: User | null) => {
            if (fbUser && firestore) {
                if (fbUser.email && fbUser.email.endsWith(`@${ALLOWED_DOMAIN}`)) {
                    const userDocRef = doc(firestore, 'users', fbUser.uid);
                    let userDoc = await getDoc(userDocRef);

                    if (!userDoc.exists()) {
                        const newUserProfile: UserProfile = {
                            uid: fbUser.uid,
                            email: fbUser.email,
                            displayName: fbUser.displayName || 'AM Dashboard User',
                            photoURL: fbUser.photoURL || '',
                            role: fbUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'viewer',
                        };
                        await setDoc(userDocRef, newUserProfile);
                        setUserProfile(newUserProfile);
                        // Seed data for the first admin user
                        if (newUserProfile.role === 'admin') {
                            await seedInitialData(firestore);
                        }
                    } else {
                        const existingProfile = userDoc.data() as UserProfile;
                        let needsUpdate = false;
                        const updatedProfile = { ...existingProfile };

                        // Ensure role is correct based on email
                        const correctRole = existingProfile.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'viewer';
                        if (existingProfile.role !== correctRole) {
                            updatedProfile.role = correctRole;
                            needsUpdate = true;
                        }
                        
                        // Seed data if admin logs in and data is missing
                        if (updatedProfile.role === 'admin') {
                            await seedInitialData(firestore);
                        }

                        if (needsUpdate) {
                            await setDoc(userDocRef, updatedProfile, { merge: true });
                            setUserProfile(updatedProfile);
                        } else {
                            setUserProfile(existingProfile);
                        }
                    }
                } else {
                    await signOut(auth);
                    setUserProfile(null);
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        };

        if (!isUserLoading) {
            handleAuth(firebaseUser);
        }
    }, [firebaseUser, isUserLoading, firestore, auth]);

    return { user: userProfile, loading };
};
