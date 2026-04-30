import type { TuningMode } from "./types";

export const A4_STANDARD = 440;
export const A4_DODECA = 431.56;
export const A4_GRANT = 432.081216;

export const GOS_FREQUENCIES = {
  lunar: 37.0,
  logos: 111.0,
  carrier: 8.392,
  microtubule: 123.335,
  dodeca: 431.56,
  grant: 432.081216,
  foxp2: 139.978,
  oprm1: 141.273,
  htr2a: 176.591,
  brca1: 94.123,
  piezo1: 124.087,
};

export function getA4(mode: TuningMode): number {
  if (mode === "dodeca") return A4_DODECA;
  if (mode === "grant") return A4_GRANT;
  return A4_STANDARD;
}

export function midiToFreq(midi: number, tuning: TuningMode = "dodeca"): number {
  return getA4(tuning) * Math.pow(2, (midi - 69) / 12);
}

export function freqToMidi(freq: number, tuning: TuningMode = "dodeca"): number {
  return 69 + 12 * Math.log2(freq / getA4(tuning));
}
