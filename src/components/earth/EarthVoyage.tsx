import React, { useState, useEffect } from 'react';
import { EarthLocation, KeyMapping, ScaleMode, RecordedTrack, CustomBeat } from '../../types/game';
import { CharacterConfig } from '../../types/character';
import { 
  EARTH_LOCATIONS, 
  getGoogleEarthUrl, 
  searchAnywhereOnEarth, 
  generateUnlimitedRandomLocation,
  createCustomEarthLocation 
} from '../../data/earthLocations';
import { ThreeGlobe } from './ThreeGlobe';
import { ConcertStage } from './ConcertStage';
import { WarpAnimation } from '../common/WarpAnimation';
import { PassportStampModal } from '../common/PassportStampModal';
import { BeatMakerModal } from '../common/BeatMakerModal';
import { ConcertRecordingModal } from '../common/ConcertRecordingModal';
import { synthEngine } from '../../audio/retroSynth';

interface EarthVoyageProps {
  character: CharacterConfig;
  keyMappings: KeyMapping[];
  activeNotes: Set<string>;
  scaleMode: ScaleMode;
  labelMode: 'keys' | 'notes' | 'solfege';
  onNoteDown: (m: KeyMapping) => void;
  onNoteUp: (m: KeyMapping) => void;
  visitedLocations: Set<string>;
  onMarkVisited: (locId: string) => void;
  recordedTracks: RecordedTrack[];
  onSaveTrack: (track: RecordedTrack) => void;
  onDeleteTrack: (trackId: string) => void;
  savedBeats: CustomBeat[];
  onSaveBeat: (beat: CustomBeat) => void;
  onDeleteBeat: (beatId: string) => void;
}

export const EarthVoyage: React.FC<EarthVoyageProps> = ({
  character,
  keyMappings,
  activeNotes,
  scaleMode,
  labelMode,
  onNoteDown,
  onNoteUp,
  visitedLocations,
  onMarkVisited,
  recordedTracks,
  onSaveTrack,
  onDeleteTrack,
  savedBeats,
  onSaveBeat,
  onDeleteBeat,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<EarthLocation>(EARTH_LOCATIONS[0]);
  const [viewMode, setViewMode] = useState<'orbit' | 'concert'>('orbit');
  const [isWarping, setIsWarping] = useState(false);
  const [warpTarget, setWarpTarget] = useState<EarthLocation>(EARTH_LOCATIONS[0]);
  const [filterContinent, setFilterContinent] = useState<string>('All');
  const [showPickModal, setShowPickModal] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const [showBeatMaker, setShowBeatMaker] = useState(false);
  const [showRecordingsModal, setShowRecordingsModal] = useState(false);

  // Search Anywhere on Google Earth state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<EarthLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customLocations, setCustomLocations] = useState<EarthLocation[]>(() => {
    try {
      const saved = localStorage.getItem('ace_space_custom_locations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [warpToast, setWarpToast] = useState<string | null>(null);

  // Combine curated + searched/random locations
  const allKnownLocations: EarthLocation[] = React.useMemo(() => {
    const list = [...EARTH_LOCATIONS];
    customLocations.forEach((c) => {
      if (!list.some((l) => l.id === c.id)) {
        list.push(c);
      }
    });
    if (!list.some((l) => l.id === selectedLocation.id)) {
      list.push(selectedLocation);
    }
    return list;
  }, [customLocations, selectedLocation]);

  // Save custom locations to local storage
  const rememberLocation = (loc: EarthLocation) => {
    setCustomLocations((prev) => {
      if (prev.some((p) => p.id === loc.id)) return prev;
      const updated = [loc, ...prev].slice(0, 50);
      try {
        localStorage.setItem('ace_space_custom_locations', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Trigger warp to a specified place
  const handleWarpTo = (target: EarthLocation) => {
    rememberLocation(target);
    synthEngine.playHyperspaceWarpSound();
    setWarpTarget(target);
    setIsWarping(true);
  };

  // Unlimited Random to anywhere on Google Earth
  const handleUnlimitedRandomWarp = () => {
    const randomLoc = generateUnlimitedRandomLocation(selectedLocation.id);
    rememberLocation(randomLoc);
    setWarpToast(`TARGET LOCKED: ${randomLoc.name.toUpperCase()} (${randomLoc.lat.toFixed(2)}°, ${randomLoc.lng.toFixed(2)}°)`);
    setTimeout(() => setWarpToast(null), 3500);
    handleWarpTo(randomLoc);
  };

  const handleWarpComplete = () => {
    setIsWarping(false);
    setSelectedLocation(warpTarget);
    setViewMode('concert');
  };

  // Search handler (searches catalog + live geocoding API)
  const handlePerformSearch = async (term: string) => {
    const q = term.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchAnywhereOnEarth(q);
      setSearchResults(results);
    } catch {
      // Fallback procedural
      const fallback = createCustomEarthLocation(q.toUpperCase(), 0, 0, 'Planet Earth');
      setSearchResults([fallback]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search when typing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      handlePerformSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  const filteredLocations = filterContinent === 'All'
    ? allKnownLocations
    : allKnownLocations.filter((l) => l.continent === filterContinent);

  // Filter recordings for selected location
  const locationRecordings = recordedTracks.filter(
    (t) => t.locationId === selectedLocation.id || t.locationName.includes(selectedLocation.name)
  );

  return (
    <div className="relative w-full max-w-7xl mx-auto flex flex-col gap-6">
      {/* Warp Toast Notification */}
      {warpToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in duration-200">
          <div className="bg-slate-950/95 border-2 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.8)] px-5 py-2.5 text-yellow-300 font-arcade text-xs tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
            <span>⚡ {warpToast}</span>
          </div>
        </div>
      )}

      {/* Full-screen Hyperspace Warp Sequence */}
      {isWarping && (
        <WarpAnimation
          destinationName={warpTarget.name}
          onComplete={handleWarpComplete}
        />
      )}

      {/* Tour Passport Modal */}
      <PassportStampModal
        isOpen={showPassport}
        onClose={() => setShowPassport(false)}
        visitedIds={visitedLocations}
      />

      {/* Beat Maker Modal */}
      <BeatMakerModal
        isOpen={showBeatMaker}
        onClose={() => setShowBeatMaker(false)}
        location={selectedLocation}
        savedBeats={savedBeats}
        onSaveBeat={onSaveBeat}
        onDeleteBeat={onDeleteBeat}
      />

      {/* Concert Recording & Cassette Vault Modal */}
      <ConcertRecordingModal
        isOpen={showRecordingsModal}
        onClose={() => setShowRecordingsModal(false)}
        location={selectedLocation}
        recordedTracks={recordedTracks}
        onDeleteTrack={onDeleteTrack}
        onReplayTrack={handleReplayTrack}
        isRecording={false}
        onStartRecording={() => {
          setShowRecordingsModal(false);
          setViewMode('concert');
        }}
        onStopRecording={() => {}}
        activeRecordingNotesCount={0}
        recordingElapsedSeconds={0}
      />

      {/* When in Concert Mode */}
      {viewMode === 'concert' ? (
        <ConcertStage
          location={selectedLocation}
          character={character}
          keyMappings={keyMappings}
          activeNotes={activeNotes}
          scaleMode={scaleMode}
          labelMode={labelMode}
          onNoteDown={onNoteDown}
          onNoteUp={onNoteUp}
          onReturnToGlobe={() => setViewMode('orbit')}
          onConcertCompleted={onMarkVisited}
          onWarpToLocation={handleWarpTo}
          recordedTracks={recordedTracks}
          onSaveTrack={onSaveTrack}
          onDeleteTrack={onDeleteTrack}
          savedBeats={savedBeats}
          onSaveBeat={onSaveBeat}
          onDeleteBeat={onDeleteBeat}
        />
      ) : (
        /* When in Orbit & Destination Command View */
        <div className="flex flex-col gap-6">
          {/* Top Mission Control Bar */}
          <div className="flex flex-col p-4 bg-slate-900 border-2 border-cyan-500/40 rounded-lg gap-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌍</span>
                <div>
                  <h1 className="font-arcade text-base sm:text-lg text-cyan-300">
                    EARTH EXPEDITION · GOOGLE EARTH CONCERT TOUR
                  </h1>
                  <p className="text-xs font-mono text-slate-400">
                    Search anywhere on Google Earth or warp at random to perform concerts anywhere on the planet!
                  </p>
                </div>
              </div>

              {/* Quick Actions: Pick, Unlimited Random, Passport, Beats, Tapes */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowPickModal(true)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-cyan-500 text-cyan-300 text-xs font-arcade transition-all"
                >
                  📍 SEARCH & PICK VENUE
                </button>

                <button
                  onClick={handleUnlimitedRandomWarp}
                  className="px-3.5 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-arcade font-bold shadow-[0_0_20px_rgba(236,72,153,0.6)] border border-pink-400 transition-all hover:scale-105 flex items-center gap-1.5"
                  title="Warp to unlimited random coordinates and wonders anywhere on Earth!"
                >
                  <span>⚡ UNLIMITED RANDOM WARP</span>
                </button>

                <button
                  onClick={() => setShowBeatMaker(true)}
                  className="px-3 py-2 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500 text-emerald-300 text-xs font-arcade transition-colors"
                  title="Create and Save Beats"
                >
                  🥁 BEAT VAULT ({savedBeats.length})
                </button>

                <button
                  onClick={() => setShowRecordingsModal(true)}
                  className="px-3 py-2 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500 text-rose-300 text-xs font-arcade transition-colors"
                  title="View Recorded Concert Tapes"
                >
                  🎙️ TAPES ({recordedTracks.length})
                </button>

                <button
                  onClick={() => setShowPassport(true)}
                  className="px-3 py-2 bg-amber-950/40 hover:bg-amber-900/60 border border-yellow-500 text-yellow-300 text-xs font-arcade transition-colors"
                  title="View Tour Passport"
                >
                  ★ PASSPORT ({visitedLocations.size}/{allKnownLocations.length})
                </button>
              </div>
            </div>

            {/* Google Earth Search Anywhere Bar */}
            <div className="relative w-full pt-1 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 text-xs font-arcade whitespace-nowrap hidden sm:inline">
                  🔍 GOOGLE EARTH SEARCH:
                </span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handlePerformSearch(searchQuery);
                      }
                    }}
                    placeholder="Search anywhere on Google Earth (e.g. Hawaii, Grand Canyon, Machu Picchu, Sydney, Paris, Iceland, Rio...)"
                    className="w-full bg-slate-950 border-2 border-slate-700 focus:border-cyan-400 px-3 py-2 text-xs font-mono text-cyan-200 placeholder:text-slate-500 focus:outline-none rounded transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-mono"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handlePerformSearch(searchQuery)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-arcade font-bold border border-cyan-400 transition-colors"
                >
                  {isSearching ? 'SEARCHING...' : 'FIND PLACE'}
                </button>
              </div>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] font-mono text-slate-500">QUICK DESTINATIONS:</span>
                {[
                  'Shibuya Tokyo',
                  'Grand Canyon',
                  'Machu Picchu',
                  'Salar de Uyuni',
                  'Reykjavik Aurora',
                  'Great Barrier Reef',
                  'Pyramids of Giza',
                  'Eiffel Tower Paris',
                  'Mount Everest',
                  'Hawaii Volcanoes',
                  'Rio Copacabana'
                ].map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setSearchQuery(name);
                      handlePerformSearch(name);
                    }}
                    className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 rounded text-[10px] font-mono text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>

              {/* Live Search Results Dropdown Matrix */}
              {searchResults.length > 0 && (
                <div className="mt-3 p-3 bg-slate-950 border-2 border-cyan-400 rounded-lg shadow-2xl space-y-2 z-20">
                  <div className="flex items-center justify-between text-[11px] font-arcade text-cyan-300 border-b border-slate-800 pb-1.5">
                    <span>GOOGLE EARTH MATCHES FOR "{searchQuery.toUpperCase()}" ({searchResults.length})</span>
                    <button
                      onClick={() => setSearchResults([])}
                      className="text-slate-400 hover:text-white font-mono text-[10px]"
                    >
                      [DISMISS]
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                    {searchResults.map((res) => (
                      <div
                        key={res.id}
                        className="p-2.5 bg-slate-900 border border-slate-700 hover:border-cyan-400 rounded flex flex-col justify-between gap-2 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                            <span className="text-yellow-400 truncate max-w-[140px]">{res.country}</span>
                            <span className="text-cyan-400 font-bold">{res.lat.toFixed(2)}°, {res.lng.toFixed(2)}°</span>
                          </div>
                          <h4 className="font-arcade text-xs text-white leading-snug line-clamp-1">{res.name}</h4>
                          <p className="text-[10px] font-mono text-slate-400 line-clamp-1 mt-0.5">{res.description}</p>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800">
                          <button
                            onClick={() => {
                              setSearchResults([]);
                              handleWarpTo(res);
                            }}
                            className="flex-1 py-1 px-2 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-arcade font-bold rounded text-center transition-colors shadow-sm"
                          >
                            🚀 WARP & CONCERT
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLocation(res);
                              synthEngine.playCoinSound();
                            }}
                            className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono border border-slate-700 rounded"
                            title="Preview on 3D Globe"
                          >
                            ORBIT
                          </button>
                          <a
                            href={getGoogleEarthUrl(res.lat, res.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1 px-2 bg-blue-950 hover:bg-blue-900 text-blue-300 text-[10px] font-mono border border-blue-700 rounded"
                            title="View in 3D on Google Earth Web"
                          >
                            3D ↗
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main 2-Column Grid: 3D Globe + Destination Radar Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: 3D WebGL Earth Globe */}
            <div className="lg:col-span-7 bg-slate-950 border-2 border-slate-800 rounded-lg p-4 flex flex-col justify-between min-h-[420px] shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 z-10">
                <div className="text-xs font-arcade text-cyan-400">
                  PLANETARY ORBIT MONITOR
                </div>
                <div className="text-xs font-mono text-slate-400">
                  PINS: {allKnownLocations.length} GLOBAL VENUES
                </div>
              </div>

              {/* Three.js Globe */}
              <div className="w-full h-80 sm:h-96">
                <ThreeGlobe
                  locations={allKnownLocations}
                  selectedLocation={selectedLocation}
                  onSelectLocation={(loc) => setSelectedLocation(loc)}
                  className="w-full h-full"
                />
              </div>

              {/* Bottom Quick Continent Filter */}
              <div className="flex flex-wrap items-center justify-center gap-1 z-10 pt-2 border-t border-slate-900">
                {['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'].map((cont) => (
                  <button
                    key={cont}
                    onClick={() => setFilterContinent(cont)}
                    className={`px-2.5 py-1 text-[11px] font-mono border transition-colors ${
                      filterContinent === cont
                        ? 'border-cyan-400 bg-cyan-950 text-cyan-300 font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cont}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Selected Location Dossier & Launchpad */}
            <div className="lg:col-span-5 bg-slate-900 border-2 border-cyan-500/30 rounded-lg p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
                  <span className="text-[11px] font-arcade text-yellow-400">TARGET LANDMARK</span>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedLocation.continent.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-arcade text-white tracking-wide mb-1">
                  {selectedLocation.name}
                </h2>
                <div className="text-xs font-mono text-cyan-300 mb-4">
                  {selectedLocation.country} · {selectedLocation.lat.toFixed(4)}° N, {selectedLocation.lng.toFixed(4)}° E
                </div>

                {/* Description & Vibe */}
                <div className="p-3 bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed mb-4">
                  {selectedLocation.description}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
                  <div className="p-2.5 bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">MUSICAL VIBE</span>
                    <span className="text-pink-400 font-bold">{selectedLocation.vibe}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">SUGGESTED TEMPO</span>
                    <span className="text-yellow-400 font-bold">{selectedLocation.recommendedBpm} BPM</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 mb-4">
                  <strong className="text-slate-200">Fact:</strong> {selectedLocation.funFact}
                </div>

                {/* Venue Beats & Recordings Status */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">VENUE TAPES & BEATS:</span>
                    <span className="text-pink-400 font-bold">
                      {locationRecordings.length} Recorded
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowBeatMaker(true)}
                      className="py-1.5 px-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 text-[10px] font-arcade text-center transition-colors"
                    >
                      🥁 EDIT VENUE BEAT
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRecordingsModal(true)}
                      className="py-1.5 px-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-500 text-rose-300 text-[10px] font-arcade text-center transition-colors"
                    >
                      🎙️ VENUE TAPES ({locationRecordings.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleWarpTo(selectedLocation)}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-arcade text-xs font-bold text-center tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all hover:scale-[1.02]"
                >
                  🚀 LAND & PERFORM CONCERT
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={getGoogleEarthUrl(selectedLocation.lat, selectedLocation.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 bg-blue-900/60 hover:bg-blue-800 border border-blue-500 text-blue-200 text-xs font-mono text-center transition-colors"
                  >
                    Google Earth 3D ↗
                  </a>
                  <button
                    onClick={handleUnlimitedRandomWarp}
                    className="py-2 px-3 bg-purple-900/50 hover:bg-purple-800 border border-purple-500 text-purple-200 text-xs font-arcade text-center transition-colors"
                  >
                    ⚡ Random Warp
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Location Grid */}
          <div className="bg-slate-950 border-2 border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-arcade text-xs text-slate-300">
                DESTINATION DIRECTORY · VENUE CATALOG ({filteredLocations.length})
              </h3>
              <button
                onClick={handleUnlimitedRandomWarp}
                className="text-xs font-arcade text-pink-400 hover:text-pink-300 underline"
              >
                + Unlimited Random Venue ↗
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-80 overflow-y-auto pr-1">
              {filteredLocations.map((loc) => {
                const isSelected = loc.id === selectedLocation.id;
                const isVisited = visitedLocations.has(loc.id);

                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`p-3 text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-md'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {loc.country}
                        </span>
                        {isVisited && <span className="text-yellow-400 text-xs">★</span>}
                      </div>
                      <div className="font-arcade text-[11px] leading-tight text-white mb-2 line-clamp-1">
                        {loc.name}
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-pink-400 truncate">
                      {loc.vibe}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pick a Place Modal (Enhanced with Global Search & Unlimited Random) */}
      {showPickModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-cyan-400 p-6 flex flex-col max-h-[88vh] overflow-hidden text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <h3 className="font-arcade text-sm text-cyan-300">
                  EXPLORE & PICK ANY DESTINATION ON EARTH
                </h3>
              </div>
              <button
                onClick={() => setShowPickModal(false)}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                [CLOSE]
              </button>
            </div>

            {/* In-Modal Search Engine */}
            <div className="py-3 border-b border-slate-800 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anywhere on Google Earth (city, wonder, mountains, island...)"
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 px-3 py-2 text-xs font-mono text-cyan-300 placeholder:text-slate-500 rounded focus:outline-none"
                />
                <button
                  onClick={() => handlePerformSearch(searchQuery)}
                  className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-arcade font-bold transition-colors"
                >
                  SEARCH
                </button>
                <button
                  onClick={() => {
                    setShowPickModal(false);
                    handleUnlimitedRandomWarp();
                  }}
                  className="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-arcade font-bold transition-all hover:scale-105"
                >
                  ⚡ RANDOM
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-1">
                {['Kyoto', 'Sahara', 'Sydney', 'Paris', 'Grand Canyon', 'Machu Picchu', 'Iceland'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      handlePerformSearch(tag);
                    }}
                    className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-cyan-300 rounded"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 overflow-y-auto flex-1">
              {(searchResults.length > 0 ? searchResults : allKnownLocations).map((loc) => (
                <div
                  key={loc.id}
                  className="p-3.5 bg-slate-950 border border-slate-800 hover:border-cyan-400 flex flex-col justify-between transition-colors rounded"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-yellow-400 truncate max-w-[160px]">{loc.country}</span>
                      <span className="text-[10px] font-mono text-slate-400">{loc.continent} · {loc.lat.toFixed(2)}°, {loc.lng.toFixed(2)}°</span>
                    </div>
                    <h4 className="font-arcade text-sm text-white mb-1.5">{loc.name}</h4>
                    <p className="text-xs font-mono text-slate-300 line-clamp-2 mb-2">{loc.description}</p>
                    <div className="text-[10px] font-mono text-pink-400 mb-2">VIBE: {loc.vibe}</div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => {
                        setShowPickModal(false);
                        handleWarpTo(loc);
                      }}
                      className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-arcade text-xs font-bold text-center transition-colors rounded"
                    >
                      🚀 WARP & PLAY CONCERT
                    </button>
                    <a
                      href={getGoogleEarthUrl(loc.lat, loc.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono border border-slate-700 rounded"
                    >
                      Earth 3D ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
