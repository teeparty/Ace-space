import React, { useState, useEffect } from 'react';
import { CustomBeat, EarthLocation } from '../../types/game';
import { drumMachine } from '../../audio/drumMachine';
import { synthEngine } from '../../audio/retroSynth';

interface SavedBeatsRackProps {
  location: EarthLocation;
  savedBeats: CustomBeat[];
  onOpenBeatMaker: () => void;
  onDeleteBeat: (beatId: string) => void;
  className?: string;
}

export const SavedBeatsRack: React.FC<SavedBeatsRackProps> = ({
  location,
  savedBeats,
  onOpenBeatMaker,
  onDeleteBeat,
  className = '',
}) => {
  const [activeLayerIds, setActiveLayerIds] = useState<Set<string>>(
    new Set(drumMachine.getActiveLayerIds())
  );
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [filterLocationOnly, setFilterLocationOnly] = useState<boolean>(false);

  // Sync step indicator
  useEffect(() => {
    const handleStep = (step: number) => {
      setCurrentStep(step);
    };
    drumMachine.onStep(handleStep);
    return () => drumMachine.offStep(handleStep);
  }, []);

  const handleToggleLayer = (beat: CustomBeat) => {
    synthEngine.playCoinSound();
    const isActive = drumMachine.toggleBeatLayer(beat.id, beat.title, beat.pattern, 0.85);

    setActiveLayerIds((prev) => {
      const next = new Set(prev);
      if (isActive) {
        next.add(beat.id);
      } else {
        next.delete(beat.id);
      }
      return next;
    });
  };

  const handleClearAll = () => {
    drumMachine.clearAllLayers();
    setActiveLayerIds(new Set());
    synthEngine.playCoinSound();
  };

  const displayedBeats = filterLocationOnly
    ? savedBeats.filter((b) => b.locationId === location.id || b.locationName.includes(location.name))
    : savedBeats;

  return (
    <div className={`p-4 bg-slate-950/90 border-2 border-emerald-500/40 rounded-lg shadow-xl flex flex-col gap-3 ${className}`}>
      
      {/* Rack Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🥁</span>
          <div>
            <h3 className="font-arcade text-xs text-emerald-300 flex items-center gap-2">
              <span>SAVED BEATS RACK · CONCERT OVERLAP</span>
              {activeLayerIds.size > 0 && (
                <span className="px-2 py-0.5 bg-emerald-500 text-black text-[10px] font-bold rounded animate-pulse">
                  {activeLayerIds.size} ACTIVE {activeLayerIds.size === 1 ? 'LAYER' : 'LAYERS'} OVERLAPPING
                </span>
              )}
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Toggle saved beats below to play and layer them simultaneously over your live concert!
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-2">
          {activeLayerIds.size > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1 bg-rose-950/70 hover:bg-rose-900 border border-rose-600 text-rose-300 text-[10px] font-arcade transition-colors"
            >
              MUTE ALL LAYERS
            </button>
          )}

          <button
            type="button"
            onClick={() => setFilterLocationOnly(!filterLocationOnly)}
            className={`px-2.5 py-1 text-[10px] font-mono border transition-colors ${
              filterLocationOnly
                ? 'border-emerald-400 bg-emerald-950 text-emerald-300 font-bold'
                : 'border-slate-800 bg-slate-900 text-slate-400'
            }`}
          >
            {filterLocationOnly ? `${location.name} Only` : 'Show All Saved'}
          </button>

          <button
            type="button"
            onClick={onOpenBeatMaker}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-arcade font-bold border border-cyan-300 shadow-sm transition-all"
          >
            + NEW BEAT
          </button>
        </div>
      </div>

      {/* Beats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-1">
        {displayedBeats.length === 0 ? (
          <div className="col-span-full p-4 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800">
            NO SAVED BEATS FOR THIS VENUE. CLICK "+ NEW BEAT" TO CREATE AND SAVE A CUSTOM BEAT!
          </div>
        ) : (
          displayedBeats.map((beat) => {
            const isOverlapping = activeLayerIds.has(beat.id);
            const isVenueMatch = beat.locationId === location.id;

            return (
              <div
                key={beat.id}
                className={`p-3 border-2 rounded flex flex-col justify-between transition-all ${
                  isOverlapping
                    ? 'border-emerald-400 bg-emerald-950/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.02]'
                    : isVenueMatch
                    ? 'border-slate-700 bg-slate-900/90'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                      {beat.locationName}
                    </span>
                    <span className="text-[10px] font-mono text-yellow-400 font-bold">
                      {beat.bpm} BPM
                    </span>
                  </div>

                  <div className="font-arcade text-xs text-white truncate mb-1">
                    {beat.title}
                  </div>

                  {/* 16-Step Mini Preview with live playback ticker */}
                  <div className="grid grid-cols-16 gap-0.5 my-2">
                    {beat.pattern.kick.map((hasKick, sIdx) => {
                      const hasSnare = beat.pattern.snare[sIdx];
                      const hasHihat = beat.pattern.hihat[sIdx];
                      const isStepNow = isOverlapping && currentStep === sIdx;

                      return (
                        <div
                          key={sIdx}
                          className={`h-3 rounded-xs transition-colors ${
                            isStepNow
                              ? 'bg-yellow-300 scale-125 z-10'
                              : hasKick
                              ? 'bg-yellow-500'
                              : hasSnare
                              ? 'bg-rose-500'
                              : hasHihat
                              ? 'bg-cyan-500'
                              : 'bg-slate-800'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Overlap Toggle Button */}
                <div className="flex items-center gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => handleToggleLayer(beat)}
                    className={`flex-1 py-1.5 px-2 text-[10px] font-arcade border rounded-xs transition-all font-bold ${
                      isOverlapping
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.6)] animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    {isOverlapping ? '● OVERLAPPING (ON)' : '+ OVERLAP BEAT'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteBeat(beat.id)}
                    className="px-2 py-1.5 text-slate-500 hover:text-rose-400 text-xs border border-transparent hover:border-slate-800 rounded"
                    title="Remove Beat"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Overlapping Info Ticker */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-900">
        <div>
          TIP: Click <strong className="text-emerald-300">"+ OVERLAP BEAT"</strong> on multiple saved beats to stack complex polyrhythmic beats!
        </div>
        <div className="text-yellow-300">
          ALL BEATS SYNC TO MASTER 16-STEP CLOCK
        </div>
      </div>

    </div>
  );
};
