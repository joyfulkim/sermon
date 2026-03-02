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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/logo.png" alt="Logo" style={{ height: '28px', width: 'auto' }} onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const next = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                        if (next) next.style.display = 'block';
                    }} />
                    <span className="header-logo" style={{ display: 'none' }}>설교세미나<br />2026</span>
                </div>
            )}

            {title && (
                <h1 className="header-title">{title}</h1>
            )}

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {userProfile?.isAdmin && (
                    <Link href="/admin/applicants" style={{
                        background: 'rgba(37,99,235,0.2)',
                        border: '1px solid rgba(37,99,235,0.4)',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        color: 'var(--neon-blue)',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none'
                    }}>
                        관리자
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
