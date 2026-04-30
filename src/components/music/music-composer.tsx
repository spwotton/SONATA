import type { MusicRoute, RVSState } from "../../lib/music/types";

const ROUTES: MusicRoute[] = [
  "LOGOS_CHORAL",
  "KEMET_DRONE",
  "PHAISTOS_SPIRAL",
  "ANTIKYTHERA_CLOCK",
  "GENOMIC_AMBIENT",
  "LEECH_ORCHESTRAL",
  "BIRD_RETROCAST",
  "BLACK_SWAN_NOIR",
  "RIEMANN_IDM",
];

const ROUTE_LABELS: Record<MusicRoute, string> = {
  LOGOS_CHORAL: "Logos Choral",
  KEMET_DRONE: "Kemet Drone",
  PHAISTOS_SPIRAL: "Phaistos Spiral",
  ANTIKYTHERA_CLOCK: "Antikythera Clock",
  GENOMIC_AMBIENT: "Genomic Ambient",
  LEECH_ORCHESTRAL: "Leech Orchestral",
  BIRD_RETROCAST: "Bird Retrocast",
  BLACK_SWAN_NOIR: "Black Swan Noir",
  RIEMANN_IDM: "Riemann IDM",
};

interface Props {
  route: MusicRoute;
  rvs: RVSState;
  durationSec: number;
  useRamsey: boolean;
  onRouteChange: (r: MusicRoute) => void;
  onRvsChange: (rvs: RVSState) => void;
  onDurationChange: (d: number) => void;
  onRamseyToggle: (v: boolean) => void;
}

function RVSSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rvs-slider">
      <div className="rvs-header">
        <span className="rvs-label">{label}</span>
        <span className="rvs-value">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

export default function MusicComposer({
  route,
  rvs,
  durationSec,
  useRamsey,
  onRouteChange,
  onRvsChange,
  onDurationChange,
  onRamseyToggle,
}: Props) {
  const setRvs = (key: keyof RVSState, v: number) => {
    onRvsChange({ ...rvs, [key]: v });
  };

  return (
    <div className="music-composer">
      <div className="composer-section">
        <label className="section-label">Music Route</label>
        <div className="route-grid">
          {ROUTES.map(r => (
            <button
              key={r}
              className={`route-btn ${route === r ? "active" : ""}`}
              onClick={() => onRouteChange(r)}
            >
              {ROUTE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="composer-section">
        <label className="section-label">Duration</label>
        <div className="duration-options">
          {[16, 32, 48, 64].map(d => (
            <button
              key={d}
              className={`duration-btn ${durationSec === d ? "active" : ""}`}
              onClick={() => onDurationChange(d)}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>

      <div className="composer-section">
        <label className="section-label">Symbolic Resonance Palette (RVS)</label>
        <div className="rvs-sliders">
          <RVSSlider label="Identity" value={rvs.identity} onChange={v => setRvs("identity", v)} />
          <RVSSlider label="Coherence" value={rvs.coherence} onChange={v => setRvs("coherence", v)} />
          <RVSSlider label="Continuity" value={rvs.continuity} onChange={v => setRvs("continuity", v)} />
          <RVSSlider label="Adaptability" value={rvs.adaptability} onChange={v => setRvs("adaptability", v)} />
          <RVSSlider label="Permeability" value={rvs.permeability} onChange={v => setRvs("permeability", v)} />
        </div>
      </div>

      <div className="composer-section">
        <label className="section-label">Rhythm Mode</label>
        <div className="rhythm-options">
          <div className="rhythm-info">Antikythera clock mode · 24-step prime-spoke rhythm</div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={useRamsey}
              onChange={e => onRamseyToggle(e.target.checked)}
            />
            <span>Ramsey 42-step rhythm overlay</span>
          </label>
        </div>
      </div>
    </div>
  );
}
