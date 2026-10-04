import { proSoundEngine } from './proSoundEngine';

export interface BackingTrack {
  id: string;
  name: string;
  genre: string;
  bpm: number;
  pattern: {
    kick: boolean[];
    snare: boolean[];
    hihat: boolean[];
    bass: number[]; // frequency or 0
  };
}

export interface BeatLayer {
  id: string;
  name: string;
  pattern: {
    kick: boolean[];
    snare: boolean[];
    hihat: boolean[];
    bass: number[];
  };
  volume: number;
}

export const BACKING_TRACKS: BackingTrack[] = [
  {
    id: 'cosmic_disco',
    name: 'Cosmic Disco Cruise',
    genre: 'Retro Disco',
    bpm: 120,
    pattern: {
      kick:  [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      bass:  [130.81, 0, 130.81, 0, 155.56, 0, 155.56, 0, 174.61, 0, 174.61, 0, 196.00, 0, 220.00, 0], // C3, Eb3, F3, G3, A3
    }
  },
  {
    id: 'chiptune_rush',
    name: '8-Bit Speedrun',
    genre: 'Fast Chiptune',
    bpm: 140,
    pattern: {
      kick:  [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, true],
      hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      bass:  [220, 220, 261.63, 220, 293.66, 220, 329.63, 220, 220, 220, 261.63, 220, 392.00, 329.63, 293.66, 261.63],
    }
  },
  {
    id: 'tokyo_drift',
    name: 'Neo-Tokyo Synthwave',
    genre: 'Vaporwave Beat',
    bpm: 96,
    pattern: {
      kick:  [true, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false],
      snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hihat: [true, false, true, true, true, false, true, false, true, false, true, true, true, false, true, true],
      bass:  [110, 0, 0, 110, 0, 0, 110, 0, 130.81, 0, 0, 130.81, 0, 98, 0, 98],
    }
  },
  {
    id: 'cairo_groove',
    name: 'Pyramid Desert Pulse',
    genre: 'Exotic Chiptune',
    bpm: 105,
    pattern: {
      kick:  [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false],
      snare: [false, false, false, false, true, false, false, false, false, false, true, false, false, false, true, false],
      hihat: [true, true, false, true, true, false, true, true, false, true, true, false, true, true, true, false],
      bass:  [146.83, 0, 155.56, 0, 185.00, 0, 196.00, 0, 185.00, 0, 155.56, 0, 146.83, 0, 138.59, 0],
    }
  }
];

class RetroDrumMachine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrack: BackingTrack = BACKING_TRACKS[0];
  private isBaseTrackActive: boolean = false;
  private currentStep: number = 0;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private stepCallbacks: Array<(step: number) => void> = [];

  // Multi-layer beat overlapping map: layerId -> BeatLayer
  private activeLayers: Map<string, BeatLayer> = new Map();

  private ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- MULTI-LAYER OVERLAP MANAGEMENT ---
  public toggleBeatLayer(
    id: string,
    name: string,
    pattern: { kick: boolean[]; snare: boolean[]; hihat: boolean[]; bass: number[] },
    volume = 0.8
  ): boolean {
    this.ensureContext();
    if (this.activeLayers.has(id)) {
      this.activeLayers.delete(id);
      // If no layers active and base track not active, stop engine
      if (this.activeLayers.size === 0 && !this.isBaseTrackActive) {
        this.stop();
      }
      return false;
    } else {
      this.activeLayers.set(id, { id, name, pattern, volume });
      if (!this.isPlaying) {
        this.start();
      }
      return true;
    }
  }

  public isLayerActive(id: string): boolean {
    return this.activeLayers.has(id);
  }

  public getActiveLayerIds(): string[] {
    return Array.from(this.activeLayers.keys());
  }

  public getActiveLayersCount(): number {
    return this.activeLayers.size;
  }

  public removeLayer(id: string) {
    this.activeLayers.delete(id);
    if (this.activeLayers.size === 0 && !this.isBaseTrackActive) {
      this.stop();
    }
  }

  public clearAllLayers() {
    this.activeLayers.clear();
    if (!this.isBaseTrackActive) {
      this.stop();
    }
  }

  public setTrack(track: BackingTrack) {
    const wasPlaying = this.isPlaying;
    if (wasPlaying) this.stop();
    this.currentTrack = track;
    if (wasPlaying) this.start();
  }

  public setCustomPattern(title: string, pattern: { kick: boolean[]; snare: boolean[]; hihat: boolean[]; bass: number[] }, bpm = 120) {
    const wasPlaying = this.isPlaying;
    if (wasPlaying) this.stop();
    this.currentTrack = {
      id: `custom_${Date.now()}`,
      name: title,
      genre: 'Custom Space Beat',
      bpm,
      pattern,
    };
    if (wasPlaying) this.start();
  }

  public getTrack(): BackingTrack {
    return this.currentTrack;
  }

  public previewSound(type: 'kick' | 'snare' | 'hihat') {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (type === 'kick') this.triggerKickSound(now);
    if (type === 'snare') this.triggerSnareSound(now);
    if (type === 'hihat') this.triggerHihatSound(now);
  }

  private triggerKickSound(now: number) {
    if (proSoundEngine.currentKit) {
      const kickSample = proSoundEngine.currentKit.samples.find(s => s.type === 'kick');
      if (kickSample) {
        proSoundEngine.triggerDrumSample(kickSample, 0.95);
        return;
      }
    }
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  private triggerSnareSound(now: number) {
    if (proSoundEngine.currentKit) {
      const snareSample = proSoundEngine.currentKit.samples.find(s => s.type === 'snare');
      if (snareSample) {
        proSoundEngine.triggerDrumSample(snareSample, 0.9);
        return;
      }
    }
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.1);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
  }

  private triggerHihatSound(now: number) {
    if (proSoundEngine.currentKit) {
      const hatSample = proSoundEngine.currentKit.samples.find(s => s.type === 'hihat_closed');
      if (hatSample) {
        proSoundEngine.triggerDrumSample(hatSample, 0.85);
        return;
      }
    }
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
  }

  public setBpm(bpm: number) {
    this.currentTrack = { ...this.currentTrack, bpm: Math.max(60, Math.min(200, bpm)) };
    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  public onStep(cb: (step: number) => void) {
    this.stepCallbacks.push(cb);
  }

  public offStep(cb: (step: number) => void) {
    this.stepCallbacks = this.stepCallbacks.filter(c => c !== cb);
  }

  public start() {
    this.ensureContext();
    if (this.isPlaying || !this.ctx) return;
    this.isPlaying = true;
    this.currentStep = 0;

    const stepIntervalMs = (60 / this.currentTrack.bpm / 4) * 1000;
    this.timerId = window.setInterval(() => {
      this.playStep(this.currentStep);
      this.stepCallbacks.forEach(cb => cb(this.currentStep));
      this.currentStep = (this.currentStep + 1) % 16;
    }, stepIntervalMs);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.currentStep = 0;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.isBaseTrackActive = false;
      this.clearAllLayers();
      this.stop();
    } else {
      this.isBaseTrackActive = true;
      this.start();
    }
    return this.isPlaying;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private playStep(step: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    let shouldKick = false;
    let shouldSnare = false;
    let shouldHihat = false;
    let bassFreq = 0;

    // 1. Evaluate Base Backing Track if active
    if (this.isBaseTrackActive) {
      const { kick, snare, hihat, bass } = this.currentTrack.pattern;
      if (kick[step]) shouldKick = true;
      if (snare[step]) shouldSnare = true;
      if (hihat[step]) shouldHihat = true;
      if (bass[step] && bass[step] > 0) bassFreq = bass[step];
    }

    // 2. Evaluate and OVERLAP all active saved beat layers
    this.activeLayers.forEach((layer) => {
      const p = layer.pattern;
      if (p.kick && p.kick[step]) shouldKick = true;
      if (p.snare && p.snare[step]) shouldSnare = true;
      if (p.hihat && p.hihat[step]) shouldHihat = true;
      if (p.bass && p.bass[step] && p.bass[step] > 0) {
        bassFreq = p.bass[step];
      }
    });

    // Fire overlapped sound triggers
    if (shouldKick) this.triggerKickSound(now);
    if (shouldSnare) this.triggerSnareSound(now);
    if (shouldHihat) this.triggerHihatSound(now);

    if (bassFreq > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(bassFreq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.17);
    }
  }
}

export const drumMachine = new RetroDrumMachine();
