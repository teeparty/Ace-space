import { KeyMapping, ScaleMode } from '../types/game';

// Standard 440Hz tuning formula: 440 * 2^((midi - 69)/12)
export function getFrequency(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const DEFAULT_KEY_MAPPINGS: KeyMapping[] = [
  // Octave 4
  { note: 'C4',  keyboardKey: 'a', frequency: 261.63, isBlack: false, octave: 4 },
  { note: 'C#4', keyboardKey: 'w', frequency: 277.18, isBlack: true,  octave: 4 },
  { note: 'D4',  keyboardKey: 's', frequency: 293.66, isBlack: false, octave: 4 },
  { note: 'D#4', keyboardKey: 'e', frequency: 311.13, isBlack: true,  octave: 4 },
  { note: 'E4',  keyboardKey: 'd', frequency: 329.63, isBlack: false, octave: 4 },
  { note: 'F4',  keyboardKey: 'f', frequency: 349.23, isBlack: false, octave: 4 },
  { note: 'F#4', keyboardKey: 't', frequency: 369.99, isBlack: true,  octave: 4 },
  { note: 'G4',  keyboardKey: 'g', frequency: 392.00, isBlack: false, octave: 4 },
  { note: 'G#4', keyboardKey: 'y', frequency: 415.30, isBlack: true,  octave: 4 },
  { note: 'A4',  keyboardKey: 'h', frequency: 440.00, isBlack: false, octave: 4 },
  { note: 'A#4', keyboardKey: 'u', frequency: 466.16, isBlack: true,  octave: 4 },
  { note: 'B4',  keyboardKey: 'j', frequency: 493.88, isBlack: false, octave: 4 },

  // Octave 5
  { note: 'C5',  keyboardKey: 'k', frequency: 523.25, isBlack: false, octave: 5 },
  { note: 'C#5', keyboardKey: 'o', frequency: 554.37, isBlack: true,  octave: 5 },
  { note: 'D5',  keyboardKey: 'l', frequency: 587.33, isBlack: false, octave: 5 },
  { note: 'D#5', keyboardKey: 'p', frequency: 622.25, isBlack: true,  octave: 5 },
  { note: 'E5',  keyboardKey: ';', frequency: 659.25, isBlack: false, octave: 5 },
  { note: 'F5',  keyboardKey: "'", frequency: 698.46, isBlack: false, octave: 5 },
  { note: 'F#5', keyboardKey: ']', frequency: 739.99, isBlack: true,  octave: 5 },
  { note: 'G5',  keyboardKey: 'Enter', frequency: 783.99, isBlack: false, octave: 5 },
];

export const SCALE_INTERVALS: Record<ScaleMode, number[]> = {
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
  blues: [0, 3, 5, 6, 7, 10],
  japanese: [0, 1, 5, 7, 8],     // Insen scale
  byzantine: [0, 1, 4, 5, 7, 8, 11], // Double harmonic
};

export function isNoteInScale(noteName: string, scale: ScaleMode, rootNote = 'C'): boolean {
  if (scale === 'chromatic') return true;
  const rootIdx = NOTE_NAMES.indexOf(rootNote);
  const cleanNote = noteName.replace(/[0-9]/g, '');
  const noteIdx = NOTE_NAMES.indexOf(cleanNote);
  if (noteIdx === -1) return true;

  const interval = (noteIdx - rootIdx + 12) % 12;
  return SCALE_INTERVALS[scale].includes(interval);
}
