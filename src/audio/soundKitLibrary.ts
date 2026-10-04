export type GenreId = 
  | 'hip_hop'
  | 'trap'
  | 'drill'
  | 'rnb'
  | 'boom_bap'
  | 'lofi'
  | 'west_coast'
  | 'memphis'
  | 'jersey_club'
  | 'baltimore_club'
  | 'detroit'
  | 'afrobeats'
  | 'dancehall'
  | 'reggaeton'
  | 'house'
  | 'tech_house'
  | 'uk_garage'
  | 'uk_drill'
  | 'grime'
  | 'breakbeat'
  | 'dnb'
  | 'pop'
  | 'electronic'
  | 'experimental';

export type DrumSoundType = 
  | 'kick'
  | 'snare'
  | 'clap'
  | 'hihat_closed'
  | 'hihat_open'
  | 'rim'
  | 'perc'
  | 'crash'
  | 'ride'
  | 'sub_808'
  | 'perc_loop'
  | 'fill'
  | 'fx_transition';

export type MelodicCategory = 
  | 'piano'
  | 'electric_piano'
  | 'synths'
  | 'pads'
  | 'strings'
  | 'brass'
  | 'bells'
  | 'plucks'
  | 'guitars'
  | 'bass'
  | '808_bass'
  | 'leads'
  | 'chords'
  | 'vocal_chops'
  | 'atmospheric_textures';

export interface DrumSampleSpec {
  id: string;
  name: string;
  type: DrumSoundType;
  variationLabel: string;
  description: string;
  keyShortcut: string;
  dsp: {
    baseFreq: number;
    decay: number;
    pitchDecay?: number;
    filterFreq: number;
    filterType: BiquadFilterType;
    resonance?: number;
    noiseAmount?: number;
    distortion?: number;
    clickTransient?: boolean;
    harmonicOvertones?: number[];
    isCowbell?: boolean;
    isBedSqueak?: boolean;
    isAmapianoLog?: boolean;
    isShaker?: boolean;
    loopBpm?: number;
    loopPattern?: string;
  };
}

export interface SoundKit {
  id: string;
  name: string;
  genre: GenreId;
  description: string;
  bpmDefault: number;
  color: string;
  samples: DrumSampleSpec[];
}

export interface MelodicSoundSpec {
  id: string;
  name: string;
  category: MelodicCategory;
  genreVibe: string;
  description: string;
  waveform: OscillatorType;
  filterType: BiquadFilterType;
  filterCutoff: number;
  resonance: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  detuneSpread?: number;
  subOsc?: boolean;
  fmRatio?: number;
  chorus?: boolean;
  formantVowel?: 'a' | 'e' | 'i' | 'o' | 'u';
  chordType?: 'minor9' | 'major7' | 'minorTriad' | 'sus4' | 'fifth';
  isTexture?: boolean;
}

export interface GenreInfo {
  id: GenreId;
  name: string;
  icon: string;
  bpmRange: string;
  vibe: string;
  color: string;
  kits: SoundKit[];
}

// ---------------------------------------------------------------------------
// KIT BUILDER UTILITY - Generates 16 high-impact sound variations per kit
// ---------------------------------------------------------------------------
interface KitCustomConfig {
  hardKick?: Partial<DrumSampleSpec['dsp']>;
  punchKick?: Partial<DrumSampleSpec['dsp']>;
  sub808Kick?: Partial<DrumSampleSpec['dsp']>;
  mainSnare?: Partial<DrumSampleSpec['dsp']>;
  ghostSnare?: Partial<DrumSampleSpec['dsp']>;
  stackClap?: Partial<DrumSampleSpec['dsp']>;
  tightClap?: Partial<DrumSampleSpec['dsp']>;
  rimshot?: Partial<DrumSampleSpec['dsp']>;
  closedHat?: Partial<DrumSampleSpec['dsp']>;
  sizzleHat?: Partial<DrumSampleSpec['dsp']>;
  openHat?: Partial<DrumSampleSpec['dsp']>;
  primaryPerc?: { name?: string; dsp?: Partial<DrumSampleSpec['dsp']> };
  secondaryPerc?: { name?: string; dsp?: Partial<DrumSampleSpec['dsp']> };
  crash?: Partial<DrumSampleSpec['dsp']>;
  ride?: Partial<DrumSampleSpec['dsp']>;
  deep808Sub?: Partial<DrumSampleSpec['dsp']>;
  percLoop?: { name?: string; pattern?: string; dsp?: Partial<DrumSampleSpec['dsp']> };
  drumFill?: Partial<DrumSampleSpec['dsp']>;
  transitionFx?: { name?: string; dsp?: Partial<DrumSampleSpec['dsp']> };
}

function buildProducerKit(
  id: string,
  name: string,
  genre: GenreId,
  desc: string,
  bpm: number,
  color: string,
  cfg?: KitCustomConfig
): SoundKit {
  return {
    id,
    name,
    genre,
    description: desc,
    bpmDefault: bpm,
    color,
    samples: [
      // ROW 1: Kicks & Snares (Q, W, E, R, T)
      {
        id: `${id}_kick_hard`,
        name: `${name} Hard Kick`,
        type: 'kick',
        variationLabel: 'Hard Punch',
        description: 'Primary hard-hitting punch kick with sharp attack',
        keyShortcut: 'Q',
        dsp: {
          baseFreq: 52,
          decay: 0.22,
          pitchDecay: 0.045,
          filterFreq: 3200,
          filterType: 'lowpass',
          distortion: 0.35,
          clickTransient: true,
          ...cfg?.hardKick,
        },
      },
      {
        id: `${id}_kick_sub`,
        name: `${name} 808 Sub Kick`,
        type: 'kick',
        variationLabel: '808 Boomer',
        description: 'Low-frequency resonant 808 boom kick',
        keyShortcut: 'W',
        dsp: {
          baseFreq: 42,
          decay: 0.45,
          pitchDecay: 0.06,
          filterFreq: 1800,
          filterType: 'lowpass',
          distortion: 0.28,
          harmonicOvertones: [1, 2],
          ...cfg?.sub808Kick,
        },
      },
      {
        id: `${id}_snare_main`,
        name: `${name} Main Snare`,
        type: 'snare',
        variationLabel: 'Crack Snare',
        description: 'Snappy body with sustained snare wire buzz',
        keyShortcut: 'E',
        dsp: {
          baseFreq: 195,
          decay: 0.18,
          filterFreq: 4500,
          filterType: 'highpass',
          noiseAmount: 0.85,
          resonance: 4,
          ...cfg?.mainSnare,
        },
      },
      {
        id: `${id}_snare_ghost`,
        name: `${name} Ghost / Crack Snare`,
        type: 'snare',
        variationLabel: 'Metallic Snap',
        description: 'Higher-pitched syncopated ghost crack snare',
        keyShortcut: 'R',
        dsp: {
          baseFreq: 245,
          decay: 0.13,
          filterFreq: 5500,
          filterType: 'highpass',
          noiseAmount: 0.75,
          resonance: 6,
          ...cfg?.ghostSnare,
        },
      },
      {
        id: `${id}_rim_shot`,
        name: `${name} Cross Rimshot`,
        type: 'rim',
        variationLabel: 'Wood Rim',
        description: 'Sharp acoustic cross-stick wood rim click',
        keyShortcut: 'T',
        dsp: {
          baseFreq: 480,
          decay: 0.05,
          filterFreq: 3600,
          filterType: 'bandpass',
          resonance: 8,
          ...cfg?.rimshot,
        },
      },

      // ROW 2: Claps, Hats & Perc (A, S, D, F, G)
      {
        id: `${id}_clap_stack`,
        name: `${name} Stereo Stack Clap`,
        type: 'clap',
        variationLabel: 'Layered Clap',
        description: 'Wide multi-tap stereo layered handclap',
        keyShortcut: 'A',
        dsp: {
          baseFreq: 240,
          decay: 0.16,
          filterFreq: 2800,
          filterType: 'bandpass',
          noiseAmount: 0.95,
          resonance: 2.5,
          ...cfg?.stackClap,
        },
      },
      {
        id: `${id}_hat_closed`,
        name: `${name} Crisp Closed Hat`,
        type: 'hihat_closed',
        variationLabel: '16th Hat',
        description: 'Sharp metallic high-velocity closed hi-hat',
        keyShortcut: 'S',
        dsp: {
          baseFreq: 8500,
          decay: 0.045,
          filterFreq: 7500,
          filterType: 'highpass',
          noiseAmount: 0.7,
          ...cfg?.closedHat,
        },
      },
      {
        id: `${id}_hat_sizzle`,
        name: `${name} Sizzle Triplet Hat`,
        type: 'hihat_closed',
        variationLabel: 'Fast Roll Hat',
        description: 'Tight sizzle hat tuned for rapid-fire rolls',
        keyShortcut: 'D',
        dsp: {
          baseFreq: 9600,
          decay: 0.03,
          filterFreq: 8800,
          filterType: 'highpass',
          noiseAmount: 0.85,
          ...cfg?.sizzleHat,
        },
      },
      {
        id: `${id}_hat_open`,
        name: `${name} Resonant Open Hat`,
        type: 'hihat_open',
        variationLabel: 'Wash Open Hat',
        description: 'Long sizzling metallic open hi-hat ring',
        keyShortcut: 'F',
        dsp: {
          baseFreq: 7200,
          decay: 0.38,
          filterFreq: 6000,
          filterType: 'highpass',
          noiseAmount: 0.8,
          ...cfg?.openHat,
        },
      },
      {
        id: `${id}_perc_primary`,
        name: cfg?.primaryPerc?.name || `${name} Signature Perc`,
        type: 'perc',
        variationLabel: 'Tuned Perc',
        description: 'Genre-defining syncopated percussion hit',
        keyShortcut: 'G',
        dsp: {
          baseFreq: 340,
          decay: 0.12,
          filterFreq: 2600,
          filterType: 'bandpass',
          resonance: 6,
          ...cfg?.primaryPerc?.dsp,
        },
      },

      // ROW 3: Sub 808, Cymbals & FX (Z, X, C, V, B)
      {
        id: `${id}_808_sub_boom`,
        name: `${name} 808 Glide Bass`,
        type: 'sub_808',
        variationLabel: 'Sustained Sub',
        description: 'Deep harmonic 808 sub-bass with rich low-end rumble',
        keyShortcut: 'Z',
        dsp: {
          baseFreq: 38,
          decay: 1.4,
          pitchDecay: 0.08,
          filterFreq: 900,
          filterType: 'lowpass',
          distortion: 0.45,
          ...cfg?.deep808Sub,
        },
      },
      {
        id: `${id}_perc_secondary`,
        name: cfg?.secondaryPerc?.name || `${name} Shaker / Wood`,
        type: 'perc',
        variationLabel: 'Groove Shaker',
        description: 'High-frequency syncopated shaker / texture perc',
        keyShortcut: 'X',
        dsp: {
          baseFreq: 450,
          decay: 0.08,
          filterFreq: 4200,
          filterType: 'highpass',
          isShaker: true,
          ...cfg?.secondaryPerc?.dsp,
        },
      },
      {
        id: `${id}_crash_cymbal`,
        name: `${name} Splash Crash`,
        type: 'crash',
        variationLabel: 'Impact Crash',
        description: 'Explosive high-impact cymbal crash with wide decay',
        keyShortcut: 'C',
        dsp: {
          baseFreq: 5500,
          decay: 1.4,
          filterFreq: 4800,
          filterType: 'highpass',
          noiseAmount: 0.95,
          ...cfg?.crash,
        },
      },
      {
        id: `${id}_ride_cymbal`,
        name: `${name} Bell Ping Ride`,
        type: 'ride',
        variationLabel: 'Acoustic Ride',
        description: 'Clear metallic ping bell ride cymbal',
        keyShortcut: 'V',
        dsp: {
          baseFreq: 3800,
          decay: 0.9,
          filterFreq: 3200,
          filterType: 'bandpass',
          resonance: 10,
          ...cfg?.ride,
        },
      },
      {
        id: `${id}_drum_fill`,
        name: `${name} Dynamic Turnaround Fill`,
        type: 'fill',
        variationLabel: 'Tom / Snare Roll',
        description: 'Multi-step cascading drum fill turnaround',
        keyShortcut: 'B',
        dsp: {
          baseFreq: 220,
          decay: 0.6,
          filterFreq: 3600,
          filterType: 'lowpass',
          ...cfg?.drumFill,
        },
      },

      // ROW 4: Groove Loop & FX Transition (1, 2)
      {
        id: `${id}_perc_loop`,
        name: cfg?.percLoop?.name || `${name} Rhythm Loop`,
        type: 'perc_loop',
        variationLabel: 'Groove Loop',
        description: 'Continuous tempo-synced syncopated rhythm loop',
        keyShortcut: '1',
        dsp: {
          baseFreq: 400,
          decay: 1.2,
          filterFreq: 3500,
          filterType: 'bandpass',
          loopBpm: bpm,
          loopPattern: cfg?.percLoop?.pattern || 'shaker_16th',
          ...cfg?.percLoop?.dsp,
        },
      },
      {
        id: `${id}_transition_fx`,
        name: cfg?.transitionFx?.name || `${name} Riser / Downlifter`,
        type: 'fx_transition',
        variationLabel: 'Sweep Drop',
        description: 'Atmospheric white noise sweep & laser pitch drop',
        keyShortcut: '2',
        dsp: {
          baseFreq: 900,
          decay: 1.1,
          pitchDecay: 0.7,
          filterFreq: 4500,
          filterType: 'lowpass',
          distortion: 0.3,
          ...cfg?.transitionFx?.dsp,
        },
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 24 GENRES WITH MULTIPLE SPECIALIZED DRUM KITS EACH
// ---------------------------------------------------------------------------
export const GENRE_CATALOG: GenreInfo[] = [
  // 1. TRAP (4 Specialized Kits)
  {
    id: 'trap',
    name: 'Trap',
    icon: '⚡',
    bpmRange: '130 - 155 BPM',
    vibe: 'Heavy sliding 808s, sizzling rolling hats, sharp brassy claps & crisp rimshots',
    color: '#ec4899',
    kits: [
      buildProducerKit('trap_metro', 'Atlanta Metro 808', 'trap', 'Punchy hard kicks, sizzling rolling hats & booming 808s', 140, '#ec4899', {
        hardKick: { baseFreq: 54, decay: 0.24, clickTransient: true, distortion: 0.4 },
        deep808Sub: { baseFreq: 36, decay: 2.1, distortion: 0.55 },
        mainSnare: { filterFreq: 6200, baseFreq: 220, decay: 0.16 },
        sizzleHat: { baseFreq: 10000, decay: 0.025 },
        primaryPerc: { name: 'Metro Triangle Chime', dsp: { baseFreq: 750, resonance: 9 } },
        percLoop: { name: 'Trap 16th Hi-Hat Roll Loop', pattern: 'trap_hat_rolls' },
      }),
      buildProducerKit('trap_southside', 'Southside 808 Mafia', 'trap', 'Sinister distorted 808 kicks, violent claps & siren FX', 145, '#f43f5e', {
        hardKick: { baseFreq: 60, distortion: 0.7, clickTransient: true, decay: 0.2 },
        deep808Sub: { baseFreq: 33, decay: 2.4, distortion: 0.8 },
        mainSnare: { baseFreq: 250, noiseAmount: 0.95, filterFreq: 5200 },
        primaryPerc: { name: '808 Gunshot Rim', dsp: { baseFreq: 520, resonance: 10, decay: 0.06 } },
        transitionFx: { name: 'Southside Kill Siren Sweep', dsp: { baseFreq: 1200, decay: 1.5, distortion: 0.6 } },
      }),
      buildProducerKit('trap_plugg', 'Minimalist Plugg Pierre', 'trap', 'Bouncing melodic 808s, soft click hats & breezy rim clicks', 134, '#c084fc', {
        hardKick: { baseFreq: 48, decay: 0.3, distortion: 0.15 },
        deep808Sub: { baseFreq: 40, decay: 2.5, distortion: 0.25 },
        rimshot: { baseFreq: 510, decay: 0.04, resonance: 7 },
        primaryPerc: { name: 'Pierre Water Drop Perc', dsp: { baseFreq: 680, pitchDecay: 0.06, decay: 0.09 } },
      }),
      buildProducerKit('trap_hyperpop', 'Hyperpop Glitch Trap', 'trap', 'Ultra-clipped kicks, chirping metallic percs and razor-sharp hats', 150, '#e879f9', {
        hardKick: { baseFreq: 65, distortion: 0.9, decay: 0.15, clickTransient: true },
        deep808Sub: { baseFreq: 44, distortion: 0.85, decay: 1.2 },
        mainSnare: { baseFreq: 280, resonance: 12, decay: 0.1 },
        primaryPerc: { name: 'Bitcrush Metal Blip', dsp: { baseFreq: 880, resonance: 14 } },
      }),
    ],
  },

  // 2. HIP-HOP (3 Kits)
  {
    id: 'hip_hop',
    name: 'Hip-Hop',
    icon: '🎤',
    bpmRange: '85 - 100 BPM',
    vibe: 'Classic organic acoustic drums, fat snares, punchy pocket kicks & live hats',
    color: '#f59e0b',
    kits: [
      buildProducerKit('hiphop_classic', 'Golden West Coast Hop', 'hip_hop', 'Laid-back deep pocket kicks, layered claps & smooth tambourine', 94, '#f59e0b', {
        mainSnare: { baseFreq: 175, decay: 0.24, filterFreq: 3600 },
        hardKick: { baseFreq: 52, decay: 0.28 },
        primaryPerc: { name: 'Tambourine Shake', dsp: { filterFreq: 6500, decay: 0.09, isShaker: true } },
      }),
      buildProducerKit('hiphop_modern', 'Modern Platinum Radio', 'hip_hop', 'Tight radio-ready drums with crisp high end and punchy sub', 92, '#fbbf24', {
        hardKick: { baseFreq: 55, decay: 0.2, clickTransient: true },
        stackClap: { decay: 0.2, noiseAmount: 0.85 },
        deep808Sub: { baseFreq: 42, decay: 1.3, distortion: 0.25 },
      }),
      buildProducerKit('hiphop_eastcoast', 'East Coast 90s Timberland', 'hip_hop', 'Raw acoustic snares, heavy wood rimshots & dusty drum breaks', 90, '#d97706', {
        mainSnare: { baseFreq: 190, decay: 0.28, noiseAmount: 0.9 },
        hardKick: { baseFreq: 58, decay: 0.22, distortion: 0.35 },
        percLoop: { name: 'Dusty Breakbeat Loop', pattern: 'break_loop' },
      }),
    ],
  },

  // 3. DRILL (3 Kits)
  {
    id: 'drill',
    name: 'Drill',
    icon: '🗡️',
    bpmRange: '140 - 146 BPM',
    vibe: 'Sliding distorted 808s, syncopated ghost snares, stuttering triplet hats',
    color: '#06b6d4',
    kits: [
      buildProducerKit('drill_brooklyn', 'Brooklyn Smoke Drill', 'drill', 'Violent sliding 808s, metallic ping snares & rapid triplet hats', 142, '#06b6d4', {
        deep808Sub: { baseFreq: 35, decay: 2.2, pitchDecay: 0.16, distortion: 0.72 },
        ghostSnare: { baseFreq: 275, resonance: 10, decay: 0.12 },
        primaryPerc: { name: 'Hollow Gunshot Perc', dsp: { baseFreq: 440, decay: 0.07, resonance: 8 } },
        percLoop: { name: 'Drill 32nd Stutter Hat Loop', pattern: 'drill_hats' },
      }),
      buildProducerKit('drill_chicago', 'Chicago Hardline', 'drill', 'Raw acoustic kick snaps, heavy rim claps & aggressive swing', 140, '#38bdf8', {
        hardKick: { baseFreq: 62, decay: 0.16, distortion: 0.5, clickTransient: true },
        mainSnare: { baseFreq: 220, decay: 0.18, noiseAmount: 0.9 },
        rimshot: { baseFreq: 540, decay: 0.05 },
      }),
      buildProducerKit('drill_melodic', 'Melodic Frost Drill', 'drill', 'Warm filtered gliding 808 sub with silky crisp hats and rim taps', 144, '#0ea5e9', {
        deep808Sub: { baseFreq: 38, decay: 2.5, pitchDecay: 0.12, distortion: 0.4 },
        closedHat: { filterFreq: 9000, decay: 0.035 },
      }),
    ],
  },

  // 4. R&B (3 Kits)
  {
    id: 'rnb',
    name: 'R&B',
    icon: '💜',
    bpmRange: '60 - 90 BPM',
    vibe: 'Lush warm rimshots, soft acoustic thumps, finger snaps, silky hats',
    color: '#a855f7',
    kits: [
      buildProducerKit('rnb_midnight', 'Midnight Velvet R&B', 'rnb', 'Warm deep sub, gentle rim clicks, smooth organic snaps', 72, '#a855f7', {
        hardKick: { baseFreq: 46, decay: 0.35, distortion: 0.05 },
        mainSnare: { baseFreq: 160, decay: 0.12, noiseAmount: 0.6 },
        rimshot: { baseFreq: 520, decay: 0.06 },
        primaryPerc: { name: 'Organic Finger Snap', dsp: { baseFreq: 780, decay: 0.04, filterFreq: 3200 } },
        percLoop: { name: 'Silky Shaker Groove Loop', pattern: 'rnb_shaker' },
      }),
      buildProducerKit('rnb_neo_soul', 'Neo-Soul Groove', 'rnb', 'Unquantized acoustic kicks, vintage woody snares & shaker loop', 82, '#c084fc', {
        hardKick: { baseFreq: 50, decay: 0.25 },
        mainSnare: { baseFreq: 185, decay: 0.2 },
        primaryPerc: { name: 'Woodblock Tick', dsp: { baseFreq: 620, decay: 0.03 } },
      }),
      buildProducerKit('rnb_90s_slowjam', '90s Slow Jam Nostalgia', 'rnb', 'TR-808 warm low end, acoustic tom rolls & smooth open cymbals', 68, '#7e22ce', {
        deep808Sub: { baseFreq: 44, decay: 1.8, distortion: 0.1 },
        stackClap: { decay: 0.22, filterFreq: 2400 },
      }),
    ],
  },

  // 5. BOOM BAP (3 Kits)
  {
    id: 'boom_bap',
    name: 'Boom Bap',
    icon: '📻',
    bpmRange: '88 - 96 BPM',
    vibe: '12-bit SP-1200 grit, vinyl crackle, hard-hitting dusty snares',
    color: '#d97706',
    kits: [
      buildProducerKit('boombap_sp1200', 'SP-1200 Vinyl Grit', 'boom_bap', 'Chipped 12-bit crunch, punchy kicks & crackling snares', 90, '#d97706', {
        hardKick: { baseFreq: 64, decay: 0.18, distortion: 0.4 },
        mainSnare: { baseFreq: 190, noiseAmount: 0.9, decay: 0.28 },
        primaryPerc: { name: 'Vinyl Dust Click', dsp: { baseFreq: 1200, decay: 0.02 } },
      }),
      buildProducerKit('boombap_dilla', 'Dilla Swing Cassette', 'boom_bap', 'Loose drunken swing, warm tape saturation & fat rim clicks', 88, '#b45309', {
        hardKick: { baseFreq: 56, decay: 0.3 },
        mainSnare: { baseFreq: 205, decay: 0.22 },
        primaryPerc: { name: 'Raw Tambourine Hit', dsp: { baseFreq: 500, decay: 0.07 } },
      }),
      buildProducerKit('boombap_mpc60', 'Golden Era MPC 60', 'boom_bap', 'Classic 16-bit analog sampling warmth with punchy lowpass kicks', 93, '#92400e', {
        hardKick: { baseFreq: 58, decay: 0.25, clickTransient: true },
        openHat: { filterFreq: 5500, decay: 0.45 },
      }),
    ],
  },

  // 6. LO-FI (3 Kits)
  {
    id: 'lofi',
    name: 'Lo-Fi',
    icon: '☕',
    bpmRange: '70 - 85 BPM',
    vibe: 'Muffled lowpass kicks, tape wow & flutter, rain noise, relaxed beats',
    color: '#10b981',
    kits: [
      buildProducerKit('lofi_chillhop', 'Rainy Cafe Chillhop', 'lofi', 'Muted kicks, soft brushed snares & warm vinyl flutter', 78, '#10b981', {
        hardKick: { filterFreq: 1200, decay: 0.22, baseFreq: 48 },
        mainSnare: { filterFreq: 2200, decay: 0.15, noiseAmount: 0.5 },
        primaryPerc: { name: 'Rain Drop Tap', dsp: { baseFreq: 700, decay: 0.04 } },
        transitionFx: { name: 'Vinyl Rain & Tape Hiss', dsp: { baseFreq: 400, decay: 2.0 } },
      }),
      buildProducerKit('lofi_study', 'Midnight Study Session', 'lofi', 'Subtle rim taps, gentle sub thumps and cozy atmosphere', 75, '#34d399', {
        closedHat: { filterFreq: 4500, decay: 0.035 },
        rimshot: { baseFreq: 440, decay: 0.04 },
      }),
      buildProducerKit('lofi_sp404', 'Dusty SP-404 Beats', 'lofi', 'Vinyl simulator compression, crunchy muffled snares and lazy groove', 82, '#059669', {
        hardKick: { baseFreq: 52, distortion: 0.35, filterFreq: 1600 },
        mainSnare: { baseFreq: 170, decay: 0.24, filterFreq: 2800 },
      }),
    ],
  },

  // 7. WEST COAST (3 Kits)
  {
    id: 'west_coast',
    name: 'West Coast',
    icon: '🌴',
    bpmRange: '92 - 102 BPM',
    vibe: 'G-Funk whiny synth leads, distinct finger snaps, bouncing kicks',
    color: '#0ea5e9',
    kits: [
      buildProducerKit('west_gfunk', 'Compton G-Funk Bounce', 'west_coast', 'Signature 808 cowbell, crisp finger snaps & lowrider bounce', 96, '#0ea5e9', {
        mainSnare: { baseFreq: 210, decay: 0.2 },
        hardKick: { baseFreq: 52, decay: 0.26 },
        primaryPerc: { name: 'G-Funk 808 Cowbell', dsp: { isCowbell: true, baseFreq: 540, decay: 0.3 } },
      }),
      buildProducerKit('west_bay', 'Bay Area Hyphy Slap', 'west_coast', 'Hard slap snares, hyphy percussions & driving high-energy kicks', 100, '#38bdf8', {
        hardKick: { baseFreq: 62, distortion: 0.45 },
        mainSnare: { baseFreq: 235, noiseAmount: 0.95 },
      }),
      buildProducerKit('west_mustard', 'LA Mustard Bounce', 'west_coast', 'Staccato handclaps, tight snappy rimshots & punchy 808 sub bounce', 98, '#0284c7', {
        stackClap: { decay: 0.12, noiseAmount: 0.9 },
        deep808Sub: { baseFreq: 42, decay: 1.1, distortion: 0.3 },
      }),
    ],
  },

  // 8. MEMPHIS (2 Kits)
  {
    id: 'memphis',
    name: 'Memphis',
    icon: '📼',
    bpmRange: '135 - 160 BPM',
    vibe: 'Raw tape hiss, dark TR-808 cowbell stabs, relentless triplet snares',
    color: '#8b5cf6',
    kits: [
      buildProducerKit('memphis_underground', 'Underground 90s Tape', 'memphis', 'Lo-fi cowbells, crunchy distorted 808s & grim vocal shouts', 140, '#8b5cf6', {
        deep808Sub: { distortion: 0.7, decay: 1.6 },
        mainSnare: { filterFreq: 5500, baseFreq: 230 },
        primaryPerc: { name: 'Dark Phonk Cowbell', dsp: { isCowbell: true, baseFreq: 580, decay: 0.25 } },
      }),
      buildProducerKit('memphis_phonk', 'Phonk Drift Overdrive', 'memphis', 'Extreme overdrive on 808 bass, rapid cowbell melodies & laser snares', 150, '#7c3aed', {
        deep808Sub: { baseFreq: 36, distortion: 0.88, decay: 1.8 },
        hardKick: { baseFreq: 60, distortion: 0.65 },
        primaryPerc: { name: 'High Drift Cowbell', dsp: { isCowbell: true, baseFreq: 740, decay: 0.2 } },
      }),
    ],
  },

  // 9. JERSEY CLUB (2 Kits)
  {
    id: 'jersey_club',
    name: 'Jersey Club',
    icon: '👟',
    bpmRange: '130 - 140 BPM',
    vibe: 'Signature bed squeaks, 5-beat bouncy kick triplet, hype vocal cuts',
    color: '#f97316',
    kits: [
      buildProducerKit('jersey_brick_city', 'Brick City Bounce', 'jersey_club', 'Fast syncopated 5-beat kick pattern & rapid-fire claps', 135, '#f97316', {
        hardKick: { baseFreq: 65, decay: 0.14, clickTransient: true },
        stackClap: { decay: 0.1, noiseAmount: 0.9 },
        primaryPerc: { name: 'Iconic Bed Squeak', dsp: { isBedSqueak: true, baseFreq: 950, decay: 0.15 } },
        percLoop: { name: 'Jersey 5-Beat Kick Triplet Loop', pattern: 'jersey_5beat' },
      }),
      buildProducerKit('jersey_triplet_hype', 'Club Anthem Triplet', 'jersey_club', 'Water drop percs, high gun-cock claps and accelerated bounce', 138, '#ea580c', {
        primaryPerc: { name: 'Water Drop Ping', dsp: { baseFreq: 820, pitchDecay: 0.08, decay: 0.09 } },
        mainSnare: { baseFreq: 260, decay: 0.11 },
      }),
    ],
  },

  // 10. BALTIMORE CLUB (2 Kits)
  {
    id: 'baltimore_club',
    name: 'Baltimore Club',
    icon: '🔊',
    bpmRange: '128 - 134 BPM',
    vibe: 'Fast breakbeat chops, raw vocal repetition, aggressive kick punch',
    color: '#ef4444',
    kits: [
      buildProducerKit('baltimore_raw', 'B-More Break Attack', 'baltimore_club', 'Aggressive drum break splices and driving handclap stabs', 130, '#ef4444', {
        mainSnare: { baseFreq: 215, decay: 0.17 },
        hardKick: { baseFreq: 58, decay: 0.2 },
        primaryPerc: { name: 'Raw Break Hit', dsp: { baseFreq: 380, decay: 0.1 } },
      }),
      buildProducerKit('baltimore_horn', 'Charm City Club Horn', 'baltimore_club', 'Heavy low-end kick thumps and acoustic snare roll fills', 132, '#dc2626', {
        hardKick: { baseFreq: 54, decay: 0.24, clickTransient: true },
        stackClap: { decay: 0.15, filterFreq: 3200 },
      }),
    ],
  },

  // 11. DETROIT (2 Kits)
  {
    id: 'detroit',
    name: 'Detroit',
    icon: '⚙️',
    bpmRange: '95 - 105 BPM',
    vibe: 'Fast syncopated hi-hats, dark industrial punch, aggressive basslines',
    color: '#64748b',
    kits: [
      buildProducerKit('detroit_industrial', 'Motor City Machine', 'detroit', 'Off-beat rapid hi-hat rolls, mechanical claps & gritty punch', 100, '#64748b', {
        hardKick: { baseFreq: 56, distortion: 0.4 },
        closedHat: { baseFreq: 9500, decay: 0.03 },
        primaryPerc: { name: 'Industrial Metal Clang', dsp: { baseFreq: 640, resonance: 10, decay: 0.14 } },
      }),
      buildProducerKit('detroit_313', '313 Fast Flow', 'detroit', 'Ultra-snappy punch kick, heavy rimshot and off-beat hat patterns', 104, '#475569', {
        hardKick: { baseFreq: 60, decay: 0.18, clickTransient: true },
        rimshot: { baseFreq: 520, decay: 0.045 },
      }),
    ],
  },

  // 12. AFROBEAT / AFROBEATS (3 Kits)
  {
    id: 'afrobeats',
    name: 'Afrobeat / Afrobeats',
    icon: '🪘',
    bpmRange: '98 - 110 BPM',
    vibe: 'Amapiano log drums, syncopated congas, lush shaker grooves, warm kicks',
    color: '#84cc16',
    kits: [
      buildProducerKit('afro_lagos', 'Lagos Island Groove', 'afrobeats', 'Warm organic kicks, resonant rimshots & shaker percussion', 104, '#84cc16', {
        hardKick: { baseFreq: 50, decay: 0.28, distortion: 0.05 },
        rimshot: { baseFreq: 550, resonance: 7, decay: 0.08 },
        primaryPerc: { name: 'African Conga Slap', dsp: { baseFreq: 380, decay: 0.14 } },
        secondaryPerc: { name: 'Shekere Shaker', dsp: { isShaker: true, filterFreq: 5500, decay: 0.07 } },
        percLoop: { name: 'Syncopated Shekere Shaker Loop', pattern: 'afro_shaker' },
      }),
      buildProducerKit('afro_amapiano', 'Amapiano Log Drum King', 'afrobeats', 'Signature pitch-sliding hollow log drum sub and crisp shakers', 112, '#65a30d', {
        deep808Sub: { isAmapianoLog: true, baseFreq: 54, pitchDecay: 0.14, decay: 0.95, distortion: 0.2 },
        rimshot: { baseFreq: 600, decay: 0.05 },
        primaryPerc: { name: 'Hollow Log Wood Tap', dsp: { baseFreq: 420, resonance: 8, decay: 0.12 } },
      }),
      buildProducerKit('afro_fusion', 'Afro-Fusion Dancehall', 'afrobeats', 'Punchy syncopated kicks, talking drum percs & vibrant claps', 106, '#4d7c0f', {
        hardKick: { baseFreq: 54, decay: 0.22, clickTransient: true },
        primaryPerc: { name: 'Talking Drum Glide', dsp: { baseFreq: 310, pitchDecay: 0.1, decay: 0.18 } },
      }),
    ],
  },

  // 13. DANCEHALL (2 Kits)
  {
    id: 'dancehall',
    name: 'Dancehall',
    icon: '🇯🇲',
    bpmRange: '95 - 108 BPM',
    vibe: 'Pounding syncopated dembow riddim, sharp snare rim, steel pans',
    color: '#eab308',
    kits: [
      buildProducerKit('dancehall_riddim', 'Kingston Riddim', 'dancehall', 'Punchy reggae-dancehall dembow groove with heavy rim shots', 100, '#eab308', {
        mainSnare: { baseFreq: 240, decay: 0.15, resonance: 6 },
        hardKick: { baseFreq: 54, decay: 0.24 },
        primaryPerc: { name: 'Jamaican Steel Pan Ping', dsp: { baseFreq: 640, resonance: 10, decay: 0.22 } },
        percLoop: { name: 'Dancehall Dembow Riddim Loop', pattern: 'dancehall_dembow' },
      }),
      buildProducerKit('dancehall_bashment', 'Bashment Club Sound', 'dancehall', 'Heavy sub bass drops, metallic gunshot rims & dub sirens', 104, '#ca8a04', {
        hardKick: { baseFreq: 58, decay: 0.2, clickTransient: true },
        deep808Sub: { baseFreq: 38, decay: 1.8, distortion: 0.4 },
        transitionFx: { name: 'Dub Siren Sweep', dsp: { baseFreq: 1100, decay: 1.6 } },
      }),
    ],
  },

  // 14. REGGAETON (2 Kits)
  {
    id: 'reggaeton',
    name: 'Reggaeton',
    icon: '🔥',
    bpmRange: '88 - 98 BPM',
    vibe: 'Booming dembow syncopation, crisp woodblock snare, lowrider bass',
    color: '#ea580c',
    kits: [
      buildProducerKit('reggaeton_dembow', 'San Juan Dembow Classic', 'reggaeton', 'Signature Boom-ch-boom-chick dembow cadence with punchy bass', 94, '#ea580c', {
        mainSnare: { baseFreq: 220, resonance: 8, decay: 0.12 },
        hardKick: { baseFreq: 56, decay: 0.25, clickTransient: true },
        primaryPerc: { name: 'Timbale Rim Hit', dsp: { baseFreq: 490, decay: 0.08 } },
        percLoop: { name: 'Classic Dembow Cadence Loop', pattern: 'reggaeton_dembow' },
      }),
      buildProducerKit('reggaeton_latin_trap', 'Latin Trap Perreo', 'reggaeton', 'Distorted 808 sub bass, snappy perreo snares & timbale rolls', 96, '#c2410c', {
        deep808Sub: { baseFreq: 38, decay: 2.0, distortion: 0.5 },
        mainSnare: { baseFreq: 245, decay: 0.14 },
      }),
    ],
  },

  // 15. HOUSE (3 Kits)
  {
    id: 'house',
    name: 'House',
    icon: '🪩',
    bpmRange: '120 - 128 BPM',
    vibe: 'Pumping four-on-the-floor kick, open hat on the offbeat, 909 claps',
    color: '#3b82f6',
    kits: [
      buildProducerKit('house_chicago', 'Chicago 909 Deep', 'house', 'Classic 909 thumping kick, offbeat open sizzle hat & warm clap', 124, '#3b82f6', {
        hardKick: { baseFreq: 52, decay: 0.28, clickTransient: true },
        openHat: { filterFreq: 6500, decay: 0.38 },
        primaryPerc: { name: 'Latin Bongo Slap', dsp: { baseFreq: 390, decay: 0.12 } },
        percLoop: { name: 'Offbeat 909 Open Hat Groove', pattern: 'house_offbeat' },
      }),
      buildProducerKit('house_vocal', 'Ibiza Vocal Anthem', 'house', 'Bright festival kick, driving shakers & celebratory crash cymbals', 126, '#60a5fa', {
        hardKick: { baseFreq: 55, decay: 0.24 },
        secondaryPerc: { name: 'Ibiza Shaker Roll', dsp: { isShaker: true, decay: 0.06 } },
      }),
      buildProducerKit('house_french', 'French Touch Filter', 'house', 'Pumping sidechained disco kick, phaser hi-hats & retro disco snare', 122, '#2563eb', {
        hardKick: { baseFreq: 50, decay: 0.32 },
        mainSnare: { baseFreq: 210, decay: 0.22 },
      }),
    ],
  },

  // 16. TECH HOUSE (2 Kits)
  {
    id: 'tech_house',
    name: 'Tech House',
    icon: '⚡',
    bpmRange: '124 - 130 BPM',
    vibe: 'Tight woody kick, rolling sub bass, organic bongo/conga textures',
    color: '#0284c7',
    kits: [
      buildProducerKit('tech_underground', 'Underground Warehouse', 'tech_house', 'Tight punchy kick, techy click rim & hypnotic percussion roll', 127, '#0284c7', {
        hardKick: { baseFreq: 50, decay: 0.2, clickTransient: true },
        rimshot: { baseFreq: 620, decay: 0.04 },
        primaryPerc: { name: 'Tech Bongo Groove', dsp: { baseFreq: 340, decay: 0.09, resonance: 7 } },
      }),
      buildProducerKit('tech_minimal', 'Minimalist Afterhours', 'tech_house', 'Subtle micro-clicks, round sub kick & filtered white noise sweeps', 128, '#0369a1', {
        hardKick: { baseFreq: 46, decay: 0.22 },
        closedHat: { filterFreq: 8000, decay: 0.025 },
      }),
    ],
  },

  // 17. UK GARAGE (2 Kits)
  {
    id: 'uk_garage',
    name: 'UK Garage',
    icon: '🇬🇧',
    bpmRange: '130 - 138 BPM',
    vibe: '2-step swing, shuffled ghost snares, deep warped Reese bass',
    color: '#6366f1',
    kits: [
      buildProducerKit('ukg_2step', 'London 2-Step Swing', 'uk_garage', 'Shuffled syncopated swing, snappy wood snare & warm sub', 134, '#6366f1', {
        hardKick: { baseFreq: 54, decay: 0.2 },
        mainSnare: { baseFreq: 210, decay: 0.16 },
        primaryPerc: { name: 'Ghost Wood Click', dsp: { baseFreq: 490, decay: 0.05 } },
        percLoop: { name: '2-Step Shuffled Swing Loop', pattern: 'ukg_2step' },
      }),
      buildProducerKit('ukg_speed', 'Speed Garage 4x4', 'uk_garage', 'Heavy 4-on-the-floor kick, time-stretched snare & warped bass swells', 138, '#4f46e5', {
        hardKick: { baseFreq: 58, decay: 0.22, clickTransient: true },
        deep808Sub: { baseFreq: 46, decay: 1.5, distortion: 0.5 },
      }),
    ],
  },

  // 18. UK DRILL (2 Kits)
  {
    id: 'uk_drill',
    name: 'UK Drill',
    icon: '🏙️',
    bpmRange: '140 - 144 BPM',
    vibe: 'Violent pitch-bending 808 slides, stuttering 32nd hats, hollow snare',
    color: '#059669',
    kits: [
      buildProducerKit('ukdrill_london', 'Brixton Sliding 808', 'uk_drill', 'Heavily saturated sliding sub bass, metallic hollow snare rim', 142, '#059669', {
        deep808Sub: { baseFreq: 34, decay: 2.2, pitchDecay: 0.18, distortion: 0.75 },
        mainSnare: { baseFreq: 280, resonance: 10, decay: 0.12 },
        primaryPerc: { name: 'Metallic Hollow Perc', dsp: { baseFreq: 620, decay: 0.06, resonance: 11 } },
      }),
      buildProducerKit('ukdrill_ghost', 'London Ghost Triplet', 'uk_drill', 'Rapid 32nd hi-hat rolls, syncopated counter-snare & sliding sub', 144, '#047857', {
        deep808Sub: { baseFreq: 36, decay: 2.0, pitchDecay: 0.14, distortion: 0.65 },
        closedHat: { baseFreq: 9800, decay: 0.025 },
      }),
    ],
  },

  // 19. GRIME (2 Kits)
  {
    id: 'grime',
    name: 'Grime',
    icon: '⚔️',
    bpmRange: '140 BPM',
    vibe: 'Square wave basses, laser percussion, staccato mechanical claps',
    color: '#14b8a6',
    kits: [
      buildProducerKit('grime_bow_e3', 'Bow E3 Squarewave', 'grime', 'Mechanical laser snares, ice-cold plucks & 140 BPM punch', 140, '#14b8a6', {
        hardKick: { baseFreq: 58, decay: 0.18 },
        mainSnare: { baseFreq: 250, noiseAmount: 0.9 },
        primaryPerc: { name: 'Eskibeat Ice Click', dsp: { baseFreq: 920, decay: 0.03, resonance: 12 } },
      }),
      buildProducerKit('grime_eskibeat', 'Wiley Eskibeat 8-Bit', 'grime', 'Staccato claps, sine wave clicks, sub bass pulse & laser impacts', 140, '#0d9488', {
        hardKick: { baseFreq: 62, decay: 0.15, clickTransient: true },
        primaryPerc: { name: 'Laser Blip Perc', dsp: { baseFreq: 800, pitchDecay: 0.05, decay: 0.08 } },
      }),
    ],
  },

  // 20. BREAKBEAT (2 Kits)
  {
    id: 'breakbeat',
    name: 'Breakbeat',
    icon: '💥',
    bpmRange: '128 - 140 BPM',
    vibe: 'Amen break chops, syncopated funk drums, rolling acoustic snares',
    color: '#f43f5e',
    kits: [
      buildProducerKit('break_amen', 'Classic Amen Break', 'breakbeat', 'High-energy chopped breakbeat snares, ghost hits and live cymbals', 135, '#f43f5e', {
        mainSnare: { baseFreq: 200, decay: 0.22, noiseAmount: 0.8 },
        drumFill: { baseFreq: 240, decay: 0.8 },
        percLoop: { name: 'Chopped Amen Break Loop', pattern: 'amen_chop' },
      }),
      buildProducerKit('break_nu_skool', 'Nu Skool Cyber Breaks', 'breakbeat', 'Synthesized sub kicks, crisp electronic snare & flanged hi-hats', 132, '#e11d48', {
        hardKick: { baseFreq: 54, decay: 0.22, clickTransient: true },
        mainSnare: { baseFreq: 220, decay: 0.16 },
      }),
    ],
  },

  // 21. DRUM & BASS (3 Kits)
  {
    id: 'dnb',
    name: 'Drum & Bass',
    icon: '🚀',
    bpmRange: '170 - 176 BPM',
    vibe: 'Lightning-fast 2-step breaks, rolling Reese bass, laser hi-hats',
    color: '#e11d48',
    kits: [
      buildProducerKit('dnb_liquid', 'Liquid Roller 174', 'dnb', 'Silky high-speed breaks, punchy kick snap and gliding Reese sub', 174, '#e11d48', {
        hardKick: { baseFreq: 64, decay: 0.13, clickTransient: true },
        mainSnare: { baseFreq: 240, decay: 0.14, noiseAmount: 0.9 },
        closedHat: { baseFreq: 9200, decay: 0.03 },
        percLoop: { name: '174 BPM Liquid 2-Step Roller', pattern: 'dnb_roller' },
      }),
      buildProducerKit('dnb_neurofunk', 'Neurofunk Darkside', 'dnb', 'Heavy distorted bass reese growls and razor-sharp tech drums', 175, '#be123c', {
        deep808Sub: { distortion: 0.8, baseFreq: 40 },
        hardKick: { baseFreq: 70, decay: 0.11, distortion: 0.5 },
      }),
      buildProducerKit('dnb_jungle', 'Jungle Revival 168', 'dnb', 'Accelerated Amen chops, deep 808 sub drops & acoustic ghost hits', 168, '#9f1239', {
        hardKick: { baseFreq: 58, decay: 0.2 },
        deep808Sub: { baseFreq: 36, decay: 1.8, distortion: 0.4 },
      }),
    ],
  },

  // 22. POP (2 Kits)
  {
    id: 'pop',
    name: 'Pop',
    icon: '✨',
    bpmRange: '110 - 128 BPM',
    vibe: 'Polished radio drums, massive claps, clean round kicks, catchy hooks',
    color: '#ec4899',
    kits: [
      buildProducerKit('pop_radio', 'Modern Billboard Smash', 'pop', 'Pristine acoustic-electronic hybrid kick, giant stack claps', 120, '#ec4899', {
        hardKick: { baseFreq: 54, decay: 0.22, clickTransient: true },
        stackClap: { decay: 0.24, noiseAmount: 0.95 },
        crash: { decay: 1.8 },
      }),
      buildProducerKit('pop_80s_synth', '80s Retro Synthpop', 'pop', 'Linndrum punch kick, gated reverb snare & retro hi-hats', 118, '#db2777', {
        hardKick: { baseFreq: 60, decay: 0.2 },
        mainSnare: { baseFreq: 195, decay: 0.35, noiseAmount: 0.9 },
      }),
    ],
  },

  // 23. ELECTRONIC (2 Kits)
  {
    id: 'electronic',
    name: 'Electronic',
    icon: '⚡',
    bpmRange: '120 - 130 BPM',
    vibe: 'Analog synthesizer drum machines, filtered white noise sweeps, futuristic clicks',
    color: '#06b6d4',
    kits: [
      buildProducerKit('electronic_synth', 'Analog Modular Lab', 'electronic', 'Frequency-modulated synthetic percs, clean sub and analog hats', 125, '#06b6d4', {
        primaryPerc: { name: 'FM Synth Blip', dsp: { baseFreq: 440, resonance: 12 } },
        hardKick: { baseFreq: 50, decay: 0.26 },
      }),
      buildProducerKit('electronic_future', 'Future Bass & Synth', 'electronic', 'Supersaw sidechain impact, tight punch kick & splash crash', 150, '#0891b2', {
        hardKick: { baseFreq: 62, decay: 0.16, clickTransient: true },
        stackClap: { decay: 0.22, noiseAmount: 0.95 },
      }),
    ],
  },

  // 24. EXPERIMENTAL (2 Kits)
  {
    id: 'experimental',
    name: 'Experimental',
    icon: '🧪',
    bpmRange: 'Variable',
    vibe: 'Glitch clicks, granular textures, bitcrushed sub drops, polyrhythmic FX',
    color: '#a855f7',
    kits: [
      buildProducerKit('experimental_glitch', 'Glitch Matrix Overdrive', 'experimental', 'Extreme bitcrushed transients, metallic ringing and spatial micro-clicks', 128, '#a855f7', {
        hardKick: { baseFreq: 45, distortion: 0.85, pitchDecay: 0.1 },
        mainSnare: { baseFreq: 310, resonance: 14, decay: 0.09 },
        primaryPerc: { name: 'Micro-Grain Particle Click', dsp: { baseFreq: 1400, decay: 0.015 } },
      }),
      buildProducerKit('experimental_ambient', 'Ambient Polyrhythm Space', 'experimental', 'Granulated textural percs, sub-harmonic rumbles & frequency shifts', 110, '#9333ea', {
        deep808Sub: { baseFreq: 32, decay: 3.0, distortion: 0.2 },
        transitionFx: { name: 'Granular Pitch Shifter', dsp: { baseFreq: 700, decay: 2.2 } },
      }),
    ],
  },
];

// ---------------------------------------------------------------------------
// MELODIC BEATMAKING INSTRUMENTS SUITE
// 15 Categories covering all modern beatmaking styles:
// Piano, Electric Piano, Synths, Pads, Strings, Brass, Bells, Plucks,
// Guitars, Bass, 808 Bass, Leads, Chords, Vocal Chops, Atmospheric Textures
// ---------------------------------------------------------------------------
export const MELODIC_SOUNDS: MelodicSoundSpec[] = [
  // 1. Piano
  {
    id: 'piano_concert_grand',
    name: 'Concert Grand Piano',
    category: 'piano',
    genreVibe: 'Hip-Hop / Trap / Pop',
    description: 'Rich resonant acoustic grand piano with natural acoustic decay',
    waveform: 'triangle',
    filterType: 'lowpass',
    filterCutoff: 4200,
    resonance: 2.5,
    attack: 0.008,
    decay: 1.2,
    sustain: 0.5,
    release: 0.45,
    subOsc: true,
  },
  {
    id: 'piano_dark_drill',
    name: 'Dark Minor Drill Piano',
    category: 'piano',
    genreVibe: 'Drill / Trap',
    description: 'Moody, sinister upright piano tuned for ominous trap melodies',
    waveform: 'sawtooth',
    filterType: 'lowpass',
    filterCutoff: 2600,
    resonance: 4.5,
    attack: 0.01,
    decay: 0.9,
    sustain: 0.4,
    release: 0.35,
  },
  {
    id: 'piano_lofi_felt',
    name: 'Lo-Fi Upright Felt Piano',
    category: 'piano',
    genreVibe: 'Lo-Fi / R&B / Boom Bap',
    description: 'Muffled felt piano with warm tape flutter and cozy intimacy',
    waveform: 'sine',
    filterType: 'lowpass',
    filterCutoff: 1800,
    resonance: 2.0,
    attack: 0.02,
    decay: 1.1,
    sustain: 0.45,
    release: 0.4,
  },

  // 2. Electric Piano
  {
    id: 'epiano_rhodes_warm',
    name: 'Vintage Rhodes Suitcase',
    category: 'electric_piano',
    genreVibe: 'R&B / Neo-Soul / Lo-Fi',
    description: 'Warm FM electric piano with silky bell chime and soft chorusing',
    waveform: 'sine',
    filterType: 'lowpass',
    filterCutoff: 3800,
    resonance: 2.0,
    attack: 0.02,
    decay: 1.5,
    sustain: 0.6,
    release: 0.5,
    chorus: true,
    fmRatio: 1.0,
  },
  {
    id: 'epiano_wurlitzer',
    name: 'Warm Wurlitzer 200A',
    category: 'electric_piano',
    genreVibe: 'Boom Bap / Hip-Hop',
    description: 'Bite and bark reed electric piano with subtle tape grit',
    waveform: 'triangle',
    filterType: 'bandpass',
    filterCutoff: 2900,
    resonance: 3.5,
    attack: 0.015,
    decay: 1.1,
    sustain: 0.55,
    release: 0.4,
  },
  {
    id: 'epiano_dx7_tine',
    name: 'DX7 Digital FM Tine',
    category: 'electric_piano',
    genreVibe: 'Pop / 80s / R&B',
    description: 'Crisp glassy 80s digital tine piano that cuts through dense mixes',
    waveform: 'sine',
    filterType: 'highpass',
    filterCutoff: 800,
    resonance: 3.0,
    attack: 0.006,
    decay: 1.4,
    sustain: 0.4,
    release: 0.5,
    fmRatio: 2.0,
  },

  // 3. Synths
  {
    id: 'synth_juno_poly',
    name: 'Juno-106 Analog Poly Synth',
    category: 'synths',
    genreVibe: 'Synthwave / Pop / House',
    description: 'Lush 80s analog polysynth with wide chorus',
    waveform: 'sawtooth',
    filterType: 'lowpass',
    filterCutoff: 3500,
    resonance: 5.0,
    attack: 0.04,
    decay: 0.8,
    sustain: 0.7,
    release: 0.6,
    detuneSpread: 8,
    chorus: true,
  },
  {
    id: 'synth_supersaw_epic',
    name: 'Futuristic Supersaw Wall',
    category: 'synths',
    genreVibe: 'Electronic / Future Bass',
    description: 'Multi-oscillator detuned saw wall for massive euphoric chords',
    waveform: 'sawtooth',
    filterType: 'lowpass',
    filterCutoff: 5200,
    resonance: 4.0,
    attack: 0.02,
    decay: 1.0,
    sustain: 0.8,
    release: 0.5,
    detuneSpread: 16,
  },

  // 4. Pads
  {
    id: 'pad_ethereal_ambient',
    name: 'Ethereal Starlight Pad',
    category: 'pads',
    genreVibe: 'Ambient / R&B / Lo-Fi',
    description: 'Slow-blooming cosmic pad with shimmering air and soft decay',
    waveform: 'triangle',
    filterType: 'lowpass',
    filterCutoff: 2100,
    resonance: 2.0,
    attack: 0.45,
    decay: 1.8,
    sustain: 0.85,
    release: 1.2,
    detuneSpread: 12,
  },
  {
    id: 'pad_analog_warmth',
    name: 'Vintage Tape Warm Pad',
    category: 'pads',
    genreVibe: 'Lo-Fi / Hip-Hop',
    description: 'Filtered warm analog pad with gentle tape wobble',
    waveform: 'sawtooth',
    filterType: 'lowpass',
    filterCutoff: 1600,
    resonance: 3.0,
    attack: 0.35,
    decay: 1.5,
    sustain: 0.75,
    release: 0.9,
  },
  {
    id: 'pad_cosmic_nebula',
    name: 'Deep Nebula Drone Pad',
    category: 'pads',
    genreVibe: 'Experimental / Space',
    description: 'Hypnotic sub-orbital space pad with slow resonant filter breathing',
    waveform: 'sine',
    filterType: 'lowpass',
    filterCutoff: 1400,
    resonance: 5.0,
    attack: 0.6,
    decay: 2.2,
    sustain: 0.9,
    release: 1.5,
    detuneSpread: 10,
    subOsc: true,
  },

  // 5. Strings
  {
    id: 'strings_chamber_orchestra',
    name: 'Cinematic Chamber Strings',
    category: 'strings',
    genreVibe: 'Hip-Hop / Drill / Cinematic',
    description: 'Expressive bowed violin and cello ensemble',
    waveform: 'sawtooth',
    filterType: 'lowpass',
    filterCutoff: 4000,
    resonance: 3.5,
    attack: 0.12,
    decay: 1.0,
    sustain: 0.8,
    release: 0.7,
    detuneSpread: 10,
  },
  {
    id: 'strings_pizzicato',
    name: 'Pizzicato Staccato Strings',
    category: 'strings',
    genreVibe: 'Trap / Drill / Pop',
    description: 'Brisk acoustic plucked violin stabs with tight damping',
    waveform: 'triangle',
    filterType: 'lowpass',
    filterCutoff: 4800,
    resonance: 5.0,
    attack: 0.005,
    decay: 0.35,
    sustain: 0.1,
    release: 0.2,
  },

  // 6. Brass
  {
    id: 'brass_trap_horns',
    name: 'Trap Stadium Brass Stabs',
    category: 'brass',
    genreVibe: 'Trap / Drill / Hip-Hop',
    description: 'Huge brass fanfare stabs that slice through heavy 808s',
    waveform: 'sawtooth',
    filterType: 'lowpass',
    filterCutoff: 4800,
    resonance: 6.0,
    attack: 0.03,
    decay: 0.5,
    sustain: 0.65,
    release: 0.3,
    detuneSpread: 6,
    subOsc: true,
  },
  {
    id: 'brass_westcoast_horns',
    name: 'West Coast G-Funk Horns',
    category: 'brass',
    genreVibe: 'West Coast / Hip-Hop',
    description: 'Warm analog synthesizer brass with classic lowrider swagger',
    waveform: 'sawtooth',
    filterType: 'lowpass',
    filterCutoff: 3400,
    resonance: 4.5,
    attack: 0.05,
    decay: 0.6,
    sustain: 0.7,
    release: 0.4,
  },

  // 7. Bells
  {
    id: 'bells_celesta_crystal',
    name: 'Crystal Music Box Bells',
    category: 'bells',
    genreVibe: 'Trap / Drill / Pop',
    description: 'Clean sparkling metallic bells with hypnotic ring',
    waveform: 'sine',
    filterType: 'highpass',
    filterCutoff: 1200,
    resonance: 7.0,
    attack: 0.005,
    decay: 1.4,
    sustain: 0.2,
    release: 0.8,
    fmRatio: 2.76,
  },
  {
    id: 'bells_vintage_tubular',
    name: 'Tubular Chime Bells',
    category: 'bells',
    genreVibe: 'West Coast / R&B',
    description: 'Warm mallet bells with acoustic harmonic sustain',
    waveform: 'triangle',
    filterType: 'lowpass',
    filterCutoff: 5500,
    resonance: 4.0,
    attack: 0.01,
    decay: 1.2,
    sustain: 0.3,
    release: 0.6,
  },

  // 8. Plucks
  {
    id: 'plucks_kalimba_thumb',
    name: 'African Kalimba Pluck',
    category: 'plucks',
    genreVibe: 'Afrobeats / Pop',
    description: 'Wooden thumb piano tines with acoustic resonance',
    waveform: 'sine',
    filterType: 'bandpass',
    filterCutoff: 2800,
    resonance: 5.0,
    attack: 0.005,
    decay: 0.45,
    sustain: 0.1,
    release: 0.25,
  },
  {
    id: 'plucks_tropical_marimba',
    name: 'Tropical Wooden Marimba',
    category: 'plucks',
    genreVibe: 'Afrobeats / Dancehall / House',
    description: 'Rich organic wooden bar strikes with bright acoustic attack',
    waveform: 'triangle',
    filterType: 'lowpass',
    filterCutoff: 3600,
    resonance: 4.0,
    attack: 0.004,
    decay: 0.5,
    sustain: 0.12,
    release: 0.2,
  },
  {
    id: 'plucks_hyper_square',
    name: 'Fast Chiptune Pluck',
    category: 'plucks',
    genreVibe: 'Electronic / Hyperpop / Game',
    description: 'Ultra-snappy 8-bit pulse pluck with instant cutoff clamp',
    waveform: 'square',
    filterType: 'lowpass',
    filterCutoff: 6500,
    resonance: 8.0,
    attack: 0.003,
    decay: 0.25,
    sustain: 0.05,
    release: 0.15,
  },

  // 9. Guitars
  {
    id: 'guitar_nylon_acoustic',
    name: 'Spanish Nylon Guitar',
    category: 'guitars',
    genreVibe: 'Afrobeats / Reggaeton / Trap',
    description: 'Authentic acoustic fingerpicked nylon string pluck',
    waveform: 'triangle',
    filterType: 'lowpass',
    filterCutoff: 3800,
    resonance: 4.0,
    attack: 0.008,
    decay: 0.85,
    sustain: 0.3,
    release: 0.4,
  },
  {
    id: 'guitar_electric_chorus',
    name: 'Clean Strat with Chorus',
    category: 'guitars',
    genreVibe: 'R&B / Pop / Lo-Fi',
    description: 'Glassy clean electric guitar with shimmering chorus',
    waveform: 'sawtooth',
    filterType: 'bandpass',
    filterCutoff: 3200,
    resonance: 3.0,
    attack: 0.01,
    decay: 1.1,
    sustain: 0.45,
    release: 0.5,
    chorus: true,
  },

  // 10. Bass
  {
    id: 'bass_reese_growl',
    name: 'UK Reese Bass Growl',
    category: 'bass',
    genreVibe: 'UK Garage / Drum & Bass / Grime',
    description: 'Dual detuned saw waves with snarling lowpass filter sweep',
    waveform: 'sawtooth',
    filterType: 'lowpass',
    filterCutoff: 950,
    resonance: 7.0,
    attack: 0.04,
    decay: 0.9,
    sustain: 0.85,
    release: 0.35,
    detuneSpread: 14,
    subOsc: true,
  },
  {
    id: 'bass_funky_slap',
    name: 'Electric Finger Bass',
    category: 'bass',
    genreVibe: 'Hip-Hop / Boom Bap / House',
    description: 'Punchy round electric bass guitar note with organic thump',
    waveform: 'triangle',
    filterType: 'lowpass',
    filterCutoff: 1200,
    resonance: 5.0,
    attack: 0.01,
    decay: 0.7,
    sustain: 0.6,
    release: 0.25,
  },
  {
    id: 'bass_acid_303',
    name: 'Acid 303 Resonance Bass',
    category: 'bass',
    genreVibe: 'Detroit / Tech House / Electronic',
    description: 'High-resonance squelching Roland TB-303 analog acid bass',
    waveform: 'sawtooth',
    filterType: 'lowpass',
    filterCutoff: 1800,
    resonance: 14.0,
    attack: 0.01,
    decay: 0.4,
    sustain: 0.5,
    release: 0.2,
  },

  // 11. 808 Bass
  {
    id: '808_spinz_clean',
    name: 'Spinz 808 Classic',
    category: '808_bass',
    genreVibe: 'Trap / Hip-Hop',
    description: 'The definitive trap 808 bass note with clean sub and crisp punch',
    waveform: 'sine',
    filterType: 'lowpass',
    filterCutoff: 800,
    resonance: 3.0,
    attack: 0.005,
    decay: 2.2,
    sustain: 0.8,
    release: 0.6,
    subOsc: true,
  },
  {
    id: '808_distorted_glide',
    name: 'Gliding Overdrive 808',
    category: '808_bass',
    genreVibe: 'Drill / Memphis',
    description: 'High-gain harmonic distortion with extended sub-bass rumble',
    waveform: 'sawtooth',
    filterType: 'lowpass',
    filterCutoff: 650,
    resonance: 8.0,
    attack: 0.02,
    decay: 2.0,
    sustain: 0.85,
    release: 0.5,
    subOsc: true,
  },
  {
    id: '808_sub_zero',
    name: 'Sub Zero Low 808',
    category: '808_bass',
    genreVibe: 'West Coast / Trap',
    description: 'Deep pure sub rumble tuned for nightclub subwoofers',
    waveform: 'sine',
    filterType: 'lowpass',
    filterCutoff: 450,
    resonance: 2.0,
    attack: 0.008,
    decay: 2.6,
    sustain: 0.9,
    release: 0.7,
    subOsc: true,
  },

  // 12. Leads
  {
    id: 'lead_west_coast_whistle',
    name: 'West Coast G-Whistle Lead',
    category: 'leads',
    genreVibe: 'West Coast / Trap',
    description: 'High-pitched piercing sine/triangle whistle lead with portamento',
    waveform: 'sine',
    filterType: 'highpass',
    filterCutoff: 1800,
    resonance: 6.0,
    attack: 0.03,
    decay: 0.6,
    sustain: 0.9,
    release: 0.4,
  },
  {
    id: 'lead_80s_mono_saw',
    name: '80s Arcade Mono Saw Lead',
    category: 'leads',
    genreVibe: 'Electronic / Synthwave',
    description: 'Biting analog mono lead with high presence and punchy transient',
    waveform: 'sawtooth',
    filterType: 'lowpass',
    filterCutoff: 5800,
    resonance: 5.5,
    attack: 0.015,
    decay: 0.8,
    sustain: 0.8,
    release: 0.35,
  },

  // 13. Chords
  {
    id: 'chords_house_stab',
    name: 'Classic House Minor 9th Stab',
    category: 'chords',
    genreVibe: 'House / Tech House / UKG',
    description: 'Instant 90s warehouse piano & organ minor chord stab',
    waveform: 'sawtooth',
    filterType: 'lowpass',
    filterCutoff: 3800,
    resonance: 5.5,
    attack: 0.008,
    decay: 0.45,
    sustain: 0.2,
    release: 0.25,
    chordType: 'minor9',
  },
  {
    id: 'chords_rnb_maj7',
    name: 'R&B Soul Major 7th Chord',
    category: 'chords',
    genreVibe: 'R&B / Neo-Soul / Lo-Fi',
    description: 'Silky warm Major 7th electric piano and pad chord harmony',
    waveform: 'sine',
    filterType: 'lowpass',
    filterCutoff: 3000,
    resonance: 3.0,
    attack: 0.02,
    decay: 1.2,
    sustain: 0.5,
    release: 0.4,
    chordType: 'major7',
  },

  // 14. Vocal Chops
  {
    id: 'vocal_aah_formant',
    name: 'Soul Vocal "Aah" Chant',
    category: 'vocal_chops',
    genreVibe: 'Hip-Hop / R&B / House',
    description: 'Formant-synthesized angelic vocal chant with tape saturation',
    waveform: 'sawtooth',
    filterType: 'bandpass',
    filterCutoff: 1000,
    resonance: 8.0,
    attack: 0.04,
    decay: 0.7,
    sustain: 0.6,
    release: 0.35,
    formantVowel: 'a',
  },
  {
    id: 'vocal_ooh_formant',
    name: 'Airy "Ooh" Falsetto Chop',
    category: 'vocal_chops',
    genreVibe: 'Trap / Drill / Pop',
    description: 'Smooth ethereal female falsetto vocal formant',
    waveform: 'triangle',
    filterType: 'bandpass',
    filterCutoff: 700,
    resonance: 9.0,
    attack: 0.06,
    decay: 0.8,
    sustain: 0.7,
    release: 0.45,
    formantVowel: 'o',
  },
  {
    id: 'vocal_hey_chant',
    name: 'Trap "Hey!" Hype Shout',
    category: 'vocal_chops',
    genreVibe: 'Trap / Hip-Hop / Jersey Club',
    description: 'Punchy formant chant shout for off-beat bounce accents',
    waveform: 'square',
    filterType: 'bandpass',
    filterCutoff: 1400,
    resonance: 7.0,
    attack: 0.01,
    decay: 0.25,
    sustain: 0.1,
    release: 0.15,
    formantVowel: 'e',
  },

  // 15. Atmospheric Textures
  {
    id: 'atmo_vinyl_rain',
    name: 'Dusty Vinyl Crackle & Rain',
    category: 'atmospheric_textures',
    genreVibe: 'Lo-Fi / R&B / Boom Bap',
    description: 'Continuous warm crackle bed and soft rain ambiance',
    waveform: 'sine',
    filterType: 'bandpass',
    filterCutoff: 3500,
    resonance: 2.0,
    attack: 0.5,
    decay: 2.5,
    sustain: 0.9,
    release: 1.5,
    isTexture: true,
  },
  {
    id: 'atmo_cyberpunk_city',
    name: 'Cyberpunk Neon Atmosphere',
    category: 'atmospheric_textures',
    genreVibe: 'Electronic / Synthwave',
    description: 'Distant city rumble, rain on asphalt and high neon drone',
    waveform: 'sawtooth',
    filterType: 'lowpass',
    filterCutoff: 1200,
    resonance: 4.0,
    attack: 0.8,
    decay: 3.0,
    sustain: 0.95,
    release: 2.0,
    isTexture: true,
  },
];
