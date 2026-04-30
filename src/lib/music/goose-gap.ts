export const GOOSE_GAP = 0.02;
export const HALL_ETA = 0.09;
export const MIN_HALL_ETA = 0.085;
export const MAX_HALL_ETA = 0.095;

export function gooseGapAtPhase(phase: number): number {
  const normalizedPhase = phase - Math.floor(phase);
  return GOOSE_GAP * (1 + 0.5 * Math.sin(Math.PI * normalizedPhase));
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
  if (conditionNumber < 50) return clamp(eta + 0.0005, MIN_HALL_ETA, MAX_HALL_ETA);
  if (conditionNumber > 100) return clamp(eta - 0.0005, MIN_HALL_ETA, MAX_HALL_ETA);
  return clamp(eta, MIN_HALL_ETA, MAX_HALL_ETA);
}

export function etaFromGooseGap(gap: number, eta = HALL_ETA): number {
  const gapToEtaScale = 10;
  return clamp(eta + gap / gapToEtaScale, MIN_HALL_ETA, MAX_HALL_ETA);
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
