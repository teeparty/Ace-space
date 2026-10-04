import React, { useState } from 'react';
import { RecordedTrack, EarthLocation, KeyMapping } from '../../types/game';
import { synthEngine } from '../../audio/retroSynth';

interface ConcertRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: EarthLocation | null;
  recordedTracks: RecordedTrack[];
  onDeleteTrack: (trackId: string) => void;
  onReplayTrack: (track: RecordedTrack) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  activeRecordingNotesCount: number;
  recordingElapsedSeconds: number;
}

export const ConcertRecordingModal: React.FC<ConcertRecordingModalProps> = ({
  isOpen,
  onClose,
  location = null,
  recordedTracks,
  onDeleteTrack,
  onReplayTrack,
  isRecording,
  onStartRecording,
  onStopRecording,
  activeRecordingNotesCount,
  recordingElapsedSeconds,
}) => {
  const [filterLocationOnly, setFilterLocationOnly] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const displayedTracks = filterLocationOnly && location
    ? recordedTracks.filter((t) => t.locationId === location.id || t.locationName === location.name)
    : recordedTracks;

  const handleExportTrack = (track: RecordedTrack) => {
    synthEngine.playCoinSound();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(track, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${track.title.replace(/\s+/g, '_')}_cassette.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice(`Exported cassette for "${track.title}"!`);
    setTimeout(() => setExportNotice(null), 2500);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] text-slate-100 p-6 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-500/30">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎙️</span>
            <div>
              <h2 className="font-arcade text-sm md:text-base text-rose-300">
                LIVE CONCERT TAPE RECORDER & ARCHIVE
              </h2>
              <div className="text-xs font-mono text-slate-400">
                {location ? `Stage: ${location.name}, ${location.country}` : 'Global Earth Concerts'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {exportNotice && (
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-3 py-1 border border-cyan-500">
                {exportNotice}
              </span>
            )}
            <button onClick={onClose} className="text-xs font-mono text-slate-400 hover:text-white">
              [CLOSE]
            </button>
          </div>
        </div>

        {/* Live Recording Console */}
        <div className="my-4 p-4 bg-slate-950 border-2 border-slate-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-lg ${
                isRecording
                  ? 'border-rose-500 bg-rose-950/60 animate-ping text-rose-300'
                  : 'border-slate-800 bg-slate-900 text-slate-600'
              }`}
            >
              ●
            </div>

            <div>
              <div className="font-arcade text-xs text-white">
                {isRecording ? 'LIVE SESSION ACTIVE' : 'STAGE RECORDER STANDBY'}
              </div>
              <div className="text-xs font-mono text-slate-400">
                {isRecording
                  ? `TIME: ${formatSeconds(recordingElapsedSeconds)} · NOTES CAPTURED: ${activeRecordingNotesCount}`
                  : 'Play piano keys on stage or keyboard to capture performance'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                type="button"
                onClick={onStartRecording}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-arcade text-xs font-bold border border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all"
              >
                ● START CONCERT RECORDING
              </button>
            ) : (
              <button
                type="button"
                onClick={onStopRecording}
                className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-arcade text-xs font-bold border border-yellow-300 animate-pulse transition-all"
              >
                ■ STOP & SAVE CASSETTE
              </button>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <span className="text-xs font-arcade text-slate-400">
            RECORDED PERFORMANCES ({displayedTracks.length})
          </span>

          {location && (
            <button
              onClick={() => setFilterLocationOnly(!filterLocationOnly)}
              className={`px-3 py-1 text-xs font-mono border transition-colors ${
                filterLocationOnly
                  ? 'border-cyan-400 bg-cyan-950 text-cyan-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
            >
              {filterLocationOnly ? `Showing: ${location.name} Only` : 'Show All Earth Venues'}
            </button>
          )}
        </div>

        {/* Cassette List */}
        <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
          {displayedTracks.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800">
              NO CONCERTS RECORDED YET. HIT "START CONCERT RECORDING" ON STAGE TO RECORD YOUR SHOW!
            </div>
          ) : (
            displayedTracks.map((tr) => (
              <div
                key={tr.id}
                className="p-3 bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono rounded"
              >
                <div>
                  <div className="font-arcade text-xs text-white">{tr.title}</div>
                  <div className="text-[11px] text-pink-400 mt-0.5">
                    📍 {tr.locationName} · {tr.duration}s · {tr.notesCount} notes · {tr.date}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onReplayTrack(tr);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-arcade text-[10px] font-bold"
                  >
                    ▶ REPLAY ON STAGE
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportTrack(tr)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px]"
                    title="Export JSON Cassette"
                  >
                    💾 EXPORT
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTrack(tr.id)}
                    className="px-2 py-1.5 text-slate-400 hover:text-rose-400 text-xs"
                    title="Delete Recording"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>SAVED AUTOMATICALLY ACROSS GOOGLE EARTH & CONCERT STAGES</span>
        </div>

      </div>
    </div>
  );
};
