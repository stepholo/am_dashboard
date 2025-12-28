"use client";

import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { signOut } from '@/lib/firebase/auth';
import type { UserProfile } from '@/lib/types';
import { ADMIN_EMAIL, ALLOWED_DOMAIN } from '@/lib/constants';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        if (firebaseUser.email && firebaseUser.email.endsWith(`@${ALLOWED_DOMAIN}`)) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          let userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            // New user, create their profile document
            const newUserProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'TractorLink User',
              photoURL: firebaseUser.photoURL || '',
              role: firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'viewer',
            };
            await setDoc(userDocRef, newUserProfile);
            setUser(newUserProfile);
          } else {
             // Existing user
            const userProfile = userDoc.data() as UserProfile;
             // Ensure role is updated if it was changed manually or for the admin
            const currentRole = userProfile.email === ADMIN_EMAIL ? 'admin' : userProfile.role;
            if (currentRole !== userProfile.role) {
              await setDoc(userDocRef, { role: currentRole }, { merge: true });
              setUser({ ...userProfile, role: currentRole });
            } else {
              setUser(userProfile);
            }
          }
        } else {
          // Not a valid domain, sign out
          await signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
