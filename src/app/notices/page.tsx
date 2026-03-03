'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Bell, Pin, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Notice {
    id: string;
    title: string;
    content: string;
    isPinned: boolean;
    createdAt: { seconds: number };
}

const DEMO_NOTICES: Notice[] = [
    { id: '1', title: '설교 세미나 2026 사전 등록 안내', content: '사전 등록은 5월 31일까지 진행됩니다...', isPinned: true, createdAt: { seconds: 1748200000 } },
    { id: '2', title: '온라인 신청자 입금 계좌 안내', content: 'SC제일은행 310-20-008298 (예금주: 재단법인한국성서침례교회) 로 입금 부탁드립니다.', isPinned: true, createdAt: { seconds: 1748100000 } },
    { id: '3', title: '오시는 길 및 주차장 안내', content: '선한목자교회 주차장은 매우 협소하오니 가급적 대중교통을 이용해 주시기 바랍니다.', isPinned: false, createdAt: { seconds: 1748000000 } },
    { id: '4', title: '세미나 교재 및 일정표 배부 안내', content: '당일 참석 확인 데스크에서 교재와 이름표를 수령해 주세요.', isPinned: false, createdAt: { seconds: 1747800000 } },
];

function formatDate(seconds: number) {
    return new Date(seconds * 1000).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function NoticesPage() {
    const [notices, setNotices] = useState<Notice[]>(DEMO_NOTICES);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notice)));
                }
            } catch { /* display demo */ }
        };
        fetchNotices();
    }, []);

    const pinned = notices.filter(n => n.isPinned);
    const regular = notices.filter(n => !n.isPinned);

    return (
        <div className="page-content">
            <Header title="공지사항" showBack={true} />

            <div className="section-header fade-in-up">
                <h2 className="section-title">NOTICE</h2>
                <p className="section-subtitle">세미나 관련 중요 소식을 전해드립니다</p>
            </div>

            <div className="grid-responsive" style={{ padding: '0 20px 24px' }}>

                {/* Pinned Notices */}
                {pinned.map(notice => (
                    <div key={notice.id} className="card-glass fade-in-up" style={{ padding: '20px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(15, 23, 42, 0.6))', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Pin size={14} color="#f87171" style={{ transform: 'rotate(45deg)' }} />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#fca5a5', letterSpacing: '0.5px' }}>IMPORTANT</span>
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '8px', lineHeight: 1.4 }}>{notice.title}</h3>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '16px' }}>{notice.content}</p>
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0 0 16px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>관리자 · {formatDate(notice.createdAt.seconds)}</span>
                        </div>
                    </div>
                ))}

                {/* Regular Notices */}
                {regular.map((notice, i) => (
                    <div key={notice.id} className={`card-glass fade-in-up fade-delay-${(i % 3) + 1}`} style={{ padding: '24px 20px', borderRadius: '20px', cursor: 'pointer', transition: 'var(--transition)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--neon-cyan)', background: 'rgba(6,182,212,0.1)', padding: '4px 10px', borderRadius: '100px', letterSpacing: '0.5px' }}>안내</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>{formatDate(notice.createdAt.seconds)}</span>
                                </div>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>{notice.title}</h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{notice.content}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {notices.length === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px', gap: '16px' }} className="fade-in-up">
                        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bell size={32} color="var(--text-tertiary)" />
                        </div>
                        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500 }}>등록된 공지사항이 없습니다</p>
                    </div>
                )}
            </div>
        </div>
    );
}
