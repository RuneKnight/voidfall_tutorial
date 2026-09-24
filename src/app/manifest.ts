import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '보이드폴(Voidfall) 한국어 튜토리얼 & 어시스트',
    short_name: '보이드폴 튜토리얼',
    description: '보이드폴(Voidfall) 보드게임 인터랙티브 튜토리얼 및 테이블탑 실전 플레이 어시스트 동반 툴',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0e17',
    theme_color: '#131620',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
