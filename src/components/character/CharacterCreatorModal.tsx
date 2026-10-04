import React, { useState } from 'react';
import { 
  CharacterConfig, 
  SkinTone, 
  HairStyle, 
  SuitStyle, 
  VisorStyle, 
  Instrument, 
  PetCompanion 
} from '../../types/character';
import { PixelAvatar } from './PixelAvatar';
import { synthEngine } from '../../audio/retroSynth';

interface CharacterCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CharacterConfig;
  onSave: (newConfig: CharacterConfig) => void;
}

const PRESET_CHARACTERS: Array<{ label: string; config: CharacterConfig }> = [
  {
    label: 'Ace Commander',
    config: {
      name: 'Ace Nova',
      skinTone: 'peach',
      hairStyle: 'spiky',
      hairColor: '#38bdf8',
      suitStyle: 'ace_flightsuit',
      suitColor: '#1d4ed8',
      secondaryColor: '#f59e0b',
      visorStyle: 'gold_visor',
      visorColor: '#fbbf24',
      instrument: 'keytar_3000',
      petCompanion: 'star_drone',
    }
  },
  {
    label: 'Neon 80s Rocker',
    config: {
      name: 'Roxie Starlight',
      skinTone: 'tan',
      hairStyle: 'afro',
      hairColor: '#ec4899',
      suitStyle: 'synthwave_jumper',
      suitColor: '#831843',
      secondaryColor: '#06b6d4',
      visorStyle: 'pixel_shades',
      visorColor: '#000000',
      instrument: 'synth_axe',
      petCompanion: 'pixel_note',
    }
  },
  {
    label: 'Alien Maestro',
    config: {
      name: 'Zorblax-7',
      skinTone: 'alien_green',
      hairStyle: 'star_crown',
      hairColor: '#4ade80',
      suitStyle: 'mecha_armor',
      suitColor: '#15803d',
      secondaryColor: '#facc15',
      visorStyle: 'glowing_eyes',
      visorColor: '#f43f5e',
      instrument: 'cosmic_piano',
      petCompanion: 'space_cat',
    }
  },
  {
    label: 'Cyber Samurai',
    config: {
      name: 'Kaito Zero',
      skinTone: 'android_cyan',
      hairStyle: 'cyber_bob',
      hairColor: '#ffffff',
      suitStyle: 'stellar_tuxedo',
      suitColor: '#0f172a',
      secondaryColor: '#06b6d4',
      visorStyle: 'cyber_scanner',
      visorColor: '#06b6d4',
      instrument: 'double_synth',
      petCompanion: 'sparkle_orb',
    }
  },
];

const RANDOM_NAMES = [
  'Ace Nova', 'Ziggy Stardust', 'Captain Chiptune', 'Luna Bit', 'Cosmo Jax', 
  'Pixel Beat', 'Viper Synth', 'Starlight Neo', 'Commander Keys', 'Astro Echo',
  'Orion Solo', 'Glitch Vance', 'Dr. Arpeggio', 'Kira Wave', 'Solar Flash'
];

const SUIT_COLORS = ['#1d4ed8', '#dc2626', '#16a34a', '#7e22ce', '#db2777', '#d97706', '#0f172a', '#0891b2'];
const ACCENT_COLORS = ['#fbbf24', '#f43f5e', '#38bdf8', '#4ade80', '#a855f7', '#ffffff', '#ea580c'];
const HAIR_COLORS = ['#38bdf8', '#ec4899', '#facc15', '#f97316', '#22c55e', '#a855f7', '#1e293b', '#f8fafc'];

export const CharacterCreatorModal: React.FC<CharacterCreatorModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [draft, setDraft] = useState<CharacterConfig>(config);
  const [activeTab, setActiveTab] = useState<'appearance' | 'gear' | 'presets'>('appearance');
  const [testPlaying, setTestPlaying] = useState<boolean>(false);

  if (!isOpen) return null;

  const triggerTestSound = () => {
    synthEngine.playCoinSound();
    setTestPlaying(true);
    setTimeout(() => setTestPlaying(false), 300);
  };

  const handleRandomize = () => {
    synthEngine.playCoinSound();
    const randomSkin: SkinTone[] = ['peach', 'tan', 'deep', 'alien_green', 'android_cyan', 'cosmic_purple', 'solar_gold'];
    const randomHair: HairStyle[] = ['spiky', 'mohawk', 'astronaut_helmet', 'star_crown', 'pilot_visor', 'afro', 'cyber_bob'];
    const randomSuit: SuitStyle[] = ['ace_flightsuit', 'synthwave_jumper', 'mecha_armor', 'stellar_tuxedo', 'disco_sparkle', 'galactic_scout'];
    const randomVisor: VisorStyle[] = ['gold_visor', 'pixel_shades', 'cyber_scanner', 'glowing_eyes', 'star_glasses', 'clear_face'];
    const randomInst: Instrument[] = ['keytar_3000', 'synth_axe', 'cosmic_piano', 'laser_sticks', 'double_synth'];
    const randomPet: PetCompanion[] = ['star_drone', 'space_cat', 'pixel_note', 'sparkle_orb', 'none'];

    setDraft({
      name: RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)],
      skinTone: randomSkin[Math.floor(Math.random() * randomSkin.length)],
      hairStyle: randomHair[Math.floor(Math.random() * randomHair.length)],
      hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
      suitStyle: randomSuit[Math.floor(Math.random() * randomSuit.length)],
      suitColor: SUIT_COLORS[Math.floor(Math.random() * SUIT_COLORS.length)],
      secondaryColor: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
      visorStyle: randomVisor[Math.floor(Math.random() * randomVisor.length)],
      visorColor: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
      instrument: randomInst[Math.floor(Math.random() * randomInst.length)],
      petCompanion: randomPet[Math.floor(Math.random() * randomPet.length)],
    });
  };

  const handleSave = () => {
    synthEngine.playCheerSound();
    onSave(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] text-slate-100 p-6 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-cyan-400 animate-ping" />
            <h2 className="font-arcade text-sm md:text-base text-cyan-300 tracking-wide uppercase">
              CHARACTER CREATOR
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            [ESC / CLOSE]
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4 overflow-y-auto flex-1">
          
          {/* Left Column: Character Stage Preview */}
          <div className="md:col-span-5 flex flex-col items-center justify-between p-4 bg-slate-950/70 border border-slate-800">
            <div className="text-center w-full">
              <label className="text-xs font-arcade text-cyan-400 block mb-1">CODENAME</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  maxLength={18}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 text-center text-sm font-arcade text-yellow-300 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  title="Randomize Codename"
                  onClick={() => {
                    const rnd = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
                    setDraft(prev => ({ ...prev, name: rnd }));
                  }}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-400 border border-slate-700"
                >
                  🎲
                </button>
              </div>
            </div>

            {/* Pixel Character Stage Canvas */}
            <div className="my-6 relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-950/40 via-purple-950/20 to-slate-900 border border-cyan-500/20 w-full rounded">
              <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500">LIVE PREVIEW</div>
              
              <PixelAvatar
                config={draft}
                size={160}
                isPlaying={testPlaying}
                activeNote={testPlaying ? '♫ ACE' : null}
              />

              <button
                type="button"
                onClick={triggerTestSound}
                className="mt-4 px-3 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400 text-cyan-200 text-xs font-pixel transition-all hover:scale-105"
              >
                TEST ANIMATION ♪
              </button>
            </div>

            {/* Action buttons */}
            <div className="w-full flex gap-2">
              <button
                type="button"
                onClick={handleRandomize}
                className="flex-1 py-2 bg-purple-900/60 hover:bg-purple-800 border border-purple-500 text-purple-200 text-xs font-arcade text-center transition-colors"
              >
                RANDOMIZE
              </button>
            </div>
          </div>

          {/* Right Column: Customizer Tabs & Selectors */}
          <div className="md:col-span-7 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-slate-800 mb-4 gap-1">
              <button
                onClick={() => setActiveTab('appearance')}
                className={`px-4 py-2 text-xs font-arcade transition-colors ${
                  activeTab === 'appearance'
                    ? 'bg-cyan-950/60 text-cyan-300 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                APPEARANCE
              </button>
              <button
                onClick={() => setActiveTab('gear')}
                className={`px-4 py-2 text-xs font-arcade transition-colors ${
                  activeTab === 'gear'
                    ? 'bg-cyan-950/60 text-cyan-300 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                GEAR & PET
              </button>
              <button
                onClick={() => setActiveTab('presets')}
                className={`px-4 py-2 text-xs font-arcade transition-colors ${
                  activeTab === 'presets'
                    ? 'bg-cyan-950/60 text-cyan-300 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PRESETS
              </button>
            </div>

            {/* Tab Contents */}
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {activeTab === 'appearance' && (
                <>
                  {/* Skin Tone */}
                  <div>
                    <label className="text-xs font-arcade text-slate-300 block mb-2">SKIN TONE</label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {(['peach', 'tan', 'deep', 'alien_green', 'android_cyan', 'cosmic_purple', 'solar_gold'] as SkinTone[]).map((skin) => (
                        <button
                          key={skin}
                          type="button"
                          onClick={() => setDraft({ ...draft, skinTone: skin })}
                          className={`p-2 text-[10px] font-pixel capitalize border transition-all ${
                            draft.skinTone === skin
                              ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300'
                              : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
                          }`}
                        >
                          {skin.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hair Style */}
                  <div>
                    <label className="text-xs font-arcade text-slate-300 block mb-2">HAIR / HELMET</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(['spiky', 'mohawk', 'astronaut_helmet', 'star_crown', 'pilot_visor', 'afro', 'cyber_bob'] as HairStyle[]).map((hair) => (
                        <button
                          key={hair}
                          type="button"
                          onClick={() => setDraft({ ...draft, hairStyle: hair })}
                          className={`p-2 text-xs font-pixel capitalize border text-left transition-all ${
                            draft.hairStyle === hair
                              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                              : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {hair.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hair Color */}
                  <div>
                    <label className="text-xs font-arcade text-slate-300 block mb-2">HAIR COLOR</label>
                    <div className="flex flex-wrap gap-2">
                      {HAIR_COLORS.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setDraft({ ...draft, hairColor: col })}
                          style={{ backgroundColor: col }}
                          className={`w-7 h-7 rounded-sm border-2 transition-transform ${
                            draft.hairColor === col ? 'scale-110 border-white' : 'border-black hover:scale-105'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Visor & Expressions */}
                  <div>
                    <label className="text-xs font-arcade text-slate-300 block mb-2">VISOR / FACE</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(['gold_visor', 'pixel_shades', 'cyber_scanner', 'glowing_eyes', 'star_glasses', 'clear_face'] as VisorStyle[]).map((visor) => (
                        <button
                          key={visor}
                          type="button"
                          onClick={() => setDraft({ ...draft, visorStyle: visor })}
                          className={`p-2 text-xs font-pixel capitalize border text-left transition-all ${
                            draft.visorStyle === visor
                              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                              : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {visor.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'gear' && (
                <>
                  {/* Space Suit Style */}
                  <div>
                    <label className="text-xs font-arcade text-slate-300 block mb-2">SUIT MODEL</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['ace_flightsuit', 'synthwave_jumper', 'mecha_armor', 'stellar_tuxedo', 'disco_sparkle', 'galactic_scout'] as SuitStyle[]).map((suit) => (
                        <button
                          key={suit}
                          type="button"
                          onClick={() => setDraft({ ...draft, suitStyle: suit })}
                          className={`p-2 text-xs font-pixel capitalize border text-left transition-all ${
                            draft.suitStyle === suit
                              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                              : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {suit.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Suit Main Color */}
                  <div>
                    <label className="text-xs font-arcade text-slate-300 block mb-2">SUIT COLOR</label>
                    <div className="flex flex-wrap gap-2">
                      {SUIT_COLORS.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setDraft({ ...draft, suitColor: col })}
                          style={{ backgroundColor: col }}
                          className={`w-7 h-7 rounded-sm border-2 transition-transform ${
                            draft.suitColor === col ? 'scale-110 border-white' : 'border-black hover:scale-105'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Instrument */}
                  <div>
                    <label className="text-xs font-arcade text-slate-300 block mb-2">STAGE INSTRUMENT</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(['keytar_3000', 'synth_axe', 'cosmic_piano', 'laser_sticks', 'double_synth'] as Instrument[]).map((inst) => (
                        <button
                          key={inst}
                          type="button"
                          onClick={() => setDraft({ ...draft, instrument: inst })}
                          className={`p-2 text-xs font-pixel capitalize border text-left transition-all ${
                            draft.instrument === inst
                              ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300'
                              : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          🎹 {inst.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pet Companion */}
                  <div>
                    <label className="text-xs font-arcade text-slate-300 block mb-2">COMPANION DRONE / PET</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(['star_drone', 'space_cat', 'pixel_note', 'sparkle_orb', 'none'] as PetCompanion[]).map((pet) => (
                        <button
                          key={pet}
                          type="button"
                          onClick={() => setDraft({ ...draft, petCompanion: pet })}
                          className={`p-2 text-xs font-pixel capitalize border text-left transition-all ${
                            draft.petCompanion === pet
                              ? 'border-purple-400 bg-purple-400/10 text-purple-300'
                              : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {pet === 'none' ? 'None' : `✨ ${pet.replace('_', ' ')}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'presets' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESET_CHARACTERS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setDraft(preset.config)}
                      className="p-3 bg-slate-950 border border-slate-800 hover:border-cyan-400 text-left flex items-center gap-3 transition-colors"
                    >
                      <PixelAvatar config={preset.config} size={50} showPet={false} />
                      <div>
                        <div className="font-arcade text-xs text-cyan-300">{preset.label}</div>
                        <div className="text-[11px] font-mono text-slate-400">{preset.config.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-cyan-500/30">
          <div className="text-xs font-mono text-slate-400 hidden sm:block">
            ACE SPACE · PILOT CUSTOMIZATION SUITE
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-arcade text-slate-300 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-arcade font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all"
            >
              SAVE CHARACTER
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
