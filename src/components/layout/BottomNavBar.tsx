'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, FileText, Image, Video, Bell, MessageCircle } from 'lucide-react';

const navItems = [
    { href: '/', icon: Home, label: '홈' },
    { href: '/intro', icon: Info, label: '소개' },
    { href: '/register', icon: FileText, label: '등록' },
    { href: '/notices', icon: Bell, label: '공지' },
    { href: '/qa', icon: MessageCircle, label: 'Q/A' },
];

export default function BottomNavBar() {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav">
            {navItems.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Icon className="nav-icon" strokeWidth={isActive ? 2.5 : 1.8} />
                        <span>{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
