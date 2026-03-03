'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Database, CheckCircle2, AlertCircle } from 'lucide-react';

const DEMO_NOTICES = [
    { title: '설교 세미나 2026 사전 등록 안내', content: '사전 등록은 5월 31일까지 진행됩니다...', isPinned: true },
    { title: '온라인 신청자 입금 계좌 안내', content: 'SC제일은행 310-20-008298 (예금주: 재단법인한국성서침례교회) 로 입금 부탁드립니다.', isPinned: true },
    { title: '오시는 길 및 주차장 안내', content: '선한목자교회 주차장은 매우 협소하오니 가급적 대중교통을 이용해 주시기 바랍니다.', isPinned: false },
    { title: '세미나 교재 및 일정표 배부 안내', content: '당일 참석 확인 데스크에서 교재와 이름표를 수령해 주세요.', isPinned: false },
];

const DEMO_VIDEOS = [
    { title: '설교 세미나 오리엔테이션', description: '세미나 전체 개요 및 아브라함 쿠루빌라 교수 소개 (누구나 시청 가능)', youtubeId: 'dQw4w9WgXcQ', thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', isPublic: true },
    { title: 'Day 1: 그리스도 중심 설교의 신학적 기초', description: '본문이 의도하는 바와 독자의 반응적 삶에 대한 성경신학적 접근 방식 이해', youtubeId: 'dQw4w9WgXcQ', thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', isPublic: false },
    { title: 'Day 2: Pericope 분석 방법론', description: '창세기 본문을 예시로 한 실전 문단 구분 및 핵심 메시지 도출 실습', youtubeId: 'dQw4w9WgXcQ', thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', isPublic: false },
];

const DEMO_PHOTOS = [
    { url: 'https://lh3.googleusercontent.com/pw/AP1GczOrB_72STE26f6L4BXzRvEOnTVJg8Sx9qQDmprxI27U8bVQC7xUFC7K-54cD1piFxlfihjS23ogxEX6uB40t9O_mQTF2721KK5_OQH0htC-8shalzxPj0cCo0cojQHpKL1pXOHk4oUdBNupPb0P2RAS6Q=w1443-h962-s-no-gm', title: '2025 설교세미나 현장 1' },
    { url: 'https://lh3.googleusercontent.com/pw/AP1GczOabQZ0afBXKkxUlC58hrmu7JE24zqQeLAy3vs1WrOmXs4lVA0QxeVgIirn8te6IXo5bQikIH8qkpOf3cuyRIgvtbHt5PZYGAfVtredRC5RAoiEZY1YoGh1tdU36yZRxzex18VJPy1jfK1FZ1ChloKQeQ=w1443-h962-s-no-gm', title: '2025 설교세미나 현장 2' },
];

const DEMO_QA = [
    { question: '세미나 교재가 영어로만 되어 있나요, 아니면 한국어 번역본도 있나요?', answer: '영어 원서와 함께 강의는 통역과 함께 진행됩니다. 일부 핵심 자료는 한국어로 별도 제공됩니다.', authorName: '김목사', isPublic: true },
    { question: 'Pericope 방법론이 설교 준비 시간을 어떻게 단축시킬 수 있나요?', answer: '오히려 본문에 더 깊이 집중하는 방식이라 처음에는 시간이 걸릴 수 있지만, 본문의 핵심을 파악하는 훈련이 되면 효율이 높아집니다.', authorName: '이동준', isPublic: true },
];

export default function AdminSetupPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSeedData = async () => {
        if (!confirm('현재 데이터베이스에 데모 데이터를 추가하시겠습니까? (중복 추가될 수 있습니다)')) return;

        setStatus('loading');
        setMessage('데이터를 생성 중입니다...');

        try {
            // Notices
            for (const item of DEMO_NOTICES) {
                await addDoc(collection(db, 'notices'), { ...item, createdAt: serverTimestamp() });
            }
            // Videos
            for (const item of DEMO_VIDEOS) {
                await addDoc(collection(db, 'videos'), { ...item, createdAt: serverTimestamp() });
            }
            // Photos
            for (const item of DEMO_PHOTOS) {
                await addDoc(collection(db, 'photos'), { ...item, createdAt: serverTimestamp() });
            }
            // QA
            for (const item of DEMO_QA) {
                await addDoc(collection(db, 'qa'), { ...item, createdAt: serverTimestamp() });
            }

            setStatus('success');
            setMessage('모든 데모 데이터가 실제 데이터베이스로 성공적으로 복사되었습니다!');
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage('데이터 생성 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="page-content">
            <Header title="시스템 초기 설정" showBack />

            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '24px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                }}>
                    <Database size={40} color="var(--neon-blue)" />
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>데이터베이스 초기화</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6 }}>
                    현재 비어있는 데이터베이스를 데모 내용으로 채웁니다.<br />
                    이 작업을 완료하면 관리자 모드에서 기존 공지, 영상, 사진들을<br />
                    즉시 확인하고 관리하실 수 있습니다.
                </p>

                {status === 'idle' && (
                    <button onClick={handleSeedData} className="btn-primary" style={{ padding: '16px 40px', width: 'auto' }}>
                        초기 데이터 생성하기
                    </button>
                )}

                {status === 'loading' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div className="spinner" />
                        <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <CheckCircle2 size={48} color="#34d399" />
                        <p style={{ color: '#34d399', fontWeight: 700 }}>{message}</p>
                        <button onClick={() => window.location.href = '/admin'} className="btn-secondary" style={{ marginTop: '12px' }}>
                            관리자 센터로 이동
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <AlertCircle size={48} color="#f87171" />
                        <p style={{ color: '#f87171', fontWeight: 700 }}>{message}</p>
                        <button onClick={() => setStatus('idle')} className="btn-secondary">
                            다시 시도
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
