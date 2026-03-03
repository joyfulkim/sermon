'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { collection, getDocs, orderBy, query, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { MessageCircle, ChevronDown, ChevronUp, Plus, Send, Lock } from 'lucide-react';
import Link from 'next/link';

interface QA {
    id: string;
    question: string;
    answer?: string;
    authorName: string;
    authorId?: string | null;
    isPublic: boolean;
    createdAt: { seconds: number };
}

const DEMO_QA: QA[] = [
    { id: '1', question: '세미나 교재가 영어로만 되어 있나요, 아니면 한국어 번역본도 있나요?', answer: '영어 원서와 함께 강의는 통역과 함께 진행됩니다. 일부 핵심 자료는 한국어로 별도 제공됩니다.', authorName: '김목사', isPublic: true, createdAt: { seconds: 1748822400 } },
    { id: '2', question: 'Pericope 방법론이 설교 준비 시간을 어떻게 단축시킬 수 있나요?', answer: '오히려 본문에 더 깊이 집중하는 방식이라 처음에는 시간이 걸릴 수 있지만, 본문의 핵심을 파악하는 훈련이 되면 효율이 높아집니다.', authorName: '이동준', isPublic: true, createdAt: { seconds: 1748736000 } },
    { id: '3', question: '신학교 졸업 후 목회 현장에서도 적용 가능한 내용인가요?', answer: undefined, authorName: '박신학생', isPublic: true, createdAt: { seconds: 1748649600 } },
];

function formatDate(seconds: number) {
    return new Date(seconds * 1000).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export default function QAPage() {
    const { user, userProfile } = useAuth();
    const [qaList, setQaList] = useState<QA[]>(DEMO_QA);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [question, setQuestion] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQA = async () => {
            try {
                const q = query(collection(db, 'qa'), orderBy('createdAt', 'desc'));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    setQaList(snap.docs.map(d => ({ id: d.id, ...d.data() } as QA)));
                }
            } catch { /* use demo */ }
        };
        fetchQA();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        setSubmitting(true);
        try {
            const newQA = {
                question: question.trim(),
                authorName: user?.displayName ?? '익명',
                authorId: user?.uid ?? null,
                isPublic,
                createdAt: serverTimestamp(),
            };
            const docRef = await addDoc(collection(db, 'qa'), newQA);
            const optimistic: QA = { id: docRef.id, ...newQA, answer: undefined, createdAt: { seconds: Date.now() / 1000 } };
            setQaList(prev => [optimistic, ...prev]);
            setQuestion('');
            setShowForm(false);
        } catch {
            // fail silently
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-content">
            <Header title="Q&A" showBack={true} rightAction={
                user ? (
                    <button onClick={() => setShowForm(!showForm)} style={{ background: 'var(--neon-blue)', border: 'none', cursor: 'pointer', color: 'white', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(59,130,246,0.4)', transition: 'var(--transition)' }}>
                        <Plus size={20} style={{ transform: showForm ? 'rotate(45deg)' : 'none', transition: 'var(--transition)' }} />
                    </button>
                ) : undefined
            } />

            <div className="section-header fade-in-up">
                <h2 className="section-title">Q & A COMMUNITY</h2>
                <p className="section-subtitle">세미나에 대한 궁금한 점을 자유롭게 질문해 주세요</p>
            </div>

            {/* Submit Form */}
            <div style={{ padding: '0 20px 16px', display: showForm && user ? 'block' : 'none' }} className="fade-in-up">
                <div className="card-glass" style={{ padding: '20px', border: '1px solid rgba(59,130,246,0.3)', background: 'linear-gradient(135deg, rgba(30,45,90,0.6), rgba(15,23,42,0.8))' }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--neon-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}><MessageCircle size={16} /> 새 질문 작성</p>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            placeholder="내용을 자세히 작성해 주세요..."
                            style={{ width: '100%', minHeight: '120px', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: 'white', fontSize: '15px', fontFamily: 'Pretendard, sans-serif', resize: 'none', outline: 'none', lineHeight: 1.6, marginBottom: '16px' }}
                            required
                        />
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                                <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--neon-blue)', borderRadius: '4px' }} />
                                공개 질문
                            </label>
                            <button className="btn-primary" type="submit" disabled={submitting} style={{ flex: 1, padding: '14px' }}>
                                {submitting ? <div className="spinner" /> : <><Send size={16} /> 등록하기</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {!user && (
                <div style={{ margin: '0 20px 16px', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', gap: '12px', alignItems: 'center', backdropFilter: 'blur(10px)' }} className="fade-in-up">
                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lock size={18} color="var(--text-tertiary)" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            <Link href="/login" style={{ color: 'var(--neon-blue)', fontWeight: 700, textDecoration: 'none' }}>로그인</Link> 및 <Link href="/signup" style={{ color: 'var(--neon-cyan)', fontWeight: 700, textDecoration: 'none' }}>회원가입</Link> 후<br />질문을 등록할 수 있습니다.
                        </p>
                    </div>
                </div>
            )}

            {/* QA List */}
            <div className="grid-responsive" style={{ padding: '0 20px 24px' }}>
                {qaList.filter(qa => qa.isPublic || qa.authorId === user?.uid || userProfile?.isAdmin).map((qa, i) => (
                    <div key={qa.id} className={`card-glass fade-in-up fade-delay-${(i % 3) + 1}`} style={{ padding: '0', borderRadius: '20px' }}>
                        <button
                            onClick={() => setExpanded(expanded === qa.id ? null : qa.id)}
                            style={{ background: 'none', border: 'none', width: '100%', padding: '20px', color: 'white', textAlign: 'left', display: 'flex', gap: '16px', alignItems: 'flex-start', cursor: 'pointer' }}
                        >
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.1))', color: 'var(--neon-blue)', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                Q
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '8px' }}>{qa.question}</p>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>{qa.authorName} · {formatDate(qa.createdAt.seconds)}</span>
                                    {!qa.isPublic && <span className="badge" style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-tertiary)', border: '1px solid rgba(255,255,255,0.1)' }}>비공개</span>}
                                    {qa.answer && <span className="badge badge-blue" style={{ fontSize: '10px', padding: '2px 8px' }}>답변완료</span>}
                                </div>
                            </div>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}>
                                {expanded === qa.id ? <ChevronUp size={14} color="var(--text-secondary)" /> : <ChevronDown size={14} color="var(--text-secondary)" />}
                            </div>
                        </button>

                        {expanded === qa.id && (
                            <div style={{ padding: '0 20px 20px 64px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                                {qa.answer ? (
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '-44px', top: '2px', width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, rgba(234,179,8,0.2), rgba(245,158,11,0.1))', color: 'var(--gold)', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            A
                                        </div>
                                        <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)', marginBottom: '6px', letterSpacing: '0.5px' }}>관리자 답변</p>
                                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.8 }}>{qa.answer}</p>
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                                        관리자가 답변을 준비 중입니다.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty state */}
            {qaList.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px', gap: '16px' }} className="fade-in-up">
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageCircle size={32} color="var(--text-tertiary)" />
                    </div>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500 }}>아직 등록된 질문이 없습니다</p>
                </div>
            )}
        </div>
    );
}
