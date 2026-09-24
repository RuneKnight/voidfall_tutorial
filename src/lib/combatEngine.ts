import {
  CombatantSpecs,
  CombatResult,
  CombatPhaseLog,
  FleetUnits,
  DefenseStructures,
} from '@/types/combat';

function applyDamageToFleet(
  units: FleetUnits,
  damage: number
): { unitsLost: Partial<FleetUnits>; remainingDamage: number } {
  let remaining = damage;
  const lost: Partial<FleetUnits> = {
    corvette: 0,
    destroyer: 0,
    dreadnought: 0,
    carrier: 0,
  };

  // 1. Corvettes (Hit priority 1 - Power 1)
  if (remaining > 0 && units.corvette > 0) {
    const cLost = Math.min(units.corvette, remaining);
    units.corvette -= cLost;
    lost.corvette = cLost;
    remaining -= cLost;
  }

  // 2. Destroyers (Hit priority 2 - Power 1)
  if (remaining > 0 && units.destroyer > 0) {
    const dLost = Math.min(units.destroyer, remaining);
    units.destroyer -= dLost;
    lost.destroyer = dLost;
    remaining -= dLost;
  }

  // 3. Dreadnoughts (Hit priority 3 - Power 2, takes 2 damage to destroy)
  if (remaining > 0 && units.dreadnought > 0) {
    const dnLost = Math.min(units.dreadnought, Math.floor(remaining / 2));
    if (dnLost > 0) {
      units.dreadnought -= dnLost;
      lost.dreadnought = dnLost;
      remaining -= dnLost * 2;
    }
  }

  // 4. Carriers (Hit priority 4 - Power 1)
  if (remaining > 0 && units.carrier > 0) {
    const carLost = Math.min(units.carrier, remaining);
    units.carrier -= carLost;
    lost.carrier = carLost;
    remaining -= carLost;
  }

  return { unitsLost: lost, remainingDamage: remaining };
}

function applyDamageToDefender(
  units: FleetUnits,
  defense: DefenseStructures,
  damage: number
): { unitsLost: Partial<FleetUnits>; defenseLost: number; remainingDamage: number } {
  let remaining = damage;
  let defLost = 0;

  // 1. Sector Defense first
  if (remaining > 0 && defense.sectorDefense > 0) {
    const sLost = Math.min(defense.sectorDefense, remaining);
    defense.sectorDefense -= sLost;
    defLost += sLost;
    remaining -= sLost;
  }

  // 2. Ships
  const fleetResult = applyDamageToFleet(units, remaining);
  remaining = fleetResult.remainingDamage;

  // 3. Starbase (Requires 2 damage to destroy if no ships/defense left)
  if (remaining >= 2 && defense.starbase && units.corvette === 0 && units.destroyer === 0 && units.dreadnought === 0 && units.carrier === 0 && defense.sectorDefense === 0) {
    defense.starbase = false;
    remaining -= 2;
  }

  return {
    unitsLost: fleetResult.unitsLost,
    defenseLost: defLost,
    remainingDamage: remaining,
  };
}

export function calculateCombatResult(
  invader: CombatantSpecs,
  defender: CombatantSpecs
): CombatResult {
  const logs: CombatPhaseLog[] = [];

  const invUnits: FleetUnits = { ...invader.units };
  const defUnits: FleetUnits = { ...defender.units };
  const defDefense: DefenseStructures = {
    sectorDefense: defender.defense?.sectorDefense || 0,
    starbase: defender.defense?.starbase || false,
  };

  let invAbsorbedRemaining = invader.techAbsorption;
  let defAbsorbedRemaining = defender.techAbsorption + (defDefense.starbase ? 1 : 0);

  // --- PHASE 1: APPROACH PHASE (접근 단계) ---
  const approachRawDamage = invUnits.destroyer * 1;
  const approachAbsorbed = Math.min(defAbsorbedRemaining, approachRawDamage);
  const approachNetDamage = Math.max(0, approachRawDamage - defAbsorbedRemaining);
  defAbsorbedRemaining = Math.max(0, defAbsorbedRemaining - approachRawDamage);

  let approachDefLost = 0;
  let approachUnitsLost: Partial<FleetUnits> = {};

  if (approachNetDamage > 0) {
    const approachResult = applyDamageToDefender(defUnits, defDefense, approachNetDamage);
    approachDefLost = approachResult.defenseLost;
    approachUnitsLost = approachResult.unitsLost;
  }

  logs.push({
    phase: 'APPROACH',
    title: '접근 단계 선제 타격 (Approach Phase)',
    invaderRawDamage: approachRawDamage,
    invaderAbsorbed: 0,
    invaderNetDamage: approachRawDamage,
    defenderRawDamage: 0,
    defenderAbsorbed: approachAbsorbed,
    defenderNetDamage: approachNetDamage,
    invaderUnitsLost: {},
    defenderUnitsLost: approachUnitsLost,
    defenderDefenseLost: approachDefLost,
    summaryNote:
      invUnits.destroyer > 0
        ? `침공자 구축함 ${invUnits.destroyer}대가 접근 단계 선제 타격 (${approachRawDamage} 대미지)을 가했습니다.`
        : '침공자 구축함이 없어 접근 단계 선제 타격 없이 통과합니다.',
  });

  // Helper to calculate total fleet power
  const getPower = (units: FleetUnits, defense?: DefenseStructures) => {
    const shipPower = units.corvette * 1 + units.destroyer * 1 + units.dreadnought * 2 + units.carrier * 1;
    const defPower = (defense?.sectorDefense || 0) * 1 + (defense?.starbase ? 2 : 0);
    return shipPower + defPower;
  };

  // --- PHASE 2: SALVO PHASE ROUND 1 (일제사격 1라운드) ---
  let invPower = getPower(invUnits);
  let defPower = getPower(defUnits, defDefense);

  let invAbsorbed = Math.min(invAbsorbedRemaining, defPower);
  let invNetDamage = Math.max(0, defPower - invAbsorbedRemaining);
  invAbsorbedRemaining = Math.max(0, invAbsorbedRemaining - defPower);

  let defAbsorbed = Math.min(defAbsorbedRemaining, invPower);
  let defNetDamage = Math.max(0, invPower - defAbsorbedRemaining);
  defAbsorbedRemaining = Math.max(0, defAbsorbedRemaining - invPower);

  const invRound1Lost = applyDamageToFleet(invUnits, invNetDamage).unitsLost;
  const defRound1Result = applyDamageToDefender(defUnits, defDefense, defNetDamage);

  logs.push({
    phase: 'SALVO_ROUND_1',
    title: '일제사격 1라운드 (Salvo Phase Round 1)',
    invaderRawDamage: invPower,
    invaderAbsorbed: invAbsorbed,
    invaderNetDamage: invNetDamage,
    defenderRawDamage: defPower,
    defenderAbsorbed: defAbsorbed,
    defenderNetDamage: defNetDamage,
    invaderUnitsLost: invRound1Lost,
    defenderUnitsLost: defRound1Result.unitsLost,
    defenderDefenseLost: defRound1Result.defenseLost,
    summaryNote: `침공자 함대력 ${invPower} vs 방어자 함대/방어력 ${defPower} 동시 피해 교환.`,
  });

  // --- PHASE 3: SALVO PHASE ROUND 2 (일제사격 2라운드 - 필요 시) ---
  const hasInvaderShips = invUnits.corvette + invUnits.destroyer + invUnits.dreadnought + invUnits.carrier > 0;
  const hasDefenderThreat = defUnits.corvette + defUnits.destroyer + defUnits.dreadnought + defUnits.carrier + defDefense.sectorDefense > 0 || defDefense.starbase;

  if (hasInvaderShips && hasDefenderThreat) {
    invPower = getPower(invUnits);
    defPower = getPower(defUnits, defDefense);

    invAbsorbed = Math.min(invAbsorbedRemaining, defPower);
    invNetDamage = Math.max(0, defPower - invAbsorbedRemaining);
    invAbsorbedRemaining = Math.max(0, invAbsorbedRemaining - defPower);

    defAbsorbed = Math.min(defAbsorbedRemaining, invPower);
    defNetDamage = Math.max(0, invPower - defAbsorbedRemaining);
    defAbsorbedRemaining = Math.max(0, defAbsorbedRemaining - invPower);

    const invRound2Lost = applyDamageToFleet(invUnits, invNetDamage).unitsLost;
    const defRound2Result = applyDamageToDefender(defUnits, defDefense, defNetDamage);

    logs.push({
      phase: 'SALVO_ROUND_2',
      title: '일제사격 2라운드 (Salvo Phase Round 2)',
      invaderRawDamage: invPower,
      invaderAbsorbed: invAbsorbed,
      invaderNetDamage: invNetDamage,
      defenderRawDamage: defPower,
      defenderAbsorbed: defAbsorbed,
      defenderNetDamage: defNetDamage,
      invaderUnitsLost: invRound2Lost,
      defenderUnitsLost: defRound2Result.unitsLost,
      defenderDefenseLost: defRound2Result.defenseLost,
      summaryNote: `잔존 함대 2라운드 교환: 침공자 ${invPower} 대미지 vs 방어자 ${defPower} 대미지.`,
    });
  }

  // --- PHASE 4: INVASION CHECK (침공 성패 판정) ---
  const totalInvaderSurviving = invUnits.corvette + invUnits.destroyer + invUnits.dreadnought + invUnits.carrier;
  const totalDefenderShipsSurviving = defUnits.corvette + defUnits.destroyer + defUnits.dreadnought + defUnits.carrier;
  const totalDefenderDefenseSurviving = defDefense.sectorDefense + (defDefense.starbase ? 2 : 0);

  const isInvasionSuccessful =
    totalInvaderSurviving > 0 &&
    totalDefenderShipsSurviving === 0 &&
    totalDefenderDefenseSurviving === 0;

  logs.push({
    phase: 'INVASION_CHECK',
    title: '전투 종료 및 침공 판정 (Invasion Outcome)',
    invaderRawDamage: 0,
    invaderAbsorbed: 0,
    invaderNetDamage: 0,
    defenderRawDamage: 0,
    defenderAbsorbed: 0,
    defenderNetDamage: 0,
    invaderUnitsLost: {},
    defenderUnitsLost: {},
    defenderDefenseLost: 0,
    summaryNote: isInvasionSuccessful
      ? `침공 성공! 침공자 잔존 유닛 ${totalInvaderSurviving}대가 섹터를 점령합니다.`
      : totalInvaderSurviving === 0
      ? '침공 실패! 침공자 함대가 모두 격파되었습니다.'
      : '침공 실패! 방어자의 함대 또는 방어 시설이 잔존하여 침공이 저지되었습니다.',
  });

  return {
    winner: isInvasionSuccessful ? 'INVADER' : 'DEFENDER',
    isInvasionSuccessful,
    sectorConquered: isInvasionSuccessful,
    finalInvaderUnits: invUnits,
    finalDefenderUnits: defUnits,
    finalDefense: defDefense,
    phaseLogs: logs,
  };
}
