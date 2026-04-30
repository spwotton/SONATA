export const PRIME_SPOKES = [1, 5, 7, 11, 13, 17, 19, 23];

export const SPOKE_PAIRS = [
  [1, 23],
  [5, 19],
  [7, 17],
  [11, 13],
];

export const ANTIKYTHERA_GEARS = {
  saros: 223,
  metonic: 235,
  lunarA: 53,
  lunarB: 38,
  solar: 48,
  exeligmos: 15,
  calendar: 365,
};

export function isPrimeSpoke(step: number): boolean {
  return PRIME_SPOKES.includes(mod(step, 24));
}

export function antikytheraAccent(step: number): number {
  const s = mod(step, 24);
  if (isPrimeSpoke(s)) return 1.0;
  if (s % 2 === 0) return 0.35;
  return 0.18;
}

export function lunarSwing(step: number): number {
  const ratio = ANTIKYTHERA_GEARS.lunarA / ANTIKYTHERA_GEARS.lunarB;
  return Math.sin((step / ANTIKYTHERA_GEARS.lunarB) * Math.PI * 2) * ratio * 0.015;
}

export function phraseReset(step: number): boolean {
  return step % ANTIKYTHERA_GEARS.exeligmos === 0;
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
