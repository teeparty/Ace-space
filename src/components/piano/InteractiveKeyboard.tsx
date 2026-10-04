import React, { useState, useEffect } from 'react';
import { KeyMapping, ScaleMode } from '../../types/game';
import { isNoteInScale } from '../../data/defaultKeyboard';

interface InteractiveKeyboardProps {
  mappings: KeyMapping[];
  activeNotes: Set<string>;
  highlightedNotes?: Set<string>; // For song guides or scale highlighting
  scaleMode?: ScaleMode;
  labelMode?: 'keys' | 'notes' | 'solfege';
  onNoteDown: (mapping: KeyMapping) => void;
  onNoteUp: (mapping: KeyMapping) => void;
  className?: string;
  compact?: boolean;
}

const SOLFEGE_MAP: Record<string, string> = {
  'C': 'Do',
  'C#': 'Di',
  'D': 'Re',
  'D#': 'Ri',
  'E': 'Mi',
  'F': 'Fa',
  'F#': 'Fi',
  'G': 'Sol',
  'G#': 'Si',
  'A': 'La',
  'A#': 'Li',
  'B': 'Ti'
};

export const InteractiveKeyboard: React.FC<InteractiveKeyboardProps> = ({
  mappings,
  activeNotes,
  highlightedNotes = new Set(),
  scaleMode = 'chromatic',
  labelMode = 'keys',
  onNoteDown,
  onNoteUp,
  className = '',
  compact = false,
}) => {
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => setMouseDown(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const getLabel = (mapping: KeyMapping) => {
    if (labelMode === 'keys') {
      const keyName = mapping.keyboardKey.toUpperCase();
      return keyName === 'ENTER' ? '↵' : keyName;
    }
    if (labelMode === 'solfege') {
      const clean = mapping.note.replace(/[0-9]/g, '');
      return SOLFEGE_MAP[clean] || clean;
    }
    return mapping.note;
  };

  // Group into white keys and overlay black keys
  const whiteKeys = mappings.filter((m) => !m.isBlack);

  return (
    <div className={`relative flex select-none justify-center overflow-x-auto p-2 bg-slate-950 border-4 border-slate-800 rounded-lg shadow-inner ${className}`}>
      <div className="relative flex items-start">
        {/* Render white keys */}
        {whiteKeys.map((wKey, idx) => {
          const isActive = activeNotes.has(wKey.note);
          const isGuide = highlightedNotes.has(wKey.note);
          const inScale = isNoteInScale(wKey.note, scaleMode);

          // Find if there is a black key attached directly after this white key
          // In standard piano: C, D, F, G, A have black keys (C#, D#, F#, G#, A#)
          const cleanNote = wKey.note.replace(/[0-9]/g, '');
          const hasSharp = ['C', 'D', 'F', 'G', 'A'].includes(cleanNote);
          const sharpNoteName = `${cleanNote}#${wKey.octave}`;
          const bKey = mappings.find((m) => m.note === sharpNoteName && m.isBlack);

          return (
            <div key={wKey.note} className="relative flex-shrink-0">
              {/* White key button */}
              <button
                type="button"
                onMouseDown={() => {
                  setMouseDown(true);
                  onNoteDown(wKey);
                }}
                onMouseUp={() => onNoteUp(wKey)}
                onMouseEnter={() => {
                  if (mouseDown) onNoteDown(wKey);
                }}
                onMouseLeave={() => onNoteUp(wKey)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  onNoteDown(wKey);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  onNoteUp(wKey);
                }}
                className={`relative flex flex-col justify-end items-center pb-2 transition-all font-pixel text-slate-800 ${
                  compact ? 'w-8 h-28' : 'w-10 sm:w-12 md:w-14 h-36 md:h-44'
                } border-r-2 border-b-4 border-slate-400 rounded-b-md ${
                  isActive
                    ? 'bg-gradient-to-t from-cyan-400 to-cyan-200 translate-y-1 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                    : isGuide
                    ? 'bg-gradient-to-t from-yellow-300 to-yellow-100 ring-2 ring-yellow-400 animate-pulse'
                    : inScale
                    ? 'bg-gradient-to-t from-slate-100 to-white hover:from-slate-200'
                    : 'bg-slate-200 opacity-60'
                }`}
              >
                {/* Secondary note label */}
                <span className="text-[10px] font-mono text-slate-500 font-bold mb-0.5">
                  {wKey.note}
                </span>

                {/* Primary key binding badge */}
                <span
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                    isActive
                      ? 'bg-cyan-900 text-white'
                      : isGuide
                      ? 'bg-yellow-800 text-yellow-100'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {getLabel(wKey)}
                </span>
              </button>

              {/* Black key overlay positioned on the right seam */}
              {hasSharp && bKey && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setMouseDown(true);
                    onNoteDown(bKey);
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation();
                    onNoteUp(bKey);
                  }}
                  onMouseEnter={() => {
                    if (mouseDown) onNoteDown(bKey);
                  }}
                  onMouseLeave={() => onNoteUp(bKey)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onNoteDown(bKey);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onNoteUp(bKey);
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: compact ? '-11px' : '-14px',
                    zIndex: 20,
                  }}
                  className={`flex flex-col justify-end items-center pb-2 transition-all font-pixel text-white ${
                    compact ? 'w-5 h-16' : 'w-7 md:w-8 h-22 md:h-28'
                  } border-b-2 border-black rounded-b-sm ${
                    activeNotes.has(bKey.note)
                      ? 'bg-gradient-to-t from-pink-500 to-pink-300 translate-y-0.5 shadow-[0_0_12px_rgba(236,72,153,0.9)]'
                      : highlightedNotes.has(bKey.note)
                      ? 'bg-gradient-to-t from-yellow-500 to-yellow-400 ring-2 ring-yellow-300 animate-pulse text-black'
                      : !isNoteInScale(bKey.note, scaleMode)
                      ? 'bg-slate-900 opacity-40'
                      : 'bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 hover:from-slate-800'
                  }`}
                >
                  <span className="text-[9px] font-mono opacity-80 mb-0.5">
                    {bKey.note}
                  </span>
                  <span
                    className={`px-1 py-0.2 rounded text-[10px] font-bold ${
                      activeNotes.has(bKey.note)
                        ? 'bg-black text-pink-300'
                        : 'bg-slate-800 text-cyan-300'
                    }`}
                  >
                    {getLabel(bKey)}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
