'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { collection, getDocs, orderBy, query, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MessageCircle, CheckCircle2, Clock, Send, ChevronDown, ChevronUp, Lock, Globe } from 'lucide-react';

interface QA {
    id: string;
    question: string;
    answer?: string;
    authorName: string;
    authorId?: string | null;
    isPublic: boolean;
    createdAt: any;
}

export default function AdminQAPage() {
    const [qaList, setQaList] = useState<QA[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [answerText, setAnswerText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchQA();
    }, []);

    const fetchQA = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'qa'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            setQaList(snap.docs.map(d => ({ id: d.id, ...d.data() } as QA)));
        } catch (error) {
            console.error("Error fetching QA:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExpand = (qa: QA) => {
        if (expanded === qa.id) {
            setExpanded(null);
            setAnswerText('');
        } else {
            setExpanded(qa.id);
            setAnswerText(qa.answer || '');
        }
    };

    const handleAnswerSubmit = async (id: string) => {
        if (!answerText.trim()) return;
        setSubmitting(true);
        try {
            await updateDoc(doc(db, 'qa', id), {
                answer: answerText.trim(),
                answeredAt: serverTimestamp(),
            });
            await fetchQA();
            setExpanded(null);
            setAnswerText('');
        } catch (error) {
            console.error("Error saving answer:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-content">
            <Header title="Q&A 답변 관리" showBack />

            <div className="section-header fade-in-up">
                <h2 className="section-title">Q&A MANAGEMENT</h2>
                <p className="section-subtitle">사용자들의 질문에 답변을 작성해 주세요</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 20px 40px' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner" /></div>
                ) : qaList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-tertiary)' }}>등록된 질문이 없습니다.</div>
                ) : (
                    qaList.map((qa) => (
                        <div key={qa.id} className="card-glass" style={{ padding: '0', overflow: 'hidden' }}>
                            <button
                                onClick={() => handleExpand(qa)}
                                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', padding: '20px', cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'flex-start' }}
                            >
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: qa.answer ? 'rgba(52, 211, 153, 0.1)' : 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {qa.answer ? <CheckCircle2 size={18} color="#34d399" /> : <Clock size={18} color="var(--neon-blue)" />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>{qa.authorName}</span>
                                        <span style={{ width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{qa.createdAt?.toDate ? qa.createdAt.toDate().toLocaleString() : 'N/A'}</span>
                                        {qa.isPublic ? <Globe size={12} color="var(--text-tertiary)" /> : <Lock size={12} color="#fca5a5" />}
                                    </div>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: 'white', lineHeight: 1.5, display: expanded === qa.id ? 'block' : '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{qa.question}</p>
                                </div>
                                <div style={{ marginTop: '4px' }}>
                                    {expanded === qa.id ? <ChevronUp size={18} color="var(--text-tertiary)" /> : <ChevronDown size={18} color="var(--text-tertiary)" />}
                                </div>
                            </button>

                            {expanded === qa.id && (
                                <div style={{ padding: '0 20px 24px 68px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }} className="fade-in">
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--gold)', marginBottom: '8px', letterSpacing: '0.5px' }}>관리자 답변 작성</label>
                                        <textarea
                                            value={answerText}
                                            onChange={e => setAnswerText(e.target.value)}
                                            style={{ width: '100%', minHeight: '120px', padding: '16px', borderRadius: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', lineHeight: 1.6, resize: 'none', outline: 'none' }}
                                            placeholder="답변 내용을 입력해 주세요..."
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => handleAnswerSubmit(qa.id)}
                                            disabled={submitting || !answerText.trim()}
                                            className="btn-primary"
                                            style={{ width: 'auto', padding: '10px 24px', display: 'flex', gap: '8px', alignItems: 'center' }}
                                        >
                                            {submitting ? <div className="spinner" /> : <><Send size={16} /> 답변 저장</>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
