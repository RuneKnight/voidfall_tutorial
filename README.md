# 보이드폴(Voidfall) 인터랙티브 튜토리얼 & 룰북 웹 애플리케이션

> 원작 보드게임 《보이드폴(Voidfall)》(Mindclash Games)의 대화형 웹 튜토리얼 가이드([boardgamegenius.net/play/voidfall](https://boardgamegenius.net/play/voidfall))를 분석하여 공식 한국어판 기준으로 완벽 번역 및 현대적인 웹 인터페이스로 재구현한 Next.js 프로젝트입니다.

---

## 1. 프로젝트 개요

* **목적**: 방대한 룰과 4.6/5의 높은 난이도를 가진 4X 유로 보드게임 《보이드폴》의 규칙을 누구나 쉽게 단계별로 학습할 수 있는 한국어 인터랙티브 웹 룰북 서비스 구축
* **배포 타깃**: **Vercel** (정적 최적화 및 글로벌 Edge CDN 배포로 무료 플랜에서도 무제한에 가까운 초고속 서빙 가능)
* **프레임워크**: **Next.js (App Router, TypeScript)**

---

## 2. 원본 사이트 분석 결과

* **콘텐츠 분량**: 총 **16개 챕터(Layer)**, **58개 세부 단계(Step)**
  1. **보이드폴에 오신 것을 환영합니다 (Welcome to Voidfall)** - 게임 개요 및 테마 (4 Steps)
  2. **게임은 언제 종료되는가? (When Does It End?)** - 게임 사이클 및 라운드 (3 Steps)
  3. **점수는 어떻게 획득하는가? (How Do You Score?)** - 영향력(점수) 획득 체계 (3 Steps)
  4. **은하 지도 (The Galaxy Map)** - 육각 타일 섹터, 공허태생 및 기지 (4 Steps)
  5. **자원과 생산 (Resources and Production)** - 식량/에너지/재료/학업 및 생산 (3 Steps)
  6. **플레이어 턴 (Your Turn)** - 집중 카드 선택 및 액션 실행 (5 Steps)
  7. **함대와 함대 전투력 (Fleets and Fleet Power)** - 초계함/구축함/드레드노트/항모 (4 Steps)
  8. **함대 이동과 침공 (Fleet Movement and Invasion)** - 함대 파견 및 진입 (3 Steps)
  9. **전투 (Combat)** - 결정론적(주사위 없는) 전투 연산 (5 Steps)
  10. **침공 결과 (Invasion Outcomes)** - 섹터 점령, 정복 및 보상 (4 Steps)
  11. **기술 (Technologies)** - 기본 기술 및 개량 기술 카드 (3 Steps)
  12. **의제 (Agendas)** - 가문 목표 및 부패와의 연계 (3 Steps)
  13. **문명 트랙 (Civilization Tracks)** - 사회, 국정, 경제 발전 트랙 (3 Steps)
  14. **부패 (Corruption)** - 공허의 잠식 메커니즘 (3 Steps)
  15. **평가 단계 (Evaluation Phase)** - 라운드 종료 정리 및 점수 계산 (4 Steps)
  16. **최종 점수 계산 (End of Game Scoring)** - 최종 승리 조건 판정 (4 Steps)

* **핵심 기능**:
  * **용어 사전(Glossary) 시스템**: 46개 핵심 게임 용어 데이터베이스 보유.
  * **인라인 용어 팝오버(Popover)**: 본문 내 용어 클릭 시 모달/팝오버로 상세 설명과 연관 용어 즉시 노출.
  * **전체 챕터 오버뷰(Overview Modal)**: 전체 진도율 및 원하는 챕터/단계로 원클릭 이동.
  * **로컬 상태 저장(LocalStorage)**: 읽던 위치 자동 저장 및 이어보기.
  * **시각적 콜아웃**: 팁(Tip), 경고(Warning), 중요(Important), 예시(Example) 스타일 박스.
  * **테마 지원**: 다크 모드 (우주 SF 테마) / 라이트 모드 전환.

---

## 3. 테이블탑 플레이 툴 구현 현황 및 접근 방법

### 3.1 기능 구현 현황 확인
* **현재 완성 및 제공 중인 기능 (v1.0)**:
  * **대화형 인터랙티브 튜토리얼 / 룰북 탐색기**: 16개 챕터, 58개 전체 단계를 순차적/선택적으로 학습하고 복습할 수 있는 반응형 웹 룰북.
  * **46개 공식 한글 용어 사전 & 인라인 팝오버**: 룰 학습 및 보드게임 실전 플레이 중 용어 궁금증을 즉시 해소할 수 있는 대화형 용어 팝오버 및 전체 검색 시스템.
  * **자동 진도 저장 및 다이렉트 라우팅**: URL 쿼리 파라미터(`/play?ch=X&step=Y`) 및 LocalStorage를 이용해 읽던 위치 자동 복원.
* **실전 플레이 보조 도구 (Companion Tools) 현황 & 로드맵**:
  * 현재 메인 화면의 "대화형 인터랙티브 룰북 & 테이블탑 플레이 툴" 뱃지 및 문서화된 `COMPANION_SPEC.md`는 **실전 플레이 동반 툴로의 고도화 설계 명세서**입니다.
  * **결정론적 전투 시뮬레이터(Combat Simulator)**, **단축키(Cmd+K) 퀵 레퍼런스 Drawer**, **화면 꺼짐 방지(Screen Wake Lock)** 등 실전 전용 보조 도구는 [COMPANION_SPEC.md](./COMPANION_SPEC.md)에 알고리즘 및 데이터 스키마가 완벽히 설계되어 있으며, 향후 마일스톤(Phase/Milestone 1~4)에 맞춰 업데이트 확장될 예정입니다.

### 3.2 애플리케이션 접근 및 활용 방법

#### A. 로컬 개발 환경 실행
```bash
# 의존성 설치 (필요시)
npm install

# 개발 서버 실행
npm run dev
```
실행 후 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

#### B. 웹 튜토리얼 & 룰북 사용 안내
1. **입장 & 이어서 학습하기**:
   * 메인 화면의 **"튜토리얼 시작하기"** (또는 이전 기록이 있을 경우 **"이어서 학습하기"**) 버튼을 클릭하여 학습 플레이어 페이지(`/play`)로 진입합니다.
   * 원하는 챕터 카드를 직접 클릭하면 해당 챕터의 첫 단계로 즉시 이동합니다.
2. **인라인 용어 사전 활용**:
   * 본문 내에 파란색 강조 표시된 게임 용어(예: *공허태생*, *부패*, *흡수* 등)를 클릭하면 **인라인 용어 팝오버**가 바로 열려 설명을 확인할 수 있습니다.
   * 상단 헤더의 **📖 (사전 아이콘)** 버튼을 누르면 46개 전체 용어를 키워드 검색할 수 있는 용어 사전 모달이 열립니다.
3. **챕터 목차 및 진도 점프**:
   * 상단 헤더의 **☰ (목차 아이콘)** 버튼을 누르면 16개 전체 챕터와 58개 단계의 목차 오버뷰 모달이 표시되어 원하는 위치로 빠르게 이동할 수 있습니다.
4. **테마 전환**:
   * 상단 오른쪽의 **☀️/🌙 (테마 버튼)**으로 SF 스타일 다크 모드와 라이트 모드를 자유롭게 전환할 수 있습니다.

#### C. 테이블탑 플레이 툴 상세 명세서 참조
* 차세대 플레이 동반 툴(전투 시뮬레이터 수식, 치트시트 스키마, 오프라인 PWA 등)의 개발 명세 및 알고리즘은 프로젝트 루트의 [COMPANION_SPEC.md](./COMPANION_SPEC.md) 문서를 참고하시기 바랍니다.

---

## 4. 공식 한국어판 용어 사전 (Glossary Mapping)

국내 정발판(로터스 프로그 게임즈 발매) 용어 체계와 100% 일치하도록 번역을 표준화합니다.

| 원문 용어 (EN) | 공식 한국어판 용어 (KO) | 설명 요약 |
|---|---|---|
| **Voidborn** | **공허태생** | 은하계를 위협하는 주 적대 세력 |
| **Corruption** | **부패** | 제국을 잠식하는 공허의 오염물 |
| **Influence** | **영향력** | 게임의 승점(VP) |
| **Focus Card** | **집중 카드** | 플레이어가 매 턴 행동을 결정하는 핵심 카드 |
| **Agenda** | **의제 카드** | 라운드 및 게임 종료 시 영향력을 주는 목표 카드 |
| **Sector** | **섹터** | 육각형 은하 지도 단위 구역 |
| **Starbase** | **성간 기지** | 방어 시설 및 함대 거점 |
| **Sector Defense** | **섹터 방어 시설** | 섹터의 기본 방어력 |
| **Absorption** | **흡수** | 접근/일제사격 피해를 무효화하는 방어력 |
| **Approach / Salvo** | **접근 단계 / 일제사격 단계** | 전투의 순차적 데미지 단계 |
| **Civilization Track** | **문명 트랙** | 사회/국정/경제의 발전 단계 (0~4단계) |
| **Crisis** | **위기** | 협동/솔로 모드에서 공허태생이 일으키는 사건 |
| **Catastrophe** | **대재앙** | 위기 누적 시 패배를 유발하는 페널티 토큰 |

---

## 5. 기술 아키텍처 및 디렉토리 구조

```
voidfall/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # 글로벌 레이아웃, 메타데이터, 폰트(Pretendard/Inter)
│   │   ├── page.tsx              # 랜딩 & 시작 화면
│   │   ├── play/
│   │   │   └── page.tsx          # 메인 튜토리얼 플레이어 페이지
│   │   ├── globals.css           # 우주 SF 테마, CSS 변수, 디자인 시스템
│   │   └── play.module.css       # 플레이어 뷰 레이아웃 및 트랜지션
│   ├── components/
│   │   ├── Header.tsx            # 진행도, 챕터 타이틀, 테마/목차/사전 토글 버튼
│   │   ├── ProgressBar.tsx       # 16개 레이어 진행도 표시 바
│   │   ├── StepContent.tsx       # 단계별 본문, 콜아웃, 인터랙션 렌더러
│   │   ├── StepNavigation.tsx    # 이전 / 다음 단계 이동 네비게이터
│   │   ├── GlossaryModal.tsx     # 용어 사전 검색 및 상세 모달
│   │   ├── GlossaryPopover.tsx   # 본문 용어 클릭 시 즉시 뜨는 팝오버
│   │   └── OverviewModal.tsx     # 전체 16개 챕터 목차 및 진도 점프 모달
│   ├── data/
│   │   ├── layers.json           # 16개 챕터 및 58개 스텝의 번역된 전체 텍스트 데이터
│   │   └── glossary.json         # 46개 핵심 용어의 한글 정의 및 연관어 데이터
│   ├── hooks/
│   │   ├── useTutorialProgress.ts # LocalStorage 연동 진도율 저장/복원 훅
│   │   └── useTheme.ts           # 다크/라이트 테마 제어 훅
│   └── types/
│       └── tutorial.ts           # 챕터, 스텝, 용어사전 타입 정의
├── COMPANION_SPEC.md             # 플레이 동반 툴(전투 시뮬레이터/퀵레퍼런스) 고도화 명세서
├── public/                       # 아이콘 및 게임 보조 그래픽
├── README.md                     # 본 가이드 문서
└── next.config.ts                # Next.js 최적화 설정
```

---

## 6. 단계별 구현 계획 (Implementation Roadmap)

### Phase 1: 원본 데이터 자동 추출 및 한글화 파이프라인 구축
1. 원본 웹사이트(boardgamegenius.net)의 58개 전체 스텝의 마크다운/HTML 본문 스크래핑
2. 46개 용어 사전(Glossary) 추출
3. 공식 한국어 용어집 매핑 및 정밀 번역 데이터셋(`layers.json`, `glossary.json`) 생성

### Phase 2: 디자인 시스템 및 UI 컴포넌트 구축
1. **Space Sci-Fi 디자인 시스템**:
   * 네이비/다크블루(`--bg-primary: #131620`), 시안/민트 악센트(`--color-accent: #64ffda`)
   * 세련된 글래스모피즘(`backdrop-filter`), 부드러운 스텝 트랜지션
2. **반응형 플레이어 쉘(Player Shell)**:
   * PC 및 스마트폰 환경(보드게임 플레이 중 모바일로 참조하기 좋음)에 최적화된 유동적 레이아웃
3. **컴포넌트 개발**:
   * 진행률 바(`ProgressBar`), 본문 렌더러(`StepContent`), 콜아웃(팁/주의/중요), 네비게이션

### Phase 3: 인터랙티브 기능 구현
1. **용어 팝오버 & 모달**: 본문 내 강조된 용어를 터치/클릭하면 팝오버가 부드럽게 나타나고, 연관 용어로 즉시 탐색 가능
2. **튜토리얼 목차(Overview)**: 16개 레이어와 58개 스텝을 시각화하고 원하는 위치로 즉시 이동
3. **진행 상황 자동 저장**: 브라우저를 닫았다가 다시 열어도 이전 위치와 학습 완료 여부 유지

### Phase 4: 성능 최적화 및 빌드 검증
1. SEO 메타데이터(OpenGraph, 한국어 검색 키워드 등) 적용
2. Next.js 정적 빌드(`npm run build`) 테스트 및 번들 최적화

### Phase 5: Vercel 배포
1. GitHub 저장소 푸시
2. Vercel 프로젝트 생성 후 원클릭 배포
3. 커스텀 도메인(선택 사항) 연결 및 모바일 기기 테스트

---

## 7. Vercel 배포 방법

### 방법 A. Vercel CLI (가장 빠름)
```bash
npm i -g vercel
vercel
# 프로덕션 배포 시:
vercel --prod
```

### 방법 B. GitHub 저장소 연동
1. 본 프로젝트를 GitHub에 푸시합니다.
2. [vercel.com](https://vercel.com)에 로그인 후 **"Add New Project"** 클릭
3. 해당 GitHub 저장소를 선택하고 **Deploy**를 클릭하면 완료됩니다.
   * Framework Preset: `Next.js` (자동 감지)
   * Build Command: `npm run build`
   * Output Directory: `.next`

---

## 8. 저작권 및 서비스 안내
* 보이드폴(Voidfall) 게임 시스템 및 설정에 대한 모든 저작권은 **Mindclash Games** 및 원작 디자이너(Nigel Buckle, David Turczi)에게 있습니다.
* 본 웹 서비스는 비상업적 팬 메이드(Non-commercial Fan-made) 규칙 가이드 및 튜토리얼 목적으로 제작됩니다.
* 하단에 원작 표기 및 공식 구매처/홈페이지 링크를 항상 표시합니다.
