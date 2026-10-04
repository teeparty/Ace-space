export type GameMenu = 'music' | 'earth' | 'keyboard_settings';

export type WaveformType = 'square' | 'sawtooth' | 'triangle' | 'sine' | 'pulse';

export interface SynthPreset {
  id: string;
  name: string;
  waveform: WaveformType;
  attack: number; // 0 to 1s
  decay: number;  // 0 to 1s
  sustain: number;// 0 to 1
  release: number;// 0 to 2s
  filterCutoff: number; // 200 to 10000 Hz
  resonance: number;    // 0 to 20
  bitDepth: number;     // 4 to 16 bits (lo-fi)
  delayFeedback: number;// 0 to 0.8
  delayTime: number;    // 0.1 to 0.6s
  vibratoRate: number;  // 0 to 10 Hz
  vibratoDepth: number; // 0 to 20 cents
}

export interface KeyMapping {
  note: string;         // e.g. "C4", "C#4", "D4"
  keyboardKey: string;   // e.g. "a", "w", "s"
  frequency: number;    // Hz e.g. 261.63
  isBlack: boolean;
  octave: number;
}

export interface MusicPlaybackKeybindings {
  playPauseKey: string;    // e.g. " " (Space)
  nextTrackKey: string;    // e.g. "]"
  prevTrackKey: string;    // e.g. "["
  toggleLoopKey: string;   // e.g. "l"
  toggleDrumsKey: string;  // e.g. "b"
  triggerTrack1: string;   // e.g. "1"
  triggerTrack2: string;   // e.g. "2"
  triggerTrack3: string;   // e.g. "3"
  triggerTrack4: string;   // e.g. "4"
  triggerTrack5: string;   // e.g. "5"
}

export const DEFAULT_MUSIC_KEYBINDINGS: MusicPlaybackKeybindings = {
  playPauseKey: ' ',
  nextTrackKey: ']',
  prevTrackKey: '[',
  toggleLoopKey: 'l',
  toggleDrumsKey: 'b',
  triggerTrack1: '1',
  triggerTrack2: '2',
  triggerTrack3: '3',
  triggerTrack4: '4',
  triggerTrack5: '5',
};

export type ScaleMode = 
  | 'chromatic' 
  | 'major' 
  | 'minor' 
  | 'pentatonic' 
  | 'blues' 
  | 'japanese' 
  | 'byzantine';

export interface EarthLocation {
  id: string;
  name: string;
  country: string;
  continent: string;
  lat: number;
  lng: number;
  description: string;
  vibe: string;
  recommendedBpm: number;
  bgPalette: {
    skyTop: string;
    skyBottom: string;
    stageAccent: string;
    neonColor: string;
  };
  pixelLandmark: string;
  funFact: string;
  visitedCount: number;
}

export interface CustomBeat {
  id: string;
  title: string;
  locationId?: string;
  locationName: string;
  bpm: number;
  date: string;
  pattern: {
    kick: boolean[];
    snare: boolean[];
    hihat: boolean[];
    bass: number[];
  };
}

export interface RecordedTrack {
  id: string;
  title: string;
  locationId?: string;
  locationName: string;
  performerName?: string;
  bpm?: number;
  date: string;
  duration: number; // seconds
  notesCount: number;
  events: Array<{
    note: string;
    time: number;
    duration: number;
  }>;
}
