import React, { useState, useEffect } from 'react';
import { 
  GENRE_CATALOG, 
  MELODIC_SOUNDS, 
  GenreId, 
  SoundKit, 
  DrumSampleSpec, 
  MelodicSoundSpec, 
  MelodicCategory 
} from '../../audio/soundKitLibrary';
import { proSoundEngine } from '../../audio/proSoundEngine';
import { synthEngine } from '../../audio/retroSynth';

interface SoundKitBrowserProps {
  onSelectKit?: (kit: SoundKit) => void;
  onSelectMelodicSound?: (sound: MelodicSoundSpec) => void;
  className?: string;
  enableKeyboardShortcuts?: boolean;
}

const MELODIC_CATEGORIES: Array<{ id: MelodicCategory; label: string; icon: string; count: number }> = [
  { id: 'piano', label: 'Grand Piano', icon: '🎹', count: 3 },
  { id: 'electric_piano', label: 'Electric Piano', icon: '✨', count: 3 },
  { id: 'synths', label: 'Polysynths', icon: '🎛️', count: 2 },
  { id: 'pads', label: 'Lush Pads', icon: '🌌', count: 3 },
  { id: 'strings', label: 'Strings', icon: '🎻', count: 2 },
  { id: 'brass', label: 'Brass Stabs', icon: '🎺', count: 2 },
  { id: 'bells', label: 'Crystal Bells', icon: '🔔', count: 2 },
  { id: 'plucks', label: 'Plucks', icon: '🎸', count: 3 },
  { id: 'guitars', label: 'Guitars', icon: '🪕', count: 2 },
  { id: 'bass', label: 'Bass / Reese', icon: '🔊', count: 3 },
  { id: '808_bass', label: '808 Bass', icon: '⚡', count: 3 },
  { id: 'leads', label: 'Leads', icon: '🚀', count: 2 },
  { id: 'chords', label: 'House Chords', icon: '🎼', count: 2 },
  { id: 'vocal_chops', label: 'Vocal Chops', icon: '🗣️', count: 3 },
  { id: 'atmospheric_textures', label: 'Atmo Textures', icon: '🌧️', count: 2 },
];

export const SoundKitBrowser: React.FC<SoundKitBrowserProps> = ({
  onSelectKit = () => {},
  onSelectMelodicSound = () => {},
  className = '',
  enableKeyboardShortcuts = true,
}) => {
  const [selectedGenreId, setSelectedGenreId] = useState<GenreId>('trap');
  const [activeKit, setActiveKit] = useState<SoundKit>(
    () => GENRE_CATALOG.find((g) => g.id === 'trap')?.kits[0] || GENRE_CATALOG[0].kits[0]
  );
  const [activeTab, setActiveTab] = useState<'drums' | 'melodic'>('drums');
  const [selectedMelodicCategory, setSelectedMelodicCategory] = useState<MelodicCategory>('piano');
  const [activeMelodic, setActiveMelodic] = useState<MelodicSoundSpec>(MELODIC_SOUNDS[0]);
  const [hitPadId, setHitPadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentGenre = GENRE_CATALOG.find((g) => g.id === selectedGenreId) || GENRE_CATALOG[0];

  const handleSelectGenre = (genreId: GenreId) => {
    setSelectedGenreId(genreId);
    const genre = GENRE_CATALOG.find((g) => g.id === genreId);
    if (genre && genre.kits.length > 0) {
      setActiveKit(genre.kits[0]);
      proSoundEngine.setKit(genre.kits[0]);
      onSelectKit(genre.kits[0]);
      synthEngine.playCoinSound();
    }
  };

  const handleSelectKit = (kit: SoundKit) => {
    setActiveKit(kit);
    proSoundEngine.setKit(kit);
    onSelectKit(kit);
    synthEngine.playCoinSound();
  };

  const handleTriggerDrum = (sample: DrumSampleSpec) => {
    proSoundEngine.triggerDrumSample(sample, 1.0);
    setHitPadId(sample.id);
    setTimeout(() => {
      setHitPadId((id) => (id === sample.id ? null : id));
    }, 140);
  };

  const handleSelectMelodic = (sound: MelodicSoundSpec) => {
    setActiveMelodic(sound);
    proSoundEngine.setMelodicSound(sound);
    onSelectMelodicSound(sound);
    synthEngine.playCoinSound();

    // Audition preview chords/notes
    proSoundEngine.playMelodicNote('preview_1', 261.63, sound); // C4
    setTimeout(() => proSoundEngine.stopMelodicNote('preview_1'), 300);

    setTimeout(() => {
      proSoundEngine.playMelodicNote('preview_2', 329.63, sound); // E4
      setTimeout(() => proSoundEngine.stopMelodicNote('preview_2'), 300);
    }, 120);

    setTimeout(() => {
      proSoundEngine.playMelodicNote('preview_3', 392.00, sound); // G4
      setTimeout(() => proSoundEngine.stopMelodicNote('preview_3'), 450);
    }, 240);
  };

  // Keyboard shortcut listener for drum pad triggers (Q, W, E, R, T, A, S, D, F, G, Z, X, C, V, B, 1, 2)
  useEffect(() => {
    if (!enableKeyboardShortcuts || activeTab !== 'drums') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if (e.repeat) return;

      const pressed = e.key.toUpperCase();
      const match = activeKit.samples.find((s) => s.keyShortcut.toUpperCase() === pressed);
      if (match) {
        e.preventDefault();
        handleTriggerDrum(match);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcuts, activeTab, activeKit]);

  // Filtered genres
  const filteredGenres = GENRE_CATALOG.filter((g) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return g.name.toLowerCase().includes(q) || g.vibe.toLowerCase().includes(q);
  });

  const filteredMelodicSounds = MELODIC_SOUNDS.filter(
    (s) => s.category === selectedMelodicCategory
  );

  return (
    <div className={`p-4 sm:p-5 bg-slate-950 border-2 border-cyan-500/40 rounded-xl shadow-2xl flex flex-col gap-5 ${className}`}>
      
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center text-xl shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            🎛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-arcade text-sm sm:text-base text-cyan-300">
                PRODUCER SAMPLE LIBRARY
              </h2>
              <span className="px-2 py-0.5 rounded bg-pink-950/80 border border-pink-500 text-[10px] font-mono text-pink-300 font-bold">
                24 GENRES · 60+ KITS · 15 MELODIC SUITES
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Trap, Hip-Hop, Drill, Afrobeats, House & more. Every kit loaded with multiple kick, snare & hat variations.
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('drums')}
            className={`px-4 py-2 text-xs font-arcade rounded transition-all flex items-center gap-2 ${
              activeTab === 'drums'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🥁</span>
            <span>DRUM KITS ({GENRE_CATALOG.length} GENRES)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('melodic')}
            className={`px-4 py-2 text-xs font-arcade rounded transition-all flex items-center gap-2 ${
              activeTab === 'melodic'
                ? 'bg-pink-500 text-black font-bold shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🎹</span>
            <span>MELODIC BEATMAKER ({MELODIC_CATEGORIES.length} TYPES)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DRUM KITS BY GENRE */}
      {activeTab === 'drums' && (
        <div className="flex flex-col gap-4">
          
          {/* Genre selector strip with search */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-arcade text-cyan-400 flex items-center gap-2">
                <span>⚡</span>
                <span>SELECT PRODUCTION GENRE / STYLE:</span>
              </span>
              <input
                type="text"
                placeholder="Search genres (e.g. Trap, Drill, House...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-700 px-3 py-1 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 rounded"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-900/90 border border-slate-800 rounded-lg">
              {filteredGenres.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSelectGenre(g.id)}
                  className={`px-3 py-1.5 text-xs font-mono border rounded transition-all whitespace-nowrap flex items-center gap-2 ${
                    selectedGenreId === g.id
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)] scale-102'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm">{g.icon}</span>
                  <span>{g.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-black/60 text-[9px] text-yellow-400 font-mono">
                    {g.kits.length} {g.kits.length === 1 ? 'kit' : 'kits'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Kits Available for Selected Genre */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-arcade text-yellow-300 flex items-center gap-1.5">
                <span>{currentGenre.icon}</span>
                <span>{currentGenre.name.toUpperCase()} KITS:</span>
              </span>
              
              <div className="flex flex-wrap gap-2">
                {currentGenre.kits.map((kit) => (
                  <button
                    key={kit.id}
                    type="button"
                    onClick={() => handleSelectKit(kit)}
                    className={`px-3.5 py-2 text-xs font-arcade border rounded transition-all flex items-center gap-2 ${
                      activeKit.id === kit.id
                        ? 'border-yellow-400 bg-yellow-950/70 text-yellow-200 font-bold shadow-[0_0_12px_rgba(250,204,21,0.4)]'
                        : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span>●</span>
                    <span>{kit.name}</span>
                    <span className="text-[10px] font-mono opacity-70">({kit.bpmDefault} BPM)</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-mono text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
              <span className="text-slate-500">VIBE:</span> <span className="text-pink-400 font-semibold">{currentGenre.vibe}</span> · <span className="text-cyan-400">{currentGenre.bpmRange}</span>
            </div>
          </div>

          {/* 17-Pad MPC Finger-Drumming Grid */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="text-cyan-300 font-bold font-arcade text-[11px]">
                MPC 17-PAD DRUM MATRIX — {activeKit.name.toUpperCase()}
              </span>
              <span>
                Audition or press keys on your keyboard ({' '}
                <strong className="text-yellow-300">Q-W-E-R-T / A-S-D-F-G / Z-X-C-V-B / 1-2</strong> )
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {activeKit.samples.map((sample) => {
                const isHit = hitPadId === sample.id;

                let colorStyles = 'border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-600';
                if (sample.type === 'kick') {
                  colorStyles = 'border-amber-500/50 bg-amber-950/20 text-amber-200 hover:border-amber-400';
                } else if (sample.type === 'sub_808') {
                  colorStyles = 'border-red-500/60 bg-red-950/30 text-red-200 hover:border-red-400 font-bold';
                } else if (sample.type === 'snare') {
                  colorStyles = 'border-rose-500/50 bg-rose-950/20 text-rose-200 hover:border-rose-400';
                } else if (sample.type === 'clap' || sample.type === 'rim') {
                  colorStyles = 'border-fuchsia-500/50 bg-fuchsia-950/20 text-fuchsia-200 hover:border-fuchsia-400';
                } else if (sample.type === 'hihat_closed' || sample.type === 'hihat_open') {
                  colorStyles = 'border-cyan-500/50 bg-cyan-950/20 text-cyan-200 hover:border-cyan-400';
                } else if (sample.type === 'crash' || sample.type === 'ride') {
                  colorStyles = 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200 hover:border-emerald-400';
                } else if (sample.type === 'perc' || sample.type === 'perc_loop') {
                  colorStyles = 'border-violet-500/50 bg-violet-950/20 text-violet-200 hover:border-violet-400';
                } else if (sample.type === 'fill' || sample.type === 'fx_transition') {
                  colorStyles = 'border-yellow-500/50 bg-yellow-950/20 text-yellow-200 hover:border-yellow-400';
                }

                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleTriggerDrum(sample)}
                    className={`p-3 text-left border-2 rounded-lg transition-all flex flex-col justify-between h-24 select-none relative overflow-hidden ${
                      isHit
                        ? 'border-white bg-cyan-400 text-black scale-95 shadow-[0_0_20px_rgba(6,182,212,0.9)] z-10'
                        : colorStyles
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono opacity-80 uppercase tracking-wider font-semibold">
                        {sample.variationLabel || sample.type.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/60 font-arcade text-[10px] border border-white/20 text-yellow-300">
                        [{sample.keyShortcut}]
                      </span>
                    </div>

                    <div>
                      <div className="font-arcade text-xs truncate font-bold text-white drop-shadow">
                        {sample.name.replace(activeKit.name, '').trim() || sample.name}
                      </div>
                      <div className="text-[9px] font-mono opacity-70 truncate mt-0.5">
                        {sample.description}
                      </div>
                    </div>

                    {isHit && (
                      <div className="absolute inset-0 bg-white/30 animate-ping pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Info & Audition Bar */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Active Kit: <strong className="text-yellow-300">{activeKit.name}</strong> ({activeKit.samples.length} sound variations)
              </span>
            </div>
            <div className="text-slate-400">
              💡 Press keys on your physical keyboard to trigger pads dynamically in real time!
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MELODIC INSTRUMENTS SUITE (15 Categories) */}
      {activeTab === 'melodic' && (
        <div className="flex flex-col gap-4">
          
          {/* Categories Grid */}
          <div className="flex flex-wrap gap-1.5 p-2 bg-slate-900/90 border border-slate-800 rounded-lg">
            {MELODIC_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedMelodicCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-mono border rounded transition-all flex items-center gap-2 ${
                  selectedMelodicCategory === cat.id
                    ? 'border-pink-400 bg-pink-950 text-pink-200 font-bold shadow-[0_0_10px_rgba(236,72,153,0.4)]'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-[9px] text-slate-500">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Sound Cards for selected category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredMelodicSounds.map((sound) => {
              const isCurrent = activeMelodic.id === sound.id;

              return (
                <div
                  key={sound.id}
                  className={`p-4 border-2 rounded-xl transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'border-pink-500 bg-pink-950/40 shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        {sound.genreVibe}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {sound.waveform}
                      </span>
                    </div>

                    <h4 className="font-arcade text-sm text-white mb-1.5">{sound.name}</h4>
                    <p className="text-xs font-mono text-slate-300 leading-relaxed mb-4">
                      {sound.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectMelodic(sound)}
                      className={`w-full py-2 font-arcade text-xs border rounded transition-all ${
                        isCurrent
                          ? 'bg-pink-500 text-black border-pink-400 font-bold shadow-[0_0_12px_rgba(236,72,153,0.6)]'
                          : 'bg-slate-800 text-pink-300 border-slate-700 hover:border-pink-400 hover:bg-slate-700'
                      }`}
                    >
                      {isCurrent ? '● ACTIVE CHROMATIC VOICE' : 'SELECT & AUDITION'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex flex-wrap items-center justify-between rounded-lg gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
              <span>
                Active Melodic Voice: <strong className="text-pink-300">{activeMelodic.name}</strong> ({activeMelodic.genreVibe})
              </span>
            </div>
            <span className="text-cyan-300 font-bold">
              PLAY CHROMATICALLY ON THE PIANO KEYBOARD OR RECORD YOUR PERFORMANCE
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
