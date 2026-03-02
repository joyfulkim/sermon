'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const { login, loginWithGoogle } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            router.push('/');
        } catch {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            // signInWithRedirect: 페이지가 구글로 리다이렉트되므로 이 줄 이후 코드는 실행되지 않습니다
        } catch {
            setError('Google 로그인 준비 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
            setLoading(false);
        }
    };

    return (
        <div className="page-content" style={{ display: 'flex', flexDirection: 'column' }}>
            <Header title="로그인" showBack showProfile={false} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px 60px' }}>

                {/* Premium Title Area */}
                <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120px', height: '120px', background: 'var(--neon-blue)', filter: 'blur(50px)', opacity: 0.15, borderRadius: '50%' }} />

                    <div style={{ width: '72px', height: '72px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,182,212,0.1))', border: '1px solid rgba(147,197,253,0.2)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 1 }}>
                        <span style={{ fontSize: '32px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }}>✝</span>
                    </div>
                    <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.5px' }}>WELCOME BACK</h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.2px' }}>설교세미나 2026 계정에 로그인하세요</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="fade-in-up" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '14px', marginBottom: '24px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <AlertCircle size={18} color="#f87171" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: '#fca5a5', fontWeight: 500, lineHeight: 1.4 }}>{error}</span>
                    </div>
                )}

                {/* Form Container */}
                <div className="card-glass fade-in-up fade-delay-1" style={{ padding: '28px 20px', borderRadius: '24px' }}>
                    <form onSubmit={handleLogin}>
                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label className="form-label" style={{ fontSize: '13px' }}>이메일 주소</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    className="form-input"
                                    type="email"
                                    placeholder="name@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    style={{ paddingLeft: '44px', background: 'rgba(0,0,0,0.2)' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label className="form-label" style={{ fontSize: '13px' }}>비밀번호</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    className="form-input"
                                    type={showPw ? 'text' : 'password'}
                                    placeholder="비밀번호를 입력하세요"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    style={{ paddingLeft: '44px', paddingRight: '44px', background: 'rgba(0,0,0,0.2)' }}
                                    required
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'var(--transition)' }}>
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button className="btn-primary" type="submit" disabled={loading} style={{ padding: '16px', fontSize: '15px' }}>
                            {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }} /> : '계정 로그인'}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '1px' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                    </div>

                    <button className="btn-secondary" onClick={handleGoogle} disabled={loading} style={{ background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <svg width="20" height="20" viewBox="0 0 18 18">
                            <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
                            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
                            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
                            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" />
                        </svg>
                        <span style={{ fontWeight: 600 }}>Google 계정으로 계속하기</span>
                    </button>
                </div>

                <p className="fade-in-up fade-delay-2" style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                    아직 계정이 없으신가요?{' '}
                    <Link href="/signup" style={{ color: 'var(--neon-cyan)', fontWeight: 700, textDecoration: 'none', marginLeft: '4px' }}>
                        새 계정 만들기
                    </Link>
                </p>
            </div>
        </div>
    );
}
