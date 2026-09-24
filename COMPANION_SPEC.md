# 보이드폴(Voidfall) 튜토리얼 & 플레이 동반 툴(Companion) 고도화 제품 명세 및 기능 설계서

본 문서는 보이드폴(Voidfall) 한국어 웹 튜토리얼 서비스를 단순한 슬라이드식 룰북에서 **테이블탑 실전 플레이 동반 툴(Tabletop Companion & Quick Reference Tool)**로 고도화하기 위한 시스템 아키텍처, 데이터 스키마, 결정론적 전투 시뮬레이션 알고리즘 및 점진적 배포 구현 로드맵을 정의합니다.

---

## 1. System Architecture & Data Schema (시스템 아키텍처 및 데이터 스키마)

### 1.1 Direct Routing & Progress Persistence State Machine
- **URL Schema**: `/play?ch={chapterId}&step={stepId}`
  - `chapterId`: 챕터 식별자 (예: `ch-1`, `ch-9`)
  - `stepId`: 스텝 식별자 (예: `step-1`, `step-31`)
- **LocalStorage Key**: `voidfall_tutorial_progress_v2`
- **Chapter Status Machine**:
  - `NOT_STARTED`: 해당 챕터의 어떤 스텝도 읽지 않음
  - `IN_PROGRESS`: 해당 챕터 내 스텝 중 최소 1개 이상 읽었으나 미완료
  - `COMPLETED`: 해당 챕터의 모든 스텝 완료

```typescript
// src/types/companion.ts

export type ChapterStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ChapterProgressInfo {
  chapterId: string;
  chapterIndex: number;
  completedStepCount: number;
  totalStepCount: number;
  status: ChapterStatus;
  lastStepIndex?: number;
}

export interface UserTutorialProgress {
  currentChapterId: string;
  currentStepId: string;
  currentStepIndex: number;
  completedSteps: number[]; // 읽은 전체 스텝 인덱스 목록
  lastAccessedAt: number;   // Unix Timestamp
  chapterProgresses: Record<string, ChapterProgressInfo>;
}
```

---

### 1.2 Quick Reference & Cheat Sheet Data Schema
- **Fuzzy Search Rule**:
  1. **한글 자모 분리 매칭 (Chosung Matching)**: 검색어가 초성(예: `ㅂㅍ`)인 경우 자모 분리 후 대조 (`부패` 매칭).
  2. **한글/영문 부분 문자열 검색**: 검색어가 대소문자 구분 없이 `Absorption` 또는 `흡수` 포함 시 매칭.
  3. **가중치 우선순위**: 제목 정확도 > 초성 완전 일치 > 연관 키워드 포함 > 본문 설명 매칭.

```typescript
export type CheatSheetCategory =
  | 'KEYWORDS'         // 보이드폴 핵심 키워드
  | 'FOCUS_CARDS'      // 포커스 카드 진행 메커니즘
  | 'CYCLE_FLOW'       // 3개 사이클 & 턴 진행 순서
  | 'EVALUATION_PHASE' // 평가 단계 점검표
  | 'COMBAT_SUMMARY';  // 전투 요약 및 순서도

export interface CheatSheetStep {
  stepNumber: number;
  title: string;
  description: string;
  warning?: string;
  tip?: string;
}

export interface CheatSheetItem {
  id: string;
  category: CheatSheetCategory;
  titleKo: string;
  titleEn: string;
  summaryKo: string;
  steps?: CheatSheetStep[];
  relatedKeywords?: string[];
}

export interface FuzzyMatchResult<T> {
  item: T;
  score: number;
  matchedField: 'titleKo' | 'titleEn' | 'summaryKo' | 'keyword' | 'jamo';
}
```

---

### 1.3 Deterministic Combat Simulator Schema
보이드폴의 전투는 **주사위나 무작위 요소가 없는 100% 결정론적(Deterministic)** 시스템입니다.
양측 유닛 수량, 방어 시설, 기술/트랙 흡수치(Absorption)를 입력받아 완벽하게 결과를 계산합니다.

```typescript
// src/types/combat.ts

export type Side = 'INVADER' | 'DEFENDER';

export type ShipType = 'CORVETTE' | 'DESTROYER' | 'DREADNOUGHT' | 'CARRIER';

export interface FleetUnits {
  corvette: number;    // 초계함 (Power 1, 피격 우선순위 1)
  destroyer: number;   // 구축함 (Power 1, 접근 선제공격 1)
  dreadnought: number; // 드레드노트 (Power 2, 피격 우선순위 3)
  carrier: number;     // 순양함 (Power 1, 공중 지원/함대 이동)
}

export interface DefenseStructures {
  sectorDefense: number; // 섹터 방어 시설 (Power 1)
  starbase: boolean;      // 성간 기지 (Power 2 + 흡수 보너스)
}

export interface CombatantSpecs {
  side: Side;
  units: FleetUnits;
  defense?: DefenseStructures;
  techAbsorption: number; // 기술/실드 트랙 기반 피해 흡수치
  hasCarrierTech?: boolean;
}

export type CombatPhaseType =
  | 'INIT'
  | 'APPROACH'
  | 'SALVO_ROUND_1'
  | 'SALVO_ROUND_2'
  | 'INVASION_CHECK'
  | 'FINISHED';

export interface CombatPhaseLog {
  phase: CombatPhaseType;
  title: string;
  invaderRawDamage: number;
  invaderAbsorbed: number;
  invaderNetDamage: number;
  defenderRawDamage: number;
  defenderAbsorbed: number;
  defenderNetDamage: number;
  invaderUnitsLost: Partial<FleetUnits>;
  defenderUnitsLost: Partial<FleetUnits>;
  defenderDefenseLost: number;
  summaryNote: string;
}

export interface CombatResult {
  winner: Side;
  isInvasionSuccessful: boolean;
  sectorConquered: boolean;
  finalInvaderUnits: FleetUnits;
  finalDefenderUnits: FleetUnits;
  finalDefense: DefenseStructures;
  phaseLogs: CombatPhaseLog[];
}
```

---

### 1.4 Tabletop Convenience UX & PWA Settings
```typescript
export interface TabletopSettings {
  wakeLockActive: boolean;    // Screen Wake Lock API 활성화 여부
  wakeLockSupported: boolean; // 브라우저 지원 여부
  quickRefOpen: boolean;      // Drawer 열림 상태
  combatSimOpen: boolean;     // 전투 시뮬레이터 Drawer 열림 상태
}
```

---

## 2. Page & Component Hierarchy (페이지 및 컴포넌트 계층 구조)

### 2.1 Next.js App Router 디렉토리 구조
```
src/
├── app/
│   ├── layout.tsx                     # 글로벌 레이아웃, PWA 매니페스트 링크, Pretendard 폰트
│   ├── page.tsx                       # 랜딩 페이지 (Hero, 이어서 학습하기 CTA, 챕터 진행도 카드)
│   ├── play/
│   │   └── page.tsx                   # 튜토리얼 플레이어 + 퀵 레퍼런스/전투 시뮬레이터 동반 Drawer
│   ├── manifest.ts                    # PWA Web App Manifest 정의
│   ├── globals.css                    # 우주 SF 테마, 글래스모피즘, 애니메이션
│   └── page.module.css
├── components/
│   ├── Header.tsx                     # 상단 바 (진행률, 테마 전환, 퀵 서치 hotkey 'Ctrl+K' 버튼)
│   ├── ProgressBar.tsx                # 16개 챕터 프로그레스 바
│   ├── StepContent.tsx                # 본문, 콜아웃, 키워드 팝오버 연동
│   ├── StepNavigation.tsx             # 이전/다음 스텝 내비게이터
│   ├── QuickRefDrawer.tsx             # [P1] Cmd+K / 단축키 퀵 레퍼런스 Drawer & 퍼지 검색 UI
│   ├── CheatSheetView.tsx             # [P1] 포커스 카드, 사이클 진행 순서, 평가 단계 점검표
│   ├── CombatSimulatorDrawer.tsx      # [P2] 결정론적 전투 계산기 Modal/Drawer
│   ├── CombatPhaseAnimator.tsx        # [P2] 접근/일제사격 단계별 대미지 교환 애니메이션
│   ├── WakeLockToggle.tsx             # [P3] 테이블탑 화면 꺼짐 방지 Toggle 버튼
│   ├── OverviewModal.tsx              # 챕터 목차 모달
│   ├── GlossaryModal.tsx              # 용어 사전 모달
│   └── GlossaryPopover.tsx            # 인라인 용어 팝오버
├── lib/
│   ├── combatEngine.ts                # [P2] 보이드폴 100% 결정론적 전투 연산 순수 함수
│   ├── fuzzySearch.ts                 # [P1] 한글 초성/영문 퍼지 검색 엔진
│   └── wakeLock.ts                    # [P3] Screen Wake Lock API 래퍼
├── data/
│   ├── tutorial.json                  # 16개 챕터, 58개 스텝
│   ├── glossary.json                  # 46개 공식 한글 용어 데이터
│   └── cheatsheets.json               # 사이클 순서, 평가 점검표 데이터
├── hooks/
│   ├── useTutorialProgress.ts         # 딥링크 query param & LocalStorage 동기화 훅
│   ├── useQuickSearch.ts              # Ctrl+K 단축키 & 퍼지 검색 상태 훅
│   ├── useWakeLock.ts                 # Screen Wake Lock 훅
│   └── useTheme.ts                    # 라이트/다크 테마 훅
└── types/
    ├── tutorial.ts
    ├── companion.ts
    └── combat.ts
```

---

### 2.2 Component Hierarchy & Data Flow Diagram
```
HomePage (app/page.tsx)
 ├── NavigationBar (Hero, Play link, ThemeToggle)
 ├── HeroSection
 │    └── ResumeCTA ("이어서 학습하기: Chapter X - Step Y")
 └── ChaptersGrid
      └── ChapterCard (Badge: COMPLETED | IN_PROGRESS, Progress Pill, Deep-link `/play?ch=X&step=Y`)

PlayPage (app/play/page.tsx)
 ├── Header
 │    ├── ProgressBar
 │    ├── QuickSearchButton (Ctrl+K)
 │    ├── CombatSimButton (⚔️)
 │    └── WakeLockToggle (💡)
 ├── MainContent (StepContent)
 ├── StepNavigation
 ├── QuickRefDrawer (Ctrl+K triggered)
 │    ├── SearchInput (Korean Jamo / English Fuzzy)
 │    └── CheatSheetView / TermResults
 └── CombatSimulatorDrawer
      ├── CombatantInputForm (Invader vs Defender Fleet, Defense, Absorption)
      ├── CombatPhaseAnimator (Approach -> Salvo -> Invasion Outcome)
      └── FinalResultSummary
```

---

## 3. Deterministic Combat Logic Pseudo-code & Flowchart

### 3.1 Voidfall Combat State Transition Flowchart

```
[Start Combat Simulation]
          │
          ▼
┌─────────────────────────────────────────┐
│ 1. Initialize Fleet & Defense Inputs   │
│   - Invader Units (Corvette, Des, Dread)│
│   - Defender Units + Sector Def / Starbase
│   - Initial Absorption (Tech / Shields) │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 2. Approach Phase (접근 단계)           │
│   - Invader Destroyer Attack (1 DMG ea) │
│   - Deduct Defender Absorption          │
│   - Apply Net Damage to Defender Units  │
│     (Priority: Sector Defense -> Corvettes)
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 3. Salvo Phase Round 1 (일제사격 1라운드)  │
│   - Compute Simultaneous Raw Damage     │
│     * Invader Fleet Power               │
│     * Defender Fleet Power + Defense    │
│   - Deduct Remaining Absorption         │
│   - Simultaneously Apply Net Damage     │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 4. Salvo Phase Round 2 (일제사격 2라운드)  │
│   - Repeat damage exchange if both sides│
│     have remaining units                │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 5. Invasion Outcome Check (침공 판정)   │
│   - Are all Defender units destroyed?   │
│   - Are Starbase / Sector Defense down? │
│   - Does Invader have >= 1 surviving unit?
└─────────────────────────────────────────┘
          │
     ┌────┴────────────┐
  [YES]               [NO]
     │                 │
     ▼                 ▼
┌───────────────┐ ┌───────────────┐
│ Invader Wins  │ │ Defender Wins │
│ Sector Conquered│ │ Sector Defended│
└───────────────┘ └───────────────┘
```

---

### 3.2 Combat Simulator Algorithm (Pseudo-code)

```typescript
// lib/combatEngine.ts Pseudo-code implementation

export function calculateCombatResult(
  invader: CombatantSpecs,
  defender: CombatantSpecs
): CombatResult {
  const logs: CombatPhaseLog[] = [];

  // Working copy of units
  let invUnits = { ...invader.units };
  let defUnits = { ...defender.units };
  let defDefense = { ...defender.defense };

  let invAbsorbedRemaining = invader.techAbsorption;
  let defAbsorbedRemaining = defender.techAbsorption + (defDefense.starbase ? 1 : 0);

  // --- PHASE 1: APPROACH PHASE ---
  const approachDamage = invUnits.destroyer * 1;
  let approachNetDamage = Math.max(0, approachDamage - defAbsorbedRemaining);
  defAbsorbedRemaining = Math.max(0, defAbsorbedRemaining - approachDamage);

  // Apply Approach Damage to Defender (Sector Defense first, then Corvettes)
  let defDefenseLost = 0;
  if (approachNetDamage > 0 && defDefense.sectorDefense > 0) {
    const defenseDestroyed = Math.min(defDefense.sectorDefense, approachNetDamage);
    defDefense.sectorDefense -= defenseDestroyed;
    approachNetDamage -= defenseDestroyed;
    defDefenseLost += defenseDestroyed;
  }
  if (approachNetDamage > 0 && defUnits.corvette > 0) {
    const corvettesLost = Math.min(defUnits.corvette, approachNetDamage);
    defUnits.corvette -= corvettesLost;
    approachNetDamage -= corvettesLost;
  }

  logs.push({
    phase: 'APPROACH',
    title: '접근 단계 선제 타격',
    invaderRawDamage: approachDamage,
    invaderAbsorbed: 0,
    invaderNetDamage: approachDamage,
    defenderRawDamage: 0,
    defenderAbsorbed: approachDamage - Math.max(0, approachDamage - defAbsorbedRemaining),
    defenderNetDamage: approachDamage - defAbsorbedRemaining,
    invaderUnitsLost: {},
    defenderUnitsLost: {},
    defenderDefenseLost: defDefenseLost,
    summaryNote: `구축함 ${invUnits.destroyer}대가 접근 단계 선제 타격 실행`
  });

  // --- PHASE 2: SALVO PHASE ROUND 1 ---
  // Calculate Fleet Power
  let invPower = invUnits.corvette * 1 + invUnits.destroyer * 1 + invUnits.dreadnought * 2 + invUnits.carrier * 1;
  let defPower = defUnits.corvette * 1 + defUnits.destroyer * 1 + defUnits.dreadnought * 2 + defUnits.carrier * 1 + (defDefense.sectorDefense * 1) + (defDefense.starbase ? 2 : 0);

  // Raw Damage Exchange
  let invNetDamage = Math.max(0, defPower - invAbsorbedRemaining);
  invAbsorbedRemaining = Math.max(0, invAbsorbedRemaining - defPower);

  let defNetDamage = Math.max(0, invPower - defAbsorbedRemaining);
  defAbsorbedRemaining = Math.max(0, defAbsorbedRemaining - invPower);

  // Simultaneously apply damage to both sides
  // Damage distribution priority:
  // Invader: Corvettes -> Destroyers -> Dreadnoughts -> Carriers
  // Defender: Sector Defense -> Corvettes -> Destroyers -> Dreadnoughts -> Carriers -> Starbase

  // Apply damage to Invader
  let invLost = applyDamageToFleet(invUnits, invNetDamage);
  // Apply damage to Defender
  let defLost = applyDamageToFleetAndDefense(defUnits, defDefense, defNetDamage);

  logs.push({
    phase: 'SALVO_ROUND_1',
    title: '일제사격 1라운드',
    invaderRawDamage: invPower,
    invaderAbsorbed: defPower - invNetDamage,
    invaderNetDamage: invNetDamage,
    defenderRawDamage: defPower,
    defenderAbsorbed: invPower - defNetDamage,
    defenderNetDamage: defNetDamage,
    invaderUnitsLost: invLost,
    defenderUnitsLost: defLost.units,
    defenderDefenseLost: defLost.defenseLost,
    summaryNote: '양측 동시에 일제사격 피해 교환'
  });

  // --- PHASE 3: INVASION CHECK ---
  const totalInvaderRemaining = invUnits.corvette + invUnits.destroyer + invUnits.dreadnought + invUnits.carrier;
  const totalDefenderRemaining = defUnits.corvette + defUnits.destroyer + defUnits.dreadnought + defUnits.carrier;
  const totalDefenderDefenseRemaining = defDefense.sectorDefense + (defDefense.starbase ? 2 : 0);

  const isInvasionSuccessful = totalInvaderRemaining > 0 && totalDefenderRemaining === 0 && totalDefenderDefenseRemaining === 0;

  return {
    winner: isInvasionSuccessful ? 'INVADER' : 'DEFENDER',
    isInvasionSuccessful,
    sectorConquered: isInvasionSuccessful,
    finalInvaderUnits: invUnits,
    finalDefenderUnits: defUnits,
    finalDefense: defDefense,
    phaseLogs: logs
  };
}
```

---

## 4. Step-by-step Implementation Plan (점진적 구현 및 배포 로드맵)

### Milestone 1: Direct Routing & Progress Persistence (P0)
- **목표**: 16개 챕터 카드가 각각 URL Query Parameter(`/play?ch=X&step=Y`)로 고유 라우팅되도록 설정하고, 로컬 진행도를 완벽하게 추적/복원.
- **주요 과제**:
  1. `useTutorialProgress` 훅에 Next.js `useSearchParams` 및 `useRouter` 연동.
  2. 메인 랜딩 페이지 히어로 영역에 `[이어서 학습하기: Chapter X - 단계 Y]` CTA 및 진행률 Pill 구현.
  3. 챕터 카드별 `COMPLETED`, `IN_PROGRESS`, `NOT_STARTED` 상태 뱃지 및 프로그레스 바 구현.

### Milestone 2: Quick Reference Drawer & Fuzzy Search (P1)
- **목표**: 실전 보드게임 플레이 중 즉시 단축키(`Ctrl/Cmd + K`)로 용어 및 사이클/평가단계 점검표 검색 지원.
- **주요 과제**:
  1. `lib/fuzzySearch.ts` 한글 초성 분리 및 부분 문자열 가중치 검색 연산 구현.
  2. `QuickRefDrawer.tsx` 구현 (키보드 이벤트 캡처, 카테고리 탭, 검색 결과 하이라이트).
  3. `cheatsheets.json` 데이터셋 작성 (포커스 카드 3장 진행 순서, 평가 단계 점검표).

### Milestone 3: Deterministic Combat Simulator (P2)
- **목표**: 보이드폴의 주사위 없는 결정론적 전투 수식을 UI 인터랙션으로 계산 및 단계별 시각화.
- **주요 과제**:
  1. `lib/combatEngine.ts` 보이드폴 전투 순서 및 흡수치 연산 알고리즘 정밀 구현 및 단일 테스트 수행.
  2. `CombatSimulatorDrawer.tsx` 유닛 수량 조절 카운터 UI 배치.
  3. `CombatPhaseAnimator.tsx` 접근 단계 -> 일제사격 1/2라운드 대미지 흐름 및 잔존 유닛 결과 표시.

### Milestone 4: Tabletop Convenience UX & Offline PWA (P3)
- **목표**: 오프라인 작동 보장 및 스마트폰/태블릿 화면 꺼짐 방지.
- **주요 과제**:
  1. Screen Wake Lock API 적용 (`useWakeLock.ts` 및 토글 버튼 UI).
  2. `next-pwa` 또는 Next.js `manifest.ts` + Service Worker 설정으로 완벽한 오프라인 지원.
