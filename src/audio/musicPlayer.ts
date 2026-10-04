import { WaveformType } from '../types/game';

export interface NoteEvent {
  note: string;       // Note name e.g. "C4", "E4", "G4"
  freq: number;       // Frequency in Hz
  duration: number;   // Duration in seconds (at 1x speed)
  channel: 'lead' | 'harmony' | 'bass';
}

export interface DrumStep {
  kick: boolean;
  snare: boolean;
  hihat: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  defaultBpm: number;
  durationSeconds: number;
  waveform: WaveformType;
  bassWaveform: WaveformType;
  description: string;
  color: string;
  // Sequential pattern measures (each measure is 16 sixteenth-notes)
  pattern: {
    lead: (string | null)[];      // Array of note names or null (rest) per 16th note
    harmony: (string | null)[];   // Second voice / counter-melody
    bass: (string | null)[];      // Bassline note names
    drums: DrumStep[];            // Drum triggers
  };
}

// Helper note frequencies
const NOTE_FREQS: Record<string, number> = {
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50,
};

export const MUSIC_CATALOG: MusicTrack[] = [
  {
    id: 'ace_odyssey',
    title: 'Ace Space Odyssey',
    subtitle: 'Main Galactic Theme',
    genre: 'Chiptune Anthem',
    defaultBpm: 124,
    durationSeconds: 16,
    waveform: 'square',
    bassWaveform: 'triangle',
    description: 'The triumphant heroic anthem as the Ace Space cruiser approaches Earth orbit.',
    color: '#38bdf8',
    pattern: {
      lead: [
        'C4', null, 'E4', null, 'G4', null, 'C5', null,
        'B4', null, 'G4', null, 'A4', null, 'G4', null,
        'F4', null, 'A4', null, 'C5', null, 'D5', null,
        'E5', null, 'D5', null, 'C5', null, null, null,
      ],
      harmony: [
        'G3', null, 'C4', null, 'E4', null, 'G4', null,
        'G4', null, 'E4', null, 'F4', null, 'E4', null,
        'D4', null, 'F4', null, 'A4', null, 'B4', null,
        'C5', null, 'B4', null, 'G4', null, null, null,
      ],
      bass: [
        'C3', 'C3', 'G2', 'C3', 'C3', 'C3', 'G2', 'C3',
        'E3', 'E3', 'B2', 'E3', 'F3', 'F3', 'C3', 'F3',
        'F3', 'F3', 'C3', 'F3', 'G3', 'G3', 'D3', 'G3',
        'C3', 'C3', 'G2', 'C3', 'C3', 'C3', 'G2', 'C3',
      ],
      drums: [
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: false, snare: true,  hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: false, snare: true,  hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: true,  hihat: true },
      ],
    },
  },
  {
    id: 'tokyo_drift',
    title: 'Neon Tokyo Highway',
    subtitle: 'Cyberpunk Midnight Run',
    genre: 'Synthwave Groove',
    defaultBpm: 110,
    durationSeconds: 16,
    waveform: 'sawtooth',
    bassWaveform: 'square',
    description: 'Hypnotic synth bass and sparkling leads echoing through Shibuya neon crossroads.',
    color: '#ec4899',
    pattern: {
      lead: [
        'A4', null, 'C5', null, 'E5', null, 'D5', 'C5',
        'B4', null, 'G4', null, 'B4', 'C5', 'B4', null,
        'F4', null, 'A4', null, 'C5', null, 'B4', 'A4',
        'G#4', null, 'E4', null, 'G#4', 'B4', 'E5', null,
      ],
      harmony: [
        'E4', null, 'A4', null, 'C5', null, 'B4', 'A4',
        'G4', null, 'D4', null, 'G4', 'A4', 'G4', null,
        'D4', null, 'F4', null, 'A4', null, 'G4', 'F4',
        'E4', null, 'B3', null, 'E4', 'G#4', 'B4', null,
      ],
      bass: [
        'A2', 'A2', 'A2', 'A2', 'C3', 'C3', 'A2', 'A2',
        'G2', 'G2', 'G2', 'G2', 'B2', 'B2', 'G2', 'G2',
        'F2', 'F2', 'F2', 'F2', 'A2', 'A2', 'F2', 'F2',
        'E2', 'E2', 'E2', 'E2', 'G#2', 'G#2', 'E2', 'E2',
      ],
      drums: [
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: true,  hihat: true },
        { kick: false, snare: false, hihat: true },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: true },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: true,  hihat: true },
        { kick: false, snare: false, hihat: true },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: true,  hihat: true },
      ],
    },
  },
  {
    id: 'pyramid_mystery',
    title: 'Giza Desert Starlight',
    subtitle: 'Mystic Pharaoh Beats',
    genre: 'Exotic Chiptune',
    defaultBpm: 104,
    durationSeconds: 16,
    waveform: 'triangle',
    bassWaveform: 'sawtooth',
    description: 'Byzantine exotic scales weaving through ancient stone monuments under Orion.',
    color: '#eab308',
    pattern: {
      lead: [
        'D4', null, 'D#4', null, 'F#4', null, 'G4', null,
        'A4', null, 'G4', null, 'F#4', 'D#4', 'D4', null,
        'D4', null, 'F#4', null, 'A4', null, 'A#4', null,
        'C5', null, 'A#4', null, 'A4', 'F#4', 'D4', null,
      ],
      harmony: [
        'A3', null, 'C4', null, 'D4', null, 'D#4', null,
        'F#4', null, 'D#4', null, 'D4', 'C4', 'A3', null,
        'A3', null, 'D4', null, 'F#4', null, 'G4', null,
        'A4', null, 'G4', null, 'F#4', 'D4', 'A3', null,
      ],
      bass: [
        'D3', 'D3', 'A2', 'D3', 'D#3', 'D#3', 'A#2', 'D#3',
        'D3', 'D3', 'A2', 'D3', 'D3', 'D3', 'A2', 'D3',
        'D3', 'D3', 'A2', 'D3', 'F#3', 'F#3', 'C#3', 'F#3',
        'G3', 'G3', 'D3', 'G3', 'D3', 'D3', 'A2', 'D3',
      ],
      drums: [
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: true,  hihat: false },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: false, hihat: true },
        { kick: true,  snare: false, hihat: false },
        { kick: false, snare: true,  hihat: true },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: true,  hihat: false },
        { kick: false, snare: false, hihat: true },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: true,  hihat: false },
        { kick: false, snare: true,  hihat: true },
      ],
    },
  },
  {
    id: 'cosmic_disco',
    title: 'Cosmic Disco Cruise',
    subtitle: 'Zero-Gravity Funk',
    genre: 'Space Disco',
    defaultBpm: 126,
    durationSeconds: 16,
    waveform: 'square',
    bassWaveform: 'square',
    description: 'Four-on-the-floor disco rhythm with funky bass stabs and catchy pixel riffs.',
    color: '#a855f7',
    pattern: {
      lead: [
        'C5', null, 'G4', null, 'A#4', null, 'C5', null,
        'D#5', null, 'D5', null, 'C5', null, 'A#4', null,
        'F4', null, 'G#4', null, 'C5', null, 'D#5', null,
        'D5', null, 'C5', null, 'G4', null, null, null,
      ],
      harmony: [
        'G4', null, 'D#4', null, 'F4', null, 'G4', null,
        'A#4', null, 'G4', null, 'F4', null, 'D#4', null,
        'C4', null, 'D#4', null, 'G4', null, 'A#4', null,
        'G4', null, 'F4', null, 'D#4', null, null, null,
      ],
      bass: [
        'C3', 'C3', 'C4', 'C3', 'D#3', 'D#3', 'D#4', 'D#3',
        'F3', 'F3', 'F4', 'F3', 'G3', 'G3', 'G4', 'G3',
        'G#3', 'G#3', 'G#4', 'G#3', 'A#3', 'A#3', 'A#4', 'A#3',
        'C3', 'C3', 'C4', 'C3', 'C3', 'C3', 'G2', 'C3',
      ],
      drums: [
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: true,  snare: true,  hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: true,  snare: true,  hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: true,  hihat: true },
      ],
    },
  },
  {
    id: 'aurora_dreams',
    title: 'Reykjavik Glacial Aurora',
    subtitle: 'Ambient Crystal Chimes',
    genre: 'Cosmic Ambient',
    defaultBpm: 92,
    durationSeconds: 16,
    waveform: 'sine',
    bassWaveform: 'triangle',
    description: 'Ethereal bells and soothing sub-bass inspired by northern lights in Iceland.',
    color: '#34d399',
    pattern: {
      lead: [
        'E5', null, 'G5', null, 'B5', null, 'A5', null,
        'G5', null, 'E5', null, 'D5', null, 'E5', null,
        'C5', null, 'E5', null, 'G5', null, 'A5', null,
        'G5', null, 'D5', null, 'E5', null, null, null,
      ],
      harmony: [
        'B4', null, 'D5', null, 'G5', null, 'E5', null,
        'D5', null, 'B4', null, 'A4', null, 'B4', null,
        'G4', null, 'B4', null, 'D5', null, 'E5', null,
        'D5', null, 'B4', null, 'G4', null, null, null,
      ],
      bass: [
        'E2', null, 'E3', null, 'G2', null, 'G3', null,
        'A2', null, 'A3', null, 'B2', null, 'B3', null,
        'C3', null, 'C4', null, 'D3', null, 'D4', null,
        'E2', null, 'E3', null, 'E2', null, 'B1', null,
      ],
      drums: [
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: false, snare: true,  hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: true,  snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: false, snare: true,  hihat: true },
        { kick: false, snare: false, hihat: false },
        { kick: false, snare: false, hihat: true },
        { kick: false, snare: false, hihat: false },
      ],
    },
  },
];

export interface PlaybackState {
  isPlaying: boolean;
  currentTrackId: string;
  currentTrack: MusicTrack;
  bpm: number;
  speed: number;       // 0.75, 1.0, 1.25, 1.5
  volume: number;      // 0 to 1
  currentStep: number; // 0 to 31
  loop: boolean;
  channelMute: {
    lead: boolean;
    harmony: boolean;
    bass: boolean;
    drums: boolean;
  };
  activeNotes: {
    lead: string | null;
    harmony: string | null;
    bass: string | null;
  };
}

class RetroMusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrack: MusicTrack = MUSIC_CATALOG[0];
  private currentStep: number = 0;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private leadGain: GainNode | null = null;
  private harmonyGain: GainNode | null = null;
  private bassGain: GainNode | null = null;
  private drumGain: GainNode | null = null;

  private bpm: number = MUSIC_CATALOG[0].defaultBpm;
  private speed: number = 1.0;
  private volume: number = 0.65;
  private loop: boolean = true;
  private channelMute = {
    lead: false,
    harmony: false,
    bass: false,
    drums: false,
  };

  private listeners: Array<(state: PlaybackState) => void> = [];

  private activeNotesState = {
    lead: null as string | null,
    harmony: null as string | null,
    bass: null as string | null,
  };

  private ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Channel Gain nodes
      this.leadGain = this.ctx.createGain();
      this.leadGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.leadGain.connect(this.masterGain);

      this.harmonyGain = this.ctx.createGain();
      this.harmonyGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.harmonyGain.connect(this.masterGain);

      this.bassGain = this.ctx.createGain();
      this.bassGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.bassGain.connect(this.masterGain);

      this.drumGain = this.ctx.createGain();
      this.drumGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      this.drumGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: (state: PlaybackState) => void) {
    this.listeners.push(cb);
    setTimeout(() => {
      try {
        cb(this.getState());
      } catch {
        // ignore
      }
    }, 0);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach((cb) => cb(s));
  }

  public getState(): PlaybackState {
    return {
      isPlaying: this.isPlaying,
      currentTrackId: this.currentTrack.id,
      currentTrack: this.currentTrack,
      bpm: this.bpm,
      speed: this.speed,
      volume: this.volume,
      currentStep: this.currentStep,
      loop: this.loop,
      channelMute: { ...this.channelMute },
      activeNotes: { ...this.activeNotesState },
    };
  }

  public selectTrack(trackId: string) {
    const found = MUSIC_CATALOG.find((t) => t.id === trackId);
    if (!found) return;
    const wasPlaying = this.isPlaying;
    if (wasPlaying) this.pause();
    this.currentTrack = found;
    this.bpm = found.defaultBpm;
    this.currentStep = 0;
    this.notify();
    if (wasPlaying) this.play();
  }

  public nextTrack() {
    const idx = MUSIC_CATALOG.findIndex((t) => t.id === this.currentTrack.id);
    const nextIdx = (idx + 1) % MUSIC_CATALOG.length;
    this.selectTrack(MUSIC_CATALOG[nextIdx].id);
  }

  public prevTrack() {
    const idx = MUSIC_CATALOG.findIndex((t) => t.id === this.currentTrack.id);
    const prevIdx = (idx - 1 + MUSIC_CATALOG.length) % MUSIC_CATALOG.length;
    this.selectTrack(MUSIC_CATALOG[prevIdx].id);
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  public play() {
    this.ensureContext();
    if (this.isPlaying || !this.ctx) return;
    this.isPlaying = true;
    this.startScheduler();
    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.activeNotesState = { lead: null, harmony: null, bass: null };
    this.notify();
  }

  public stop() {
    this.pause();
    this.currentStep = 0;
    this.notify();
  }

  public setBpm(newBpm: number) {
    this.bpm = Math.max(50, Math.min(220, newBpm));
    if (this.isPlaying) {
      this.startScheduler();
    }
    this.notify();
  }

  public setSpeed(s: number) {
    this.speed = s;
    if (this.isPlaying) {
      this.startScheduler();
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  public toggleLoop() {
    this.loop = !this.loop;
    this.notify();
  }

  public toggleChannelMute(channel: 'lead' | 'harmony' | 'bass' | 'drums') {
    this.channelMute[channel] = !this.channelMute[channel];
    this.notify();
  }

  private startScheduler() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
    }
    const effectiveBpm = this.bpm * this.speed;
    const stepIntervalMs = (60 / effectiveBpm / 4) * 1000;

    this.timerId = window.setInterval(() => {
      this.tick();
    }, stepIntervalMs);
  }

  private tick() {
    if (!this.ctx || !this.isPlaying) return;
    const totalSteps = 32;

    this.playStep(this.currentStep);

    this.currentStep = (this.currentStep + 1) % totalSteps;
    if (this.currentStep === 0 && !this.loop) {
      this.pause();
    }
    this.notify();
  }

  private playStep(step: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const pattern = this.currentTrack.pattern;

    // 1. Lead Note
    const leadNote = pattern.lead[step % pattern.lead.length];
    this.activeNotesState.lead = leadNote;
    if (leadNote && !this.channelMute.lead && this.leadGain) {
      const freq = NOTE_FREQS[leadNote];
      if (freq) {
        this.synthVoice(freq, this.currentTrack.waveform, this.leadGain, 0.14, now);
      }
    }

    // 2. Harmony Note
    const harmonyNote = pattern.harmony[step % pattern.harmony.length];
    this.activeNotesState.harmony = harmonyNote;
    if (harmonyNote && !this.channelMute.harmony && this.harmonyGain) {
      const freq = NOTE_FREQS[harmonyNote];
      if (freq) {
        this.synthVoice(freq, 'triangle', this.harmonyGain, 0.16, now);
      }
    }

    // 3. Bass Note
    const bassNote = pattern.bass[step % pattern.bass.length];
    this.activeNotesState.bass = bassNote;
    if (bassNote && !this.channelMute.bass && this.bassGain) {
      const freq = NOTE_FREQS[bassNote];
      if (freq) {
        this.synthVoice(freq, this.currentTrack.bassWaveform, this.bassGain, 0.18, now);
      }
    }

    // 4. Drums
    const drumItem = pattern.drums[step % pattern.drums.length];
    if (drumItem && !this.channelMute.drums && this.drumGain) {
      if (drumItem.kick) this.triggerKick(now);
      if (drumItem.snare) this.triggerSnare(now);
      if (drumItem.hihat) this.triggerHihat(now);
    }
  }

  private synthVoice(freq: number, type: WaveformType, dest: GainNode, dur: number, when: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const actualType: OscillatorType = type === 'pulse' ? 'square' : type;

    osc.type = actualType;
    osc.frequency.setValueAtTime(freq, when);

    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(0.5, when + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dur);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(when);
    osc.stop(when + dur + 0.02);
  }

  private triggerKick(when: number) {
    if (!this.ctx || !this.drumGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, when);
    osc.frequency.exponentialRampToValueAtTime(32, when + 0.11);

    gain.gain.setValueAtTime(0.9, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + 0.12);

    osc.connect(gain);
    gain.connect(this.drumGain);
    osc.start(when);
    osc.stop(when + 0.13);
  }

  private triggerSnare(when: number) {
    if (!this.ctx || !this.drumGain) return;
    // Noise buffer
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.09);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1100, when);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.drumGain);
    noise.start(when);
  }

  private triggerHihat(when: number) {
    if (!this.ctx || !this.drumGain) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.035);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, when);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.drumGain);
    noise.start(when);
  }
}

export const musicEngine = new RetroMusicEngine();
