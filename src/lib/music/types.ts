export type TuningMode = "dodeca" | "grant" | "standard";

export type MusicRoute =
  | "KEMET_DRONE"
  | "PHAISTOS_SPIRAL"
  | "ANTIKYTHERA_CLOCK"
  | "LOGOS_CHORAL"
  | "RIEMANN_IDM"
  | "GENOMIC_AMBIENT"
  | "LEECH_ORCHESTRAL"
  | "BIRD_RETROCAST"
  | "BLACK_SWAN_NOIR";

export interface RVSState {
  identity: number;
  coherence: number;
  continuity: number;
  adaptability: number;
  permeability: number;
}

export interface NoteEvent {
  time: number;
  duration: number;
  midi: number;
  velocity: number;
  channel: string;
}

export interface ChordEvent {
  time: number;
  duration: number;
  midiNotes: number[];
  velocity: number;
}

export interface SonataComposition {
  id: string;
  title: string;
  route: MusicRoute;
  generation: number;
  durationSec: number;
  tempo: number;
  tuning: TuningMode;
  rootHz: number;
  rvs: RVSState;
  notes: NoteEvent[];
  chords: ChordEvent[];
  prompt: string;
  createdAt: number;
}

export interface AudioAssessment {
  beauty: number;
  coherence: number;
  novelty: number;
  emotionalDepth: number;
  mixClarity: number;
  gooseGap: number;
  gosResonance: number;
  verdict: string;
  suggestion: string;
}
