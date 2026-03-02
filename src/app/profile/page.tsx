'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, LogOut, CheckCircle2, Clock, Mail, Building, Settings, ChevronRight } from 'lucide-react';

interface Registration {
    id: string;
    status: 'pending' | 'completed';
    amount: number;
    type: 'general' | 'student';
    createdAt: Timestamp;
}

export default function ProfilePage() {
    const { user, userProfile, logout } = useAuth();
    const router = useRouter();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.replace('/login');
            return;
        }

        const fetchRegistrations = async () => {
            try {
                const q = query(
                    collection(db, 'registrations'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );
                const snap = await getDocs(q);
                setRegistrations(snap.docs.map(d => ({ id: d.id, ...d.data() } as Registration)));
            } catch (e) {
                console.error('Failed to fetch registrations', e);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [user, router]);

    const handleLogout = async () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            await logout();
            router.push('/');
        }
    };

    if (!user) return null;

    return (
        <div className="page-content">
            <Header title="내 정보" showBack={false} />

            <div style={{ padding: '0 20px 24px' }}>
                <div className="fade-in-up">
                    <h2 className="section-title" style={{ padding: '24px 0 16px' }}>PROFILE</h2>
                </div>

                {/* Profile Card */}
                <div className="card-glass fade-in-up fade-delay-1" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.1))', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                            <User size={36} color="var(--neon-blue)" />
                        </div>
                        {userProfile?.isAdmin && (
                            <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--neon-cyan)', color: '#000', fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '12px', border: '2px solid var(--bg-base)' }}>
                                ADMIN
                            </div>
                        )}
                    </div>

                    <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px', color: 'white' }}>{user.displayName || '이름 없음'}</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: '20px' }}>{user.email}</p>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px' }}>
                            <Building size={16} color="var(--text-tertiary)" />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>소속 교회</p>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{userProfile?.church || '미등록'}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px' }}>
                            <Mail size={16} color="var(--text-tertiary)" />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>이메일 계정</p>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration History */}
                <div className="fade-in-up fade-delay-2" style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 800 }}>나의 세미나 신청 내역</h3>
                        <span style={{ fontSize: '12px', color: 'var(--neon-cyan)', fontWeight: 600 }}>총 {registrations.length}건</span>
                    </div>

                    {loading ? (
                        <div style={{ padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
                            <div className="spinner" />
                        </div>
                    ) : registrations.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {registrations.map(reg => (
                                <div key={reg.id} className="card-glass" style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                                                {reg.type === 'student' ? '신학생' : '일반'}
                                            </span>
                                            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                                                {new Date(reg.createdAt.seconds * 1000).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {reg.status === 'completed' ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#34d399' }}>
                                                <CheckCircle2 size={14} /> 입금확인
                                            </span>
                                        ) : (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>
                                                <Clock size={14} /> 입금대기
                                            </span>
                                        )}
                                    </div>
                                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>설교 세미나 2026 참석</h4>
                                    <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--neon-blue)', letterSpacing: '0.5px' }}>{reg.amount.toLocaleString()}원</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card-glass" style={{ padding: '40px 20px', textAlign: 'center', borderRadius: '20px', background: 'rgba(255,255,255,0.02)' }}>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>아직 신청한 내역이 없습니다</p>
                            <button onClick={() => router.push('/register')} className="btn-secondary" style={{ padding: '12px 20px', display: 'inline-flex', width: 'auto', borderRadius: '12px' }}>
                                세미나 신청하기 <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="fade-in-up fade-delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {userProfile?.isAdmin && (
                        <button
                            onClick={() => router.push('/admin/applicants')}
                            style={{ width: '100%', padding: '16px 20px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '16px', color: 'var(--neon-blue)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', fontWeight: 800, cursor: 'pointer', transition: 'var(--transition)' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Users size={18} />
                                신청자 명단 관리 (관리자)
                            </div>
                            <ChevronRight size={18} />
                        </button>
                    )}
                    <button style={{ width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Settings size={18} color="var(--text-tertiary)" />
                            계정 설정
                        </div>
                        <ChevronRight size={18} color="var(--text-tertiary)" />
                    </button>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '16px 20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '16px', color: '#fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <LogOut size={18} />
                            로그아웃
                        </div>
                    </button>
                </div>

            </div>
        </div>
    );
}
