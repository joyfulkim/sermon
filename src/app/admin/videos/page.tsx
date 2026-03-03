'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { collection, getDocs, orderBy, query, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Video, Trash2, Plus, X, Play, Save } from 'lucide-react';

interface VideoInfo {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
    thumbnailUrl: string;
    isPublic: boolean;
    createdAt: any;
}

export default function AdminVideosPage() {
    const [videos, setVideos] = useState<VideoInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [youtubeId, setYoutubeId] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() } as VideoInfo)));
        } catch (error) {
            console.error("Error fetching videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setYoutubeId('');
        setIsPublic(true);
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (video: VideoInfo) => {
        setTitle(video.title);
        setDescription(video.description);
        setYoutubeId(video.youtubeId);
        setIsPublic(video.isPublic);
        setEditingId(video.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Extract youtubeId if full URL is pasted
            let id = youtubeId.trim();
            if (id.includes('youtube.com/watch?v=')) {
                id = id.split('v=')[1].split('&')[0];
            } else if (id.includes('youtu.be/')) {
                id = id.split('youtu.be/')[1].split('?')[0];
            }

            const videoData = {
                title,
                description,
                youtubeId: id,
                thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
                isPublic,
                updatedAt: serverTimestamp(),
                ...(editingId ? {} : { createdAt: serverTimestamp() })
            };

            const { updateDoc, doc, addDoc } = await import('firebase/firestore');
            if (editingId) {
                await updateDoc(doc(db, 'videos', editingId), videoData);
            } else {
                await addDoc(collection(db, 'videos'), videoData);
            }
            await fetchVideos();
            resetForm();
        } catch (error) {
            console.error("Error saving video:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말 이 영상을 삭제하시겠습니까?')) return;
        try {
            await deleteDoc(doc(db, 'videos', id));
            await fetchVideos();
        } catch (error) {
            console.error("Error deleting video:", error);
        }
    };

    return (
        <div className="page-content">
            <Header title="영상 관리" showBack rightAction={
                <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                </button>
            } />

            {showForm && (
                <div style={{ padding: '20px' }} className="fade-in-up">
                    <div className="card-glass" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', color: 'white' }}>
                            {editingId ? '영상 정보 수정' : '새 영상 등록'}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>영상 제목</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="form-input"
                                    placeholder="영상 제목을 입력하세요"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>유튜브 링크 또는 ID</label>
                                <input
                                    type="text"
                                    value={youtubeId}
                                    onChange={e => setYoutubeId(e.target.value)}
                                    className="form-input"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>영상 설명</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="form-input"
                                    placeholder="영상에 대한 짧은 설명을 입력하세요"
                                    style={{ minHeight: '80px', resize: 'none' }}
                                />
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'white' }}>
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={e => setIsPublic(e.target.checked)}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--neon-blue)' }}
                                />
                                전체 공개 (체크 해제 시 로그인 된 회원만 시청 가능)
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

            <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner" /></div>
                ) : videos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-tertiary)' }}>등록된 영상이 없습니다.</div>
                ) : (
                    videos.map((v) => (
                        <div key={v.id} className="card-glass" style={{ padding: '16px', display: 'flex', gap: '16px' }}>
                            <div style={{ position: 'relative', width: '120px', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', background: '#000', flexShrink: 0 }}>
                                <img src={v.thumbnailUrl} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Play size={12} color="white" fill="white" />
                                    </div>
                                </div>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</h3>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <button onClick={() => handleEdit(v)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>수정</button>
                                        <button onClick={() => handleDelete(v.id)} style={{ background: 'none', border: 'none', color: '#f87171', padding: '0', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.description}</p>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600 }}>{v.isPublic ? 'PUBLIC' : 'PRIVATE'}</span>
                                    <span style={{ width: '2px', height: '2px', borderRadius: '50%', background: 'var(--text-tertiary)' }} />
                                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{v.createdAt?.toDate ? v.createdAt.toDate().toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
