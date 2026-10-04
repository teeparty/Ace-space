export type SkinTone = 
  | 'peach' 
  | 'tan' 
  | 'deep' 
  | 'alien_green' 
  | 'android_cyan' 
  | 'cosmic_purple' 
  | 'solar_gold';

export type HairStyle = 
  | 'spiky' 
  | 'mohawk' 
  | 'astronaut_helmet' 
  | 'star_crown' 
  | 'pilot_visor' 
  | 'afro' 
  | 'cyber_bob';

export type SuitStyle = 
  | 'ace_flightsuit' 
  | 'synthwave_jumper' 
  | 'mecha_armor' 
  | 'stellar_tuxedo' 
  | 'disco_sparkle' 
  | 'galactic_scout';

export type VisorStyle = 
  | 'gold_visor' 
  | 'pixel_shades' 
  | 'cyber_scanner' 
  | 'glowing_eyes' 
  | 'star_glasses' 
  | 'clear_face';

export type Instrument = 
  | 'keytar_3000' 
  | 'synth_axe' 
  | 'cosmic_piano' 
  | 'laser_sticks' 
  | 'double_synth';

export type PetCompanion = 
  | 'star_drone' 
  | 'space_cat' 
  | 'pixel_note' 
  | 'sparkle_orb' 
  | 'none';

export interface CharacterConfig {
  name: string;
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: string;
  suitStyle: SuitStyle;
  suitColor: string;
  secondaryColor: string;
  visorStyle: VisorStyle;
  visorColor: string;
  instrument: Instrument;
  petCompanion: PetCompanion;
}

export const DEFAULT_CHARACTER: CharacterConfig = {
  name: 'Ace Nova',
  skinTone: 'peach',
  hairStyle: 'spiky',
  hairColor: '#38bdf8', // electric cyan
  suitStyle: 'ace_flightsuit',
  suitColor: '#2563eb', // royal blue
  secondaryColor: '#f59e0b', // solar amber
  visorStyle: 'gold_visor',
  visorColor: '#fbbf24',
  instrument: 'keytar_3000',
  petCompanion: 'star_drone',
};
