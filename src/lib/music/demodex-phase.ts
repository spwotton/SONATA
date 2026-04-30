export interface DemodexPhaseParameters {
  phase: number;
  kScale: number;
  carrierFreq: number;
  tonicShift: number;
  noiseDensity: number;
}

const DEMODEX_TABLE: DemodexPhaseParameters[] = [
  { phase: 0.0, kScale: 0.82, carrierFreq: 7.83, tonicShift: 0, noiseDensity: 0.42 },
  { phase: 0.25, kScale: 0.94, carrierFreq: 8.6, tonicShift: 3, noiseDensity: 0.28 },
  { phase: 0.5, kScale: 1.0, carrierFreq: 7.83, tonicShift: 6, noiseDensity: 0.12 },
  { phase: 0.75, kScale: 0.9, carrierFreq: 8.2, tonicShift: 3, noiseDensity: 0.32 },
  { phase: 1.0, kScale: 0.78, carrierFreq: 7.4, tonicShift: 0, noiseDensity: 0.58 },
];

export function demodexPhaseAt(time: number, durationSec: number, generation = 0): number {
  const safeDuration = Math.max(1, durationSec);
  return mod(time / safeDuration + generation * 0.0001, 1);
}

export function demodexParametersAt(phase: number): DemodexPhaseParameters {
  const normalizedPhase = mod(phase, 1);
  const nextIndex = DEMODEX_TABLE.findIndex(point => point.phase >= normalizedPhase);
  const upper = DEMODEX_TABLE[nextIndex === -1 ? DEMODEX_TABLE.length - 1 : nextIndex];
  const lower = DEMODEX_TABLE[Math.max(0, (nextIndex === -1 ? DEMODEX_TABLE.length : nextIndex) - 1)];
  const span = Math.max(0.000001, upper.phase - lower.phase);
  const amount = (normalizedPhase - lower.phase) / span;

  return {
    phase: normalizedPhase,
    kScale: lerp(lower.kScale, upper.kScale, amount),
    carrierFreq: lerp(lower.carrierFreq, upper.carrierFreq, amount),
    tonicShift: lerp(lower.tonicShift, upper.tonicShift, amount),
    noiseDensity: lerp(lower.noiseDensity, upper.noiseDensity, amount),
  };
}

function lerp(a: number, b: number, amount: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, amount));
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
