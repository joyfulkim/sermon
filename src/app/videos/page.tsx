'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { PlayCircle, Lock, Video as VideoIcon, Calendar, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface VideoInfo {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
    thumbnailUrl: string;
    isPublic: boolean;
    createdAt: { seconds: number };
}

const DEMO_VIDEOS: VideoInfo[] = [
    { id: '1', title: '설교 세미나 오리엔테이션', description: '세미나 전체 개요 및 아브라함 쿠루빌라 교수 소개 (누구나 시청 가능)', youtubeId: 'dQw4w9WgXcQ', thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', isPublic: true, createdAt: { seconds: 1748200000 } },
    { id: '2', title: 'Day 1: 그리스도 중심 설교의 신학적 기초', description: '본문이 의도하는 바와 독자의 반응적 삶에 대한 성경신학적 접근 방식 이해', youtubeId: 'dQw4w9WgXcQ', thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', isPublic: false, createdAt: { seconds: 1748100000 } },
    { id: '3', title: 'Day 2: Pericope 분석 방법론', description: '창세기 본문을 예시로 한 실전 문단 구분 및 핵심 메시지 도출 실습', youtubeId: 'dQw4w9WgXcQ', thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', isPublic: false, createdAt: { seconds: 1748000000 } },
];

function formatDate(seconds: number) {
    return new Date(seconds * 1000).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function VideosPage() {
    const { user } = useAuth();
    const [videos, setVideos] = useState<VideoInfo[]>(DEMO_VIDEOS);
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() } as VideoInfo)));
                }
            } catch { /* display demo */ }
        };
        fetchVideos();
    }, []);

    return (
        <div className="page-content">
            <Header title="세미나 영상" showBack={false} />

            <div className="section-header fade-in-up">
                <h2 className="section-title">SEMINAR VOD</h2>
                <p className="section-subtitle">지난 세미나 강의 영상을 다시 시청하실 수 있습니다</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 20px 24px' }}>
                {videos.map((video, i) => {
                    const hasAccess = video.isPublic || user;

                    return (
                        <div key={video.id} className={`fade-in-up fade-delay-${(i % 3) + 1}`} style={{ borderRadius: '24px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                            {/* Thumbnail Area */}
                            <div
                                style={{ position: 'relative', width: '100%', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: hasAccess ? 'pointer' : 'default', background: '#000' }}
                                onClick={() => hasAccess && setPlayingVideo(video.youtubeId)}
                            >
                                <Image
                                    src={video.thumbnailUrl}
                                    alt={video.title}
                                    fill
                                    sizes="(max-width: 480px) 100vw, 400px"
                                    style={{ objectFit: 'cover', opacity: hasAccess ? 0.7 : 0.4 }}
                                />

                                {hasAccess ? (
                                    <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }} className="play-btn">
                                        <PlayCircle size={32} color="white" />
                                    </div>
                                ) : (
                                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.6)', padding: '16px 24px', borderRadius: '16px', backdropFilter: 'blur(8px)' }}>
                                        <Lock size={24} color="#f87171" style={{ filter: 'drop-shadow(0 0 8px rgba(248,113,113,0.5))' }} />
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>회원 전용 영상</span>
                                    </div>
                                )}
                            </div>

                            {/* Info Area */}
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                                    {!video.isPublic && <span className="badge badge-gold" style={{ letterSpacing: '0.5px' }}>PREMIUM VOD</span>}
                                    {video.isPublic && <span className="badge badge-blue">PUBLIC</span>}
                                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {formatDate(video.createdAt.seconds)}</span>
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '8px', lineHeight: 1.4 }}>{video.title}</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{video.description}</p>
                            </div>

                            {/* Lock Warning */}
                            {!hasAccess && (
                                <div style={{ padding: '0 20px 20px' }}>
                                    <div style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0.1), transparent)', borderLeft: '3px solid #f87171', padding: '12px 16px', borderRadius: '0 8px 8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', color: '#fca5a5', fontWeight: 500 }}>시청하시려면 로그인이 필요합니다.</span>
                                        <Link href="/login" style={{ fontSize: '12px', fontWeight: 700, color: 'white', background: 'rgba(239,68,68,0.2)', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none' }}>
                                            로그인하기
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {videos.length === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px', gap: '16px' }} className="fade-in-up">
                        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <VideoIcon size={32} color="var(--text-tertiary)" />
                        </div>
                        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500 }}>등록된 영상이 없습니다</p>
                    </div>
                )}
            </div>

            {/* Video Modal Player */}
            {playingVideo && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.2s ease-out' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'env(safe-area-inset-top, 20px) 20px 20px' }}>
                        <button onClick={() => setPlayingVideo(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <div style={{ width: '100%', maxWidth: '800px', aspectRatio: '16/9', background: '#000', borderRadius: '0', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .play-btn:active { transform: scale(0.9); }
            `}</style>
        </div>
    );
}
