export function encodeWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numSamples = buffer.length;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const totalSize = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  function writeInt16(offset: number, value: number) {
    view.setInt16(offset, value, true);
  }

  function writeUint32(offset: number, value: number) {
    view.setUint32(offset, value, true);
  }

  writeString(0, "RIFF");
  writeUint32(4, totalSize - 8);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  writeUint32(16, 16);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  writeUint32(24, sampleRate);
  writeUint32(28, byteRate);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  writeUint32(40, dataSize);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = buffer.getChannelData(ch)[i];
      const clamped = Math.max(-1, Math.min(1, sample));
      writeInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

export function downloadWav(buffer: AudioBuffer, filename = "omega-sonata.wav"): void {
  const blob = encodeWav(buffer);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
