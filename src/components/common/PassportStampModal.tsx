import React from 'react';
import { EARTH_LOCATIONS } from '../../data/earthLocations';

interface PassportStampModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitedIds: Set<string>;
}

export const PassportStampModal: React.FC<PassportStampModalProps> = ({
  isOpen,
  onClose,
  visitedIds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-yellow-500 p-6 flex flex-col max-h-[85vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-yellow-500/30">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="font-arcade text-sm md:text-base text-yellow-300">
                COSMIC TOUR PASSPORT
              </h2>
              <div className="text-xs font-mono text-slate-400">
                STAMPS COLLECTED: {visitedIds.size} / {EARTH_LOCATIONS.length}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-mono text-slate-400 hover:text-white"
          >
            [CLOSE]
          </button>
        </div>

        {/* Passport Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4 overflow-y-auto flex-1">
          {EARTH_LOCATIONS.map((loc) => {
            const isVisited = visitedIds.has(loc.id);
            return (
              <div
                key={loc.id}
                className={`p-3 border-2 flex flex-col items-center justify-between text-center relative ${
                  isVisited
                    ? 'border-yellow-400/80 bg-yellow-950/20 shadow-[0_0_15px_rgba(250,204,21,0.2)]'
                    : 'border-slate-800 bg-slate-950/60 opacity-50'
                }`}
              >
                {/* Stamp Icon */}
                <div className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center my-2 border-current text-yellow-300">
                  {isVisited ? '★' : '🔒'}
                </div>

                <div>
                  <div className="text-xs font-arcade text-white">{loc.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">{loc.country}</div>
                </div>

                <div className="mt-2 text-[9px] font-mono uppercase px-2 py-0.5 border border-slate-700">
                  {isVisited ? 'PASSPORT CLEARED' : 'UNVISITED'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 text-center text-xs font-mono text-slate-400">
          VISIT PLACES ON EARTH & PERFORM CONCERTS TO EARN ALL PASSPORT STAMPS
        </div>

      </div>
    </div>
  );
};
