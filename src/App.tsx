import React, { useState, useEffect, useCallback } from 'react';
import { 
  GameMenu, 
  KeyMapping, 
  ScaleMode, 
  RecordedTrack, 
  CustomBeat,
  MusicPlaybackKeybindings, 
  DEFAULT_MUSIC_KEYBINDINGS 
} from './types/game';
import { CharacterConfig, DEFAULT_CHARACTER } from './types/character';
import { DEFAULT_KEY_MAPPINGS } from './data/defaultKeyboard';
import { DEFAULT_SAVED_BEATS } from './data/defaultBeats';
import { synthEngine } from './audio/retroSynth';
import { proSoundEngine } from './audio/proSoundEngine';
import { musicEngine, MUSIC_CATALOG, PlaybackState } from './audio/musicPlayer';
import { TopBar } from './components/navigation/TopBar';
import { CharacterCreatorModal } from './components/character/CharacterCreatorModal';
import { EarthVoyage } from './components/earth/EarthVoyage';
import { MusicStudio } from './components/music/MusicStudio';
import { KeyboardSettings } from './components/settings/KeyboardSettings';

export default function App() {
  // Navigation menu state: 'music' | 'earth' | 'keyboard_settings'
  const [currentMenu, setCurrentMenu] = useState<GameMenu>('earth');

  // Character customization state
  const [character, setCharacter] = useState<CharacterConfig>(() => {
    try {
      const saved = localStorage.getItem('ace_space_character');
      return saved ? JSON.parse(saved) : DEFAULT_CHARACTER;
    } catch {
      return DEFAULT_CHARACTER;
    }
  });
  const [isCharacterCreatorOpen, setIsCharacterCreatorOpen] = useState(false);

  // Musical note keymappings
  const [keyMappings, setKeyMappings] = useState<KeyMapping[]>(() => {
    try {
      const saved = localStorage.getItem('ace_space_keymappings');
      return saved ? JSON.parse(saved) : DEFAULT_KEY_MAPPINGS;
    } catch {
      return DEFAULT_KEY_MAPPINGS;
    }
  });

  // Music playback trigger keybindings
  const [musicKeybindings, setMusicKeybindings] = useState<MusicPlaybackKeybindings>(() => {
    try {
      const saved = localStorage.getItem('ace_space_music_keybindings');
      return saved ? JSON.parse(saved) : DEFAULT_MUSIC_KEYBINDINGS;
    } catch {
      return DEFAULT_MUSIC_KEYBINDINGS;
    }
  });

  // Musical & Audio state
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [scaleMode, setScaleMode] = useState<ScaleMode>('chromatic');
  const [labelMode, setLabelMode] = useState<'keys' | 'notes' | 'solfege'>('keys');
  const [sustainHold, setSustainHold] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCrtEnabled, setIsCrtEnabled] = useState<boolean>(true);

  // Music Player live state
  const [playbackState, setPlaybackState] = useState<PlaybackState>(musicEngine.getState());
  const [hudFeedback, setHudFeedback] = useState<string | null>(null);

  // Game progress: Locations where concerts were performed
  const [visitedLocations, setVisitedLocations] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('ace_space_visited');
      return saved ? new Set(JSON.parse(saved)) : new Set(['tokyo']);
    } catch {
      return new Set(['tokyo']);
    }
  });

  // Recorded tracks
  const [recordedTracks, setRecordedTracks] = useState<RecordedTrack[]>(() => {
    try {
      const saved = localStorage.getItem('ace_space_tracks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Saved Custom Beats
  const [savedBeats, setSavedBeats] = useState<CustomBeat[]>(() => {
    try {
      const saved = localStorage.getItem('ace_space_saved_beats');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_SAVED_BEATS;
    } catch {
      return DEFAULT_SAVED_BEATS;
    }
  });

  // Subscribe to music player state
  useEffect(() => {
    const unsub = musicEngine.subscribe((state) => {
      setPlaybackState(state);
    });
    return () => unsub();
  }, []);

  // Save character changes
  const handleSaveCharacter = (newConfig: CharacterConfig) => {
    setCharacter(newConfig);
    try {
      localStorage.setItem('ace_space_character', JSON.stringify(newConfig));
    } catch {
      // ignore
    }
  };

  // Save keymappings changes
  const handleUpdateMappings = useCallback((newMappings: KeyMapping[]) => {
    setKeyMappings(newMappings);
    try {
      localStorage.setItem('ace_space_keymappings', JSON.stringify(newMappings));
    } catch {
      // ignore
    }
  }, []);

  // Save music playback trigger keybindings
  const handleUpdateMusicKeybindings = useCallback((newBindings: MusicPlaybackKeybindings) => {
    setMusicKeybindings(newBindings);
    try {
      localStorage.setItem('ace_space_music_keybindings', JSON.stringify(newBindings));
    } catch {
      // ignore
    }
  }, []);

  // Save visited concert locations
  const handleMarkVisited = useCallback((locId: string) => {
    setTimeout(() => {
      setVisitedLocations((prev) => {
        if (prev.has(locId)) return prev;
        const next = new Set(prev);
        next.add(locId);
        try {
          localStorage.setItem('ace_space_visited', JSON.stringify(Array.from(next)));
        } catch {
          // ignore
        }
        return next;
      });
    }, 0);
  }, []);

  // Track recording storage
  const handleSaveTrack = useCallback((track: RecordedTrack) => {
    setTimeout(() => {
      setRecordedTracks((prev) => {
        const updated = [track, ...prev];
        try {
          localStorage.setItem('ace_space_tracks', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }, 0);
  }, []);

  const handleDeleteTrack = useCallback((id: string) => {
    setTimeout(() => {
      setRecordedTracks((prev) => {
        const updated = prev.filter((t) => t.id !== id);
        try {
          localStorage.setItem('ace_space_tracks', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }, 0);
  }, []);

  // Beat storage
  const handleSaveBeat = useCallback((beat: CustomBeat) => {
    setTimeout(() => {
      setSavedBeats((prev) => {
        const updated = [beat, ...prev];
        try {
          localStorage.setItem('ace_space_saved_beats', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }, 0);
  }, []);

  const handleDeleteBeat = useCallback((id: string) => {
    setTimeout(() => {
      setSavedBeats((prev) => {
        const updated = prev.filter((b) => b.id !== id);
        try {
          localStorage.setItem('ace_space_saved_beats', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }, 0);
  }, []);

  // Note Down Handler
  const handleNoteDown = useCallback(
    (mapping: KeyMapping) => {
      setActiveNotes((prev) => {
        const next = new Set(prev);
        next.add(mapping.note);
        return next;
      });
      synthEngine.playNote(mapping.note, mapping.frequency);
      proSoundEngine.playMelodicNote(mapping.note, mapping.frequency);
    },
    []
  );

  // Note Up Handler
  const handleNoteUp = useCallback(
    (mapping: KeyMapping) => {
      if (!sustainHold) {
        setActiveNotes((prev) => {
          const next = new Set(prev);
          next.delete(mapping.note);
          return next;
        });
        synthEngine.stopNote(mapping.note);
        proSoundEngine.stopMelodicNote(mapping.note);
      }
    },
    [sustainHold]
  );

  const showHudToast = (text: string) => {
    setHudFeedback(text);
    setTimeout(() => {
      setHudFeedback((current) => (current === text ? null : current));
    }, 1800);
  };

  // Global physical computer keyboard listener for BOTH Music Playback Triggers AND Synthesizer Notes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      if (e.repeat) return;

      const rawKey = e.key;
      const lowerKey = e.key.toLowerCase();

      // 1. Check Music Playback Triggers (Customizable)
      // Play/Pause Key
      const isPlayPause =
        musicKeybindings.playPauseKey === ' '
          ? rawKey === ' '
          : lowerKey === musicKeybindings.playPauseKey.toLowerCase();

      if (isPlayPause) {
        e.preventDefault();
        const willPlay = musicEngine.togglePlay();
        showHudToast(willPlay ? `MUSIC: PLAYING [${musicEngine.getState().currentTrack.title}]` : 'MUSIC: PAUSED');
        return;
      }

      // Next Track Key
      if (lowerKey === musicKeybindings.nextTrackKey.toLowerCase()) {
        e.preventDefault();
        musicEngine.nextTrack();
        showHudToast(`NEXT TRACK: [${musicEngine.getState().currentTrack.title}]`);
        return;
      }

      // Prev Track Key
      if (lowerKey === musicKeybindings.prevTrackKey.toLowerCase()) {
        e.preventDefault();
        musicEngine.prevTrack();
        showHudToast(`PREV TRACK: [${musicEngine.getState().currentTrack.title}]`);
        return;
      }

      // Toggle Loop Key
      if (lowerKey === musicKeybindings.toggleLoopKey.toLowerCase()) {
        e.preventDefault();
        musicEngine.toggleLoop();
        showHudToast(musicEngine.getState().loop ? 'LOOP: ENABLED' : 'LOOP: DISABLED');
        return;
      }

      // Toggle Drums Key
      if (lowerKey === musicKeybindings.toggleDrumsKey.toLowerCase()) {
        e.preventDefault();
        musicEngine.toggleChannelMute('drums');
        showHudToast(musicEngine.getState().channelMute.drums ? 'DRUMS: MUTED' : 'DRUMS: ACTIVE');
        return;
      }

      // Direct Track Triggers (1 to 5)
      for (let i = 1; i <= 5; i++) {
        const triggerKey = musicKeybindings[`triggerTrack${i}` as keyof MusicPlaybackKeybindings];
        if (triggerKey && lowerKey === triggerKey.toLowerCase()) {
          const track = MUSIC_CATALOG[i - 1];
          if (track) {
            e.preventDefault();
            musicEngine.selectTrack(track.id);
            if (!musicEngine.getState().isPlaying) {
              musicEngine.play();
            }
            showHudToast(`PLAYING TRACK ${i}: [${track.title}]`);
            return;
          }
        }
      }

      // 2. Check Musical Note Keymappings (A, S, D, F, etc.)
      const noteMatch = keyMappings.find((m) => m.keyboardKey.toLowerCase() === lowerKey);
      if (noteMatch) {
        e.preventDefault();
        handleNoteDown(noteMatch);
        return;
      }

      // 3. Check Drum Pad Trigger Keymappings (Q, W, E, R, T, A, S, D, F, G, Z, X, C, V, B, 1, 2)
      if (proSoundEngine.currentKit) {
        const drumMatch = proSoundEngine.currentKit.samples.find(
          (s) => s.keyShortcut.toUpperCase() === rawKey.toUpperCase()
        );
        if (drumMatch) {
          e.preventDefault();
          proSoundEngine.triggerDrumSample(drumMatch, 1.0);
          showHudToast(`DRUM PAD: [${drumMatch.name}]`);
          return;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const lowerKey = e.key.toLowerCase();
      const noteMatch = keyMappings.find((m) => m.keyboardKey.toLowerCase() === lowerKey);
      if (noteMatch) {
        e.preventDefault();
        handleNoteUp(noteMatch);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyMappings, musicKeybindings, handleNoteDown, handleNoteUp]);

  // Helper key display name
  const getKeyDisplay = (key: string) => {
    if (key === ' ') return 'SPACE';
    return key.toUpperCase();
  };

  return (
    <div className={`min-h-screen bg-[#060814] text-slate-100 flex flex-col font-pixel ${isCrtEnabled ? 'crt-overlay' : ''}`}>
      
      {/* Top Bar adhering to Top Bar Contract */}
      <TopBar
        currentMenu={currentMenu}
        onSelectMenu={(menu) => setCurrentMenu(menu)}
        character={character}
        onOpenCharacterCreator={() => setIsCharacterCreatorOpen(true)}
        isMuted={isMuted}
        onToggleMute={() => {
          const muted = synthEngine.toggleMute();
          setIsMuted(muted);
        }}
        isCrtEnabled={isCrtEnabled}
        onToggleCrt={() => setIsCrtEnabled(!isCrtEnabled)}
      />

      {/* Floating HUD Feedback Toast when user triggers music via keyboard */}
      {hudFeedback && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in duration-150">
          <div className="bg-slate-900/95 border-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.7)] px-4 py-2 text-pink-300 font-arcade text-xs tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-ping" />
            <span>{hudFeedback}</span>
          </div>
        </div>
      )}

      {/* Persistent Mini Music Player Bar */}
      <div className="w-full bg-slate-950/90 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              musicEngine.togglePlay();
            }}
            className={`px-3 py-1 text-xs font-arcade border rounded-xs transition-all ${
              playbackState.isPlaying
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black border-cyan-400'
            }`}
            title={`Trigger music playback (Key: [${getKeyDisplay(musicKeybindings.playPauseKey)}])`}
          >
            {playbackState.isPlaying
              ? `■ PAUSE [${getKeyDisplay(musicKeybindings.playPauseKey)}]`
              : `▶ PLAY [${getKeyDisplay(musicKeybindings.playPauseKey)}]`}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[10px] hidden sm:inline">MUSIC:</span>
            <span className="text-white font-arcade text-[11px] truncate max-w-[200px] sm:max-w-xs">
              {playbackState.currentTrack.title}
            </span>
            <span className="text-[10px] text-pink-400 hidden md:inline">
              ({playbackState.currentTrack.genre})
            </span>
          </div>
        </div>

        {/* Global Keyboard Shortcut Hints */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="hidden lg:inline text-slate-500">KEYBOARD SHORTCUTS:</span>
          <span className="bg-slate-900 px-2 py-0.5 border border-slate-800 text-yellow-300">
            [{getKeyDisplay(musicKeybindings.playPauseKey)}] Play/Pause
          </span>
          <span className="bg-slate-900 px-2 py-0.5 border border-slate-800 text-cyan-300 hidden sm:inline">
            [{musicKeybindings.prevTrackKey.toUpperCase()}/{musicKeybindings.nextTrackKey.toUpperCase()}] Tracks
          </span>
          <span className="bg-slate-900 px-2 py-0.5 border border-slate-800 text-pink-300 hidden md:inline">
            [1-5] Direct Select
          </span>
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col">
        {currentMenu === 'earth' && (
          <EarthVoyage
            character={character}
            keyMappings={keyMappings}
            activeNotes={activeNotes}
            scaleMode={scaleMode}
            labelMode={labelMode}
            onNoteDown={handleNoteDown}
            onNoteUp={handleNoteUp}
            visitedLocations={visitedLocations}
            onMarkVisited={handleMarkVisited}
            recordedTracks={recordedTracks}
            onSaveTrack={handleSaveTrack}
            onDeleteTrack={handleDeleteTrack}
            savedBeats={savedBeats}
            onSaveBeat={handleSaveBeat}
            onDeleteBeat={handleDeleteBeat}
          />
        )}

        {currentMenu === 'music' && (
          <MusicStudio
            character={character}
            keyMappings={keyMappings}
            activeNotes={activeNotes}
            scaleMode={scaleMode}
            onScaleModeChange={setScaleMode}
            labelMode={labelMode}
            onNoteDown={handleNoteDown}
            onNoteUp={handleNoteUp}
            recordedTracks={recordedTracks}
            onSaveTrack={handleSaveTrack}
            onDeleteTrack={handleDeleteTrack}
            musicKeybindings={musicKeybindings}
            savedBeats={savedBeats}
            onSaveBeat={handleSaveBeat}
            onDeleteBeat={handleDeleteBeat}
          />
        )}

        {currentMenu === 'keyboard_settings' && (
          <KeyboardSettings
            mappings={keyMappings}
            onUpdateMappings={handleUpdateMappings}
            musicKeybindings={musicKeybindings}
            onUpdateMusicKeybindings={handleUpdateMusicKeybindings}
            scaleMode={scaleMode}
            onScaleModeChange={setScaleMode}
            labelMode={labelMode}
            onLabelModeChange={setLabelMode}
            sustainHold={sustainHold}
            onSustainHoldChange={setSustainHold}
            volume={volume}
            onVolumeChange={setVolume}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-4 border-t border-slate-900 bg-slate-950/80 text-center text-xs font-mono text-slate-500">
        ACE SPACE · RETRO COSMIC SOUND EXPEDITION ACROSS PLANET EARTH · 2026
      </footer>

      {/* Character Customization Modal */}
      <CharacterCreatorModal
        isOpen={isCharacterCreatorOpen}
        onClose={() => setIsCharacterCreatorOpen(false)}
        config={character}
        onSave={handleSaveCharacter}
      />
    </div>
  );
}
