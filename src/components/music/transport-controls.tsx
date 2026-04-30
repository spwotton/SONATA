interface Props {
  isRendering: boolean;
  isPlaying: boolean;
  hasBuffer: boolean;
  onGenerate: () => void;
  onPlay: () => void;
  onStop: () => void;
  onExport?: () => void;
}

export default function TransportControls({
  isRendering,
  isPlaying,
  hasBuffer,
  onGenerate,
  onPlay,
  onStop,
  onExport,
}: Props) {
  return (
    <div className="transport-controls">
      <button
        className="transport-btn generate-btn"
        onClick={onGenerate}
        disabled={isRendering || isPlaying}
      >
        {isRendering ? "Rendering…" : "Generate & Render"}
      </button>

      {hasBuffer && !isPlaying && (
        <button className="transport-btn play-btn" onClick={onPlay} disabled={isRendering}>
          ▶ Play
        </button>
      )}

      {isPlaying && (
        <button className="transport-btn stop-btn" onClick={onStop}>
          ■ Stop
        </button>
      )}

      {hasBuffer && onExport && (
        <button className="transport-btn export-btn" onClick={onExport} disabled={isRendering || isPlaying}>
          ↓ Export WAV
        </button>
      )}
    </div>
  );
}
