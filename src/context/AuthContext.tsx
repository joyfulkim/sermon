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

// 관리자 권한을 부여할 이메일 목록
const ADMIN_EMAILS = [
    'joyfulkim@gmail.com', // 사용자 요청에 따라 관리자로 등록할 이메을
];

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
        const isAdmin = ADMIN_EMAILS.includes(email);
        const profile: UserProfile = {
            uid: result.user.uid,
            email,
            displayName: additionalData.displayName,
            photoURL: null,
            church: additionalData.church,
            role: additionalData.role,
            isAdmin: isAdmin,
            createdAt: serverTimestamp(),
        };
        await setDoc(doc(db, 'users', result.user.uid), profile);
        setUserProfile(profile);
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                const isAdmin = user.email ? ADMIN_EMAILS.includes(user.email) : false;
                const profile: UserProfile = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    church: '',
                    role: '일반',
                    isAdmin: isAdmin,
                    createdAt: serverTimestamp(),
                };
                await setDoc(docRef, profile);
                setUserProfile(profile);
            } else {
                // 이미 존재하는 유저인 경우, 관리자 목록에 포함되어 있다면 isAdmin 플래그 업데이트
                const existingData = docSnap.data() as UserProfile;
                if (user.email && ADMIN_EMAILS.includes(user.email) && !existingData.isAdmin) {
                    await setDoc(docRef, { ...existingData, isAdmin: true }, { merge: true });
                    setUserProfile({ ...existingData, isAdmin: true });
                } else {
                    setUserProfile(existingData);
                }
            }
        } catch (error: any) {
            console.error("Google Login Error:", error);
            throw error;
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
