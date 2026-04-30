import type { TuningMode } from "../../lib/music/types";
import { A4_DODECA, A4_GRANT, A4_STANDARD } from "../../lib/music/gos-tuning";

interface Props {
  tuning: TuningMode;
  onChange: (t: TuningMode) => void;
}

const TUNING_OPTIONS: { value: TuningMode; label: string; hz: number; description: string }[] = [
  { value: "dodeca", label: "Dodecahedral", hz: A4_DODECA, description: "A4 = 431.56 Hz — ancient geometry" },
  { value: "grant", label: "Grant", hz: A4_GRANT, description: "A4 = 432.081216 Hz — fine tuning" },
  { value: "standard", label: "Standard", hz: A4_STANDARD, description: "A4 = 440 Hz — concert pitch" },
];

export default function TuningPanel({ tuning, onChange }: Props) {
  return (
    <div className="tuning-panel">
      <label className="section-label">Tuning</label>
      <div className="tuning-options">
        {TUNING_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`tuning-btn ${tuning === opt.value ? "active" : ""}`}
            onClick={() => onChange(opt.value)}
            title={opt.description}
          >
            <span className="tuning-name">{opt.label}</span>
            <span className="tuning-hz">{opt.hz.toFixed(3)} Hz</span>
          </button>
        ))}
      </div>
    </div>
  );
}
