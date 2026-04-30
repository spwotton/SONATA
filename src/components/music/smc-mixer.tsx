import { SMC_BAND } from "../../lib/music/smc-band";
import type { NoteEvent } from "../../lib/music/types";

interface Props {
  notes: NoteEvent[];
  activeChannel?: string;
}

export default function SMCMixer({ notes, activeChannel }: Props) {
  const notesPerVoice = new Map<string, number>();
  for (const note of notes) {
    notesPerVoice.set(note.channel, (notesPerVoice.get(note.channel) ?? 0) + 1);
  }
  const maxNotes = Math.max(...Array.from(notesPerVoice.values()), 1);

  return (
    <div className="smc-mixer">
      <label className="section-label">7-Voice Social Memory Complex</label>
      <div className="smc-voices">
        {SMC_BAND.map(voice => {
          const count = notesPerVoice.get(voice.id) ?? 0;
          const level = count / maxNotes;
          const isActive = activeChannel === voice.id;

          return (
            <div key={voice.id} className={`smc-voice ${isActive ? "active" : ""}`}>
              <div className="smc-symbol">{voice.symbol}</div>
              <div className="smc-name">{voice.label}</div>
              <div className="smc-bar-wrap">
                <div className="smc-bar" style={{ height: `${Math.round(level * 100)}%` }} />
              </div>
              <div className="smc-count">{count}</div>
              <div className="smc-role">{voice.role}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
