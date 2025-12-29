"use client";

import { useUser, useFirestore, useAuth as useFirebaseAuth } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '@/lib/types';
import { ADMIN_EMAIL, ALLOWED_DOMAIN } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { signOut } from '@/lib/firebase/auth';

export const useAuth = () => {
    const { user: firebaseUser, isUserLoading } = useUser();
    const firestore = useFirestore();
    const auth = useFirebaseAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleAuth = async (fbUser: User | null) => {
            if (fbUser) {
                if (fbUser.email && fbUser.email.endsWith(`@${ALLOWED_DOMAIN}`)) {
                    const userDocRef = doc(firestore, 'users', fbUser.uid);
                    let userDoc = await getDoc(userDocRef);

                    if (!userDoc.exists()) {
                        const newUserProfile: UserProfile = {
                            uid: fbUser.uid,
                            email: fbUser.email,
                            displayName: fbUser.displayName || 'AM Dashboard User',
                            photoURL: fbUser.photoURL || '',
                            role: fbUser.email === ADMIN_EMAIL ? 'admin' : 'viewer',
                        };
                        await setDoc(userDocRef, newUserProfile);
                        setUserProfile(newUserProfile);
                    } else {
                        const existingProfile = userDoc.data() as UserProfile;
                        const currentRole = existingProfile.email === ADMIN_EMAIL ? 'admin' : existingProfile.role;
                        if (currentRole !== existingProfile.role) {
                            await setDoc(userDocRef, { role: currentRole }, { merge: true });
                            setUserProfile({ ...existingProfile, role: currentRole });
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
