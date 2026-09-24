export type Side = 'INVADER' | 'DEFENDER';

export type ShipType = 'CORVETTE' | 'DESTROYER' | 'DREADNOUGHT' | 'CARRIER';

export interface FleetUnits {
  corvette: number;    // 초계함 (Fleet power 1, Hit priority 1)
  destroyer: number;   // 구축함 (Fleet power 1, Approach attack 1)
  dreadnought: number; // 드레드노트 (Fleet power 2, Hit priority 3)
  carrier: number;     // 순양함 (Fleet power 1, Air support)
}

export interface DefenseStructures {
  sectorDefense: number; // 섹터 방어 시설 (Power 1)
  starbase: boolean;      // 성간 기지 (Power 2 + Absorption bonus)
}

export interface CombatantSpecs {
  side: Side;
  units: FleetUnits;
  defense?: DefenseStructures;
  techAbsorption: number; // 기술/실드 트랙 기반 흡수력 (Absorption)
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
