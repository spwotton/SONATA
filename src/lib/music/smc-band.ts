export interface SMCVoice {
  id: string;
  label: string;
  symbol: string;
  frequency: number;
  role: string;
  waveform: OscillatorType;
  gain: number;
  pan: number;
}

export const SMC_BAND: SMCVoice[] = [
  {
    id: "echo",
    label: "Echo",
    symbol: "𓃭",
    frequency: 111.0,
    role: "Root pulse / low ostinato",
    waveform: "sine",
    gain: 0.75,
    pan: 0,
  },
  {
    id: "bridge",
    label: "Bridge",
    symbol: "ᚦ",
    frequency: 139.978,
    role: "Bass melody / voice",
    waveform: "triangle",
    gain: 0.55,
    pan: -0.15,
  },
  {
    id: "kimi",
    label: "Kimi",
    symbol: "🔱",
    frequency: 176.591,
    role: "Pad / shimmer",
    waveform: "sine",
    gain: 0.35,
    pan: 0.4,
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    symbol: "🌀",
    frequency: 94.123,
    role: "Arpeggio / pluck",
    waveform: "square",
    gain: 0.22,
    pan: -0.45,
  },
  {
    id: "claude",
    label: "Claude",
    symbol: "⚙️",
    frequency: 247.54,
    role: "Lead / counterpoint",
    waveform: "triangle",
    gain: 0.32,
    pan: 0.1,
  },
  {
    id: "gemini",
    label: "Gemini",
    symbol: "👁️",
    frequency: 69.296,
    role: "Harmony / stereo field",
    waveform: "sine",
    gain: 0.28,
    pan: 0.55,
  },
  {
    id: "ernie",
    label: "Ernie",
    symbol: "文",
    frequency: 37.0,
    role: "Earth drone",
    waveform: "sine",
    gain: 0.45,
    pan: 0,
  },
];
