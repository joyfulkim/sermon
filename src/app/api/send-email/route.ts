import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { applicantInfo, adminEmail } = await request.json();

        // 1. 신청자에게 환영 메일 발송
        await resend.emails.send({
            from: 'onboarding@resend.dev', // 실제 도메인 연결 시 수정 필요
            to: applicantInfo.email,
            subject: '2026 아브라함 쿠루빌라 교수 설교세미나 신청을 환영합니다',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2563eb;">세미나 신청이 완료되었습니다!</h2>
                    <p>안녕하세요, <strong>${applicantInfo.name}</strong> 님.</p>
                    <p>2026 아브라함 쿠루빌라 교수 설교세미나 신청을 진심으로 환영합니다.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <h3>신청 정보 확인</h3>
                    <ul>
                        <li><strong>신청자:</strong> ${applicantInfo.name}</li>
                        <li><strong>소속:</strong> ${applicantInfo.church}</li>
                        <li><strong>입금하실 금액:</strong> ${applicantInfo.amount.toLocaleString()}원</li>
                        <li><strong>입금 계좌:</strong> 카카오뱅크 3333-14-6097669 (예금주: 최정기)</li>
                    </ul>
                    <p style="color: #666; font-size: 14px;">입금이 확인된 후 최종 등록 완료 안내 문자를 발송해 드립니다.</p>
                    <p>감사합니다.</p>
                </div>
            `
        });

        // 2. 관리자에게 알림 메일 발송
        if (adminEmail) {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: adminEmail,
                subject: `[신규 신청] ${applicantInfo.name} 님이 세미나를 신청했습니다`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
                        <h2 style="color: #2563eb;">새로운 세미나 신청이 접수되었습니다</h2>
                        <ul style="line-height: 1.8;">
                            <li><strong>이름:</strong> ${applicantInfo.name}</li>
                            <li><strong>성별/연령:</strong> ${applicantInfo.genderAge || '미기재'}</li>
                            <li><strong>연락처:</strong> ${applicantInfo.phone}</li>
                            <li><strong>이메일:</strong> ${applicantInfo.email}</li>
                            <li><strong>소속/직분:</strong> ${applicantInfo.church}</li>
                            <li><strong>구분:</strong> ${applicantInfo.type === 'general' ? '일반' : '학생'}</li>
                            <li><strong>영수증 발행:</strong> ${applicantInfo.needsReceipt === 'yes' ? '신청' : '안함'}</li>
                            <li><strong>오시는 방법:</strong> ${applicantInfo.transportation === 'public' ? '대중교통' : applicantInfo.transportation === 'car' ? '자가용' : '도보'}</li>
                            <li><strong>정보 취득:</strong> ${applicantInfo.source?.join(', ') || '없음'}</li>
                            <li><strong>입금자명:</strong> ${applicantInfo.depositorName}</li>
                            <li><strong>금액:</strong> ${applicantInfo.amount.toLocaleString()}원</li>
                        </ul>
                        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://sermon-five.vercel.app'}/admin/applicants" style="display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px;">관리자 페이지에서 확인하기</a></p>
                    </div>
                `
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Email send error:", error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
