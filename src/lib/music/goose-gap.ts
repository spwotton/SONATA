export const GOOSE_GAP = 0.02;
export const HALL_ETA = 0.09;
export const MIN_HALL_ETA = 0.085;
export const MAX_HALL_ETA = 0.095;
export const GOOSE_GAP_TO_ETA_SCALE = 10;
export const GOOSE_GAP_MODULATION_DEPTH = 0.5;
export const CONDITION_LOWER_THRESHOLD = 50;
export const CONDITION_UPPER_THRESHOLD = 100;
export const ETA_ADJUSTMENT_STEP = 0.0005;

export function gooseGapAtPhase(phase: number): number {
  const normalizedPhase = phase - Math.floor(phase);
  return GOOSE_GAP * (1 + GOOSE_GAP_MODULATION_DEPTH * Math.sin(Math.PI * normalizedPhase));
}

export function humanizeTime(time: number, amount = GOOSE_GAP): number {
  return time + (Math.random() - 0.5) * amount;
}

export function humanizeVelocity(velocity: number, amount = GOOSE_GAP): number {
  return clamp01(velocity + (Math.random() - 0.5) * amount);
}

export function hallRegularize(value: number, target: number, eta = HALL_ETA): number {
  return value * (1 - eta) + target * eta;
}

export function scheduleHallEta(conditionNumber: number, eta = HALL_ETA): number {
  if (conditionNumber < CONDITION_LOWER_THRESHOLD) return clamp(eta + ETA_ADJUSTMENT_STEP, MIN_HALL_ETA, MAX_HALL_ETA);
  if (conditionNumber > CONDITION_UPPER_THRESHOLD) return clamp(eta - ETA_ADJUSTMENT_STEP, MIN_HALL_ETA, MAX_HALL_ETA);
  return clamp(eta, MIN_HALL_ETA, MAX_HALL_ETA);
}

export function etaWithGooseGapAdjustment(gap: number, eta = HALL_ETA): number {
  return clamp(eta + gap / GOOSE_GAP_TO_ETA_SCALE, MIN_HALL_ETA, MAX_HALL_ETA);
}

export function gooseGapScore(value: number): number {
  const target = GOOSE_GAP;
  return Math.max(0, 100 - Math.abs(value - target) * 3000);
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

function clamp(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, x));
}
