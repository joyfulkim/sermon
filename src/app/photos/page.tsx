'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

interface Photo {
    id: string;
    url: string;
    title: string;
    createdAt: { seconds: number };
}

// Unsplash placeholders for testing photo album
const DEMO_PHOTOS: Photo[] = [
    { id: '1', url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80', title: '설교 세미나 1일차 전경', createdAt: { seconds: 1748200000 } },
    { id: '2', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', title: '강의중인 아브라함 교수', createdAt: { seconds: 1748100000 } },
    { id: '3', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80', title: '세미나 질의응답 시간', createdAt: { seconds: 1748000000 } },
    { id: '4', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80', title: '참석자 토론 및 교제', createdAt: { seconds: 1747900000 } },
    { id: '5', url: 'https://images.unsplash.com/photo-1475721025535-915097b2e8a1?w=800&q=80', title: '단체 기념 사진', createdAt: { seconds: 1747800000 } },
    { id: '6', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80', title: '수료식 및 파송', createdAt: { seconds: 1747700000 } },
];

export default function PhotosPage() {
    const [photos, setPhotos] = useState<Photo[]>(DEMO_PHOTOS);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() } as Photo)));
                }
            } catch { /* use demo */ }
        };
        fetchPhotos();
    }, []);

    return (
        <div className="page-content">
            <Header title="사진 앨범" showBack={false} />

            <div className="section-header fade-in-up">
                <h2 className="section-title">GALLERY</h2>
                <p className="section-subtitle">세미나의 생생한 현장 사진을 공유합니다</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '0 20px 24px' }}>
                {photos.map((photo, i) => (
                    <div
                        key={photo.id}
                        className={`fade-in-up fade-delay-${(i % 4)}`}
                        onClick={() => setSelectedPhoto(photo)}
                        style={{ position: 'relative', aspectRatio: '1', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        <Image
                            src={photo.url}
                            alt={photo.title}
                            fill
                            sizes="(max-width: 480px) 50vw, 33vw"
                            style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                            className="hover-scale"
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8))', display: 'flex', alignItems: 'flex-end', padding: '12px' }}>
                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {photo.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {photos.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px', gap: '16px' }} className="fade-in-up">
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={32} color="var(--text-tertiary)" />
                    </div>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500 }}>아직 등록된 사진이 없습니다</p>
                </div>
            )}

            {/* Premium Lightbox */}
            {selectedPhoto && (
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.2s ease-out' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'env(safe-area-inset-top, 20px) 20px 20px' }}>
                        <button onClick={() => setSelectedPhoto(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>
                    <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '800px', aspectRatio: '4/3', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Image
                                src={selectedPhoto.url}
                                alt={selectedPhoto.title}
                                fill
                                sizes="100vw"
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                    </div>
                    <div style={{ padding: '24px 20px env(safe-area-inset-bottom, 24px)', background: 'linear-gradient(0deg, rgba(0,0,0,0.8), transparent)' }}>
                        <p style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '8px', letterSpacing: '0.5px' }}>{selectedPhoto.title}</p>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                            {new Date(selectedPhoto.createdAt.seconds * 1000).toLocaleDateString()} 업로드
                        </p>
                    </div>
                </div>
            )}
            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .hover-scale { transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                .hover-scale:hover { transform: scale(1.05); }
            `}</style>
        </div>
    );
}
