'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userProfile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !userProfile?.isAdmin) {
            router.push('/');
        }
    }, [userProfile, loading, router]);

    if (loading) {
        return (
            <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!userProfile?.isAdmin) {
        return null;
    }

    return (
        <div className="admin-container">
            {children}
        </div>
    );
}
