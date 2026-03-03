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
        genderAge: '', // 02 성별과 연령대
        phone: '', // 03 연락처
        email: userProfile?.email || user?.email || '', // 04 이메일
        church: userProfile?.church || '', // 05 섬기시는 교회 및 직분
        type: 'general', // general | student
        depositorName: '',
        needsReceipt: 'no', // 06 영수증 발행 여부
        transportation: '', // 07 행사장 오시는 방법
        source: [] as string[], // 08 세미나 정보 습득 경로 (다중 선택)
        privacyAgreed: false, // 09 개인정보 수집 동의
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const fee = formData.type === 'general' ? '80,000' : '50,000';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        if (type === 'checkbox' && name === 'privacyAgreed') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCheckboxChange = (option: string) => {
        const currentSources = [...formData.source];
        const index = currentSources.indexOf(option);
        if (index > -1) {
            currentSources.splice(index, 1);
        } else {
            if (currentSources.length < 3) {
                currentSources.push(option);
            }
        }
        setFormData({ ...formData, source: currentSources });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.privacyAgreed) {
            alert('개인정보 수집 및 이용에 동의해 주셔야 합니다.');
            return;
        }

        setLoading(true);
        try {
            const amount = formData.type === 'general' ? 80000 : 50000;
            const docRef = await addDoc(collection(db, 'registrations'), {
                ...formData,
                userId: user?.uid || null,
                status: 'pending',
                amount: amount,
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
                            amount: amount
                        },
                        adminEmail: 'kms@jfm.kr'
                    }),
                });
            } catch (emailError) {
                console.error("Failed to send notification emails:", emailError);
            }

            setSuccess(true);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Submission Error:", error);
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
                        세미나 등록이 정상적으로 접수되었습니다.<br />
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
            <Header title="세미나 등록" showBack />

            <div style={{ padding: '16px 20px 40px' }} className="fade-in-up">
                <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.05))', borderRadius: '20px', border: '1px solid rgba(59,130,246,0.2)', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -30, right: -20, width: '100px', height: '100px', background: 'var(--neon-cyan)', filter: 'blur(40px)', opacity: 0.2 }} />
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>세미나 온라인 등록</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>현장 등록시 혼잡할 수 있으니 사전 등록을 권장합니다. 등록 후 입금이 확인되면 최종 안내 문자를 발송해 드립니다.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card-glass fade-in-up" style={{ padding: '24px 20px', marginBottom: '24px' }}>
                        <div className="form-group">
                            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>01 신청자 성함은? *</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>*What is the applicant's name?</p>
                            <input name="name" type="text" className="form-input" placeholder="응답자의 답변" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>02 성별과 연령대는? (성별/연령대) *</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>*What is your gender and age group?</p>
                            <input name="genderAge" type="text" className="form-input" placeholder="예: 남성 / 40대" value={formData.genderAge} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>03 연락처(Phone number)는? *</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>*휴대폰 번호를 010-0000-0000 이와 같은 양식으로 작성 바랍니다.</p>
                            <input name="phone" type="tel" className="form-input" placeholder="010-0000-0000" value={formData.phone} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>04 이메일 주소는? *</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>*Your email address is</p>
                            <input name="email" type="email" className="form-input" placeholder="email@example.com" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>05 섬기시는 교회(단체)와 직분(직위)은? *</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>*What church (organization) and position (position) do you serve?</p>
                            <input name="church" type="text" className="form-input" placeholder="예: 선한목자교회 비전센터 / 담임목사" value={formData.church} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="card-glass fade-in-up" style={{ padding: '24px 20px', marginBottom: '24px' }}>
                        <div className="form-group">
                            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>06 세미나 등록비 입금에 대한 '영수증 발행'이 필요하십니까?</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px', lineHeight: 1.5 }}>
                                *세미나 등록비는 1인당 8만원이며, 신학생은 5만원입니다. 입금 확인 후 영수증을 메일로 발송해 드립니다.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input type="radio" name="needsReceipt" value="yes" checked={formData.needsReceipt === 'yes'} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                                    <span style={{ fontSize: '14px' }}>네 (입금 확인 후 메일로 발송)</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input type="radio" name="needsReceipt" value="no" checked={formData.needsReceipt === 'no'} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                                    <span style={{ fontSize: '14px' }}>아니요</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>참석 유형 (등록비 확인) *</h3>
                            <select name="type" className="form-select" value={formData.type} onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', fontWeight: 600 }}>
                                <option value="general">일반 / 목회자 (80,000원)</option>
                                <option value="student">신학생 할인 (50,000원)</option>
                            </select>
                        </div>
                    </div>

                    {/* Transportation question removed per user request */}

                    <div className="card-glass fade-in-up" style={{ padding: '24px 20px', marginBottom: '24px' }}>
                        <div className="form-group">
                            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>07 세미나에 관한 정보는 어디를 통해서 알게 되셨습니까? *</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>*Where did you find out about the seminar? (응답자는 최대 3개 선택 가능)</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                                {['지인추천', 'SNS (페이스 북/인스타그램 등)', '간행물 광고 (목회와 신학/성침트리뷴/월간 목회 등)', '방송 뉴스와 기사', '이메일', '문자광고', '기타'].map((opt) => (
                                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.source.includes(opt)}
                                            onChange={() => handleCheckboxChange(opt)}
                                            disabled={!formData.source.includes(opt) && formData.source.length >= 3}
                                            style={{ width: '18px', height: '18px' }}
                                        />
                                        <span style={{ fontSize: '14px' }}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card-glass fade-in-up" style={{ padding: '24px 20px', marginBottom: '32px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>08 개인정보 수집 및 이용에 동의하십니까? *</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px', lineHeight: 1.5 }}>
                                본 신청서를 통해 수집된 개인정보는 세미나 참가자 관리 및 행사 안내를 위해서만 사용되며, 행사 종료 후 1개월 내에 파기됩니다.
                            </p>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: 'rgba(52, 211, 153, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                                <input type="checkbox" name="privacyAgreed" checked={formData.privacyAgreed} onChange={handleChange} required style={{ width: '20px', height: '20px' }} />
                                <span style={{ fontSize: '15px', fontWeight: 600, color: '#34d399' }}>네, 동의합니다 / Yes</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">입금자명</label>
                        <div style={{ position: 'relative' }}>
                            <Landmark size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                            <input name="depositorName" type="text" className="form-input" placeholder="입금하실 분의 성함" value={formData.depositorName} onChange={handleChange} required style={{ paddingLeft: '44px' }} />
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '8px' }}>* 등록자와 입금자가 다를 경우 반드시 정확히 기재</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', margin: '24px 0 32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>최종 입금액</span>
                            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.5px' }}>{fee} 원</span>
                        </div>
                    </div>

                    <button className="btn-primary" type="submit" disabled={loading} style={{ padding: '18px 24px', fontSize: '16px', marginBottom: '40px' }}>
                        {loading ? <div className="spinner" style={{ width: '22px', height: '22px' }} /> : (
                            <>세미나 신청서 접수하기 <ChevronRight size={20} /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
