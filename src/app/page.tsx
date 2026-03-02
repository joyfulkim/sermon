'use client';

import Link from 'next/link';
import { CalendarDays, MapPin, Phone, Clock, BookOpen, FileText, Image as ImageIcon, Video, Bell, MessageCircle, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const quickLinks = [
  { href: '/intro', icon: BookOpen, label: '세미나 소개', color: '#60a5fa', desc: '아브라함 교수 집중조명' },
  { href: '/register', icon: FileText, label: '온라인 신청서', color: '#2dd4bf', desc: '지금 바로 등록하기' },
  { href: '/videos', icon: Video, label: '세미나 영상', color: '#a78bfa', desc: '다시보기 지원' },
  { href: '/photos', icon: ImageIcon, label: '사진 앨범', color: '#fbbf24', desc: '생생한 현장 갤러리' },
  { href: '/notices', icon: Bell, label: '공지사항', color: '#f87171', desc: '최신 중요 안내' },
  { href: '/qa', icon: MessageCircle, label: 'Q&A 커뮤니티', color: '#38bdf8', desc: '자유로운 질문 답변' },
];

export default function HomePage() {
  const { user, userProfile } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="page-content" style={{ paddingTop: 0 }}>
      {/* Premium Hero Banner replacing original static gradient */}
      <div style={{ position: 'relative', width: '100%', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px 20px 32px', zIndex: 10 }}>

        {/* Top nav area in hero */}
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 20px) + 16px)', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '32px', width: 'auto' }} onError={(e) => {
              // Fallback if logo.png is not found yet
              (e.target as HTMLImageElement).style.display = 'none';
              const next = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
              if (next) next.style.display = 'flex';
            }} />
            <div style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', color: 'white', fontWeight: 800 }}>b</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.5px' }}>성서침례대학원대학교</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {mounted && userProfile?.isAdmin && (
              <Link href="/admin/applicants" style={{
                background: 'rgba(37,99,235,0.3)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59,130,246,0.3)',
                padding: '6px 12px',
                borderRadius: '20px',
                color: 'white',
                fontSize: '11px',
                fontWeight: 800,
                textDecoration: 'none'
              }}>
                관리자 모드
              </Link>
            )}
            {mounted && (
              <Link href={user ? '/profile' : '/login'} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                <User size={14} />
                <span>{user ? ((userProfile?.displayName || user.displayName)?.split(' ')[0] ?? '내설정') : '로그인'}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Hero Content */}
        <div className="fade-in-up">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
            <span className="badge badge-gold">2026 PREMIER SEMINAR</span>
          </div>
          <p style={{ fontSize: '16px', color: 'var(--neon-blue)', fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.3px', textShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }}>
            아브라함 쿠루빌라 교수 초청
          </p>
          <h1 style={{ fontSize: '40px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '8px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            설교 세미나<br />
            <span style={{ background: 'linear-gradient(135deg, #fff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>2026</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 400, letterSpacing: '0.5px' }}>
            Dr. Abraham Kuruvilla
          </p>
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '-10px', position: 'relative', zIndex: 11 }}>
        {/* Date & Venue Glass Card */}
        <div className="card-glass fade-in-up fade-delay-1" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '4px', height: '14px', background: 'var(--neon-cyan)', borderRadius: '2px', boxShadow: '0 0 8px var(--glow-cyan)' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>SEMINAR INFO</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <InfoRow icon={<CalendarDays size={18} />} label="날짜" value="June 8-9, 2026" />
            <InfoRow icon={<Clock size={18} />} label="시간" value="10:00 ~ 17:00" />
            <InfoRow icon={<MapPin size={18} />} label="장소" value="선한목자교회 (복정동)" />
            <InfoRow icon={<Phone size={18} />} label="문의" value="031.634.1258" />
          </div>
        </div>

        {/* Premium Fee Card with Animated Gradient border */}
        <div className="fade-in-up fade-delay-2" style={{ position: 'relative', borderRadius: '18px', padding: '1px', background: 'linear-gradient(135deg, rgba(59,130,246,0.6), rgba(139,92,246,0.2), rgba(6,182,212,0.4))' }}>
          <div style={{ background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(2,6,23,0.95))', borderRadius: '17px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px)' }}>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>사전 등록비안내</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#fde047' }}>80,000</span>
                <span style={{ fontSize: '14px', color: 'var(--gold-glow)', fontWeight: 600 }}>원</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>신학생 특별할인 30,000원</p>
            </div>
            <Link href="/register">
              <button style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', border: 'none', color: 'white', padding: '12px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                신청서 작성 <span style={{ opacity: 0.8 }}>→</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Seminar Theme Glass Card */}
        <div className="card-glass fade-in-up fade-delay-3" style={{ padding: '24px 20px' }}>
          <p style={{ fontSize: '12px', color: 'var(--neon-blue)', fontWeight: 800, letterSpacing: '1px', marginBottom: '12px' }}>THEME OF 2026</p>
          <div style={{ borderLeft: '3px solid var(--neon-blue)', paddingLeft: '16px' }}>
            <p style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.5, color: '#f8fafc', marginBottom: '6px' }}>
              그리스도의 형상을 따라가게 하는<br />
              <span style={{ color: '#93c5fd', textShadow: '0 0 10px rgba(147, 197, 253, 0.4)' }}>Christ-iconic</span> 설교
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
              문단(Pericope)을 중심으로 한 신학적 설교 방법론
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links Grid - Glassmorphism style */}
      <div className="section-header" style={{ paddingTop: '32px' }}>
        <h2 className="section-title">주요 메뉴 살펴보기</h2>
        <p className="section-subtitle">세미나 정보와 소식을 빠르게 확인하세요</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '0 20px 16px' }}>
        {quickLinks.map(({ href, icon: Icon, label, color, desc }, i) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }} className={`fade-in-up fade-delay-${(i % 3) + 1}`}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              padding: '20px 16px',
              transition: 'var(--transition)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Subtle hover background glow */}
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '60px', height: '60px', background: color, filter: 'blur(30px)', opacity: 0.15, borderRadius: '50%' }} />

              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `linear-gradient(135deg, ${color}22, ${color}11)`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', boxShadow: `0 4px 12px ${color}15` }}>
                <Icon size={20} color={color} />
              </div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '4px', letterSpacing: '-0.3px' }}>{label}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '8px', padding: '16px 32px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', lineHeight: 1.8, fontWeight: 500 }}>
            <span style={{ color: 'var(--text-secondary)' }}>주최</span> | 성서침례대학원대학교<br />
            <span style={{ color: 'var(--text-secondary)' }}>주관</span> | 성침진흥위원회<br />
            <span style={{ color: 'var(--text-secondary)' }}>협력</span> | 조이플 미션 · 꿈을심는교회 · 선한목자교회
          </p>
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.15)', marginTop: '24px', letterSpacing: '1px' }}>
          © 2026 BBTS.AC.KR
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neon-blue)' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '2px', fontWeight: 600 }}>{label}</p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{value}</p>
      </div>
    </div>
  );
}
