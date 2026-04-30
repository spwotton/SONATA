import type { SonataComposition, NoteEvent, ChordEvent, MusicRoute, TuningMode, RVSState } from "./types";
import { freqToMidi } from "./gos-tuning";
import { gooseGapAtPhase, humanizeTime, humanizeVelocity } from "./goose-gap";
import { SMC_BAND } from "./smc-band";
import { antikytheraAccent, lunarSwing, isPrimeSpoke } from "./antikythera-sequencer";
import { demodexParametersAt, demodexPhaseAt } from "./demodex-phase";
import { ramseyMasterGate } from "./ramsey-sequencer";

export interface ComposerOptions {
  route: MusicRoute;
  tuning: TuningMode;
  durationSec: number;
  tempo: number;
  rootHz: number;
  rvs: RVSState;
  useRamsey: boolean;
  generation: number;
}

const ROUTE_SCALES: Record<MusicRoute, number[]> = {
  KEMET_DRONE:       [0, 2, 3, 7, 10, 12],
  PHAISTOS_SPIRAL:   [0, 1, 5, 7, 8, 12],
  ANTIKYTHERA_CLOCK: [0, 2, 4, 7, 9, 12],
  LOGOS_CHORAL:      [0, 3, 5, 7, 10, 12, 14],
  RIEMANN_IDM:       [0, 1, 3, 6, 8, 10, 11],
  GENOMIC_AMBIENT:   [0, 2, 5, 7, 9, 11, 12],
  LEECH_ORCHESTRAL:  [0, 2, 4, 5, 7, 9, 11, 12],
  BIRD_RETROCAST:    [0, 2, 3, 5, 7, 9, 10, 12],
  BLACK_SWAN_NOIR:   [0, 1, 3, 6, 7, 9, 11],
};

const ROUTE_TEMPOS: Record<MusicRoute, number> = {
  KEMET_DRONE: 52,
  PHAISTOS_SPIRAL: 63,
  ANTIKYTHERA_CLOCK: 68,
  LOGOS_CHORAL: 74,
  RIEMANN_IDM: 120,
  GENOMIC_AMBIENT: 58,
  LEECH_ORCHESTRAL: 82,
  BIRD_RETROCAST: 96,
  BLACK_SWAN_NOIR: 66,
};

const ROUTE_TITLES: Record<MusicRoute, string> = {
  KEMET_DRONE:       "Kemet Drone",
  PHAISTOS_SPIRAL:   "Phaistos Spiral",
  ANTIKYTHERA_CLOCK: "Antikythera Clock",
  LOGOS_CHORAL:      "Logos Choral",
  RIEMANN_IDM:       "Riemann IDM",
  GENOMIC_AMBIENT:   "Genomic Ambient",
  LEECH_ORCHESTRAL:  "Leech Orchestral",
  BIRD_RETROCAST:    "Bird Retrocast",
  BLACK_SWAN_NOIR:   "Black Swan Noir",
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function compose(options: ComposerOptions): SonataComposition {
  const { route, tuning, durationSec, tempo, rootHz, rvs, useRamsey, generation } = options;
  const rng = seededRandom(Date.now() ^ (generation * 0x9e3779b9));

  const scale = ROUTE_SCALES[route];
  const effectiveTempo = ROUTE_TEMPOS[route] || tempo;
  const beatSec = 60 / effectiveTempo;
  const rootMidi = Math.round(freqToMidi(rootHz, tuning));

  const notes: NoteEvent[] = [];
  const chords: ChordEvent[] = [];

  const totalBeats = Math.floor(durationSec / beatSec);

  SMC_BAND.forEach((voice, voiceIndex) => {
    const voiceOctaveOffset = [-1, 0, 1, -1, 1, 0, -2][voiceIndex] ?? 0;
    let step = 0;

    for (let beat = 0; beat < totalBeats; beat++) {
      const time = beat * beatSec;
      const phase = demodexPhaseAt(time, durationSec, generation);
      const demodex = demodexParametersAt(phase);
      const gooseGap = gooseGapAtPhase(phase);
      const mod24Step = beat % 24;
      const accent = antikytheraAccent(mod24Step);
      const swing = lunarSwing(beat);

      const primeGate = isPrimeSpoke(mod24Step);
      const ramseyGateOpen = useRamsey ? ramseyMasterGate(step, voiceIndex * 7) : true;
      const adaptGate = rng() < rvs.adaptability + 0.3;
      const shouldPlay = useRamsey ? ramseyGateOpen && adaptGate : primeGate || adaptGate;

      if (shouldPlay) {
        const scaleDegree = scale[Math.floor(rng() * scale.length)];
        const octaveShift = voiceOctaveOffset + (rng() < 0.15 ? (rng() > 0.5 ? 12 : -12) : 0);
        const shiftedTonic = rootMidi + Math.round(demodex.tonicShift);
        const scaledDegree = Math.round(scaleDegree * demodex.kScale);
        const midi = shiftedTonic + scaledDegree + octaveShift;
        const clampedMidi = Math.max(24, Math.min(96, midi));

        const baseVelocity = voice.gain * accent * (0.6 + rvs.coherence * 0.4) * (1 - demodex.noiseDensity * 0.25);
        const velocity = humanizeVelocity(Math.min(1, baseVelocity), gooseGap);
        const noteTime = humanizeTime(time + swing, gooseGap * 0.5);
        const noteDuration = beatSec * (0.4 + rng() * 0.5) * (1 + rvs.continuity * 0.3) * demodex.kScale;

        notes.push({
          time: Math.max(0, noteTime),
          duration: noteDuration,
          midi: clampedMidi,
          velocity,
          channel: voice.id,
        });
      }
      step++;
    }

    if (rvs.coherence > 0.7 && voiceIndex < 3) {
      for (let beat = 0; beat < totalBeats; beat += 4) {
        if (isPrimeSpoke(beat % 24)) {
          const chordRoot = rootMidi + (voiceOctaveOffset * 12);
          const chordNotes = scale
            .filter((_, i) => i % 2 === 0)
            .slice(0, 3)
            .map(d => Math.max(24, Math.min(96, chordRoot + d)));

          chords.push({
            time: beat * beatSec,
            duration: beatSec * 3,
            midiNotes: chordNotes,
            velocity: 0.35 * voice.gain,
          });
        }
      }
    }
  });

  notes.sort((a, b) => a.time - b.time);
  chords.sort((a, b) => a.time - b.time);

  return {
    id: `sonata-${Date.now()}-${generation}`,
    title: ROUTE_TITLES[route],
    route,
    generation,
    durationSec,
    tempo: effectiveTempo,
    tuning,
    rootHz,
    rvs,
    notes,
    chords,
    prompt: `${route} • ${tuning} tuning • ${effectiveTempo} BPM • root ${rootHz.toFixed(3)} Hz`,
    createdAt: Date.now(),
  };
}
