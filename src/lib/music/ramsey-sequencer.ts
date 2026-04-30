export const RAMSEY_STEPS = 42;

export const RAMSEY_PATTERN: number[] = [
  1, 1, 1, 0, 0, 0,
  1, 1, 0, 1, 1, 0,
  1, 0, 1, 1, 1, 0,
  0, 0, 1, 1, 0, 0,
  1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 0,
  0, 1, 1, 1, 0, 0,
];

export function ramseyGate(step: number, rotation = 0): boolean {
  const index = ((step + rotation) % RAMSEY_STEPS + RAMSEY_STEPS) % RAMSEY_STEPS;
  return RAMSEY_PATTERN[index] === 1;
}

export function ramseyVelocity(step: number, rotation = 0): number {
  return ramseyGate(step, rotation) ? 0.85 : 0.15;
}
