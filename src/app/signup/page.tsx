'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import Header from '@/components/layout/Header';
import { User, Mail, Lock, Building, MapPin, Briefcase, Camera, ChevronRight, AlertCircle } from 'lucide-react';

export default function SignupPage() {
    const { signup } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        church: '',
        role: 'pastor'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('비밀번호가 일치하지 않습니다.');
        }
        if (formData.password.length < 6) {
            return setError('비밀번호는 6자 이상이어야 합니다.');
        }

        setError('');
        setLoading(true);

        try {
            await signup(formData.email, formData.password, {
                displayName: formData.name,
                church: formData.church,
                role: formData.role
            });
            router.push('/');
        } catch {
            setError('회원가입 중 오류가 발생했습니다. 이메일 형식을 확인해 주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-content">
            <Header title="회원가입" showBack showProfile={false} />

            <div style={{ padding: '24px 20px 40px' }} className="fade-in-up">

                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>
                        새 계정 만들기
                    </h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        간단한 가입으로 세미나 신청과 영상 다시보기 등<br />다양한 프리미엄 혜택을 누리세요.
                    </p>
                </div>

                {error && (
                    <div className="fade-in-up" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '14px', marginBottom: '24px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <AlertCircle size={18} color="#f87171" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: '#fca5a5', fontWeight: 500, lineHeight: 1.4 }}>{error}</span>
                    </div>
                )}

                <div className="card-glass fade-in-up fade-delay-1" style={{ padding: '32px 24px', borderRadius: '24px' }}>
                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label className="form-label">이름 / 직분</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    name="name"
                                    type="text"
                                    className="form-input"
                                    placeholder="예: 홍길동 목사"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '44px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">이메일 계정 (로그인 ID)</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    name="email"
                                    type="email"
                                    className="form-input"
                                    placeholder="name@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '44px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">시무 / 출석 교회</label>
                            <div style={{ position: 'relative' }}>
                                <Building size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    name="church"
                                    type="text"
                                    className="form-input"
                                    placeholder="예: 선한목자교회"
                                    value={formData.church}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '44px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">구분</label>
                            <div style={{ position: 'relative' }}>
                                <Briefcase size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <select
                                    name="role"
                                    className="form-select"
                                    value={formData.role}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '44px' }}
                                >
                                    <option value="pastor">목회자 / 일반</option>
                                    <option value="student">신학생</option>
                                    <option value="other">기타</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '32px 0 24px' }} />

                        <div className="form-group">
                            <label className="form-label">비밀번호 설정</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    name="password"
                                    type="password"
                                    className="form-input"
                                    placeholder="6자 이상 입력"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '44px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '32px' }}>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    className="form-input"
                                    placeholder="비밀번호 확인"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '44px' }}
                                    required
                                />
                            </div>
                        </div>

                        <button className="btn-primary" type="submit" disabled={loading}>
                            {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }} /> : (
                                <>가입 완료하고 계속하기 <ChevronRight size={18} /></>
                            )}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '16px', lineHeight: 1.5 }}>
                            가입 시 개인정보 수집 및 서비스 이용약관에 동의하는 것으로 간주합니다.
                        </p>
                    </form>
                </div>

            </div>
        </div>
    );
}
