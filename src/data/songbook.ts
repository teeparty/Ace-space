export interface SongGuide {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Master';
  description: string;
  notes: Array<{
    note: string;
    durationMs: number;
    pauseAfterMs?: number;
  }>;
}

export const SONGBOOK: SongGuide[] = [
  {
    id: 'space_odyssey',
    title: 'Ace Space Odyssey Theme',
    difficulty: 'Easy',
    description: 'The heroic fanfare of Ace Space traveling through the starfield toward Earth.',
    notes: [
      { note: 'C4', durationMs: 400, pauseAfterMs: 100 },
      { note: 'G4', durationMs: 400, pauseAfterMs: 100 },
      { note: 'C5', durationMs: 800, pauseAfterMs: 200 },
      { note: 'E5', durationMs: 400, pauseAfterMs: 100 },
      { note: 'D5', durationMs: 400, pauseAfterMs: 100 },
      { note: 'C5', durationMs: 800, pauseAfterMs: 300 },
      { note: 'G4', durationMs: 400, pauseAfterMs: 100 },
      { note: 'A4', durationMs: 400, pauseAfterMs: 100 },
      { note: 'C5', durationMs: 1000, pauseAfterMs: 400 },
    ]
  },
  {
    id: 'twinkle_star',
    title: 'Twinkle Starlight',
    difficulty: 'Easy',
    description: 'A classic celestial lullaby tuned to 8-bit cosmic synthesizer frequencies.',
    notes: [
      { note: 'C4', durationMs: 350 }, { note: 'C4', durationMs: 350 },
      { note: 'G4', durationMs: 350 }, { note: 'G4', durationMs: 350 },
      { note: 'A4', durationMs: 350 }, { note: 'A4', durationMs: 350 },
      { note: 'G4', durationMs: 700, pauseAfterMs: 200 },
      { note: 'F4', durationMs: 350 }, { note: 'F4', durationMs: 350 },
      { note: 'E4', durationMs: 350 }, { note: 'E4', durationMs: 350 },
      { note: 'D4', durationMs: 350 }, { note: 'D4', durationMs: 350 },
      { note: 'C4', durationMs: 700, pauseAfterMs: 300 },
    ]
  },
  {
    id: 'retro_fanfare',
    title: 'Level Clear Fanfare',
    difficulty: 'Medium',
    description: 'Iconic arcade victory jingle when arriving at an Earth concert hall.',
    notes: [
      { note: 'G4', durationMs: 150 },
      { note: 'C5', durationMs: 150 },
      { note: 'E5', durationMs: 150 },
      { note: 'G5', durationMs: 300, pauseAfterMs: 100 },
      { note: 'E5', durationMs: 150 },
      { note: 'G5', durationMs: 600, pauseAfterMs: 200 },
    ]
  },
  {
    id: 'ode_to_joy',
    title: 'Ode to Earth',
    difficulty: 'Medium',
    description: 'Joyful universal anthem celebrating Earth from the cosmos.',
    notes: [
      { note: 'E4', durationMs: 300 }, { note: 'E4', durationMs: 300 },
      { note: 'F4', durationMs: 300 }, { note: 'G4', durationMs: 300 },
      { note: 'G4', durationMs: 300 }, { note: 'F4', durationMs: 300 },
      { note: 'E4', durationMs: 300 }, { note: 'D4', durationMs: 300 },
      { note: 'C4', durationMs: 300 }, { note: 'C4', durationMs: 300 },
      { note: 'D4', durationMs: 300 }, { note: 'E4', durationMs: 300 },
      { note: 'E4', durationMs: 450 }, { note: 'D4', durationMs: 200 },
      { note: 'D4', durationMs: 600 },
    ]
  }
];
