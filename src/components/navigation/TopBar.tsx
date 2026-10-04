import React from 'react';
import { GameMenu } from '../../types/game';
import { CharacterConfig } from '../../types/character';
import { PixelAvatar } from '../character/PixelAvatar';

interface TopBarProps {
  currentMenu: GameMenu;
  onSelectMenu: (menu: GameMenu) => void;
  character: CharacterConfig;
  onOpenCharacterCreator: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isCrtEnabled: boolean;
  onToggleCrt: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentMenu,
  onSelectMenu,
  character,
  onOpenCharacterCreator,
  isMuted,
  onToggleMute,
  isCrtEnabled,
  onToggleCrt,
}) => {
  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-md border-b-2 border-cyan-500/40 sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      
      {/* Zone 1: Brand Title (Single text element wordmark in display face) */}
      <button
        onClick={() => onSelectMenu('earth')}
        className="text-base sm:text-xl font-arcade tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
      >
        <span className="text-yellow-400">★</span>
        <span>ACE SPACE</span>
      </button>

      {/* Zone 2: The Three Navigation Menus (music, earth, keyboard settings) */}
      <nav className="flex items-center gap-2 sm:gap-6 font-arcade text-xs tracking-wide">
        <button
          onClick={() => onSelectMenu('music')}
          className={`py-1.5 px-2.5 sm:px-3 rounded-xs whitespace-nowrap transition-colors border ${
            currentMenu === 'music'
              ? 'border-pink-500 bg-pink-950/60 text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.4)]'
              : 'border-transparent text-slate-400 hover:text-slate-100 hover:border-slate-800'
          }`}
        >
          MUSIC
        </button>

        <button
          onClick={() => onSelectMenu('earth')}
          className={`py-1.5 px-2.5 sm:px-3 rounded-xs whitespace-nowrap transition-colors border ${
            currentMenu === 'earth'
              ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              : 'border-transparent text-slate-400 hover:text-slate-100 hover:border-slate-800'
          }`}
        >
          EARTH
        </button>

        <button
          onClick={() => onSelectMenu('keyboard_settings')}
          className={`py-1.5 px-2.5 sm:px-3 rounded-xs whitespace-nowrap transition-colors border ${
            currentMenu === 'keyboard_settings'
              ? 'border-yellow-400 bg-yellow-950/60 text-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.4)]'
              : 'border-transparent text-slate-400 hover:text-slate-100 hover:border-slate-800'
          }`}
        >
          KEYBOARD SETTINGS
        </button>
      </nav>

      {/* Zone 3: Primary Actions (Pilot Customizer & Sound/CRT controls) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Pilot Button */}
        <button
          type="button"
          onClick={onOpenCharacterCreator}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-cyan-500/60 text-cyan-300 text-xs font-arcade transition-all hover:scale-105"
          title="Customize Character Avatar"
        >
          <PixelAvatar config={character} size={24} showPet={false} />
          <span className="hidden md:inline">{character.name}</span>
          <span className="text-[10px] text-yellow-400 hidden sm:inline">EDIT</span>
        </button>

        {/* CRT Scanline Toggle */}
        <button
          type="button"
          onClick={onToggleCrt}
          className={`px-2 py-1 text-[10px] font-mono border hidden sm:block transition-colors ${
            isCrtEnabled
              ? 'border-emerald-500 text-emerald-300 bg-emerald-950/50'
              : 'border-slate-800 text-slate-500 bg-slate-900'
          }`}
          title="Toggle CRT Scanline Overlay"
        >
          CRT {isCrtEnabled ? 'ON' : 'OFF'}
        </button>

        {/* Audio Mute/Unmute */}
        <button
          type="button"
          onClick={onToggleMute}
          className={`px-2.5 py-1 text-xs font-mono border transition-colors ${
            isMuted
              ? 'border-rose-500 text-rose-300 bg-rose-950/50'
              : 'border-slate-700 text-slate-300 bg-slate-900 hover:border-slate-500'
          }`}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

    </header>
  );
};
