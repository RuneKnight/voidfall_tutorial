import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '보이드폴(Voidfall) 인터랙티브 룰북 & 튜토리얼',
  description:
    '보드게임 보이드폴(Voidfall)의 대화형 인터랙티브 한국어 튜토리얼 가이드입니다. 16개 챕터, 58개 단계, 46개 게임 용어 사전을 통해 규칙을 쉽고 빠르게 익히세요.',
  keywords: [
    '보이드폴',
    'Voidfall',
    '보이드폴 룰북',
    '보이드폴 튜토리얼',
    '보이드폴 규칙',
    '보드게임',
    'Mindclash Games',
    'David Turczi',
  ],
  authors: [{ name: 'Voidfall KR Fan Project' }],
  openGraph: {
    title: '보이드폴(Voidfall) 인터랙티브 룰북 & 튜토리얼',
    description:
      '총 16개 챕터 58단계로 완벽하게 정리된 보이드폴 공식 한국어 대화형 가이드',
    type: 'website',
    locale: 'ko_KR',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0b0e17',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" data-theme="dark">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
