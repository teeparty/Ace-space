import { CustomBeat } from '../types/game';

export const DEFAULT_SAVED_BEATS: CustomBeat[] = [
  {
    id: 'beat_tokyo_electro',
    title: 'Shibuya Neon Trap',
    locationId: 'tokyo',
    locationName: 'Shibuya Neon Crossing',
    bpm: 128,
    date: 'Cosmic Tour 2026',
    pattern: {
      kick:  [true, false, false, false, false, false, true, false, true, false, false, false, false, false, true, false],
      snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      bass:  [110, 0, 0, 110, 0, 0, 130.81, 0, 98, 0, 0, 98, 110, 0, 146.83, 0],
    },
  },
  {
    id: 'beat_pyramids_pulse',
    title: 'Giza Desert 4-on-Floor',
    locationId: 'pyramids',
    locationName: 'Great Pyramids of Giza',
    bpm: 104,
    date: 'Cosmic Tour 2026',
    pattern: {
      kick:  [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      snare: [false, false, false, false, true, false, false, true, false, false, true, false, true, false, false, false],
      hihat: [true, false, true, false, true, false, true, true, false, true, true, false, true, false, true, true],
      bass:  [146.83, 0, 155.56, 0, 185.00, 0, 196.00, 0, 185.00, 0, 155.56, 0, 146.83, 0, 138.59, 0],
    },
  },
  {
    id: 'beat_rio_samba',
    title: 'Copacabana Bossa Stabs',
    locationId: 'christ',
    locationName: 'Christ the Redeemer',
    bpm: 124,
    date: 'Cosmic Tour 2026',
    pattern: {
      kick:  [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true],
      snare: [false, false, true, false, false, true, false, false, false, false, true, false, false, true, false, false],
      hihat: [true, true, true, false, true, true, true, false, true, true, true, false, true, true, true, false],
      bass:  [130.81, 0, 146.83, 0, 155.56, 0, 174.61, 0, 196.00, 0, 220.00, 0, 196.00, 0, 155.56, 0],
    },
  },
  {
    id: 'beat_times_square_rock',
    title: 'Times Square Heavy Stomp',
    locationId: 'times_square',
    locationName: 'Times Square Crossroads',
    bpm: 130,
    date: 'Cosmic Tour 2026',
    pattern: {
      kick:  [true, false, true, false, false, false, true, false, true, false, false, false, true, false, false, false],
      snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, true],
      hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      bass:  [110, 110, 0, 110, 0, 0, 130.81, 0, 146.83, 146.83, 0, 130.81, 110, 0, 98, 0],
    },
  },
  {
    id: 'beat_aurora_chill',
    title: 'Reykjavik Sub-Bass Pulse',
    locationId: 'aurora',
    locationName: 'Reykjavik Aurora Borealis',
    bpm: 92,
    date: 'Cosmic Tour 2026',
    pattern: {
      kick:  [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
      snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hihat: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      bass:  [82.41, 0, 0, 0, 98.00, 0, 0, 0, 110.00, 0, 0, 0, 123.47, 0, 0, 0],
    },
  },
];
