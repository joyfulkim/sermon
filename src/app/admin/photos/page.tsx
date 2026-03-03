'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { collection, getDocs, orderBy, query, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Image as ImageIcon, Trash2, Plus, X, Save } from 'lucide-react';

interface Photo {
    id: string;
    url: string;
    title: string;
    createdAt: any;
}

export default function AdminPhotosPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() } as Photo)));
        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setUrl('');
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (photo: Photo) => {
        setTitle(photo.title);
        setUrl(photo.url);
        setEditingId(photo.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const photoData = {
                title,
                url,
                updatedAt: serverTimestamp(),
                ...(editingId ? {} : { createdAt: serverTimestamp() })
            };

            const { updateDoc, doc, addDoc } = await import('firebase/firestore');
            if (editingId) {
                await updateDoc(doc(db, 'photos', editingId), photoData);
            } else {
                await addDoc(collection(db, 'photos'), photoData);
            }
            await fetchPhotos();
            resetForm();
        } catch (error) {
            console.error("Error saving photo:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말 이 사진을 삭제하시겠습니까?')) return;
        try {
            await deleteDoc(doc(db, 'photos', id));
            await fetchPhotos();
        } catch (error) {
            console.error("Error deleting photo:", error);
        }
    };

    return (
        <div className="page-content">
            <Header title="사진 관리" showBack rightAction={
                <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                </button>
            } />

            {showForm && (
                <div style={{ padding: '20px' }} className="fade-in-up">
                    <div className="card-glass" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', color: 'white' }}>
                            {editingId ? '사진 정보 수정' : '새 사진 등록'}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>사진 제목</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="form-input"
                                    placeholder="사진 제목을 입력하세요 (예: 2026 설교세미나 현장)"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>이미지 URL</label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    className="form-input"
                                    placeholder="이미지 주소를 입력하세요"
                                    required
                                />
                            </div>
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

            <div style={{ padding: '0 20px 40px' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner" /></div>
                ) : photos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-tertiary)' }}>등록된 사진이 없습니다.</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                        {photos.map((photo) => (
                            <div key={photo.id} className="card-glass" style={{ position: 'relative', aspectRatio: '1', borderRadius: '16px', overflow: 'hidden' }}>
                                <img src={photo.url} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.8))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <button onClick={() => handleEdit(photo)} style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>수정</button>
                                        <button onClick={() => handleDelete(photo.id)} style={{ background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}><Trash2 size={14} /></button>
                                    </div>
                                    <p style={{ fontSize: '10px', color: 'white', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{photo.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
