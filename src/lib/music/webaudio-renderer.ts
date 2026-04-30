import type { SonataComposition } from "./types";
import { midiToFreq } from "./gos-tuning";
import { SMC_BAND } from "./smc-band";
import { GOOSE_GAP } from "./goose-gap";

export async function renderComposition(composition: SonataComposition): Promise<AudioBuffer> {
  const sampleRate = 44100;
  const totalSamples = Math.ceil(composition.durationSec * sampleRate);
  const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate);

  const compressor = offlineCtx.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.knee.value = 6;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.05;
  compressor.release.value = 0.25;
  compressor.connect(offlineCtx.destination);

  const masterGain = offlineCtx.createGain();
  masterGain.gain.value = 0.55;
  masterGain.connect(compressor);

  const reverbGain = offlineCtx.createGain();
  reverbGain.gain.value = 0.18;
  reverbGain.connect(masterGain);

  const dryGain = offlineCtx.createGain();
  dryGain.gain.value = 0.82;
  dryGain.connect(masterGain);

  const reverbDuration = 2.2;
  const reverbSamples = Math.ceil(reverbDuration * sampleRate);
  const irBuffer = offlineCtx.createBuffer(2, reverbSamples, sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = irBuffer.getChannelData(ch);
    for (let i = 0; i < reverbSamples; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbSamples, 2.5);
    }
  }
  const convolver = offlineCtx.createConvolver();
  convolver.buffer = irBuffer;
  convolver.connect(reverbGain);

  const voiceMap = new Map(SMC_BAND.map(v => [v.id, v]));

  for (const note of composition.notes) {
    const bandVoice = voiceMap.get(note.channel);
    if (!bandVoice) continue;

    const freq = midiToFreq(note.midi, composition.tuning);
    const startTime = note.time;
    const endTime = startTime + note.duration;

    if (startTime >= composition.durationSec) continue;

    const osc = offlineCtx.createOscillator();
    osc.type = bandVoice.waveform === "square" ? "triangle" : bandVoice.waveform;
    osc.frequency.value = freq;

    const env = offlineCtx.createGain();
    env.gain.setValueAtTime(0, startTime);

    const attackTime = 0.06 + GOOSE_GAP;
    const releaseTime = 0.12;
    const peakGain = note.velocity * bandVoice.gain * 0.7;

    env.gain.linearRampToValueAtTime(peakGain, startTime + attackTime);
    env.gain.setValueAtTime(peakGain, Math.max(startTime + attackTime, endTime - releaseTime));
    env.gain.linearRampToValueAtTime(0, endTime);

    const panner = offlineCtx.createStereoPanner();
    panner.pan.value = bandVoice.pan;

    osc.connect(env);
    env.connect(panner);
    panner.connect(dryGain);
    panner.connect(convolver);

    osc.start(startTime);
    osc.stop(Math.min(endTime + 0.05, composition.durationSec));
  }

  for (const chord of composition.chords) {
    if (chord.time >= composition.durationSec) continue;

    for (const midiNote of chord.midiNotes) {
      const freq = midiToFreq(midiNote, composition.tuning);
      const startTime = chord.time;
      const endTime = startTime + chord.duration;

      const osc = offlineCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const env = offlineCtx.createGain();
      env.gain.setValueAtTime(0, startTime);
      env.gain.linearRampToValueAtTime(chord.velocity * 0.4, startTime + 0.3);
      env.gain.setValueAtTime(chord.velocity * 0.4, Math.max(startTime + 0.3, endTime - 0.5));
      env.gain.linearRampToValueAtTime(0, endTime);

      osc.connect(env);
      env.connect(dryGain);
      env.connect(convolver);

      osc.start(startTime);
      osc.stop(Math.min(endTime + 0.1, composition.durationSec));
    }
  }

  masterGain.gain.setValueAtTime(0, 0);
  masterGain.gain.linearRampToValueAtTime(0.55, 1.5);
  masterGain.gain.setValueAtTime(0.55, composition.durationSec - 2.0);
  masterGain.gain.linearRampToValueAtTime(0, composition.durationSec);

  return offlineCtx.startRendering();
}

export function playBuffer(buffer: AudioBuffer): AudioBufferSourceNode {
  const ctx = new AudioContext();
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start();
  return source;
}
