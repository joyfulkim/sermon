'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    church?: string;
    role?: string;
    isAdmin?: boolean;
    createdAt?: unknown;
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, additionalData: { displayName: string, church: string, role: string }) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                const docRef = doc(db, 'users', firebaseUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserProfile(docSnap.data() as UserProfile);
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signup = async (email: string, password: string, additionalData: { displayName: string, church: string, role: string }) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: additionalData.displayName });
        const profile: UserProfile = {
            uid: result.user.uid,
            email,
            displayName: additionalData.displayName,
            photoURL: null,
            church: additionalData.church,
            role: additionalData.role,
            isAdmin: false,
            createdAt: serverTimestamp(),
        };
        await setDoc(doc(db, 'users', result.user.uid), profile);
        setUserProfile(profile);
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const docRef = doc(db, 'users', result.user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            const profile: UserProfile = {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                church: '',
                role: '일반',
                isAdmin: false,
                createdAt: serverTimestamp(),
            };
            await setDoc(docRef, profile);
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, login, signup, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
