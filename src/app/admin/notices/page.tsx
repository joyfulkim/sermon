'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { collection, getDocs, orderBy, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Bell, Pin, Trash2, Edit2, Plus, X, Save } from 'lucide-react';

interface Notice {
    id: string;
    title: string;
    content: string;
    isPinned: boolean;
    createdAt: any;
}

export default function AdminNoticesPage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPinned, setIsPinned] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notice)));
        } catch (error) {
            console.error("Error fetching notices:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setIsPinned(false);
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (notice: Notice) => {
        setTitle(notice.title);
        setContent(notice.content);
        setIsPinned(notice.isPinned);
        setEditingId(notice.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const noticeData = {
                title,
                content,
                isPinned,
                updatedAt: serverTimestamp(),
            };

            if (editingId) {
                await updateDoc(doc(db, 'notices', editingId), noticeData);
            } else {
                await addDoc(collection(db, 'notices'), {
                    ...noticeData,
                    createdAt: serverTimestamp(),
                });
            }
            await fetchNotices();
            resetForm();
        } catch (error) {
            console.error("Error saving notice:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말 이 공지사항을 삭제하시겠습니까?')) return;
        try {
            await deleteDoc(doc(db, 'notices', id));
            await fetchNotices();
        } catch (error) {
            console.error("Error deleting notice:", error);
        }
    };

    return (
        <div className="page-content">
            <Header title="공지사항 관리" showBack rightAction={
                <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                </button>
            } />

            {showForm && (
                <div style={{ padding: '20px' }} className="fade-in-up">
                    <div className="card-glass" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', color: 'white' }}>
                            {editingId ? '공지사항 수정' : '새 공지사항 등록'}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>제목</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="form-input"
                                    placeholder="공지 제목을 입력하세요"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>내용</label>
                                <textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="form-input"
                                    placeholder="공지 내용을 입력하세요"
                                    style={{ minHeight: '150px', resize: 'none' }}
                                    required
                                />
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'white' }}>
                                <input
                                    type="checkbox"
                                    checked={isPinned}
                                    onChange={e => setIsPinned(e.target.checked)}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--neon-blue)' }}
                                />
                                상단 고정하기 (중요 공지)
                            </label>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button type="button" onClick={resetForm} className="btn-secondary" style={{ flex: 1 }}>취소</button>
                                <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 2 }}>
                                    {submitting ? <div className="spinner" /> : <><Save size={18} /> {editingId ? '수정 완료' : '등록 완료'}</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner" /></div>
                ) : notices.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-tertiary)' }}>등록된 공지사항이 없습니다.</div>
                ) : (
                    notices.map((notice) => (
                        <div key={notice.id} className="card-glass" style={{ padding: '20px', border: notice.isPinned ? '1px solid rgba(239, 68, 68, 0.3)' : undefined }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {notice.isPinned && <Pin size={14} color="#f87171" style={{ transform: 'rotate(45deg)' }} />}
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>{notice.title}</h3>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleEdit(notice)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(notice.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                </div>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '12px' }}>
                                {notice.content}
                            </p>
                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                                {notice.createdAt?.toDate ? notice.createdAt.toDate().toLocaleString() : 'N/A'}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
