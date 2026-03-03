'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Users, Bell, Video, Image as ImageIcon, MessageCircle, Settings } from 'lucide-react';

const adminMenus = [
    { href: '/admin/applicants', icon: Users, label: '신청자 관리', color: '#60a5fa', desc: '신청자 명단 확인 및 엑셀 다운로드' },
    { href: '/admin/notices', icon: Bell, label: '공지사항 관리', color: '#f87171', desc: '새로운 공지 등록 및 수정/삭제' },
    { href: '/admin/videos', icon: Video, label: '영상 관리', color: '#a78bfa', desc: '유튜브 영상 링크 등록 및 삭제' },
    { href: '/admin/photos', icon: ImageIcon, label: '사진 관리', color: '#fbbf24', desc: '현장 사진 업로드 및 삭제' },
    { href: '/admin/qa', icon: MessageCircle, label: 'Q&A 묻고 답하기 관리', color: '#38bdf8', desc: '질문 확인 및 답변 작성' },
];

export default function AdminPage() {
    return (
        <div className="page-content">
            <Header title="관리자 센터" showBack={false} />

            <div className="section-header fade-in-up">
                <h2 className="section-title">ADMIN PANEL</h2>
                <p className="section-subtitle">세미나 정보와 소통을 관리하세요</p>
            </div>

            <div className="grid-responsive" style={{ padding: '0 20px 40px' }}>
                {adminMenus.map((menu, i) => (
                    <Link key={menu.href} href={menu.href} style={{ textDecoration: 'none' }} className={`fade-in-up fade-delay-${(i % 3) + 1}`}>
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '20px',
                            padding: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            transition: 'var(--transition)'
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: `linear-gradient(135deg, ${menu.color}22, ${menu.color}11)`,
                                border: `1px solid ${menu.color}44`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 4px 12px ${menu.color}15`
                            }}>
                                <menu.icon size={28} color={menu.color} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '18px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{menu.label}</p>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{menu.desc}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ padding: '0 20px 40px' }} className="fade-in-up fade-delay-3">
                <div style={{ padding: '24px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(15,23,42,0.6))', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <Settings size={20} color="var(--neon-blue)" />
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>시스템 안내</h3>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        관리자 모드에서는 세미나의 모든 데이터를 실시간으로 관리할 수 있습니다. <br />
                        변경사항은 사용자 앱에 즉시 반영됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
