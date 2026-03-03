'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Header from '@/components/layout/Header';
import { FileDown, Users, Search, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Registration {
    id: string;
    name: string;
    genderAge: string;
    phone: string;
    email: string;
    church: string;
    type: string;
    depositorName: string;
    amount: number;
    status: string;
    needsReceipt: string;
    transportation: string;
    source: string[];
    privacyAgreed: boolean;
    createdAt: any;
    updatedAt: any;
}

export default function AdminApplicantsPage() {
    const { userProfile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (!userProfile?.isAdmin) {
                router.push('/');
                return;
            }
            fetchRegistrations();
        }
    }, [userProfile, authLoading, router]);

    const fetchRegistrations = async () => {
        try {
            const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Registration[];
            setRegistrations(data);
        } catch (error) {
            console.error("Error fetching registrations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
            await updateDoc(doc(db, 'registrations', id), {
                status: newStatus,
                updatedAt: serverTimestamp()
            });
            setRegistrations(prev => prev.map(reg => reg.id === id ? { ...reg, status: newStatus } : reg));
        } catch (error) {
            console.error("Status update error:", error);
            alert('상태 변경에 실패했습니다.');
        } finally {
            setUpdatingId(null);
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredRegistrations.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredRegistrations.map(r => r.id));
        }
    };

    const handleBulkAction = (action: 'email' | 'sms') => {
        if (selectedIds.length === 0) {
            alert('대상자를 선택해 주세요.');
            return;
        }
        const selectedEmails = registrations.filter(r => selectedIds.includes(r.id)).map(r => r.email).join(',');
        const selectedPhones = registrations.filter(r => selectedIds.includes(r.id)).map(r => r.phone);

        if (action === 'email') {
            window.location.href = `mailto:?bcc=${selectedEmails}&subject=[2026 설교세미나 안내]`;
        } else {
            // iOS uses comma, Android uses semicolon
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const separator = isIOS ? ',' : ';';
            const phoneStr = selectedPhones.join(separator);

            // Note: Different mobile browsers/OS versions handle multi-recipient SMS differently.
            // Some might require "sms:p1,p2,p3", others "sms:?body=...&addresses=..."
            // The most widely supported simple method is "sms:number1;number2" or "sms:number1,number2"
            window.location.href = `sms:${phoneStr}`;
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(registrations.map(reg => ({
            '신청일': reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleString() : '',
            '신청자 성함': reg.name,
            '성별/연령대': reg.genderAge || '',
            '연락처': reg.phone,
            '이메일': reg.email,
            '교회/직분': reg.church,
            '참석유형': reg.type === 'general' ? '일반' : '학생',
            '영수증필요': reg.needsReceipt === 'yes' ? '예' : '아니요',
            '오시는방법': reg.transportation === 'public' ? '대중교통' : reg.transportation === 'car' ? '자가용' : '도보',
            '정보습득경로': reg.source ? reg.source.join(', ') : '',
            '입금자명': reg.depositorName,
            '금액': reg.amount,
            '상태': reg.status
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "신청자 명단");
        XLSX.writeFile(workbook, `세미나_신청자_명단_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const filteredRegistrations = registrations.filter(reg =>
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.church.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.depositorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authLoading || loading) {
        return (
            <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="page-content">
            <Header title="신청자 관리" showBack />

            <div style={{ padding: '24px 20px 100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px' }}>신청자 현황</h2>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>총 {registrations.length}명의 신청자가 있습니다.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={exportToExcel} className="btn-secondary" style={{ width: 'auto', padding: '10px 16px', display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                            <FileDown size={18} />
                            엑셀
                        </button>
                    </div>
                </div>

                {selectedIds.length > 0 && (
                    <div className="fade-in-up" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(59,130,246,0.1)', borderRadius: '16px', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--neon-blue)' }}>{selectedIds.length}명 선택됨</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleBulkAction('email')} className="btn-secondary" style={{ width: 'auto', padding: '8px 12px', fontSize: '12px', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)' }}>이메일 발송</button>
                            <button onClick={() => handleBulkAction('sms')} className="btn-secondary" style={{ width: 'auto', padding: '8px 12px', fontSize: '12px', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}>문자 발송</button>
                        </div>
                    </div>
                )}

                <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="text"
                        placeholder="이름, 교회, 입금자명으로 검색..."
                        className="form-input"
                        style={{ paddingLeft: '44px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px', marginBottom: '4px' }}>
                        <input type="checkbox" checked={selectedIds.length === filteredRegistrations.length && filteredRegistrations.length > 0} onChange={toggleSelectAll} style={{ width: '18px', height: '18px' }} />
                        <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: 600 }}>전체 선택</span>
                    </div>

                    {filteredRegistrations.map((reg) => (
                        <div key={reg.id} className="card-glass" style={{ padding: '16px', border: selectedIds.includes(reg.id) ? '1px solid var(--neon-blue)' : '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(reg.id)}
                                onChange={() => toggleSelect(reg.id)}
                                style={{ position: 'absolute', right: '16px', top: '16px', width: '20px', height: '20px', zIndex: 1 }}
                            />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', paddingRight: '24px' }}>
                                <div>
                                    <span style={{ fontSize: '12px', color: 'var(--neon-cyan)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                                        {reg.type === 'general' ? '일반/목회자' : '신학생'}
                                    </span>
                                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{reg.name}</h3>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <select
                                        value={reg.status}
                                        onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                                        disabled={updatingId === reg.id}
                                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: reg.status === 'confirmed' ? '#34d399' : reg.status === 'pending' ? 'var(--gold)' : '#f87171', borderRadius: '8px', fontSize: '12px', padding: '4px 8px', fontWeight: 700, outline: 'none' }}
                                    >
                                        <option value="pending">입금대기</option>
                                        <option value="confirmed">등록완료</option>
                                        <option value="cancelled">등록취소</option>
                                    </select>
                                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'block' }}>
                                        {reg.amount.toLocaleString()}원
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                <div style={{ gridColumn: 'span 2' }}><strong>성별/연령:</strong> {reg.genderAge}</div>
                                <div style={{ gridColumn: 'span 2' }}><strong>교회/직분:</strong> {reg.church}</div>
                                <div><strong>입금자:</strong> {reg.depositorName}</div>
                                <div><strong>영수증:</strong> {reg.needsReceipt === 'yes' ? '필요' : '미필요'}</div>
                                <div style={{ gridColumn: 'span 2' }}><strong>연락처:</strong> {reg.phone}</div>
                                <div style={{ gridColumn: 'span 2' }}><strong>이메일:</strong> {reg.email}</div>
                                <div style={{ gridColumn: 'span 2' }}><strong>경로:</strong> {reg.source?.join(', ')}</div>
                                <div style={{ gridColumn: 'span 2', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                                    신청일: {reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredRegistrations.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
