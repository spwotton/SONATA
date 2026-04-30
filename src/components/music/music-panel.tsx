import { useState, useRef, useCallback } from "react";
import type { MusicRoute, RVSState, SonataComposition, TuningMode } from "../../lib/music/types";
import { compose } from "../../lib/music/symbolic-composer";
import { renderComposition, playBuffer } from "../../lib/music/webaudio-renderer";
import { downloadWav } from "../../lib/music/wav-encoder";
import { GOS_FREQUENCIES } from "../../lib/music/gos-tuning";
import TuningPanel from "./tuning-panel";
import MusicComposer from "./music-composer";
import SMCMixer from "./smc-mixer";
import SonataGrid from "./sonata-grid";
import TransportControls from "./transport-controls";
import "./music-panel.css";

const DEFAULT_RVS: RVSState = {
  identity: 0.82,
  coherence: 0.9,
  continuity: 0.86,
  adaptability: 0.55,
  permeability: 0.32,
};

export default function MusicPanel() {
  const [route, setRoute] = useState<MusicRoute>("LOGOS_CHORAL");
  const [tuning, setTuning] = useState<TuningMode>("dodeca");
  const [durationSec, setDurationSec] = useState(32);
  const [rvs, setRvs] = useState<RVSState>(DEFAULT_RVS);
  const [useRamsey, setUseRamsey] = useState(false);
  const [composition, setComposition] = useState<SonataComposition | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generation, setGeneration] = useState(1);

  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleGenerate = useCallback(async () => {
    setError(null);
    setIsRendering(true);
    try {
      const rootHz = GOS_FREQUENCIES.logos;
      const comp = compose({
        route,
        tuning,
        durationSec,
        tempo: 74,
        rootHz,
        rvs,
        useRamsey,
        generation,
      });
      setComposition(comp);

      const buffer = await renderComposition(comp);
      setAudioBuffer(buffer);
      setGeneration(g => g + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Render failed");
    } finally {
      setIsRendering(false);
    }
  }, [route, tuning, durationSec, rvs, useRamsey, generation]);

  const handlePlay = useCallback(() => {
    if (!audioBuffer) return;
    sourceRef.current = playBuffer(audioBuffer);
    setIsPlaying(true);
    sourceRef.current.onended = () => setIsPlaying(false);
  }, [audioBuffer]);

  const handleStop = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch {
        /* already stopped */
      }
      sourceRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const handleExport = useCallback(() => {
    if (!audioBuffer || !composition) return;
    downloadWav(audioBuffer, `omega-sonata-${composition.route.toLowerCase()}-${Date.now()}.wav`);
  }, [audioBuffer, composition]);

  return (
    <div className="music-panel">
      <div className="panel-left">
        <TuningPanel tuning={tuning} onChange={setTuning} />
        <MusicComposer
          route={route}
          rvs={rvs}
          durationSec={durationSec}
          useRamsey={useRamsey}
          onRouteChange={setRoute}
          onRvsChange={setRvs}
          onDurationChange={setDurationSec}
          onRamseyToggle={setUseRamsey}
        />
      </div>
      <div className="panel-right">
        <SonataGrid composition={composition} />
        <TransportControls
          isRendering={isRendering}
          isPlaying={isPlaying}
          hasBuffer={!!audioBuffer}
          onGenerate={handleGenerate}
          onPlay={handlePlay}
          onStop={handleStop}
          onExport={handleExport}
        />
        {error && <div className="error-message">{error}</div>}
        <SMCMixer notes={composition?.notes ?? []} />
      </div>
    </div>
  );
}
