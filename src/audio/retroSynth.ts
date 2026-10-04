import { SynthPreset, WaveformType } from '../types/game';

class RetroSynthEngine {
  private ctx: AudioContext | null = null;
  private activeNotes: Map<string, { osc: OscillatorNode; gain: GainNode; filter: BiquadFilterNode; osc2?: OscillatorNode }> = new Map();
  private masterGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedbackGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7;

  public currentPreset: SynthPreset = {
    id: '8bit_hero',
    name: '8-Bit Hero Lead',
    waveform: 'square',
    attack: 0.02,
    decay: 0.15,
    sustain: 0.6,
    release: 0.25,
    filterCutoff: 3500,
    resonance: 6,
    bitDepth: 8,
    delayFeedback: 0.25,
    delayTime: 0.22,
    vibratoRate: 5,
    vibratoDepth: 4,
  };

  private ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      // Delay effect network
      this.delayNode = this.ctx.createDelay();
      this.delayNode.delayTime.setValueAtTime(this.currentPreset.delayTime, this.ctx.currentTime);

      this.delayFeedbackGain = this.ctx.createGain();
      this.delayFeedbackGain.gain.setValueAtTime(this.currentPreset.delayFeedback, this.ctx.currentTime);

      // Routing: Delay loop
      this.delayNode.connect(this.delayFeedbackGain);
      this.delayFeedbackGain.connect(this.delayNode);
      this.delayNode.connect(this.masterGain);

      // Master to speaker
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public updatePreset(partial: Partial<SynthPreset>) {
    this.currentPreset = { ...this.currentPreset, ...partial };
    if (this.delayNode && this.delayFeedbackGain && this.ctx) {
      this.delayNode.delayTime.setValueAtTime(this.currentPreset.delayTime, this.ctx.currentTime);
      this.delayFeedbackGain.gain.setValueAtTime(this.currentPreset.delayFeedback, this.ctx.currentTime);
    }
  }

  public playNote(noteKey: string, frequency: number) {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    // Stop existing note instance if still playing
    this.stopNote(noteKey, true);

    const now = this.ctx.currentTime;
    const { attack, decay, sustain, filterCutoff, resonance, waveform, vibratoRate, vibratoDepth } = this.currentPreset;

    // 1. Oscillator
    const osc = this.ctx.createOscillator();
    const actualWaveform: OscillatorType = waveform === 'pulse' ? 'square' : waveform;
    osc.type = actualWaveform;
    osc.frequency.setValueAtTime(frequency, now);

    // Subtle pitch vibrato
    if (vibratoDepth > 0 && vibratoRate > 0) {
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(vibratoRate, now);
      lfoGain.gain.setValueAtTime(vibratoDepth, now);
      lfo.connect(osc.frequency);
      lfo.start(now);
    }

    // Optional second detuned osc for "pulse" or fat lead
    let osc2: OscillatorNode | undefined;
    if (waveform === 'pulse' || this.currentPreset.id === 'cosmic_pad') {
      osc2 = this.ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(frequency * 1.004, now);
    }

    // 2. Filter (BiquadFilterNode)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(200, filterCutoff * 0.5), now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(200, filterCutoff), now + Math.max(0.01, attack));
    filter.Q.setValueAtTime(resonance, now);

    // 3. Amplitude Envelope (ADSR)
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    const attackTime = Math.max(0.005, attack);
    gainNode.gain.linearRampToValueAtTime(0.5, now + attackTime);
    gainNode.gain.linearRampToValueAtTime(0.5 * Math.max(0.1, sustain), now + attackTime + decay);

    // Connect chain: osc -> filter -> gainNode -> master & delay
    osc.connect(filter);
    if (osc2) {
      osc2.connect(filter);
    }
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    if (this.delayNode && this.currentPreset.delayFeedback > 0) {
      gainNode.connect(this.delayNode);
    }

    osc.start(now);
    if (osc2) {
      osc2.start(now);
    }

    this.activeNotes.set(noteKey, { osc, gain: gainNode, filter, osc2 });
  }

  public stopNote(noteKey: string, immediate = false) {
    const entry = this.activeNotes.get(noteKey);
    if (!entry || !this.ctx) return;

    const { osc, gain, osc2 } = entry;
    const now = this.ctx.currentTime;
    const releaseTime = immediate ? 0.01 : Math.max(0.02, this.currentPreset.release);

    try {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);

      setTimeout(() => {
        try {
          osc.stop();
          osc.disconnect();
          if (osc2) {
            osc2.stop();
            osc2.disconnect();
          }
          gain.disconnect();
        } catch {
          // ignore disconnect errors
        }
      }, releaseTime * 1000 + 50);
    } catch {
      // ignore ramp errors
    }

    this.activeNotes.delete(noteKey);
  }

  public stopAllNotes() {
    for (const key of Array.from(this.activeNotes.keys())) {
      this.stopNote(key, true);
    }
    this.activeNotes.clear();
  }

  // Sound effects for game events
  public playHyperspaceWarpSound() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.6);
    osc.frequency.exponentialRampToValueAtTime(60, now + 1.2);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  public playCoinSound() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playCheerSound() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    // Chiptune chord fanfare
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    chords.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.2, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.06);
      osc.stop(now + 0.85);
    });
  }
}

export const synthEngine = new RetroSynthEngine();

export const SYNTH_PRESETS: SynthPreset[] = [
  {
    id: '8bit_hero',
    name: '8-Bit Hero Lead',
    waveform: 'square',
    attack: 0.01,
    decay: 0.12,
    sustain: 0.7,
    release: 0.15,
    filterCutoff: 3800,
    resonance: 7,
    bitDepth: 8,
    delayFeedback: 0.2,
    delayTime: 0.18,
    vibratoRate: 6,
    vibratoDepth: 5,
  },
  {
    id: 'arcade_blitz',
    name: '16-Bit Arcade Brass',
    waveform: 'sawtooth',
    attack: 0.03,
    decay: 0.2,
    sustain: 0.8,
    release: 0.25,
    filterCutoff: 4500,
    resonance: 4,
    bitDepth: 16,
    delayFeedback: 0.3,
    delayTime: 0.25,
    vibratoRate: 4,
    vibratoDepth: 3,
  },
  {
    id: 'space_theremin',
    name: 'Cosmic Theremin',
    waveform: 'sine',
    attack: 0.08,
    decay: 0.3,
    sustain: 0.9,
    release: 0.5,
    filterCutoff: 6000,
    resonance: 2,
    bitDepth: 12,
    delayFeedback: 0.45,
    delayTime: 0.32,
    vibratoRate: 5.5,
    vibratoDepth: 12,
  },
  {
    id: 'cosmic_pad',
    name: 'Starlight Pad',
    waveform: 'triangle',
    attack: 0.15,
    decay: 0.4,
    sustain: 0.85,
    release: 0.65,
    filterCutoff: 2200,
    resonance: 3,
    bitDepth: 16,
    delayFeedback: 0.5,
    delayTime: 0.4,
    vibratoRate: 3,
    vibratoDepth: 2,
  },
  {
    id: 'lofi_bass',
    name: 'Punchy 8-Bit Bass',
    waveform: 'square',
    attack: 0.005,
    decay: 0.1,
    sustain: 0.4,
    release: 0.1,
    filterCutoff: 1200,
    resonance: 9,
    bitDepth: 6,
    delayFeedback: 0.05,
    delayTime: 0.12,
    vibratoRate: 0,
    vibratoDepth: 0,
  },
  {
    id: 'acid_chiptune',
    name: 'Acid Space Squeal',
    waveform: 'sawtooth',
    attack: 0.01,
    decay: 0.25,
    sustain: 0.5,
    release: 0.2,
    filterCutoff: 5000,
    resonance: 14,
    bitDepth: 8,
    delayFeedback: 0.35,
    delayTime: 0.2,
    vibratoRate: 8,
    vibratoDepth: 8,
  }
];
