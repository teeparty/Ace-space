import React, { useState, useEffect } from 'react';
import { KeyMapping, ScaleMode, RecordedTrack, CustomBeat, MusicPlaybackKeybindings } from '../../types/game';
import { CharacterConfig } from '../../types/character';
import { musicEngine, MUSIC_CATALOG, PlaybackState } from '../../audio/musicPlayer';
import { synthEngine } from '../../audio/retroSynth';
import { proSoundEngine } from '../../audio/proSoundEngine';
import { InteractiveKeyboard } from '../piano/InteractiveKeyboard';
import { PixelAvatar } from '../character/PixelAvatar';
import { BeatMakerModal } from '../common/BeatMakerModal';
import { SoundKitBrowser } from './SoundKitBrowser';

interface MusicStudioProps {
  character: CharacterConfig;
  keyMappings: KeyMapping[];
  activeNotes: Set<string>;
  scaleMode: ScaleMode;
  onScaleModeChange: (scale: ScaleMode) => void;
  labelMode: 'keys' | 'notes' | 'solfege';
  onNoteDown: (m: KeyMapping) => void;
  onNoteUp: (m: KeyMapping) => void;
  recordedTracks: RecordedTrack[];
  onSaveTrack: (track: RecordedTrack) => void;
  onDeleteTrack: (trackId: string) => void;
  musicKeybindings: MusicPlaybackKeybindings;
  savedBeats?: CustomBeat[];
  onSaveBeat?: (beat: CustomBeat) => void;
  onDeleteBeat?: (beatId: string) => void;
}

export const MusicStudio: React.FC<MusicStudioProps> = ({
  character,
  keyMappings,
  activeNotes,
  scaleMode,
  onScaleModeChange,
  labelMode,
  onNoteDown,
  onNoteUp,
  recordedTracks,
  onSaveTrack,
  onDeleteTrack,
  musicKeybindings,
  savedBeats = [],
  onSaveBeat = () => {},
  onDeleteBeat = () => {},
}) => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(musicEngine.getState());
  const [studioSection, setStudioSection] = useState<'sound_kits' | 'jukebox' | 'recorder'>('sound_kits');
  const [activePlayerSubTab, setActivePlayerSubTab] = useState<'player' | 'mixer'>('player');
  const [showBeatMaker, setShowBeatMaker] = useState(false);

  // Live recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number>(0);
  const [recordedEvents, setRecordedEvents] = useState<Array<{ note: string; time: number; duration: number }>>([]);
  const [trackTitleInput, setTrackTitleInput] = useState<string>('Cosmic Session #1');

  // Subscribe to real-time playback state updates from musicEngine
  useEffect(() => {
    const unsubscribe = musicEngine.subscribe((state) => {
      setPlaybackState(state);
    });
    return () => unsubscribe();
  }, []);

  // Music controls
  const handleTogglePlay = () => {
    musicEngine.togglePlay();
  };

  const handleSelectTrack = (trackId: string) => {
    musicEngine.selectTrack(trackId);
    synthEngine.playCoinSound();
  };

  const handleNextTrack = () => {
    musicEngine.nextTrack();
    synthEngine.playCoinSound();
  };

  const handlePrevTrack = () => {
    musicEngine.prevTrack();
    synthEngine.playCoinSound();
  };

  const handleBpmChange = (bpm: number) => {
    musicEngine.setBpm(bpm);
  };

  const handleSpeedChange = (speed: number) => {
    musicEngine.setSpeed(speed);
  };

  const handleVolumeChange = (vol: number) => {
    musicEngine.setVolume(vol);
  };

  const handleToggleLoop = () => {
    musicEngine.toggleLoop();
  };

  const handleToggleMuteChannel = (ch: 'lead' | 'harmony' | 'bass' | 'drums') => {
    musicEngine.toggleChannelMute(ch);
  };

  // Recording controls
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingStartTime(Date.now());
    setRecordedEvents([]);
    synthEngine.playCoinSound();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    const duration = Math.max(1, Math.round((Date.now() - recordingStartTime) / 1000));
    if (recordedEvents.length > 0) {
      const newTrack: RecordedTrack = {
        id: `track_${Date.now()}`,
        title: trackTitleInput.trim() || `Cosmic Jam #${recordedTracks.length + 1}`,
        locationName: proSoundEngine.currentMelodicSound.name,
        date: new Date().toLocaleDateString(),
        duration,
        notesCount: recordedEvents.length,
        events: [...recordedEvents],
      };
      onSaveTrack(newTrack);
      synthEngine.playCheerSound();
      setTrackTitleInput(`Cosmic Session #${recordedTracks.length + 2}`);
    }
  };

  useEffect(() => {
    if (!isRecording) return;
    activeNotes.forEach((note) => {
      const time = Date.now() - recordingStartTime;
      setRecordedEvents((prev) => [...prev, { note, time, duration: 250 }]);
    });
  }, [activeNotes, isRecording, recordingStartTime]);

  const handleReplayTrack = (track: RecordedTrack) => {
    synthEngine.playCoinSound();
    track.events.forEach((ev) => {
      setTimeout(() => {
        const mapping = keyMappings.find((m) => m.note === ev.note);
        if (mapping) {
          onNoteDown(mapping);
          setTimeout(() => onNoteUp(mapping), ev.duration);
        }
      }, ev.time);
    });
  };

  // Helper key display name
  const getKeyDisplay = (key: string) => {
    if (key === ' ') return 'SPACE';
    return key.toUpperCase();
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* Top Banner & Performer Deck */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-slate-900 border-2 border-pink-500/40 rounded-xl gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <PixelAvatar
            config={character}
            size={70}
            isPlaying={playbackState.isPlaying || activeNotes.size > 0}
            activeNote={playbackState.activeNotes.lead || Array.from(activeNotes)[0]}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎵</span>
              <h1 className="font-arcade text-base sm:text-lg text-pink-300">
                PRODUCER MUSIC STUDIO
              </h1>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Active Sound Kit: <span className="text-yellow-300 font-bold">{proSoundEngine.currentKit.name}</span> · Melodic Voice: <span className="text-pink-400 font-bold">{proSoundEngine.currentMelodicSound.name}</span>
            </p>
          </div>
        </div>

        {/* Global Controls & Studio View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBeatMaker(true)}
            className="px-3.5 py-2 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 text-xs font-arcade transition-all rounded shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          >
            🥁 BEAT MAKER ({savedBeats.length})
          </button>

          <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setStudioSection('sound_kits')}
              className={`px-3 py-1.5 text-xs font-arcade rounded transition-all ${
                studioSection === 'sound_kits'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎛️ SOUND KITS (24 GENRES)
            </button>
            <button
              type="button"
              onClick={() => setStudioSection('jukebox')}
              className={`px-3 py-1.5 text-xs font-arcade rounded transition-all ${
                studioSection === 'jukebox'
                  ? 'bg-pink-500 text-black font-bold shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📼 CASSETTE JUKEBOX
            </button>
            <button
              type="button"
              onClick={() => setStudioSection('recorder')}
              className={`px-3 py-1.5 text-xs font-arcade rounded transition-all ${
                studioSection === 'recorder'
                  ? 'bg-amber-500 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎙️ RECORDER ({recordedTracks.length})
            </button>
          </div>
        </div>
      </div>

      {/* Beat Maker Modal */}
      <BeatMakerModal
        isOpen={showBeatMaker}
        onClose={() => setShowBeatMaker(false)}
        savedBeats={savedBeats}
        onSaveBeat={onSaveBeat}
        onDeleteBeat={onDeleteBeat}
      />

      {/* SECTION 1: PRODUCER SOUND KIT BROWSER & MPC PADS */}
      {studioSection === 'sound_kits' && (
        <SoundKitBrowser />
      )}

      {/* SECTION 2: RETRO JUKEBOX CASSETTES */}
      {studioSection === 'jukebox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Track Selector Jukebox */}
          <div className="lg:col-span-5 bg-slate-900 border-2 border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">📼</span>
                  <h3 className="font-arcade text-xs text-cyan-300">SELECTABLE MUSIC TRACKS</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">5 RETRO TAPES</span>
              </div>

              <div className="space-y-2">
                {MUSIC_CATALOG.map((track, idx) => {
                  const isCurrent = track.id === playbackState.currentTrackId;
                  const trackNum = idx + 1;
                  const directKey = musicKeybindings[`triggerTrack${trackNum}` as keyof MusicPlaybackKeybindings] || `${trackNum}`;

                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => handleSelectTrack(track.id)}
                      className={`w-full p-3 text-left border transition-all flex items-center justify-between rounded ${
                        isCurrent
                          ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded flex items-center justify-center font-arcade text-xs border ${
                            isCurrent
                              ? 'bg-cyan-500 text-black border-cyan-300 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                          title={`Press keyboard key '${directKey}' to trigger!`}
                        >
                          {trackNum}
                        </div>

                        <div>
                          <div className="font-arcade text-xs text-white flex items-center gap-2">
                            <span>{track.title}</span>
                            {isCurrent && playbackState.isPlaying && (
                              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {track.genre} · {track.defaultBpm} BPM · Key [{directKey}]
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-xs font-mono font-bold ${isCurrent && playbackState.isPlaying ? 'text-pink-400' : 'text-slate-500'}`}>
                          {isCurrent && playbackState.isPlaying ? 'PLAYING ▶' : 'SELECT'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Prompt */}
            <div className="mt-4 p-3 bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 rounded">
              💡 <strong className="text-yellow-300">Keyboard Tip:</strong> Press numbers{' '}
              <strong className="text-cyan-300">[1, 2, 3, 4, 5]</strong> anytime to instantly switch tracks!
            </div>
          </div>

          {/* Right Column: Active Player Console & Adjustment Deck */}
          <div className="lg:col-span-7 bg-slate-900 border-2 border-cyan-500/30 rounded-xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              {/* Header: Currently Selected Track */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-arcade text-pink-400 uppercase">NOW TUNED IN</span>
                  <h2 className="text-lg sm:text-xl font-arcade text-white tracking-wide">
                    {playbackState.currentTrack.title}
                  </h2>
                  <div className="text-xs font-mono text-cyan-300">
                    {playbackState.currentTrack.subtitle} · {playbackState.currentTrack.genre}
                  </div>
                </div>

                <div className="flex gap-1 bg-slate-950 p-1 border border-slate-800 rounded">
                  <button
                    type="button"
                    onClick={() => setActivePlayerSubTab('player')}
                    className={`px-3 py-1 text-xs font-arcade transition-colors ${
                      activePlayerSubTab === 'player'
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    PLAYER
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePlayerSubTab('mixer')}
                    className={`px-3 py-1 text-xs font-arcade transition-colors ${
                      activePlayerSubTab === 'mixer'
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    MIXER
                  </button>
                </div>
              </div>

              {/* Player Sub-Tab */}
              {activePlayerSubTab === 'player' && (
                <div className="space-y-4">
                  {/* 32-Step Visualizer */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                      <span>STEP TIMELINE (32-STEP CYCLE)</span>
                      <span className="text-yellow-400 font-bold">
                        STEP {playbackState.currentStep + 1} / 32
                      </span>
                    </div>

                    <div className="grid grid-cols-16 sm:grid-cols-32 gap-1 mb-3">
                      {Array.from({ length: 32 }).map((_, stepIdx) => (
                        <div
                          key={stepIdx}
                          className={`h-7 rounded-xs border transition-colors ${
                            playbackState.currentStep === stepIdx && playbackState.isPlaying
                              ? 'bg-cyan-400 border-white scale-110 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                              : stepIdx % 8 === 0
                              ? 'bg-slate-700 border-slate-600'
                              : stepIdx % 4 === 0
                              ? 'bg-slate-800 border-slate-700'
                              : 'bg-slate-900 border-slate-800'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                        <span className="text-[10px] text-slate-500 block">LEAD VOICE</span>
                        <span className="text-pink-400 font-bold">
                          {playbackState.activeNotes.lead || '—'}
                        </span>
                      </div>
                      <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                        <span className="text-[10px] text-slate-500 block">HARMONY</span>
                        <span className="text-yellow-400 font-bold">
                          {playbackState.activeNotes.harmony || '—'}
                        </span>
                      </div>
                      <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                        <span className="text-[10px] text-slate-500 block">BASSLINE</span>
                        <span className="text-cyan-400 font-bold">
                          {playbackState.activeNotes.bass || '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Transport Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePrevTrack}
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-arcade transition-colors rounded"
                    >
                      ◀ PREV [{musicKeybindings.prevTrackKey}]
                    </button>

                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className={`flex-1 py-3 px-6 text-sm font-arcade font-bold border transition-all rounded ${
                        playbackState.isPlaying
                          ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.6)] animate-pulse'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-black border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                      }`}
                    >
                      {playbackState.isPlaying
                        ? `■ PAUSE [${getKeyDisplay(musicKeybindings.playPauseKey)}]`
                        : `▶ PLAY MUSIC [${getKeyDisplay(musicKeybindings.playPauseKey)}]`}
                    </button>

                    <button
                      type="button"
                      onClick={handleNextTrack}
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-arcade transition-colors rounded"
                    >
                      NEXT [{musicKeybindings.nextTrackKey}] ▶
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleLoop}
                      className={`px-3 py-3 text-xs font-arcade border transition-colors rounded ${
                        playbackState.loop
                          ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                          : 'bg-slate-800 border-slate-700 text-slate-500'
                      }`}
                    >
                      LOOP [{musicKeybindings.toggleLoopKey.toUpperCase()}]
                    </button>
                  </div>

                  {/* Tempo & Speed */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-400">TEMPO ADJUST (BPM)</span>
                        <span className="text-yellow-400 font-bold">{playbackState.bpm} BPM</span>
                      </div>
                      <input
                        type="range"
                        min="70"
                        max="180"
                        value={playbackState.bpm}
                        onChange={(e) => handleBpmChange(parseInt(e.target.value))}
                        className="w-full accent-yellow-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="text-xs font-mono text-slate-400 mb-1">PLAYBACK SPEED</div>
                      <div className="grid grid-cols-4 gap-1">
                        {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                          <button
                            key={spd}
                            type="button"
                            onClick={() => handleSpeedChange(spd)}
                            className={`py-1 text-xs font-mono border rounded transition-colors ${
                              playbackState.speed === spd
                                ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold'
                                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mixer Sub-Tab */}
              {activePlayerSubTab === 'mixer' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'lead', name: 'Lead Melody', icon: '🎹', desc: 'Main square lead' },
                      { id: 'harmony', name: 'Harmony Arp', icon: '✨', desc: 'Chime accompaniment' },
                      { id: 'bass', name: 'Bass Line', icon: '🎸', desc: 'Sub synth bass' },
                      { id: 'drums', name: '8-Bit Drums', icon: '🥁', desc: 'Kick, snare, hi-hat' },
                    ].map((ch) => {
                      const isMuted = playbackState.channelMute[ch.id as keyof typeof playbackState.channelMute];
                      return (
                        <div
                          key={ch.id}
                          className={`p-3 border rounded-lg flex flex-col justify-between ${
                            isMuted
                              ? 'border-rose-900/60 bg-rose-950/20 opacity-60'
                              : 'border-slate-800 bg-slate-950'
                          }`}
                        >
                          <div>
                            <div className="text-xl mb-1">{ch.icon}</div>
                            <div className="font-arcade text-xs text-white">{ch.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">{ch.desc}</div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleMuteChannel(ch.id as 'lead' | 'harmony' | 'bass' | 'drums')}
                            className={`mt-3 py-1.5 text-xs font-arcade border rounded transition-colors ${
                              isMuted
                                ? 'bg-rose-900/60 border-rose-500 text-rose-200'
                                : 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            }`}
                          >
                            {isMuted ? 'MUTED' : 'ACTIVE'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400">MASTER MUSIC VOLUME</span>
                      <span className="text-white font-bold">{Math.round(playbackState.volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={playbackState.volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* SECTION 3: CASSETTE RECORDER */}
      {studioSection === 'recorder' && (
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎙️</span>
              <h3 className="font-arcade text-sm text-amber-300">LIVE CASSETTE PERFORMANCE RECORDER</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Record live piano & drum solos directly over your beats
            </span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
            <label className="text-xs font-arcade text-amber-400 block">SESSION TITLE</label>
            <input
              type="text"
              value={trackTitleInput}
              onChange={(e) => setTrackTitleInput(e.target.value)}
              placeholder="Track Title..."
              className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500 rounded"
            />

            <div className="flex gap-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-arcade text-xs flex items-center justify-center gap-2 rounded transition-all shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  START LIVE RECORDING
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-arcade text-xs flex items-center justify-center gap-2 rounded animate-pulse"
                >
                  <span>■ SAVE RECORDING ({recordedEvents.length} NOTES)</span>
                </button>
              )}
            </div>
          </div>

          {/* Saved Tracks List */}
          <div className="space-y-2">
            <span className="text-xs font-arcade text-slate-400 block">SAVED CASSETTES:</span>
            {recordedTracks.length === 0 ? (
              <div className="p-4 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded">
                NO CASSETTES RECORDED YET. RECORD YOUR LIVE JAMS OVER ANY GENRE KIT!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recordedTracks.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="font-bold text-white truncate max-w-[200px]">{tr.title}</div>
                      <div className="text-[10px] text-slate-400">
                        {tr.duration}s · {tr.notesCount} notes · {tr.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReplayTrack(tr)}
                        className="px-3 py-1 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700 text-[10px] font-arcade rounded"
                      >
                        ▶ PLAY
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTrack(tr.id)}
                        className="px-2 py-1 text-slate-400 hover:text-rose-400 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Center Stage: Interactive Piano Keyboard for Live Chromatic Jamming */}
      <div className="bg-slate-900 border-2 border-cyan-500/30 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            <span className="font-arcade text-xs text-white">LIVE CHROMATIC KEYBOARD JAM STATION</span>
            <span className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 text-[10px] font-mono border border-pink-500/40">
              VOICE: {proSoundEngine.currentMelodicSound.name.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 border border-slate-800 rounded">
              <span className="text-[11px] font-mono text-slate-400">SCALE:</span>
              <select
                value={scaleMode}
                onChange={(e) => onScaleModeChange(e.target.value as ScaleMode)}
                className="bg-transparent text-xs font-arcade text-yellow-300 focus:outline-none cursor-pointer"
              >
                <option value="chromatic">CHROMATIC</option>
                <option value="major">MAJOR</option>
                <option value="minor">MINOR</option>
                <option value="pentatonic">PENTATONIC</option>
                <option value="blues">BLUES</option>
                <option value="japanese">JAPANESE</option>
                <option value="byzantine">BYZANTINE</option>
              </select>
            </div>
            
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Play using keyboard keys (A-S-D-F...) or click keys
            </span>
          </div>
        </div>

        {/* Keyboard Component */}
        <InteractiveKeyboard
          mappings={keyMappings}
          activeNotes={activeNotes}
          scaleMode={scaleMode}
          labelMode={labelMode}
          onNoteDown={onNoteDown}
          onNoteUp={onNoteUp}
          compact={false}
        />
      </div>

    </div>
  );
};
