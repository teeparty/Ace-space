import React from 'react';
import { CharacterConfig, SkinTone } from '../../types/character';

interface PixelAvatarProps {
  config: CharacterConfig;
  size?: number; // pixel size e.g. 64, 128, 192
  isPlaying?: boolean;
  activeNote?: string | null;
  className?: string;
  showPet?: boolean;
}

const SKIN_COLORS: Record<SkinTone, { base: string; shadow: string }> = {
  peach: { base: '#fed7aa', shadow: '#fb923c' },
  tan: { base: '#fde047', shadow: '#ca8a04' },
  deep: { base: '#a16207', shadow: '#713f12' },
  alien_green: { base: '#4ade80', shadow: '#16a34a' },
  android_cyan: { base: '#38bdf8', shadow: '#0284c7' },
  cosmic_purple: { base: '#c084fc', shadow: '#7e22ce' },
  solar_gold: { base: '#facc15', shadow: '#d97706' },
};

export const PixelAvatar: React.FC<PixelAvatarProps> = ({
  config,
  size = 120,
  isPlaying = false,
  activeNote = null,
  className = '',
  showPet = true,
}) => {
  const skin = SKIN_COLORS[config.skinTone] || SKIN_COLORS.peach;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Musical notes flying up when playing */}
      {isPlaying && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none flex gap-2 animate-bounce">
          <span className="text-pink-400 font-pixel text-xs drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
            ♪ {activeNote || '♫'}
          </span>
        </div>
      )}

      {/* SVG 32x32 Pixel Art Character */}
      <svg
        viewBox="0 0 32 32"
        className={`w-full h-full pixel-art filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] ${
          isPlaying ? 'scale-105' : 'animate-pulse'
        } transition-transform duration-100`}
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {/* Shadow on ground */}
        <ellipse cx="16" cy="30" rx="9" ry="2" fill="rgba(0,0,0,0.5)" />

        {/* --- JETPACK / AURA --- */}
        {config.petCompanion !== 'none' && showPet && (
          <g className="animate-bounce">
            {config.petCompanion === 'star_drone' && (
              <>
                <rect x="24" y="8" width="4" height="4" fill="#38bdf8" />
                <rect x="25" y="9" width="2" height="2" fill="#ffffff" />
                <rect x="24" y="12" width="1" height="2" fill="#64748b" />
                <rect x="27" y="12" width="1" height="2" fill="#64748b" />
              </>
            )}
            {config.petCompanion === 'space_cat' && (
              <>
                <rect x="23" y="18" width="5" height="5" fill="#f59e0b" />
                <rect x="23" y="16" width="2" height="2" fill="#d97706" />
                <rect x="26" y="16" width="2" height="2" fill="#d97706" />
                <rect x="24" y="19" width="1" height="1" fill="#000" />
                <rect x="26" y="19" width="1" height="1" fill="#000" />
              </>
            )}
            {config.petCompanion === 'pixel_note' && (
              <>
                <rect x="25" y="6" width="2" height="2" fill="#ec4899" />
                <rect x="26" y="8" width="1" height="4" fill="#ec4899" />
                <rect x="24" y="11" width="3" height="2" fill="#f43f5e" />
              </>
            )}
            {config.petCompanion === 'sparkle_orb' && (
              <>
                <rect x="24" y="7" width="3" height="3" fill="#a855f7" />
                <rect x="25" y="6" width="1" height="5" fill="#e9d5ff" />
                <rect x="23" y="8" width="5" height="1" fill="#e9d5ff" />
              </>
            )}
          </g>
        )}

        {/* --- LEGS & BOOTS --- */}
        {/* Left Leg */}
        <rect x="11" y="22" width="4" height="5" fill={config.suitColor} />
        <rect x="11" y="27" width="4" height="3" fill="#0f172a" />
        <rect x="10" y="28" width="5" height="2" fill={config.secondaryColor} />

        {/* Right Leg */}
        <rect x="17" y="22" width="4" height="5" fill={config.suitColor} />
        <rect x="17" y="27" width="4" height="3" fill="#0f172a" />
        <rect x="17" y="28" width="5" height="2" fill={config.secondaryColor} />

        {/* --- TORSO & SPACE SUIT --- */}
        <rect x="10" y="14" width="12" height="9" fill={config.suitColor} />
        {/* Chest Plate / Accent stripe */}
        <rect x="13" y="15" width="6" height="6" fill={config.secondaryColor} />
        <rect x="14" y="17" width="4" height="2" fill="#ffffff" opacity="0.8" />
        {/* Belt */}
        <rect x="10" y="21" width="12" height="2" fill="#1e293b" />
        <rect x="15" y="21" width="2" height="2" fill="#fbbf24" />

        {/* --- HEAD & FACE --- */}
        <rect x="11" y="6" width="10" height="8" fill={skin.base} />
        <rect x="11" y="12" width="10" height="2" fill={skin.shadow} />

        {/* Helmet ring / collar */}
        {config.hairStyle === 'astronaut_helmet' ? (
          <>
            {/* Astronaut Glass Dome */}
            <circle cx="16" cy="10" r="7" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <rect x="9" y="4" width="14" height="11" fill="none" stroke="#64748b" strokeWidth="1" />
            <rect x="10" y="13" width="12" height="2" fill="#94a3b8" />
          </>
        ) : null}

        {/* Hair Styles */}
        {config.hairStyle === 'spiky' && (
          <g fill={config.hairColor}>
            <rect x="10" y="3" width="3" height="4" />
            <rect x="13" y="2" width="3" height="5" />
            <rect x="16" y="1" width="3" height="6" />
            <rect x="19" y="3" width="3" height="4" />
            <rect x="9" y="5" width="2" height="3" />
            <rect x="21" y="5" width="2" height="3" />
          </g>
        )}
        {config.hairStyle === 'mohawk' && (
          <g fill={config.hairColor}>
            <rect x="15" y="1" width="2" height="6" />
            <rect x="14" y="2" width="4" height="4" />
            <rect x="15" y="7" width="2" height="2" />
          </g>
        )}
        {config.hairStyle === 'star_crown' && (
          <g fill="#fbbf24">
            <rect x="11" y="4" width="2" height="3" />
            <rect x="15" y="2" width="2" height="5" />
            <rect x="19" y="4" width="2" height="3" />
            <rect x="11" y="5" width="10" height="2" />
          </g>
        )}
        {config.hairStyle === 'pilot_visor' && (
          <g fill="#334155">
            <rect x="10" y="4" width="12" height="3" />
            <rect x="9" y="6" width="3" height="2" fill="#64748b" />
            <rect x="20" y="6" width="3" height="2" fill="#64748b" />
          </g>
        )}
        {config.hairStyle === 'afro' && (
          <g fill={config.hairColor}>
            <rect x="8" y="2" width="16" height="6" />
            <rect x="7" y="4" width="18" height="6" />
            <rect x="8" y="5" width="3" height="4" />
            <rect x="21" y="5" width="3" height="4" />
          </g>
        )}
        {config.hairStyle === 'cyber_bob' && (
          <g fill={config.hairColor}>
            <rect x="10" y="4" width="12" height="3" />
            <rect x="9" y="5" width="3" height="7" />
            <rect x="20" y="5" width="3" height="7" />
          </g>
        )}

        {/* Visor & Eyes */}
        {config.visorStyle === 'gold_visor' && (
          <g>
            <rect x="11" y="8" width="10" height="4" fill={config.visorColor} />
            <rect x="12" y="9" width="3" height="1" fill="#ffffff" />
            <rect x="16" y="9" width="4" height="1" fill="#ffffff" opacity="0.6" />
          </g>
        )}
        {config.visorStyle === 'pixel_shades' && (
          <g>
            <rect x="11" y="8" width="4" height="3" fill="#000000" />
            <rect x="17" y="8" width="4" height="3" fill="#000000" />
            <rect x="15" y="8" width="2" height="1" fill="#000000" />
            <rect x="12" y="8" width="1" height="1" fill="#ffffff" />
            <rect x="18" y="8" width="1" height="1" fill="#ffffff" />
          </g>
        )}
        {config.visorStyle === 'cyber_scanner' && (
          <g>
            <rect x="10" y="8" width="12" height="2" fill={config.visorColor} />
            <rect x="17" y="8" width="2" height="2" fill="#ffffff" />
            <rect x="9" y="7" width="2" height="4" fill="#475569" />
          </g>
        )}
        {config.visorStyle === 'glowing_eyes' && (
          <g>
            <rect x="13" y="8" width="2" height="2" fill={config.visorColor} />
            <rect x="17" y="8" width="2" height="2" fill={config.visorColor} />
          </g>
        )}
        {config.visorStyle === 'star_glasses' && (
          <g fill={config.visorColor}>
            <rect x="12" y="8" width="2" height="2" />
            <rect x="13" y="7" width="1" height="4" />
            <rect x="18" y="8" width="2" height="2" />
            <rect x="19" y="7" width="1" height="4" />
          </g>
        )}
        {config.visorStyle === 'clear_face' && (
          <g>
            {/* Classic 8-bit eyes and smile */}
            <rect x="13" y="8" width="2" height="2" fill="#0f172a" />
            <rect x="17" y="8" width="2" height="2" fill="#0f172a" />
            <rect x="14" y="11" width="4" height="1" fill="#dc2626" />
          </g>
        )}

        {/* --- INSTRUMENTS --- */}
        {config.instrument === 'keytar_3000' && (
          <g transform={isPlaying ? 'rotate(-6 16 18)' : 'rotate(0 16 18)'}>
            {/* Body */}
            <polygon points="7,20 25,14 26,18 9,23" fill="#ec4899" />
            {/* Keys */}
            <rect x="10" y="19" width="1" height="3" fill="#ffffff" />
            <rect x="12" y="18" width="1" height="3" fill="#ffffff" />
            <rect x="14" y="17" width="1" height="3" fill="#ffffff" />
            <rect x="16" y="16" width="1" height="3" fill="#ffffff" />
            <rect x="18" y="15" width="1" height="3" fill="#ffffff" />
            {/* Neck */}
            <rect x="23" y="12" width="4" height="3" fill="#1e293b" />
          </g>
        )}

        {config.instrument === 'synth_axe' && (
          <g transform={isPlaying ? 'rotate(5 16 18)' : 'rotate(0 16 18)'}>
            <polygon points="6,15 9,24 13,22 11,14" fill="#8b5cf6" />
            <rect x="11" y="17" width="15" height="2" fill="#e2e8f0" />
            <rect x="24" y="15" width="4" height="4" fill="#fbbf24" />
          </g>
        )}

        {config.instrument === 'cosmic_piano' && (
          <g>
            <rect x="6" y="19" width="20" height="5" fill="#0f172a" />
            <rect x="7" y="20" width="18" height="2" fill="#ffffff" />
            <rect x="8" y="20" width="2" height="1" fill="#000000" />
            <rect x="11" y="20" width="2" height="1" fill="#000000" />
            <rect x="15" y="20" width="2" height="1" fill="#000000" />
            <rect x="18" y="20" width="2" height="1" fill="#000000" />
            <rect x="21" y="20" width="2" height="1" fill="#000000" />
            {/* Stand */}
            <line x1="8" y1="24" x2="8" y2="29" stroke="#94a3b8" strokeWidth="1" />
            <line x1="24" y1="24" x2="24" y2="29" stroke="#94a3b8" strokeWidth="1" />
          </g>
        )}

        {config.instrument === 'laser_sticks' && (
          <g>
            <line x1="8" y1="13" x2="14" y2="21" stroke="#06b6d4" strokeWidth="2" />
            <line x1="24" y1="13" x2="18" y2="21" stroke="#f43f5e" strokeWidth="2" />
            <circle cx="8" cy="13" r="1.5" fill="#ffffff" />
            <circle cx="24" cy="13" r="1.5" fill="#ffffff" />
          </g>
        )}

        {config.instrument === 'double_synth' && (
          <g transform={isPlaying ? 'scale(1.05)' : 'none'}>
            <polygon points="7,17 25,12 25,16 8,20" fill="#10b981" />
            <polygon points="7,20 25,16 25,20 8,24" fill="#06b6d4" />
          </g>
        )}

        {/* --- ARMS / HANDS --- */}
        {isPlaying ? (
          <>
            {/* Rocking arms */}
            <rect x="8" y="16" width="3" height="4" fill={config.suitColor} />
            <rect x="9" y="19" width="3" height="2" fill={skin.base} />
            <rect x="21" y="15" width="3" height="4" fill={config.suitColor} />
            <rect x="20" y="18" width="3" height="2" fill={skin.base} />
          </>
        ) : (
          <>
            {/* Relaxed / holding arms */}
            <rect x="7" y="15" width="3" height="5" fill={config.suitColor} />
            <rect x="7" y="19" width="3" height="2" fill={skin.base} />
            <rect x="22" y="15" width="3" height="5" fill={config.suitColor} />
            <rect x="22" y="19" width="3" height="2" fill={skin.base} />
          </>
        )}
      </svg>
    </div>
  );
};
