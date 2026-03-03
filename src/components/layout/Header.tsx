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
                    <a href="https://www.bbts.ac.kr" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/logo.png" alt="Logo" style={{ height: '40px', width: 'auto' }} onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const next = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                            if (next) next.style.display = 'block';
                        }} />
                    </a>
                    <span className="header-logo" style={{ display: 'none' }}>설교세미나<br />2026</span>
                </div>
            )}

            {title && (
                <h1 className="header-title" style={{ marginLeft: showBack ? '0' : '20px' }}>{title}</h1>
            )}

            <nav className="show-on-desktop" style={{ display: 'flex', gap: '24px', marginLeft: '40px' }}>
                <Link href="/" className="nav-link-desktop">홈</Link>
                <Link href="/notices" className="nav-link-desktop">공지</Link>
                <Link href="/videos" className="nav-link-desktop">영상</Link>
                <Link href="/photos" className="nav-link-desktop">앨범</Link>
                <Link href="/qa" className="nav-link-desktop">Q&A</Link>
            </nav>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {userProfile?.isAdmin && (
                    <Link href="/admin/applicants" style={{
                        background: 'rgba(37,99,235,0.3)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 800,
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
