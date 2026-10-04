import React, { useState, useEffect } from 'react';
import { KeyMapping, ScaleMode, MusicPlaybackKeybindings, DEFAULT_MUSIC_KEYBINDINGS } from '../../types/game';
import { synthEngine } from '../../audio/retroSynth';
import { proSoundEngine } from '../../audio/proSoundEngine';
import { musicEngine, MUSIC_CATALOG } from '../../audio/musicPlayer';
import { DEFAULT_KEY_MAPPINGS } from '../../data/defaultKeyboard';

interface KeyboardSettingsProps {
  mappings: KeyMapping[];
  onUpdateMappings: (mappings: KeyMapping[]) => void;
  musicKeybindings: MusicPlaybackKeybindings;
  onUpdateMusicKeybindings: (bindings: MusicPlaybackKeybindings) => void;
  scaleMode: ScaleMode;
  onScaleModeChange: (scale: ScaleMode) => void;
  labelMode: 'keys' | 'notes' | 'solfege';
  onLabelModeChange: (mode: 'keys' | 'notes' | 'solfege') => void;
  sustainHold: boolean;
  onSustainHoldChange: (hold: boolean) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
}

export const KeyboardSettings: React.FC<KeyboardSettingsProps> = ({
  mappings,
  onUpdateMappings,
  musicKeybindings,
  onUpdateMusicKeybindings,
  scaleMode,
  onScaleModeChange,
  labelMode,
  onLabelModeChange,
  sustainHold,
  onSustainHoldChange,
  volume,
  onVolumeChange,
}) => {
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editingMusicAction, setEditingMusicAction] = useState<keyof MusicPlaybackKeybindings | null>(null);
  const [octaveShift, setOctaveShift] = useState<number>(0);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  // Global key listener for remapping either a Note Key or a Music Control Key
  useEffect(() => {
    if (!editingNote && !editingMusicAction) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const pressedKey = e.key.toLowerCase();

      // Check if ESC to cancel
      if (e.key === 'Escape') {
        setEditingNote(null);
        setEditingMusicAction(null);
        return;
      }

      // Remap Music Playback Action
      if (editingMusicAction) {
        const actionLabel = editingMusicAction.replace('Key', '').replace('triggerTrack', 'Track ');
        const keyVal = e.key === ' ' ? ' ' : pressedKey;

        const updatedBindings = {
          ...musicKeybindings,
          [editingMusicAction]: keyVal,
        };
        onUpdateMusicKeybindings(updatedBindings);
        synthEngine.playCoinSound();
        const displayKey = keyVal === ' ' ? 'SPACE' : keyVal.toUpperCase();
        setSaveToast(`Key [${displayKey}] bound to ${actionLabel.toUpperCase()}!`);
        setTimeout(() => setSaveToast(null), 2500);
        setEditingMusicAction(null);
        return;
      }

      // Remap Note Key
      if (editingNote) {
        const updated = mappings.map((m) => {
          if (m.note === editingNote) {
            return { ...m, keyboardKey: pressedKey };
          }
          if (m.keyboardKey === pressedKey && m.note !== editingNote) {
            return { ...m, keyboardKey: '' };
          }
          return m;
        });

        onUpdateMappings(updated);
        synthEngine.playCoinSound();
        setSaveToast(`Key [${pressedKey.toUpperCase()}] bound to ${editingNote}!`);
        setTimeout(() => setSaveToast(null), 2500);
        setEditingNote(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingNote, editingMusicAction, mappings, musicKeybindings, onUpdateMappings, onUpdateMusicKeybindings]);

  // Listener to highlight live keyboard inputs in the test area
  useEffect(() => {
    const handleKeyTester = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      const k = e.key === ' ' ? 'SPACE' : e.key.toUpperCase();
      setLastKeyPressed(k);
    };

    window.addEventListener('keydown', handleKeyTester);
    return () => window.removeEventListener('keydown', handleKeyTester);
  }, []);

  const handleOctaveShift = (delta: number) => {
    const newShift = Math.max(-2, Math.min(2, octaveShift + delta));
    setOctaveShift(newShift);

    const mult = Math.pow(2, newShift);
    const updated = mappings.map((m) => {
      const orig = DEFAULT_KEY_MAPPINGS.find((d) => d.note === m.note);
      const baseFreq = orig ? orig.frequency : m.frequency;
      return {
        ...m,
        frequency: baseFreq * mult,
      };
    });
    onUpdateMappings(updated);
    synthEngine.playCoinSound();
  };

  const handleResetDefaults = () => {
    onUpdateMappings([...DEFAULT_KEY_MAPPINGS]);
    onUpdateMusicKeybindings({ ...DEFAULT_MUSIC_KEYBINDINGS });
    setOctaveShift(0);
    onScaleModeChange('chromatic');
    onLabelModeChange('keys');
    onSustainHoldChange(false);
    synthEngine.setVolume(0.7);
    onVolumeChange(0.7);
    synthEngine.playCoinSound();
    setSaveToast('Reset all keyboard & music keybindings to defaults!');
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Helper key display name
  const getKeyDisplay = (key: string) => {
    if (key === ' ') return 'SPACE';
    return key.toUpperCase();
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* Settings Top Header */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-slate-900 border-2 border-yellow-500/40 rounded-lg gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚙️</span>
          <div>
            <h1 className="font-arcade text-base sm:text-lg text-yellow-300">
              KEYBOARD & MUSIC INPUT SETTINGS
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Customize physical keys to trigger music playback and play synthesizer notes.
            </p>
          </div>
        </div>

        {/* Status Toast & Global Reset Button */}
        <div className="flex items-center gap-3">
          {saveToast && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/90 px-3 py-1.5 border border-emerald-500 shadow-sm animate-in fade-in">
              {saveToast}
            </span>
          )}
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-arcade text-slate-300 border border-slate-700 transition-colors"
          >
            RESET ALL DEFAULTS
          </button>
        </div>
      </div>

      {/* SECTION 1: CUSTOMIZABLE MUSIC PLAYBACK KEYBOARD INPUTS */}
      <div className="bg-slate-900 border-2 border-pink-500/40 rounded-lg p-5 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🎵</span>
              <h2 className="font-arcade text-xs sm:text-sm text-pink-300">
                MUSIC PLAYBACK KEYBOARD CONTROLS (CUSTOMIZABLE)
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Click any action below and press any key on your keyboard to assign it as the music trigger!
            </p>
          </div>

          {editingMusicAction && (
            <div className="px-3 py-1.5 bg-pink-950/80 border-2 border-pink-400 text-pink-300 text-xs font-arcade animate-pulse">
              PRESS ANY KEY FOR [{editingMusicAction.toUpperCase()}] · ESC TO CANCEL
            </div>
          )}
        </div>

        {/* Grid of Music Playback Keybindings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* 1. Play / Pause Music */}
          <button
            type="button"
            onClick={() => {
              setEditingNote(null);
              setEditingMusicAction('playPauseKey');
            }}
            className={`p-3 text-left border rounded transition-all flex flex-col justify-between ${
              editingMusicAction === 'playPauseKey'
                ? 'border-pink-400 bg-pink-950/80 ring-2 ring-pink-400 scale-105'
                : 'border-slate-800 bg-slate-950 hover:border-pink-500'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-400 uppercase">PLAY / PAUSE MUSIC</div>
            <div className="my-2 font-arcade text-base text-yellow-300 font-bold">
              [{getKeyDisplay(musicKeybindings.playPauseKey)}]
            </div>
            <div className="text-[10px] font-mono text-cyan-400">CLICK TO REBIND KEY</div>
          </button>

          {/* 2. Next Track */}
          <button
            type="button"
            onClick={() => {
              setEditingNote(null);
              setEditingMusicAction('nextTrackKey');
            }}
            className={`p-3 text-left border rounded transition-all flex flex-col justify-between ${
              editingMusicAction === 'nextTrackKey'
                ? 'border-pink-400 bg-pink-950/80 ring-2 ring-pink-400 scale-105'
                : 'border-slate-800 bg-slate-950 hover:border-pink-500'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-400 uppercase">NEXT MUSIC TRACK</div>
            <div className="my-2 font-arcade text-base text-yellow-300 font-bold">
              [{getKeyDisplay(musicKeybindings.nextTrackKey)}]
            </div>
            <div className="text-[10px] font-mono text-cyan-400">CLICK TO REBIND KEY</div>
          </button>

          {/* 3. Previous Track */}
          <button
            type="button"
            onClick={() => {
              setEditingNote(null);
              setEditingMusicAction('prevTrackKey');
            }}
            className={`p-3 text-left border rounded transition-all flex flex-col justify-between ${
              editingMusicAction === 'prevTrackKey'
                ? 'border-pink-400 bg-pink-950/80 ring-2 ring-pink-400 scale-105'
                : 'border-slate-800 bg-slate-950 hover:border-pink-500'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-400 uppercase">PREVIOUS TRACK</div>
            <div className="my-2 font-arcade text-base text-yellow-300 font-bold">
              [{getKeyDisplay(musicKeybindings.prevTrackKey)}]
            </div>
            <div className="text-[10px] font-mono text-cyan-400">CLICK TO REBIND KEY</div>
          </button>

          {/* 4. Toggle Loop */}
          <button
            type="button"
            onClick={() => {
              setEditingNote(null);
              setEditingMusicAction('toggleLoopKey');
            }}
            className={`p-3 text-left border rounded transition-all flex flex-col justify-between ${
              editingMusicAction === 'toggleLoopKey'
                ? 'border-pink-400 bg-pink-950/80 ring-2 ring-pink-400 scale-105'
                : 'border-slate-800 bg-slate-950 hover:border-pink-500'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-400 uppercase">TOGGLE TRACK LOOP</div>
            <div className="my-2 font-arcade text-base text-yellow-300 font-bold">
              [{getKeyDisplay(musicKeybindings.toggleLoopKey)}]
            </div>
            <div className="text-[10px] font-mono text-cyan-400">CLICK TO REBIND KEY</div>
          </button>

          {/* 5. Toggle Beat */}
          <button
            type="button"
            onClick={() => {
              setEditingNote(null);
              setEditingMusicAction('toggleDrumsKey');
            }}
            className={`p-3 text-left border rounded transition-all flex flex-col justify-between ${
              editingMusicAction === 'toggleDrumsKey'
                ? 'border-pink-400 bg-pink-950/80 ring-2 ring-pink-400 scale-105'
                : 'border-slate-800 bg-slate-950 hover:border-pink-500'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-400 uppercase">TOGGLE DRUM BEAT</div>
            <div className="my-2 font-arcade text-base text-yellow-300 font-bold">
              [{getKeyDisplay(musicKeybindings.toggleDrumsKey)}]
            </div>
            <div className="text-[10px] font-mono text-cyan-400">CLICK TO REBIND KEY</div>
          </button>

        </div>

        {/* Direct Track Select Keys (1 to 5) */}
        <div className="pt-3 border-t border-slate-800">
          <div className="text-xs font-arcade text-slate-400 mb-2">
            DIRECT TRACK SELECTOR SHORTCUT KEYS (1-5):
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {MUSIC_CATALOG.map((track, i) => {
              const trackNum = i + 1;
              const fieldName = `triggerTrack${trackNum}` as keyof MusicPlaybackKeybindings;
              const currentKey = musicKeybindings[fieldName] || `${trackNum}`;

              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    setEditingNote(null);
                    setEditingMusicAction(fieldName);
                  }}
                  className={`p-2.5 text-left border rounded transition-colors ${
                    editingMusicAction === fieldName
                      ? 'border-yellow-400 bg-yellow-950/80'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">Track {trackNum}</span>
                    <span className="text-xs font-arcade text-yellow-300 font-bold">
                      [{getKeyDisplay(currentKey)}]
                    </span>
                  </div>
                  <div className="font-arcade text-[10px] text-white truncate mt-1">
                    {track.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Test Strip */}
        <div className="p-3 bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 rounded">
          <div className="flex items-center gap-2">
            <span className="text-xs font-arcade text-cyan-300">LIVE KEY TESTER:</span>
            <span className="text-xs font-mono text-slate-400">
              Press any key on your keyboard to test:
            </span>
            <span className="px-2 py-0.5 bg-slate-800 text-yellow-400 font-arcade text-xs border border-slate-700">
              {lastKeyPressed || 'NONE'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              musicEngine.togglePlay();
            }}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-arcade text-xs transition-colors"
          >
            TEST PLAY MUSIC ▶
          </button>
        </div>
      </div>

      {/* SECTION 2: CUSTOMIZABLE MUSICAL NOTE KEYBINDINGS */}
      <div className="bg-slate-900 border-2 border-cyan-500/30 rounded-lg p-5 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🎹</span>
              <h2 className="font-arcade text-xs sm:text-sm text-cyan-300">
                PIANO NOTE KEYBINDING MATRIX
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Click any piano note below, then press your desired physical computer keyboard key.
            </p>
          </div>

          {editingNote && (
            <div className="px-3 py-1.5 bg-yellow-400/20 border-2 border-yellow-400 text-yellow-300 text-xs font-arcade animate-pulse">
              PRESS ANY KEY FOR NOTE [{editingNote}] · ESC TO CANCEL
            </div>
          )}
        </div>

        {/* Visual Key Mapping Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2">
          {mappings.map((m) => {
            const isEditing = editingNote === m.note;

            return (
              <button
                key={m.note}
                type="button"
                onClick={() => {
                  setEditingMusicAction(null);
                  setEditingNote(m.note);
                }}
                className={`p-2.5 text-center border transition-all flex flex-col justify-between items-center rounded ${
                  isEditing
                    ? 'border-yellow-400 bg-yellow-950/60 ring-2 ring-yellow-400 scale-105'
                    : m.isBlack
                    ? 'border-slate-800 bg-slate-950 text-white hover:border-cyan-500'
                    : 'border-slate-700 bg-slate-800 text-slate-100 hover:border-cyan-400'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  {m.note}
                </div>
                <div
                  className={`my-1 text-sm font-arcade px-2 py-0.5 rounded ${
                    m.keyboardKey
                      ? 'text-cyan-300 bg-slate-900 border border-slate-700'
                      : 'text-slate-600 bg-black/40'
                  }`}
                >
                  {m.keyboardKey ? m.keyboardKey.toUpperCase() : 'NONE'}
                </div>
                <div className="text-[9px] font-mono text-slate-500">
                  {Math.round(m.frequency)} Hz
                </div>
              </button>
            );
          })}
        </div>

        {/* Octave Shift & Tuning Controls */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-arcade text-slate-400">OCTAVE SHIFT:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleOctaveShift(-1)}
                disabled={octaveShift <= -2}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-white font-arcade text-xs"
              >
                -1
              </button>
              <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 font-bold">
                {octaveShift > 0 ? `+${octaveShift}` : octaveShift}
              </span>
              <button
                type="button"
                onClick={() => handleOctaveShift(1)}
                disabled={octaveShift >= 2}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-white font-arcade text-xs"
              >
                +1
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-arcade text-slate-400">KEY LABELS:</span>
            <div className="flex gap-1">
              {[
                { id: 'keys', label: 'Keyboard Keys' },
                { id: 'notes', label: 'Note Names' },
                { id: 'solfege', label: 'Do-Re-Mi' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onLabelModeChange(mode.id as 'keys' | 'notes' | 'solfege')}
                  className={`px-3 py-1 text-xs font-mono border transition-colors ${
                    labelMode === mode.id
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: PRODUCER DRUM PAD MATRIX SHORTCUTS (17 PADS) */}
      <div className="bg-slate-900 border-2 border-emerald-500/30 rounded-lg p-5 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🥁</span>
              <h2 className="font-arcade text-xs sm:text-sm text-emerald-300">
                PRODUCER DRUM PAD KEYBOARD SHORTCUTS ({proSoundEngine.currentKit.name.toUpperCase()})
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Finger-drumming shortcut keys for all 18 sound variations. Click any pad to audition live!
            </p>
          </div>

          <div className="text-xs font-mono text-yellow-300 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded">
            ACTIVE SOUND KIT: <span className="font-bold text-white">{proSoundEngine.currentKit.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {proSoundEngine.currentKit.samples.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                proSoundEngine.triggerDrumSample(s, 1.0);
                synthEngine.playCoinSound();
              }}
              className="p-3 text-left border border-slate-800 bg-slate-950 hover:border-emerald-500 hover:bg-slate-900 rounded transition-all flex flex-col justify-between h-20"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  {s.variationLabel || s.type.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500 font-arcade text-xs text-emerald-300">
                  [{s.keyShortcut}]
                </span>
              </div>
              <div className="font-arcade text-xs text-white truncate">
                {s.name.replace(proSoundEngine.currentKit.name, '').trim() || s.name}
              </div>
            </button>
          ))}
        </div>

        <div className="text-[11px] font-mono text-slate-400 p-2.5 bg-slate-950 border border-slate-800 rounded flex items-center justify-between">
          <span>
            💡 <strong>Finger Drumming Tip:</strong> You can play drums anytime on your keyboard using keys ( <strong>Q, W, E, R, T, A, S, D, F, G, Z, X, C, V, B, 1, 2</strong> )!
          </span>
          <span className="text-emerald-400 font-bold">ALL 18 VARIATIONS READY</span>
        </div>
      </div>

    </div>
  );
};
