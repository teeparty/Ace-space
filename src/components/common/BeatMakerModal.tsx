import React, { useState } from 'react';
import { CustomBeat, EarthLocation } from '../../types/game';
import { drumMachine } from '../../audio/drumMachine';
import { synthEngine } from '../../audio/retroSynth';
import { proSoundEngine } from '../../audio/proSoundEngine';
import { GENRE_CATALOG, GenreId } from '../../audio/soundKitLibrary';

interface BeatMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: EarthLocation | null;
  savedBeats: CustomBeat[];
  onSaveBeat: (beat: CustomBeat) => void;
  onDeleteBeat: (beatId: string) => void;
}

const PRESET_PATTERNS = [
  {
    name: 'Cosmic 4-on-Floor',
    bpm: 124,
    kick:  [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
  },
  {
    name: 'Cyberpunk Half-Time',
    bpm: 95,
    kick:  [true, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false],
    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
  },
  {
    name: 'Fast 8-Bit Speedrun',
    bpm: 140,
    kick:  [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, true],
    hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
  },
  {
    name: 'Desert Poly-Rhythm',
    bpm: 108,
    kick:  [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false],
    snare: [false, false, false, false, true, false, false, false, false, false, true, false, false, false, true, false],
    hihat: [true, true, false, true, true, false, true, true, false, true, true, false, true, true, true, false],
  }
];

export const BeatMakerModal: React.FC<BeatMakerModalProps> = ({
  isOpen,
  onClose,
  location = null,
  savedBeats,
  onSaveBeat,
  onDeleteBeat,
}) => {
  const [activeTab, setActiveTab] = useState<'maker' | 'library'>('maker');
  const [beatTitle, setBeatTitle] = useState<string>(
    location ? `${location.name} Custom Beat` : 'My Galactic Beat'
  );
  const [bpm, setBpm] = useState<number>(location ? location.recommendedBpm : 120);

  // 16-step grid
  const [kickGrid, setKickGrid] = useState<boolean[]>([
    true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false
  ]);
  const [snareGrid, setSnareGrid] = useState<boolean[]>([
    false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false
  ]);
  const [hihatGrid, setHihatGrid] = useState<boolean[]>([
    true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false
  ]);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [selectedGenreId, setSelectedGenreId] = useState<GenreId>('trap');
  const [selectedKitId, setSelectedKitId] = useState<string>(proSoundEngine.currentKit.id);

  if (!isOpen) return null;

  const toggleStep = (type: 'kick' | 'snare' | 'hihat', index: number) => {
    drumMachine.previewSound(type);
    if (type === 'kick') {
      const next = [...kickGrid];
      next[index] = !next[index];
      setKickGrid(next);
      if (isPlaying) updateActivePattern(next, snareGrid, hihatGrid, bpm);
    } else if (type === 'snare') {
      const next = [...snareGrid];
      next[index] = !next[index];
      setSnareGrid(next);
      if (isPlaying) updateActivePattern(kickGrid, next, hihatGrid, bpm);
    } else {
      const next = [...hihatGrid];
      next[index] = !next[index];
      setHihatGrid(next);
      if (isPlaying) updateActivePattern(kickGrid, snareGrid, next, bpm);
    }
  };

  const updateActivePattern = (k: boolean[], s: boolean[], h: boolean[], tempo: number) => {
    drumMachine.setCustomPattern(
      beatTitle,
      {
        kick: k,
        snare: s,
        hihat: h,
        bass: [130.81, 0, 130.81, 0, 155.56, 0, 155.56, 0, 174.61, 0, 174.61, 0, 196.00, 0, 220.00, 0],
      },
      tempo
    );
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      drumMachine.stop();
      setIsPlaying(false);
    } else {
      updateActivePattern(kickGrid, snareGrid, hihatGrid, bpm);
      drumMachine.start();
      setIsPlaying(true);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_PATTERNS[0]) => {
    setKickGrid([...preset.kick]);
    setSnareGrid([...preset.snare]);
    setHihatGrid([...preset.hihat]);
    setBpm(preset.bpm);
    synthEngine.playCoinSound();
    if (isPlaying) {
      updateActivePattern(preset.kick, preset.snare, preset.hihat, preset.bpm);
    }
  };

  const handleSave = () => {
    if (!beatTitle.trim()) return;
    const newBeat: CustomBeat = {
      id: `beat_${Date.now()}`,
      title: beatTitle.trim(),
      locationId: location ? location.id : undefined,
      locationName: location ? location.name : 'Cosmic Earth Orbit',
      bpm,
      date: new Date().toLocaleDateString(),
      pattern: {
        kick: [...kickGrid],
        snare: [...snareGrid],
        hihat: [...hihatGrid],
        bass: [130.81, 0, 130.81, 0, 155.56, 0, 155.56, 0, 174.61, 0, 174.61, 0, 196.00, 0, 220.00, 0],
      },
    };

    onSaveBeat(newBeat);
    synthEngine.playCheerSound();
    setSaveToast(`Beat "${newBeat.title}" saved!`);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleLoadBeat = (beat: CustomBeat) => {
    setBeatTitle(beat.title);
    setBpm(beat.bpm);
    setKickGrid([...beat.pattern.kick]);
    setSnareGrid([...beat.pattern.snare]);
    setHihatGrid([...beat.pattern.hihat]);
    synthEngine.playCoinSound();
    setActiveTab('maker');
    if (isPlaying) {
      updateActivePattern(beat.pattern.kick, beat.pattern.snare, beat.pattern.hihat, beat.bpm);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] text-slate-100 p-6 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
          <div className="flex items-center gap-3">
            <span className="text-xl">🥁</span>
            <div>
              <h2 className="font-arcade text-sm md:text-base text-emerald-300">
                BEAT MAKER & RHYTHM VAULT
              </h2>
              <div className="text-xs font-mono text-slate-400">
                {location ? `Tailored for ${location.name} (${location.country})` : 'Global Cosmic Beats'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveToast && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 border border-emerald-500">
                {saveToast}
              </span>
            )}
            <button
              onClick={() => {
                if (isPlaying) drumMachine.stop();
                onClose();
              }}
              className="text-xs font-mono text-slate-400 hover:text-white"
            >
              [CLOSE]
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 my-3 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('maker')}
            className={`px-4 py-1.5 text-xs font-arcade transition-colors ${
              activeTab === 'maker'
                ? 'bg-emerald-500 text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BEAT SEQUENCER
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-1.5 text-xs font-arcade transition-colors ${
              activeTab === 'library'
                ? 'bg-emerald-500 text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SAVED BEATS VAULT ({savedBeats.length})
          </button>
        </div>

        {/* Tab 1: Sequencer */}
        {activeTab === 'maker' && (
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {/* Genre & Sound Kit Selector Strip */}
            <div className="p-3 bg-slate-950 border border-emerald-500/30 rounded flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-arcade text-emerald-400">SOUND KIT:</span>
                <select
                  value={selectedGenreId}
                  onChange={(e) => {
                    const gid = e.target.value as GenreId;
                    setSelectedGenreId(gid);
                    const genre = GENRE_CATALOG.find((g) => g.id === gid);
                    if (genre && genre.kits.length > 0) {
                      const firstKit = genre.kits[0];
                      setSelectedKitId(firstKit.id);
                      proSoundEngine.setKit(firstKit);
                      setBpm(firstKit.bpmDefault);
                      if (isPlaying) drumMachine.setBpm(firstKit.bpmDefault);
                    }
                  }}
                  className="bg-slate-900 border border-slate-700 px-2.5 py-1 text-xs font-mono text-cyan-300 focus:outline-none rounded"
                >
                  {GENRE_CATALOG.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.icon} {g.name} ({g.kits.length} kits)
                    </option>
                  ))}
                </select>

                <select
                  value={selectedKitId}
                  onChange={(e) => {
                    const kid = e.target.value;
                    setSelectedKitId(kid);
                    const genre = GENRE_CATALOG.find((g) => g.id === selectedGenreId);
                    const kit = genre?.kits.find((k) => k.id === kid);
                    if (kit) {
                      proSoundEngine.setKit(kit);
                      setBpm(kit.bpmDefault);
                      if (isPlaying) drumMachine.setBpm(kit.bpmDefault);
                    }
                  }}
                  className="bg-slate-900 border border-slate-700 px-2.5 py-1 text-xs font-mono text-yellow-300 focus:outline-none rounded font-bold"
                >
                  {(GENRE_CATALOG.find((g) => g.id === selectedGenreId)?.kits || []).map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name} ({k.bpmDefault} BPM)
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                Active Sound Kit: <strong className="text-yellow-300">{proSoundEngine.currentKit.name}</strong>
              </div>
            </div>

            {/* Title & BPM Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-slate-950 border border-slate-800 rounded">
              <div className="sm:col-span-8">
                <label className="text-[10px] font-arcade text-emerald-400 block mb-1">
                  BEAT TITLE & LOCATION
                </label>
                <input
                  type="text"
                  value={beatTitle}
                  onChange={(e) => setBeatTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="sm:col-span-4">
                <div className="flex justify-between text-[10px] font-arcade text-slate-400 mb-1">
                  <span>TEMPO (BPM)</span>
                  <span className="text-yellow-400 font-bold">{bpm}</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="180"
                  value={bpm}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setBpm(val);
                    if (isPlaying) drumMachine.setBpm(val);
                  }}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            {/* 16-Step Drum Grid */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-3">
              <div className="text-xs font-arcade text-slate-300">16-STEP RHYTHM MATRIX</div>

              {/* Kick Row */}
              <div className="flex items-center gap-2">
                <div className="w-20 text-[11px] font-arcade text-yellow-300">KICK</div>
                <div className="grid grid-cols-16 gap-1 flex-1">
                  {kickGrid.map((active, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleStep('kick', i)}
                      className={`h-9 rounded-xs border transition-all text-[9px] font-mono ${
                        active
                          ? 'bg-yellow-400 border-yellow-200 text-black font-bold shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                          : i % 4 === 0
                          ? 'bg-slate-800 border-slate-700 text-slate-500'
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Snare Row */}
              <div className="flex items-center gap-2">
                <div className="w-20 text-[11px] font-arcade text-rose-300">SNARE</div>
                <div className="grid grid-cols-16 gap-1 flex-1">
                  {snareGrid.map((active, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleStep('snare', i)}
                      className={`h-9 rounded-xs border transition-all text-[9px] font-mono ${
                        active
                          ? 'bg-rose-500 border-rose-300 text-white font-bold shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                          : i % 4 === 0
                          ? 'bg-slate-800 border-slate-700 text-slate-500'
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hihat Row */}
              <div className="flex items-center gap-2">
                <div className="w-20 text-[11px] font-arcade text-cyan-300">HI-HAT</div>
                <div className="grid grid-cols-16 gap-1 flex-1">
                  {hihatGrid.map((active, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleStep('hihat', i)}
                      className={`h-9 rounded-xs border transition-all text-[9px] font-mono ${
                        active
                          ? 'bg-cyan-400 border-cyan-200 text-black font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : i % 4 === 0
                          ? 'bg-slate-800 border-slate-700 text-slate-500'
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-arcade text-slate-400">LOAD PRESET:</span>
              {PRESET_PATTERNS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleTogglePlay}
                className={`flex-1 py-3 font-arcade text-xs border font-bold transition-all ${
                  isPlaying
                    ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black border-emerald-300'
                }`}
              >
                {isPlaying ? '■ STOP BEAT AUDITION' : '▶ TEST PLAY BEAT'}
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="py-3 px-6 bg-cyan-500 hover:bg-cyan-400 text-black font-arcade text-xs font-bold border border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
              >
                💾 SAVE BEAT TO VAULT
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Saved Beats Library */}
        {activeTab === 'library' && (
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {savedBeats.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800">
                NO SAVED BEATS YET. CREATE AND SAVE YOUR OWN CUSTOM BEATS FOR CONCERT VENUES!
              </div>
            ) : (
              savedBeats.map((beat) => (
                <div
                  key={beat.id}
                  className="p-3 bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono rounded"
                >
                  <div>
                    <div className="font-arcade text-xs text-white">{beat.title}</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      📍 {beat.locationName} · {beat.bpm} BPM · {beat.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoadBeat(beat)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-arcade text-[10px] font-bold"
                    >
                      LOAD & PLAY
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteBeat(beat.id)}
                      className="px-2 py-1.5 text-slate-400 hover:text-rose-400 text-xs"
                      title="Delete Beat"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
