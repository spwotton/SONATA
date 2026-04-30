export const GOOSE_GAP = 0.02;
export const HALL_ETA = 0.09;

export function humanizeTime(time: number, amount = GOOSE_GAP): number {
  return time + (Math.random() - 0.5) * amount;
}

export function humanizeVelocity(velocity: number, amount = GOOSE_GAP): number {
  return clamp01(velocity + (Math.random() - 0.5) * amount);
}

export function hallRegularize(value: number, target: number, eta = HALL_ETA): number {
  return value * (1 - eta) + target * eta;
}

export function gooseGapScore(value: number): number {
  const target = GOOSE_GAP;
  return Math.max(0, 100 - Math.abs(value - target) * 3000);
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}
