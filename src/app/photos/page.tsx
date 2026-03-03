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

// 2025 설교세미나 Google Photos Album
const DEMO_PHOTOS: Photo[] = [
    { id: '1', url: 'https://lh3.googleusercontent.com/pw/AP1GczOrB_72STE26f6L4BXzRvEOnTVJg8Sx9qQDmprxI27U8bVQC7xUFC7K-54cD1piFxlfihjS23ogxEX6uB40t9O_mQTF2721KK5_OQH0htC-8shalzxPj0cCo0cojQHpKL1pXOHk4oUdBNupPb0P2RAS6Q=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254400 } },
    { id: '2', url: 'https://lh3.googleusercontent.com/pw/AP1GczOabQZ0afBXKkxUlC58hrmu7JE24zqQeLAy3vs1WrOmXs4lVA0QxeVgIirn8te6IXo5bQikIH8qkpOf3cuyRIgvtbHt5PZYGAfVtredRC5RAoiEZY1YoGh1tdU36yZRxzex18VJPy1jfK1FZ1ChloKQeQ=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254401 } },
    { id: '3', url: 'https://lh3.googleusercontent.com/pw/AP1GczPANiuJMwzQCxVJJfGiZsukliGAbTnxKPTHkm2lMNGIqUedolFXV94r7yeKFlHy0eCvJwtglZi0epQp3I8RuYfppZCA0P-xurcs89k8EZkxysKexTZikXNd6ol20DclHIq1I6t74a82LE3JyJ6lQERbPA=w641-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254402 } },
    { id: '4', url: 'https://lh3.googleusercontent.com/pw/AP1GczNVhBZ5D7K18khO31yWULHkkmGnR9GDIPtMb3B4kdrq8b6jFOTK9pujW4QHLSNeSwmR-f7ANShibGEUg-WHKOKTMFa6HMI5khDw02CwUixZrtdq5F9iuBogSLDYtRbcSU75-9eLMsiC5Ls57xXnBmEtUw=w641-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254403 } },
    { id: '5', url: 'https://lh3.googleusercontent.com/pw/AP1GczNh_syhSAIjyEktkebfJWYprSIa5ePH4S0cT0TWwm0W7gpZd47d2Hhl6mZr425rTmbmX-IE4iCQyc_YRasQMLhdNoIlMc_aBn7YnNMiF6R2o4zQ9_S6-gvIaXt_cg3-_YFAqfC_jtVXysgvyOuFW6GyHg=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254404 } },
    { id: '6', url: 'https://lh3.googleusercontent.com/pw/AP1GczMvRBCBfI2POHHdYmPIqs_yIEZNK3Fg-XwXWMN9zjikaSCTFL5jamTusVSamTg50jq-bAgJimpcH2scVwzGXmDO1zcU_pV_PzS6H6576VeBOVLwi5L5bDlQhyAml007QKddsNxubLNa-c8Dlx6TCssNVQ=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254405 } },
    { id: '7', url: 'https://lh3.googleusercontent.com/pw/AP1GczOjKktxRxCML70f47NjczTROe6ScskLtpbYCYIAKTMofaShu15Gg9188sISSm7ycuVdt7VZhPjGU6weLMT_Xnd--WofUBoJSOLYTZPzblICQQnVwKjooYUpqKEkR1tnwpGtb7HhagIr-a3XU16DPdKb4g=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254406 } },
    { id: '8', url: 'https://lh3.googleusercontent.com/pw/AP1GczOs5tmRyDkanbc6jyEi0txJw5aLEIzkWJc4m_vq7EMwkrDtmPLwyDmYdVDi75hrbEIJYI5fSeObaX5ljm-X_Is0js8WiSMt93TIrI1ZzvCE6mVBEBZftq2-p_PK_W6izQuN3Tg3z_VttGerbrQF3rDV-Q=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254407 } },
    { id: '9', url: 'https://lh3.googleusercontent.com/pw/AP1GczMDntVJvF-rrNSFN9hbAEcLb-hSMdv8RR3ygOmPj2JWAt7GiHbcv2I0ttsu206L1TiEYoZqrjKiKHHyOw8rMZIWw0Qws5_KDZNbiHDxHSx5QO5mXa8ORx4rMb9JU5w8MISdmFOm2RS_nMXXqzhNTXJdgg=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254408 } },
    { id: '10', url: 'https://lh3.googleusercontent.com/pw/AP1GczMZ6N29da4piUrF_RXFaCj4u592Zt4UcU5BcGJJBzejdb8_faBBnIcawD-Dr8hZ_R9vCdu2GXliA_mmbpTcq1vufkU-Fu2jmnE7ttnptwVR7zXmStoecUA7dvnMGRpXVmdl4TOUkQWG1p2TOk9bIvSVeQ=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254409 } },
    { id: '11', url: 'https://lh3.googleusercontent.com/pw/AP1GczOdFuIzJRb5FRVlcUKBbzYc0hfNKFyxp4YNNciTZzwLmTXgUMC2fxHJ67jSYQBmA8uOZ1uMR818rOlpjwh75mFMrR5KhyYiDYv7q-NEhR5iYvzcov7lXwHojcpqdaYIUOYNtTNtnIvdyCCIymZFnxDLcQ=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254410 } },
    { id: '12', url: 'https://lh3.googleusercontent.com/pw/AP1GczM2lrttrrDToy4GruKDjpIlWSy9pdI3RaxKtxS3AMvNy57Dd_D8duivCYZ40lz31k0OBYCIM-3yG8kJz1UYdk7iSNsknuNELp6ZjJukcKaFL-VqaAH43HJcnWLh3bZBxYg-7jlm8Q-wua_KjTwxDhMLQw=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254411 } },
    { id: '13', url: 'https://lh3.googleusercontent.com/pw/AP1GczNUFyWRo4zEiDE6TPVSpRG3oy38Bgsw6ni7jV-qffAYrssBBh1_0Sff__Ejrm1czpXYFMY0yjEmn9JcDI7aIukj-PwYsH2V3wUF-mQzMjVtcdl2TXKCIFgxz5Jr6eka_M2txocV_5h6k8wjHV4Ht1HbPA=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254412 } },
    { id: '14', url: 'https://lh3.googleusercontent.com/pw/AP1GczMup03ogfplADlOdoVkZb33dzA5V2MK89SexKwFwgu9Bjh6RFBW53btSQnVXuentyZONwMTpIhtHwFF30PNUDtqS3jXmmREs7liuWIrbIIkjOFihwPRhjxkI9Ih92vYZ8A5q64uK8cfY7ZWzQ65Hqoq1Q=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254413 } },
    { id: '15', url: 'https://lh3.googleusercontent.com/pw/AP1GczP32jvDSMoGjRw0ik3DQACDndiWXj3Pwqxk2uZsmUiYRXl2wEU_qaD1CXFqawi7fELJg4nypC9dIQj3CcuThWRoyVdDJcg_OsmaHwVe2eRdKCA6iSZ5977Ppt7-rSS1HMM40oNCtrcF3EHQA3jheIj-og=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254414 } },
    { id: '16', url: 'https://lh3.googleusercontent.com/pw/AP1GczMhhRYPMmDUWBUiAAjL3j2Oh1nBuQ9KZ7cvpn9CkS9cOhMWjDhsUIU8oV27ugU-IxFcQ0Midu2vIC-x1fs1DbLrWs48ijmlT3owFaVI0HOslxL4TldHEoq-orQ_Zeujt7bKFhHqjHcBQ2mLYSuLzAbCWA=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254415 } },
    { id: '17', url: 'https://lh3.googleusercontent.com/pw/AP1GczM5NUsZA19bOiD2yTZEY12n25wXwizyyB9RApX9lMF88NpJxiAhvnqiPf54DyLB8FJRMO4nzjxISbvtRh_EJSQde7YrD-unrnlZnl2KzVZcsECmzN6bnsI_1yrQGHmgSfXiRRImhoe2NyZDGuAVGAjp-g=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254416 } },
    { id: '18', url: 'https://lh3.googleusercontent.com/pw/AP1GczMWG-NMPIQg9VWnp-UoBd6guss9MFGHsw7LqsQPf5mw8S5eGngRMGVaDQ5xaXJ_ZNnitPtDWbE9d5g9UlPIl4eJyU3UDWVGMV_AmAUZXZ-CIaFzbz2kHhVnmF1M2jsRSVP-4W3wDRedYqhD4CiMZvr0vw=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254417 } },
    { id: '19', url: 'https://lh3.googleusercontent.com/pw/AP1GczM7473UC62XVpYupMiUJku-r1_v5vRtSx65Ix7jUOsozAewJ9gL9PeCDdId_H6E_4Jbr_o2_YjId-aS2UsiLSc6lXkv8RDPEERSznXN4Y_GJjmBg7P3pVlBmwL6qfQ8q65qdb7N0pafmUrLwp8GNA45HQ=w1443-h962-s-no-gm', title: '2025 설교세미나', createdAt: { seconds: 1749254418 } },
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
                <h2 className="section-title">PHOTO ALBUM</h2>
                <p className="section-subtitle">세미나의 생생한 현장 사진을 공유합니다</p>
            </div>

            <div className="grid-responsive" style={{ padding: '0 20px 24px' }}>
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
