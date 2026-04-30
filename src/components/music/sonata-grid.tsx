import type { SonataComposition } from "../../lib/music/types";

interface Props {
  composition: SonataComposition | null;
}

export default function SonataGrid({ composition }: Props) {
  if (!composition) {
    return (
      <div className="sonata-grid empty">
        <span>No composition yet — generate to begin</span>
      </div>
    );
  }

  return (
    <div className="sonata-grid">
      <div className="grid-meta">
        <span className="meta-item">
          <span className="meta-key">Title</span>
          <span className="meta-val">{composition.title}</span>
        </span>
        <span className="meta-item">
          <span className="meta-key">A4</span>
          <span className="meta-val">{composition.rootHz.toFixed(3)} Hz root · {
            composition.tuning === "dodeca" ? "431.56 Hz" :
            composition.tuning === "grant" ? "432.081 Hz" : "440 Hz"
          } tuning</span>
        </span>
        <span className="meta-item">
          <span className="meta-key">Tempo</span>
          <span className="meta-val">{composition.tempo} BPM</span>
        </span>
        <span className="meta-item">
          <span className="meta-key">Notes</span>
          <span className="meta-val">{composition.notes.length}</span>
        </span>
        <span className="meta-item">
          <span className="meta-key">Duration</span>
          <span className="meta-val">{composition.durationSec}s</span>
        </span>
        <span className="meta-item">
          <span className="meta-key">Generation</span>
          <span className="meta-val">#{composition.generation}</span>
        </span>
      </div>
      <div className="grid-prompt">{composition.prompt}</div>
    </div>
  );
}
