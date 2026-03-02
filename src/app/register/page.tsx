'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Header from '@/components/layout/Header';
import { CheckCircle2, User, Phone, Mail, Building, Landmark, ChevronRight } from 'lucide-react';

export default function RegisterPage() {
    const { user, userProfile } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: userProfile?.displayName || user?.displayName || '',
        phone: '',
        email: userProfile?.email || user?.email || '',
        church: userProfile?.church || '',
        type: 'general', // general | student
        depositorName: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Derive initial amount based on role. Even though they can change type dropdown, default it well.
    const fee = formData.type === 'general' ? '80,000' : '30,000';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, 'registrations'), {
                ...formData,
                userId: user?.uid || null,
                status: 'pending',
                amount: formData.type === 'general' ? 80000 : 30000,
                createdAt: serverTimestamp(),
            });

            // 이메일 발송 요청
            try {
                await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        applicantInfo: {
                            ...formData,
                            amount: formData.type === 'general' ? 80000 : 30000
                        },
                        adminEmail: 'joyfulkim@gmail.com' // 관리자에게 알림
                    }),
                });
            } catch (emailError) {
                console.error("Failed to send notification emails:", emailError);
                // 이메일 실패해도 가입은 완료된 것으로 처리 (사전 등록은 성공했으므로)
            }

            setSuccess(true);
            window.scrollTo(0, 0);
        } catch {
            alert('신청서 제출에 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="page-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
                <div className="fade-in-up" style={{ textAlign: 'center', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 0 40px rgba(52, 211, 153, 0.2)' }}>
                        <CheckCircle2 size={40} color="#34d399" />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.5px' }}>신청서 접수 완료</h2>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
                        세미나 사전 등록이 정상적으로 접수되었습니다.<br />
                        등록비를 입금해 주시면 최종 확정됩니다.
                    </p>

                    <div className="card-glass" style={{ width: '100%', padding: '24px', textAlign: 'left', marginBottom: '40px', background: 'rgba(255,255,255,0.03)' }}>
                        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '8px' }}>입금 안내</p>
                        <p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold)', marginBottom: '8px', letterSpacing: '0.5px' }}>카카오뱅크 3333-14-6097669</p>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>예금주: 최정기</p>
                        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>입금하실 금액</span>
                            <span style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>{fee}원</span>
                        </div>
                    </div>

                    <button className="btn-primary" onClick={() => router.push('/')}>
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <Header title="사전 등록" showBack />

            <div style={{ padding: '16px 20px 40px' }} className="fade-in-up">
                {/* Registration Header Banner */}
                <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.05))', borderRadius: '20px', border: '1px solid rgba(59,130,246,0.2)', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -30, right: -20, width: '100px', height: '100px', background: 'var(--neon-cyan)', filter: 'blur(40px)', opacity: 0.2 }} />
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>세미나 온라인 등록</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>현장 등록시 혼잡할 수 있으니 사전 등록을 권장합니다. 등록 후 입금이 확인되면 최종 안내 문자를 발송해 드립니다.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card-glass fade-in-up fade-delay-1" style={{ padding: '24px 20px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: 'var(--neon-blue)', letterSpacing: '0.5px' }}>신청자 정보</h3>

                        <div className="form-group">
                            <label className="form-label">이름 / 직분</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input name="name" type="text" className="form-input" placeholder="이름과 직분 (예: 홍길동 목사)" value={formData.name} onChange={handleChange} required style={{ paddingLeft: '44px' }} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">휴대전화번호</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input name="phone" type="tel" className="form-input" placeholder="010-0000-0000" value={formData.phone} onChange={handleChange} required style={{ paddingLeft: '44px' }} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">이메일 주소</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input name="email" type="email" className="form-input" placeholder="안내 메일 수신용" value={formData.email} onChange={handleChange} required style={{ paddingLeft: '44px' }} />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">출석 교회 / 소속</label>
                            <div style={{ position: 'relative' }}>
                                <Building size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input name="church" type="text" className="form-input" placeholder="예: 선한목자교회" value={formData.church} onChange={handleChange} required style={{ paddingLeft: '44px' }} />
                            </div>
                        </div>
                    </div>

                    <div className="card-glass fade-in-up fade-delay-2" style={{ padding: '24px 20px', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: 'var(--neon-cyan)', letterSpacing: '0.5px' }}>등록 구분 및 결제</h3>

                        <div className="form-group">
                            <label className="form-label">참석 유형</label>
                            <select name="type" className="form-select" value={formData.type} onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', fontWeight: 600 }}>
                                <option value="general">일반 / 목회자 (80,000원)</option>
                                <option value="student">신학생 할인 (30,000원)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">입금자명</label>
                            <div style={{ position: 'relative' }}>
                                <Landmark size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input name="depositorName" type="text" className="form-input" placeholder="입금하실 분의 성함" value={formData.depositorName} onChange={handleChange} required style={{ paddingLeft: '44px' }} />
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '8px' }}>* 등록자와 입금자가 다를 경우 반드시 정확히 기재</p>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>최종 입금액</span>
                                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.5px' }}>{fee} 원</span>
                            </div>
                        </div>
                    </div>

                    <button className="btn-primary" type="submit" disabled={loading} style={{ padding: '18px 24px', fontSize: '16px' }}>
                        {loading ? <div className="spinner" style={{ width: '22px', height: '22px' }} /> : (
                            <>세미나 신청서 접수하기 <ChevronRight size={20} /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
