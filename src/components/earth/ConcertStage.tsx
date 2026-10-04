import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { EarthLocation, KeyMapping, ScaleMode, RecordedTrack, CustomBeat } from '../../types/game';
import { CharacterConfig } from '../../types/character';
import { PixelAvatar } from '../character/PixelAvatar';
import { InteractiveKeyboard } from '../piano/InteractiveKeyboard';
import { synthEngine } from '../../audio/retroSynth';
import { drumMachine } from '../../audio/drumMachine';
import { proSoundEngine } from '../../audio/proSoundEngine';
import { GENRE_CATALOG, GenreId } from '../../audio/soundKitLibrary';
import { musicEngine, PlaybackState } from '../../audio/musicPlayer';
import { getGoogleEarthUrl, searchAnywhereOnEarth, generateUnlimitedRandomLocation } from '../../data/earthLocations';
import { BeatMakerModal } from '../common/BeatMakerModal';
import { ConcertRecordingModal } from '../common/ConcertRecordingModal';
import { SavedBeatsRack } from './SavedBeatsRack';

interface ConcertStageProps {
  location: EarthLocation;
  character: CharacterConfig;
  keyMappings: KeyMapping[];
  activeNotes: Set<string>;
  scaleMode: ScaleMode;
  labelMode: 'keys' | 'notes' | 'solfege';
  onNoteDown: (m: KeyMapping) => void;
  onNoteUp: (m: KeyMapping) => void;
  onReturnToGlobe: () => void;
  onConcertCompleted: (locId: string) => void;
  onWarpToLocation?: (loc: EarthLocation) => void;
  recordedTracks: RecordedTrack[];
  onSaveTrack: (track: RecordedTrack) => void;
  onDeleteTrack: (trackId: string) => void;
  savedBeats: CustomBeat[];
  onSaveBeat: (beat: CustomBeat) => void;
  onDeleteBeat: (beatId: string) => void;
}

export const ConcertStage: React.FC<ConcertStageProps> = ({
  location,
  character,
  keyMappings,
  activeNotes,
  scaleMode,
  labelMode,
  onNoteDown,
  onNoteUp,
  onReturnToGlobe,
  onConcertCompleted,
  onWarpToLocation,
  recordedTracks,
  onSaveTrack,
  onDeleteTrack,
  savedBeats,
  onSaveBeat,
  onDeleteBeat,
}) => {
  const [hypeMeter, setHypeMeter] = useState(30);
  const [notesPlayedCount, setNotesPlayedCount] = useState(0);
  const [isDrumPlaying, setIsDrumPlaying] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>(musicEngine.getState());
  const [showEarthModal, setShowEarthModal] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [showVenueSearchModal, setShowVenueSearchModal] = useState(false);
  const [venueSearchQuery, setVenueSearchQuery] = useState('');
  const [venueSearchResults, setVenueSearchResults] = useState<EarthLocation[]>([]);
  const [isSearchingVenues, setIsSearchingVenues] = useState(false);
  const [stageToast, setStageToast] = useState<string | null>(null);

  const handleStageRandomWarp = () => {
    synthEngine.playCoinSound();
    const randomLoc = generateUnlimitedRandomLocation(location.id);
    if (onWarpToLocation) {
      onWarpToLocation(randomLoc);
    }
  };

  const handleStageSearch = async (term: string) => {
    const q = term.trim();
    if (!q) {
      setVenueSearchResults([]);
      return;
    }
    setIsSearchingVenues(true);
    try {
      const results = await searchAnywhereOnEarth(q);
      setVenueSearchResults(results);
    } catch {
      setVenueSearchResults([]);
    } finally {
      setIsSearchingVenues(false);
    }
  };

  // Live recording state
  const [isRecording, setIsRecording] = useState(false);
  const recordingStartTimeRef = useRef<number>(0);
  const recordedEventsRef = useRef<Array<{ note: string; time: number; duration: number }>>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showBeatMaker, setShowBeatMaker] = useState(false);
  const [showRecordingsModal, setShowRecordingsModal] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    const unsub = musicEngine.subscribe((state) => {
      setPlaybackState(state);
    });
    return () => unsub();
  }, []);

  // Timer for recording duration
  useEffect(() => {
    let timer: number;
    if (isRecording) {
      timer = window.setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - recordingStartTimeRef.current) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Capture notes during recording
  useEffect(() => {
    if (!isRecording) return;
    activeNotes.forEach((note) => {
      const time = Date.now() - recordingStartTimeRef.current;
      recordedEventsRef.current.push({
        note,
        time,
        duration: 300,
      });
    });
  }, [activeNotes, isRecording]);

  // Increase hype whenever notes are played
  useEffect(() => {
    if (activeNotes.size > 0) {
      setNotesPlayedCount((c) => c + 1);
      setHypeMeter((prev) => Math.min(100, prev + 3));
    }
  }, [activeNotes]);

  // Handle celebration & marking concert completed when hype reaches 100%
  useEffect(() => {
    if (hypeMeter >= 100 && !hasCelebrated) {
      setHasCelebrated(true);
      synthEngine.playCheerSound();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#ec4899', '#facc15', '#10b981'],
        });
      } catch {
        // ignore
      }
      setTimeout(() => {
        onConcertCompleted(location.id);
      }, 50);
    }
  }, [hypeMeter, hasCelebrated, location.id, onConcertCompleted]);

  // Slow decay of hype if idle
  useEffect(() => {
    const timer = setInterval(() => {
      setHypeMeter((prev) => Math.max(20, prev - 1));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const handleStartConcertRecording = () => {
    setIsRecording(true);
    recordingStartTimeRef.current = Date.now();
    recordedEventsRef.current = [];
    setElapsedSeconds(0);
    synthEngine.playCoinSound();
  };

  const handleStopConcertRecording = () => {
    setIsRecording(false);
    const duration = Math.max(1, Math.round((Date.now() - recordingStartTimeRef.current) / 1000));
    const events = [...recordedEventsRef.current];

    if (events.length > 0) {
      const newTrack: RecordedTrack = {
        id: `concert_${Date.now()}`,
        title: `Live at ${location.name}`,
        locationId: location.id,
        locationName: location.name,
        performerName: character.name,
        date: new Date().toLocaleDateString(),
        duration,
        notesCount: events.length,
        events,
      };
      onSaveTrack(newTrack);
      synthEngine.playCheerSound();
      setSaveSuccessToast(`Saved "${newTrack.title}" (${events.length} notes)!`);
      setTimeout(() => setSaveSuccessToast(null), 3000);
    }
  };

  const handleReplayConcertTrack = (track: RecordedTrack) => {
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

  const handleToggleDrums = () => {
    const playing = drumMachine.toggle();
    setIsDrumPlaying(playing);
  };

  const isPlayingActive = activeNotes.size > 0;
  const currentActiveNote = Array.from(activeNotes)[0] || null;

  return (
    <div className="relative w-full flex flex-col bg-slate-950 border-2 border-slate-800 rounded-lg overflow-hidden shadow-2xl">
      {/* Beat Maker Modal */}
      <BeatMakerModal
        isOpen={showBeatMaker}
        onClose={() => setShowBeatMaker(false)}
        location={location}
        savedBeats={savedBeats}
        onSaveBeat={onSaveBeat}
        onDeleteBeat={onDeleteBeat}
      />

      {/* Concert Recording & Cassette Vault Modal */}
      <ConcertRecordingModal
        isOpen={showRecordingsModal}
        onClose={() => setShowRecordingsModal(false)}
        location={location}
        recordedTracks={recordedTracks}
        onDeleteTrack={onDeleteTrack}
        onReplayTrack={handleReplayConcertTrack}
        isRecording={isRecording}
        onStartRecording={handleStartConcertRecording}
        onStopRecording={handleStopConcertRecording}
        activeRecordingNotesCount={recordedEventsRef.current.length}
        recordingElapsedSeconds={elapsedSeconds}
      />

      {/* Top Stage Control Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToGlobe}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-arcade text-cyan-400 border border-slate-700 transition-colors"
          >
            ← ORBIT VIEW
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-arcade text-white tracking-wide">
              {location.name.toUpperCase()}
            </h2>
            <div className="text-xs font-mono text-slate-400">
              {location.country} · {location.vibe} · {location.lat.toFixed(2)}°, {location.lng.toFixed(2)}°
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Recording Trigger */}
          {!isRecording ? (
            <button
              onClick={handleStartConcertRecording}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-arcade text-xs flex items-center gap-1.5 border border-rose-400 transition-all shadow-[0_0_10px_rgba(244,63,94,0.4)]"
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>REC CONCERT</span>
            </button>
          ) : (
            <button
              onClick={handleStopConcertRecording}
              className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-arcade text-xs flex items-center gap-1.5 border border-yellow-300 animate-pulse font-bold transition-all"
            >
              <span>■ SAVE TAPE ({recordedEventsRef.current.length} N)</span>
            </button>
          )}

          {/* Beat Maker / Custom Beat Button */}
          <button
            onClick={() => setShowBeatMaker(true)}
            className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500 text-emerald-200 text-xs font-arcade flex items-center gap-1.5 transition-colors"
            title="Create & Save Custom Beats for this Venue"
          >
            <span>🥁 SAVE BEAT</span>
          </button>

          {/* Recordings Vault */}
          <button
            onClick={() => setShowRecordingsModal(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-arcade flex items-center gap-1.5 transition-colors"
            title="View Concert Cassettes"
          >
            <span>📼 TAPES ({recordedTracks.length})</span>
          </button>

          {/* Music Playback Trigger */}
          <button
            onClick={() => musicEngine.togglePlay()}
            className={`px-3 py-1.5 text-xs font-arcade border transition-all ${
              playbackState.isPlaying
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                : 'bg-cyan-600 hover:bg-cyan-500 border-cyan-400 text-white'
            }`}
            title="Trigger music playback via button or keyboard [SPACE]"
          >
            {playbackState.isPlaying ? '■ PAUSE' : '▶ MUSIC'}
          </button>

          {/* Google Earth Link Button */}
          <button
            onClick={() => setShowEarthModal(true)}
            className="px-3 py-1.5 bg-blue-900/60 hover:bg-blue-800 border border-blue-500 text-blue-200 text-xs font-arcade flex items-center gap-1.5 transition-colors"
            title="View 3D Satellite Map via Google Earth"
          >
            <span>🌍 3D</span>
          </button>

          {/* Search Anywhere on Google Earth Modal Trigger */}
          <button
            onClick={() => setShowVenueSearchModal(true)}
            className="px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800 border border-purple-500 text-purple-200 text-xs font-arcade flex items-center gap-1.5 transition-colors"
            title="Search anywhere on Google Earth to warp to a new concert stage"
          >
            <span>🔍 SEARCH VENUE</span>
          </button>

          {/* Unlimited Random Warp from Stage */}
          <button
            onClick={handleStageRandomWarp}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-pink-600 hover:from-amber-500 hover:to-pink-500 text-white font-arcade text-xs flex items-center gap-1.5 border border-amber-300 font-bold shadow-md transition-all hover:scale-105"
            title="Warp at random to anywhere on Earth!"
          >
            <span>⚡ RANDOM WARP</span>
          </button>
        </div>
      </div>

      {/* Main Concert Screen (Pixel Stage Backdrop) */}
      <div
        className="relative w-full h-64 sm:h-80 md:h-96 flex flex-col justify-between overflow-hidden select-none"
        style={{
          background: `linear-gradient(to bottom, ${location.bgPalette.skyTop}, ${location.bgPalette.skyBottom})`,
        }}
      >
        {/* Stage Lighting / Laser Sweep Beams */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div
            className={`absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-cyan-400/40 to-transparent transform -skew-x-12 transition-transform duration-200 ${
              isPlayingActive ? 'scale-110 opacity-80' : ''
            }`}
          />
          <div
            className={`absolute top-0 right-1/4 w-32 h-full bg-gradient-to-b from-pink-400/40 to-transparent transform skew-x-12 transition-transform duration-200 ${
              isPlayingActive ? 'scale-110 opacity-80' : ''
            }`}
          />
        </div>

        {/* Pixel Landmark SVG Illustrations in the Horizon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
          {location.pixelLandmark === 'shibuya' && (
            <svg viewBox="0 0 400 200" className="w-full h-full pixel-art" preserveAspectRatio="xMidYMax slice">
              {/* Neon Skyscrapers */}
              <rect x="20" y="40" width="60" height="160" fill="#0f172a" />
              <rect x="30" y="55" width="40" height="25" fill="#ec4899" opacity="0.8" />
              <rect x="30" y="90" width="40" height="20" fill="#06b6d4" opacity="0.8" />
              <rect x="90" y="20" width="70" height="180" fill="#1e1b4b" />
              <rect x="100" y="35" width="50" height="40" fill="#facc15" opacity="0.7" />
              <rect x="170" y="60" width="80" height="140" fill="#0f172a" />
              <rect x="185" y="80" width="50" height="30" fill="#3b82f6" opacity="0.9" />
              <rect x="260" y="30" width="65" height="170" fill="#1e1b4b" />
              <rect x="275" y="50" width="35" height="50" fill="#10b981" opacity="0.8" />
              <rect x="335" y="50" width="55" height="150" fill="#0f172a" />
            </svg>
          )}

          {location.pixelLandmark === 'pyramids' && (
            <svg viewBox="0 0 400 200" className="w-full h-full pixel-art" preserveAspectRatio="xMidYMax slice">
              {/* Moon */}
              <circle cx="80" cy="50" r="24" fill="#fef08a" opacity="0.9" />
              {/* Stars */}
              <rect x="180" y="30" width="3" height="3" fill="#ffffff" />
              <rect x="250" y="40" width="4" height="4" fill="#ffffff" />
              <rect x="320" y="20" width="3" height="3" fill="#facc15" />
              {/* Great Pyramid of Giza */}
              <polygon points="120,60 40,180 200,180" fill="#ca8a04" />
              <polygon points="120,60 160,180 200,180" fill="#a16207" />
              {/* Second Pyramid */}
              <polygon points="260,80 180,180 340,180" fill="#eab308" />
              <polygon points="260,80 300,180 340,180" fill="#854d0e" />
              {/* Desert Dune Line */}
              <path d="M0,170 Q100,150 200,175 T400,170 L400,200 L0,200 Z" fill="#713f12" />
            </svg>
          )}

          {location.pixelLandmark === 'eiffel' && (
            <svg viewBox="0 0 400 200" className="w-full h-full pixel-art" preserveAspectRatio="xMidYMax slice">
              {/* Eiffel Tower Pixel Lattice */}
              <polygon points="200,20 185,180 215,180" fill="#f59e0b" />
              <rect x="188" y="70" width="24" height="6" fill="#d97706" />
              <rect x="182" y="120" width="36" height="8" fill="#d97706" />
              <rect x="198" y="10" width="4" height="15" fill="#fef08a" />
              {/* Spotlights */}
              <polygon points="200,15 100,0 130,0" fill="#fef08a" opacity="0.2" />
              <polygon points="200,15 270,0 300,0" fill="#fef08a" opacity="0.2" />
            </svg>
          )}

          {location.pixelLandmark === 'fuji' && (
            <svg viewBox="0 0 400 200" className="w-full h-full pixel-art" preserveAspectRatio="xMidYMax slice">
              {/* Mount Fuji */}
              <polygon points="200,45 80,185 320,185" fill="#475569" />
              {/* Snow cap */}
              <polygon points="200,45 155,95 180,90 200,100 220,90 245,95" fill="#ffffff" />
              {/* Sakura blossom petals */}
              <circle cx="90" cy="70" r="3" fill="#f472b6" />
              <circle cx="130" cy="110" r="2" fill="#fbcfe8" />
              <circle cx="280" cy="80" r="3" fill="#f472b6" />
              <circle cx="310" cy="120" r="2.5" fill="#fbcfe8" />
            </svg>
          )}

          {location.pixelLandmark === 'aurora' && (
            <svg viewBox="0 0 400 200" className="w-full h-full pixel-art" preserveAspectRatio="xMidYMax slice">
              {/* Aurora Waves */}
              <path d="M0,40 Q100,90 200,30 T400,60 L400,100 Q300,70 200,110 T0,70 Z" fill="#34d399" opacity="0.45" />
              <path d="M0,60 Q120,20 240,80 T400,30 L400,90 Q280,110 160,50 T0,80 Z" fill="#818cf8" opacity="0.35" />
              {/* Arctic Mountains */}
              <polygon points="60,110 0,180 140,180" fill="#0f172a" />
              <polygon points="170,120 100,180 250,180" fill="#1e293b" />
              <polygon points="310,100 220,180 400,180" fill="#0f172a" />
            </svg>
          )}

          {/* Generic/Colosseum/Times Square fallback skyline */}
          {!['shibuya', 'pyramids', 'eiffel', 'fuji', 'aurora'].includes(location.pixelLandmark) && (
            <svg viewBox="0 0 400 200" className="w-full h-full pixel-art" preserveAspectRatio="xMidYMax slice">
              <rect x="40" y="60" width="50" height="130" fill="#1e293b" />
              <rect x="100" y="40" width="70" height="150" fill="#0f172a" />
              <rect x="180" y="30" width="60" height="160" fill="#1e293b" />
              <rect x="250" y="55" width="80" height="135" fill="#0f172a" />
              <rect x="340" y="70" width="45" height="120" fill="#1e293b" />
            </svg>
          )}
        </div>

        {/* Top HUD: Hype Meter, Concert Stat & Live Recording Banner */}
        <div className="relative z-10 flex flex-wrap items-center justify-between p-3 gap-2">
          <div className="bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 border border-cyan-500/30 flex items-center gap-2">
            <span className="text-[11px] font-arcade text-cyan-300">CROWD HYPE:</span>
            <div className="w-28 sm:w-40 h-3 bg-slate-800 border border-slate-700 rounded-xs overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 transition-all duration-200"
                style={{ width: `${hypeMeter}%` }}
              />
            </div>
            <span className="text-xs font-mono text-yellow-300 font-bold">{hypeMeter}%</span>
          </div>

          {/* Live Recording Active Banner */}
          {isRecording && (
            <div className="bg-rose-950/90 border-2 border-rose-500 px-3 py-1 text-rose-300 font-arcade text-xs flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.6)]">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>REC ON STAGE · {elapsedSeconds}s · {recordedEventsRef.current.length} NOTES</span>
            </div>
          )}

          {/* Toast Notification */}
          {saveSuccessToast && (
            <div className="bg-emerald-950/90 border border-emerald-500 px-3 py-1 text-emerald-300 font-mono text-xs animate-in fade-in">
              {saveSuccessToast}
            </div>
          )}

          <div className="bg-slate-900/80 px-3 py-1.5 border border-slate-700 text-xs font-mono text-slate-300">
            NOTES: <span className="text-pink-400 font-bold">{notesPlayedCount}</span>
          </div>
        </div>

        {/* Center Stage: Performing Character & Stage Rig */}
        <div className="relative z-20 flex flex-col items-center justify-end pb-2">
          {/* Main Stage Podium */}
          <div className="relative flex flex-col items-center">
            {/* Spotlight halo under character */}
            <div
              className={`w-36 h-8 rounded-full blur-xs transition-colors duration-150 ${
                isPlayingActive ? 'bg-cyan-400/60 scale-110' : 'bg-yellow-400/30'
              }`}
            />

            {/* Pixel Character Center Stage */}
            <div className="absolute -top-32">
              <PixelAvatar
                config={character}
                size={140}
                isPlaying={isPlayingActive}
                activeNote={currentActiveNote}
              />
            </div>

            {/* Stage Floor Border */}
            <div className="w-72 sm:w-96 h-4 bg-slate-900 border-t-2 border-cyan-400 flex items-center justify-around px-4">
              <div className="w-2 h-2 bg-pink-500 animate-ping" />
              <div className="w-2 h-2 bg-cyan-400 animate-pulse" />
              <div className="w-2 h-2 bg-yellow-400 animate-ping" />
            </div>
          </div>
        </div>

        {/* Foreground: Pixel Audience Fans Cheering */}
        <div className="relative z-30 w-full h-12 bg-black/60 border-t border-slate-800 flex items-end justify-around px-2 overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => {
            const isWave = isPlayingActive && i % 2 === (notesPlayedCount % 2);
            return (
              <div
                key={i}
                className={`flex flex-col items-center transition-transform duration-100 ${
                  isWave ? '-translate-y-2' : 'translate-y-0'
                }`}
              >
                {/* Glowstick */}
                {i % 3 === 0 && (
                  <div
                    className="w-1 h-3 rounded-full mb-0.5"
                    style={{
                      backgroundColor: ['#ec4899', '#38bdf8', '#a855f7', '#4ade80'][i % 4],
                    }}
                  />
                )}
                {/* Pixel Fan Head & Shoulders */}
                <div className="w-3 h-3 bg-slate-700 rounded-t-xs" />
                <div className="w-5 h-4 bg-slate-800 rounded-t-xs" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Beats Overlap Rack */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <SavedBeatsRack
          location={location}
          savedBeats={savedBeats}
          onOpenBeatMaker={() => setShowBeatMaker(true)}
          onDeleteBeat={onDeleteBeat}
        />
      </div>

      {/* Stage Bottom: Interactive Musical Keyboard & Drum Pads */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-3">
            <span className="text-xs font-arcade text-white">CONCERT STAGE RIG</span>
            <span className="px-2 py-0.5 rounded bg-yellow-950/80 border border-yellow-500/40 text-[10px] font-mono text-yellow-300">
              KIT: {proSoundEngine.currentKit.name.toUpperCase()}
            </span>
            <span className="px-2 py-0.5 rounded bg-pink-950/80 border border-pink-500/40 text-[10px] font-mono text-pink-300">
              VOICE: {proSoundEngine.currentMelodicSound.name.toUpperCase()}
            </span>
          </div>

          {/* Quick Sound Kit Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-arcade text-slate-400">SOUND KIT:</span>
            <select
              value={proSoundEngine.currentKit.genre}
              onChange={(e) => {
                const genre = GENRE_CATALOG.find((g) => g.id === e.target.value);
                if (genre && genre.kits.length > 0) {
                  proSoundEngine.setKit(genre.kits[0]);
                  synthEngine.playCoinSound();
                }
              }}
              className="bg-slate-950 border border-slate-700 px-2 py-1 text-xs font-mono text-cyan-300 focus:outline-none rounded"
            >
              {GENRE_CATALOG.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.icon} {g.name}
                </option>
              ))}
            </select>

            <select
              value={proSoundEngine.currentKit.id}
              onChange={(e) => {
                const genre = GENRE_CATALOG.find((g) => g.id === proSoundEngine.currentKit.genre);
                const kit = genre?.kits.find((k) => k.id === e.target.value);
                if (kit) {
                  proSoundEngine.setKit(kit);
                  synthEngine.playCoinSound();
                }
              }}
              className="bg-slate-950 border border-slate-700 px-2 py-1 text-xs font-mono text-yellow-300 focus:outline-none rounded font-bold"
            >
              {(GENRE_CATALOG.find((g) => g.id === proSoundEngine.currentKit.genre)?.kits || []).map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Drum Pads Strip for Stage Performance */}
        <div className="flex flex-wrap gap-2 p-2 bg-slate-950 border border-slate-800 rounded">
          <span className="text-[10px] font-arcade text-slate-500 self-center mr-1">STAGE PADS:</span>
          {proSoundEngine.currentKit.samples.slice(0, 8).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                proSoundEngine.triggerDrumSample(s, 1.0);
                setNotesPlayedCount((c) => c + 1);
                setHypeMeter((h) => Math.min(100, h + 2));
              }}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 rounded text-xs font-mono text-slate-200 transition-all flex items-center gap-1.5"
            >
              <span className="text-yellow-400 font-arcade text-[10px]">[{s.keyShortcut}]</span>
              <span>{s.variationLabel || s.type}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-1 px-1">
          <div className="text-[11px] font-arcade text-slate-300">
            PLAY SYNTHESIZER / MELODIC VOICE
          </div>
          <div className="text-[11px] font-mono text-cyan-400">
            SCALE: <span className="uppercase font-bold text-yellow-300">{scaleMode}</span>
          </div>
        </div>

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

      {/* On-Stage Search Anywhere on Google Earth Modal */}
      {showVenueSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-slate-900 border-2 border-purple-500 p-6 flex flex-col max-h-[85vh] text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-purple-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <h3 className="font-arcade text-sm text-purple-300">
                  SEARCH ANYWHERE ON GOOGLE EARTH · CHANGE CONCERT STAGE
                </h3>
              </div>
              <button
                onClick={() => setShowVenueSearchModal(false)}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                [CLOSE]
              </button>
            </div>

            <div className="py-3 border-b border-slate-800 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={venueSearchQuery}
                  onChange={(e) => setVenueSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleStageSearch(venueSearchQuery);
                  }}
                  placeholder="Search any landmark, city, country, or coordinates..."
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-purple-400 px-3 py-2 text-xs font-mono text-purple-200 placeholder:text-slate-500 rounded focus:outline-none"
                />
                <button
                  onClick={() => handleStageSearch(venueSearchQuery)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-arcade text-xs font-bold rounded transition-colors"
                >
                  {isSearchingVenues ? 'SEARCHING...' : 'SEARCH'}
                </button>
                <button
                  onClick={() => {
                    setShowVenueSearchModal(false);
                    handleStageRandomWarp();
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-arcade text-xs font-bold rounded transition-all hover:scale-105"
                >
                  ⚡ RANDOM
                </button>
              </div>

              {/* Preset quick links */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Grand Canyon', 'Machu Picchu', 'Sydney Opera', 'Iceland Aurora', 'Mount Fuji', 'Sahara Desert'].map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setVenueSearchQuery(name);
                      handleStageSearch(name);
                    }}
                    className="px-2 py-0.5 bg-slate-950 border border-slate-800 hover:border-purple-500 rounded text-[10px] font-mono text-slate-400 hover:text-purple-300"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Results List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 overflow-y-auto flex-1">
              {venueSearchResults.length === 0 ? (
                <div className="col-span-full py-8 text-center text-xs font-mono text-slate-500">
                  {isSearchingVenues ? 'SEARCHING GOOGLE EARTH...' : 'TYPE ANY PLACE NAME ABOVE TO DISCOVER CONCERT STAGES ACROSS THE GLOBE.'}
                </div>
              ) : (
                venueSearchResults.map((res) => (
                  <div
                    key={res.id}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-purple-400 rounded flex flex-col justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-yellow-400">{res.country}</span>
                        <span className="text-cyan-400">{res.lat.toFixed(2)}°, {res.lng.toFixed(2)}°</span>
                      </div>
                      <h4 className="font-arcade text-xs text-white mb-1">{res.name}</h4>
                      <p className="text-[10px] font-mono text-slate-400 line-clamp-2">{res.description}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 mt-2 border-t border-slate-900">
                      <button
                        onClick={() => {
                          setShowVenueSearchModal(false);
                          if (onWarpToLocation) onWarpToLocation(res);
                        }}
                        className="flex-1 py-1 px-2 bg-purple-600 hover:bg-purple-500 text-white font-arcade text-xs font-bold rounded text-center transition-colors"
                      >
                        🚀 WARP STAGE HERE
                      </button>
                      <a
                        href={getGoogleEarthUrl(res.lat, res.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-mono border border-slate-700 rounded"
                      >
                        3D ↗
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Google Earth Modal */}
      {showEarthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-900 border-2 border-cyan-400 p-6 flex flex-col gap-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-cyan-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌍</span>
                <h3 className="font-arcade text-sm text-cyan-300">
                  GOOGLE EARTH EXPLORATION · {location.name.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setShowEarthModal(false)}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                [CLOSE]
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <p>
                <strong className="text-yellow-300">Destination:</strong> {location.name}, {location.country} ({location.continent})
              </p>
              <p>
                <strong className="text-cyan-300">Coordinates:</strong> {location.lat.toFixed(5)}° N, {location.lng.toFixed(5)}° E
              </p>
              <p className="p-3 bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                "{location.description}"
              </p>
              <p className="text-pink-300">
                💡 <strong>Cosmic Lore:</strong> {location.funFact}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-800">
              <a
                href={getGoogleEarthUrl(location.lat, location.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-arcade text-xs text-center border border-blue-400 transition-colors"
              >
                LAUNCH GOOGLE EARTH 3D WEB ↗
              </a>
              <button
                onClick={() => setShowEarthModal(false)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-arcade text-xs transition-colors"
              >
                RETURN TO CONCERT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
