'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, User } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    showProfile?: boolean;
    rightAction?: React.ReactNode;
}

export default function Header({ title, showBack = false, showProfile = true, rightAction }: HeaderProps) {
    const router = useRouter();

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

            {rightAction ?? (showProfile && (
                <Link href="/profile" style={{ color: 'var(--white-70)', marginLeft: 'auto' }}>
                    <User size={22} />
                </Link>
            ))}
        </header>
    );
}
