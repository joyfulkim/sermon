'use client';

import Header from '@/components/layout/Header';
import Link from 'next/link';
import { BookOpen, Users, Calendar, MapPin, ChevronRight, Award } from 'lucide-react';

const schedule = [
    { day: '월/8일', time: '오전', title: '설교의 비전 복습' },
    { day: '월/8일', time: '오후', title: '설교의 계획과 준비 / 예화 Illustrating' },
    { day: '화/9일', time: '오전', title: '설교 서론과 결론 / 설교작성' },
    { day: '화/9일', time: '오후', title: '설교의 전달 / 장기적 준비' },
];

export default function IntroPage() {
    return (
        <div className="page-content">
            <Header title="세미나 소개" showBack />

            <div style={{ padding: '0 0 16px' }} className="fade-in-up">
                {/* VIP Professor Profile Banner */}
                <div style={{ position: 'relative', overflow: 'hidden', padding: '32px 20px', background: 'linear-gradient(180deg, rgba(30, 45, 90, 0.2), transparent)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ position: 'absolute', top: -50, right: -50, width: '150px', height: '150px', background: 'var(--neon-blue)', filter: 'blur(60px)', opacity: 0.2 }} />

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                        <div style={{ width: '90px', height: '90px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(6,182,212,0.1))', border: '1px solid rgba(147,197,253,0.3)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 32px rgba(59,130,246,0.2)' }}>
                            <img
                                src="/professor.png"
                                alt="Dr. Abraham Kuruvilla"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    const parent = (e.target as HTMLElement).parentElement;
                                    if (parent) parent.innerHTML = '👨‍🏫';
                                }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <span className="badge badge-blue" style={{ marginBottom: '10px', display: 'inline-flex', letterSpacing: '0.5px' }}>KEYNOTE SPEAKER</span>
                            <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: '4px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>아브라함 쿠루빌라 교수</h2>
                            <p style={{ fontSize: '14px', color: 'var(--neon-blue)', fontWeight: 600, letterSpacing: '0.5px' }}>Dr. Abraham Kuruvilla</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px', lineHeight: 1.6 }}>
                                Dallas Theological Seminary<br />설교학 교수 (Ph.D.)
                            </p>
                        </div>
                    </div>

                    <div className="card-glass" style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, fontWeight: 400 }}>
                            설교학 분야의 세계적 석학.
                            <span style={{ color: 'var(--neon-cyan)', fontWeight: 600, margin: '0 4px' }}>「Privilege the Text」</span>,
                            <span style={{ color: 'var(--neon-cyan)', fontWeight: 600, margin: '0 4px' }}>「Vision of the Pastor」</span> 등
                            저명한 설교학 서적의 저자이며, 독창적인 <strong style={{ color: '#fff' }}>Christ-iconic</strong> 설교 방법론의 창시자입니다.
                        </p>
                    </div>
                </div>

                {/* Seminar Theme */}
                <div style={{ padding: '24px 20px 0' }} className="fade-in-up fade-delay-1">
                    <div className="card-glass" style={{ padding: '24px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'var(--neon-purple)', filter: 'blur(50px)', opacity: 0.15 }} />

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59,130,246,0.3)' }}>
                                <BookOpen size={20} color="var(--neon-blue)" />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.5px' }}>세미나 주제</h3>
                        </div>

                        <p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '10px', textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
                            그리스도의 형상을 따라가게 하는<br />
                            <span style={{ background: 'linear-gradient(90deg, #93c5fd, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>(Christ-iconic)</span> 설교
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--neon-cyan)', marginBottom: '12px' }}>
                            문단(Pericope)을 중심으로 한 신학적 설교
                        </p>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            설교문단(Pericope)이 독자들의 삶을 어떻게 변화시키려 했는지를 파악하고, 그 변화의 목표가 <strong>그리스도의 형상을 닮아가게 하는 것</strong>임을 보여주는 방법론을 깊이 있게 탐구합니다.
                        </p>
                    </div>
                </div>

                {/* Key Concepts Grid */}
                <div style={{ padding: '32px 20px 0' }} className="fade-in-up fade-delay-2">
                    <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.5px' }}>핵심 키워드</h3>
                    <div className="grid-responsive" style={{ gap: '12px' }}>
                        {[
                            { icon: '📖', title: 'Pericope 중심', desc: '성경 본문의 구조적 단위를 가장 중요하게 다루는 해석', color: 'rgba(96,165,250,0.1)' },
                            { icon: '✨', title: 'Christ-iconic', desc: '설교를 통해 그리스도의 형상을 삶 속에 온전히 드러내는 접근', color: 'rgba(167,139,250,0.1)' },
                            { icon: '🎯', title: '적용적 신학', desc: '본문의 신학적 의도를 현대 성도의 삶에 명확히 적용', color: 'rgba(52,211,153,0.1)' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>{item.title}</p>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Schedule */}
                <div style={{ padding: '32px 20px 0' }} className="fade-in-up fade-delay-3">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={18} color="var(--neon-blue)" />
                            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>타임 테이블</h3>
                        </div>
                        <span className="badge badge-blue">June 8-9</span>
                    </div>

                    <div className="card-glass" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '2px', background: 'rgba(15,23,42,0.4)' }}>
                        {schedule.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '40%', background: i < 3 ? 'var(--neon-cyan)' : 'var(--neon-purple)', borderRadius: '0 2px 2px 0' }} />
                                <div style={{ flexShrink: 0, minWidth: '75px' }}>
                                    <p style={{ fontSize: '11px', color: i < 3 ? 'var(--neon-cyan)' : 'var(--neon-purple)', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>{item.day}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>{item.time}</p>
                                </div>
                                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                                <p style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.5, display: 'flex', alignItems: 'center' }}>{item.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Location & Organizers */}
                <div style={{ padding: '32px 20px 0' }} className="fade-in-up fade-delay-3">
                    <div className="card-glass" style={{ padding: '20px', border: '1px solid rgba(59,130,246,0.2)', background: 'linear-gradient(135deg, rgba(15,23,42,0.6), rgba(30,58,138,0.2))' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MapPin size={18} color="var(--neon-blue)" />
                            </div>
                            <div>
                                <p style={{ fontSize: '15px', fontWeight: 800 }}>선한목자교회 비전센터</p>
                                <p style={{ fontSize: '12px', color: 'var(--neon-blue)', marginTop: '2px', fontWeight: 500 }}>성남시 수정구 복정동 | 031.634.1258</p>
                            </div>
                        </div>

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Users size={18} color="var(--text-secondary)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                {[
                                    { r: '주최', n: '성서침례대학원대학교', c: '#93c5fd' },
                                    { r: '주관', n: '성침진흥위원회', c: 'var(--text-secondary)' },
                                    { r: '협력', n: '선한목자교회 비전센터, 조이플 미션', c: 'var(--text-tertiary)' },
                                ].map((org, i) => (
                                    <p key={i} style={{ fontSize: '13px', marginBottom: i < 2 ? '6px' : 0, display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: org.c, width: '32px', display: 'inline-block' }}>{org.r}</span>
                                        <span style={{ color: 'var(--text-primary)' }}>{org.n}</span>
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating CTA */}
                <div style={{ padding: '32px 20px 8px' }}>
                    <Link href="/register">
                        <button className="btn-primary" style={{ padding: '18px 24px', fontSize: '16px', boxShadow: '0 10px 30px rgba(37,99,235,0.4)' }}>
                            세미나 온라인 사전신청
                            <ChevronRight size={20} />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
