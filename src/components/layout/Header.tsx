'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, User, Settings } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    showProfile?: boolean;
    rightAction?: React.ReactNode;
}

export default function Header({ title, showBack = false, showProfile = true, rightAction }: HeaderProps) {
    const router = useRouter();
    const { userProfile } = useAuth();

    return (
        <header className="app-header">
            {showBack ? (
                <button className="header-back-btn" onClick={() => router.back()}>
                    <ChevronLeft size={24} />
                </button>
            ) : (
                <span className="header-logo">설교세미나<br />2026</span>
            )}

            {title && (
                <h1 className="header-title">{title}</h1>
            )}

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                {userProfile?.isAdmin && (
                    <Link href="/admin/applicants" style={{ color: 'var(--white-70)', display: 'flex' }}>
                        <Settings size={22} className="rotate-on-hover" />
                    </Link>
                )}

                {rightAction ?? (showProfile && (
                    <Link href="/profile" style={{ color: 'var(--white-70)' }}>
                        <User size={22} />
                    </Link>
                ))}
            </div>
        </header>
    );
}
