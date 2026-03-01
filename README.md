# 설교세미나 2026 모바일 앱

아브라함 쿠루빌라 교수 **설교 세미나 2026** 공식 모바일 앱
> Google Play Store / Apple App Store 출시 가능한 PWA

---

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

`http://localhost:3000` 에서 앱 확인

---

## 🔥 Firebase 설정 (필수)

1. [Firebase Console](https://console.firebase.google.com)에서 새 프로젝트 생성
2. Authentication → 이메일/비밀번호 및 Google 활성화
3. Firestore Database 생성 (프로덕션 모드)
4. `.env.local` 파일에 Firebase 설정값 입력:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=실제키
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=프로젝트.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=프로젝트ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=프로젝트.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=발신자ID
NEXT_PUBLIC_FIREBASE_APP_ID=앱ID
```

5. Firestore Rules 배포:
```bash
firebase deploy --only firestore:rules
```

---

## 📱 앱스토어 배포 (Capacitor)

### 웹 빌드
```bash
npm run build
```

### Android (Google Play Store)
```bash
npx cap add android
npx cap sync
npx cap open android
# Android Studio에서 APK/AAB 빌드 후 Play Console 업로드
```

### iOS (Apple App Store)
```bash
npx cap add ios
npx cap sync  
npx cap open ios
# Xcode에서 빌드 후 App Store Connect 업로드
```

**필요 계정:**
- Google Play Console: $25 (1회)
- Apple Developer Program: $99/년

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx          # 홈
│   ├── intro/            # 세미나 소개
│   ├── register/         # 온라인 신청서
│   ├── photos/           # 사진 앨범
│   ├── videos/           # 세미나 영상
│   ├── notices/          # 공지사항
│   ├── qa/               # Q&A
│   ├── login/            # 로그인
│   ├── signup/           # 회원가입
│   └── profile/          # 마이페이지
├── components/
│   └── layout/
│       ├── BottomNavBar.tsx
│       └── Header.tsx
├── context/
│   └── AuthContext.tsx   # Firebase Auth
└── lib/
    └── firebase.ts       # Firebase 초기화
```

---

## 🗂️ Firestore 컬렉션

| 컬렉션 | 설명 |
|--------|------|
| `users` | 사용자 프로필 |
| `notices` | 공지사항 |
| `qa` | Q&A 질문/답변 |
| `registrations` | 세미나 신청 |
| `photos` | 사진 메타데이터 |
| `videos` | 영상 정보 |

---

## 👤 관리자 설정

Firebase Console → Firestore → `users/{uid}` 문서에서 `isAdmin: true` 설정
