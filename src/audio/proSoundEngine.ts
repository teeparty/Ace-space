import { 
  DrumSampleSpec, 
  MelodicSoundSpec, 
  SoundKit, 
  GENRE_CATALOG, 
  MELODIC_SOUNDS 
} from './soundKitLibrary';

class ProSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeMelodicVoices: Map<string, { 
    oscillators: OscillatorNode[]; 
    gain: GainNode; 
    filter: BiquadFilterNode;
  }> = new Map();
  private volume: number = 0.75;
  private isMuted: boolean = false;

  public currentKit: SoundKit = GENRE_CATALOG[0].kits[0]; // default: Atlanta Metro 808
  public currentMelodicSound: MelodicSoundSpec = MELODIC_SOUNDS[0]; // default: Concert Grand Piano

  private ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setKit(kit: SoundKit) {
    this.currentKit = kit;
  }

  public setMelodicSound(sound: MelodicSoundSpec) {
    this.currentMelodicSound = sound;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // --------------------------------------------------------------------------
  // DRUM TRIGGER ENGINE (Professional synthesis for all 18 drum variations)
  // --------------------------------------------------------------------------
  public triggerDrumSample(sample: DrumSampleSpec, velocity = 1.0) {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const { dsp, type } = sample;
    const vel = Math.max(0.2, Math.min(1.0, velocity));

    if (dsp.isCowbell) {
      this.synthesize808Cowbell(dsp, now, vel);
    } else if (dsp.isBedSqueak) {
      this.synthesizeJerseyBedSqueak(dsp, now, vel);
    } else if (dsp.isAmapianoLog) {
      this.synthesizeAmapianoLogDrum(dsp, now, vel);
    } else if (dsp.isShaker) {
      this.synthesizeShaker(dsp, now, vel);
    } else if (type === 'kick' || type === 'sub_808') {
      this.synthesizeKickOr808(dsp, now, vel);
    } else if (type === 'snare' || type === 'rim') {
      this.synthesizeSnareOrRim(dsp, now, vel);
    } else if (type === 'clap') {
      this.synthesizeLayeredClap(dsp, now, vel);
    } else if (type === 'hihat_closed' || type === 'hihat_open' || type === 'ride') {
      this.synthesizeCymbal(dsp, now, vel, type === 'hihat_open' || type === 'ride');
    } else if (type === 'crash') {
      this.synthesizeCrash(dsp, now, vel);
    } else if (type === 'perc') {
      this.synthesizePerc(dsp, now, vel);
    } else if (type === 'perc_loop') {
      this.synthesizePercLoop(dsp, now, vel);
    } else if (type === 'fill') {
      this.synthesizeDrumFill(dsp, now, vel);
    } else if (type === 'fx_transition') {
      this.synthesizeTransitionFx(dsp, now, vel);
    } else {
      this.synthesizePerc(dsp, now, vel);
    }
  }

  // 1. Kick & 808 Sub Synthesis
  private synthesizeKickOr808(dsp: DrumSampleSpec['dsp'], when: number, vel: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = dsp.distortion && dsp.distortion > 0.4 ? 'triangle' : 'sine';
    const startFreq = dsp.baseFreq * 2.8;
    const endFreq = dsp.baseFreq;

    osc.frequency.setValueAtTime(startFreq, when);
    osc.frequency.exponentialRampToValueAtTime(endFreq, when + (dsp.pitchDecay || 0.045));

    gain.gain.setValueAtTime(0.9 * vel, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dsp.decay);

    // Optional click transient
    if (dsp.clickTransient) {
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(850, when);
      clickOsc.frequency.exponentialRampToValueAtTime(70, when + 0.015);
      clickGain.gain.setValueAtTime(0.6 * vel, when);
      clickGain.gain.exponentialRampToValueAtTime(0.001, when + 0.02);
      clickOsc.connect(clickGain);
      clickGain.connect(this.masterGain);
      clickOsc.start(when);
      clickOsc.stop(when + 0.025);
    }

    const filter = this.ctx.createBiquadFilter();
    filter.type = dsp.filterType;
    filter.frequency.setValueAtTime(dsp.filterFreq, when);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(when);
    osc.stop(when + dsp.decay + 0.05);
  }

  // 2. Snare & Rim Synthesis
  private synthesizeSnareOrRim(dsp: DrumSampleSpec['dsp'], when: number, vel: number) {
    if (!this.ctx || !this.masterGain) return;

    // Body tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(dsp.baseFreq * 1.4, when);
    osc.frequency.exponentialRampToValueAtTime(dsp.baseFreq, when + 0.04);
    oscGain.gain.setValueAtTime(0.55 * vel, when);
    oscGain.gain.exponentialRampToValueAtTime(0.001, when + dsp.decay * 0.7);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(when);
    osc.stop(when + dsp.decay);

    // Snare wire noise
    const bufferSize = Math.floor(this.ctx.sampleRate * dsp.decay);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = dsp.filterType;
    filter.frequency.setValueAtTime(dsp.filterFreq, when);
    if (dsp.resonance) filter.Q.setValueAtTime(dsp.resonance, when);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime((dsp.noiseAmount || 0.8) * vel, when);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, when + dsp.decay);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(when);
  }

  // 3. Multi-burst Handclap Synthesis
  private synthesizeLayeredClap(dsp: DrumSampleSpec['dsp'], when: number, vel: number) {
    if (!this.ctx || !this.masterGain) return;

    const burstOffsets = [0, 0.011, 0.022, 0.035];
    burstOffsets.forEach((offset, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const isFinal = idx === burstOffsets.length - 1;
      const dur = isFinal ? dsp.decay : 0.015;
      const bufferSize = Math.floor(this.ctx.sampleRate * dur);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(dsp.filterFreq, when + offset);
      filter.Q.setValueAtTime(3.0, when + offset);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime((isFinal ? 0.85 : 0.4) * vel, when + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, when + offset + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(when + offset);
    });
  }

  // 4. Inharmonic Sizzle Cymbals & Hats
  private synthesizeCymbal(dsp: DrumSampleSpec['dsp'], when: number, vel: number, isOpen = false) {
    if (!this.ctx || !this.masterGain) return;
    const metalFreqs = [205, 304, 369, 522, 540, 800];

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(dsp.filterFreq, when);

    const envGain = this.ctx.createGain();
    envGain.gain.setValueAtTime((isOpen ? 0.8 : 0.65) * vel, when);
    envGain.gain.exponentialRampToValueAtTime(0.001, when + dsp.decay);

    metalFreqs.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, when);
      osc.connect(filter);
      osc.start(when);
      osc.stop(when + dsp.decay + 0.05);
    });

    filter.connect(envGain);
    envGain.connect(this.masterGain);
  }

  // 5. Crash Cymbal
  private synthesizeCrash(dsp: DrumSampleSpec['dsp'], when: number, vel: number) {
    if (!this.ctx || !this.masterGain) return;
    const dur = Math.max(1.0, dsp.decay);
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(4500, when);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.85 * vel, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(when);
  }

  // 6. Tuned Percussion (Conga, Bongo, Woodblock)
  private synthesizePerc(dsp: DrumSampleSpec['dsp'], when: number, vel: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(dsp.baseFreq * 1.8, when);
    osc.frequency.exponentialRampToValueAtTime(dsp.baseFreq, when + 0.035);

    gain.gain.setValueAtTime(0.75 * vel, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dsp.decay);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(dsp.filterFreq, when);
    filter.Q.setValueAtTime(dsp.resonance || 6, when);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(when);
    osc.stop(when + dsp.decay + 0.05);
  }

  // 7. TR-808 Dual-Frequency Cowbell (Memphis / West Coast / Trap)
  private synthesize808Cowbell(dsp: DrumSampleSpec['dsp'], when: number, vel: number) {
    if (!this.ctx || !this.masterGain) return;
    const f1 = dsp.baseFreq;
    const f2 = dsp.baseFreq * 1.48; // classic 808 cowbell ratio ~540Hz & 800Hz

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'square';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(f1, when);
    osc2.frequency.setValueAtTime(f2, when);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime((f1 + f2) / 2, when);
    filter.Q.setValueAtTime(9.0, when);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7 * vel, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dsp.decay);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(when);
    osc2.start(when);
    osc1.stop(when + dsp.decay + 0.05);
    osc2.stop(when + dsp.decay + 0.05);
  }

  // 8. Jersey Club Bed Squeak Chirp
  private synthesizeJerseyBedSqueak(dsp: DrumSampleSpec['dsp'], when: number, vel: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Chirp sweep: from 600Hz up to 1400Hz rapidly
    osc.frequency.setValueAtTime(600, when);
    osc.frequency.exponentialRampToValueAtTime(1450, when + 0.06);
    osc.frequency.exponentialRampToValueAtTime(950, when + 0.12);

    gain.gain.setValueAtTime(0.8 * vel, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + 0.15);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, when);
    filter.Q.setValueAtTime(8, when);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(when);
    osc.stop(when + 0.18);
  }

  // 9. Amapiano Pitch-Sliding Hollow Log Drum
  private synthesizeAmapianoLogDrum(dsp: DrumSampleSpec['dsp'], when: number, vel: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    subOsc.type = 'triangle';

    const startFreq = dsp.baseFreq * 2.2;
    const endFreq = dsp.baseFreq;

    osc.frequency.setValueAtTime(startFreq, when);
    osc.frequency.exponentialRampToValueAtTime(endFreq, when + (dsp.pitchDecay || 0.14));

    subOsc.frequency.setValueAtTime(startFreq * 0.5, when);
    subOsc.frequency.exponentialRampToValueAtTime(endFreq * 0.5, when + (dsp.pitchDecay || 0.14));

    gain.gain.setValueAtTime(0.9 * vel, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dsp.decay);

    // Warm wooden bandpass resonance
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, when);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(when);
    subOsc.start(when);
    osc.stop(when + dsp.decay + 0.05);
    subOsc.stop(when + dsp.decay + 0.05);
  }

  // 10. Shaker (Afrobeats, House, R&B)
  private synthesizeShaker(dsp: DrumSampleSpec['dsp'], when: number, vel: number) {
    if (!this.ctx || !this.masterGain) return;
    const dur = dsp.decay || 0.07;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(dsp.filterFreq || 5500, when);
    filter.Q.setValueAtTime(4.0, when);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6 * vel, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(when);
  }

  // 11. Percussion Loop (Rhythmic syncopated groove pattern)
  private synthesizePercLoop(dsp: DrumSampleSpec['dsp'], when: number, vel: number) {
    if (!this.ctx || !this.masterGain) return;
    const tempo = dsp.loopBpm || 120;
    const beatInterval = 60 / tempo / 4; // 16th note interval

    // Play an 8-step groove burst
    for (let step = 0; step < 8; step++) {
      const stepTime = when + step * beatInterval;
      const isAccent = step === 0 || step === 3 || step === 6;
      setTimeout(() => {
        if (!this.ctx) return;
        this.synthesizeShaker(
          { ...dsp, filterFreq: isAccent ? 6200 : 4800, decay: 0.05 },
          this.ctx.currentTime,
          (isAccent ? 0.9 : 0.5) * vel
        );
      }, step * beatInterval * 1000);
    }
  }

  // 12. Drum Fill (Multi-tom & snare turnaround roll)
  private synthesizeDrumFill(dsp: DrumSampleSpec['dsp'], when: number, vel: number) {
    const tomFreqs = [260, 220, 180, 140, 110];
    tomFreqs.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        this.synthesizeKickOr808(
          { ...dsp, baseFreq: freq, decay: 0.14, clickTransient: true },
          this.ctx.currentTime,
          (0.7 + idx * 0.06) * vel
        );
      }, idx * 65);
    });
  }

  // 13. Transitional FX (Laser Downshifter / Noise Riser Sweep)
  private synthesizeTransitionFx(dsp: DrumSampleSpec['dsp'], when: number, vel: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(dsp.baseFreq * 2, when);
    osc.frequency.exponentialRampToValueAtTime(45, when + dsp.decay);

    gain.gain.setValueAtTime(0.6 * vel, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dsp.decay);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4500, when);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(when);
    osc.stop(when + dsp.decay + 0.05);
  }

  // --------------------------------------------------------------------------
  // CHROMATIC MELODIC INSTRUMENT ENGINE
  // Plays Piano, Rhodes, 808 Bass, Leads, Chords, Vocal Chops, etc.
  // --------------------------------------------------------------------------
  public playMelodicNote(noteKey: string, freq: number, spec = this.currentMelodicSound, velocity = 1.0) {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    this.stopMelodicNote(noteKey);

    const now = this.ctx.currentTime;
    const { 
      attack, 
      decay, 
      sustain, 
      filterCutoff, 
      filterType, 
      resonance, 
      waveform, 
      detuneSpread, 
      subOsc, 
      chordType,
      formantVowel 
    } = spec;

    const oscillators: OscillatorNode[] = [];
    const masterVoiceGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(Math.min(filterCutoff, 12000), now);
    filter.Q.setValueAtTime(resonance, now);

    // Formant filter enhancement for vocal chops
    if (formantVowel) {
      const formantFreqs = {
        a: 850,
        o: 500,
        e: 450,
        i: 300,
        u: 350,
      };
      filter.frequency.setValueAtTime(formantFreqs[formantVowel] || 700, now);
      filter.Q.setValueAtTime(8.5, now);
    }

    // Determine frequencies to play (single note or chord stab)
    let freqsToPlay: number[] = [freq];
    if (chordType === 'minor9') {
      // Root, Minor 3rd (+3 semitones), 5th (+7), Minor 7th (+10), 9th (+14)
      freqsToPlay = [
        freq, 
        freq * Math.pow(2, 3/12), 
        freq * Math.pow(2, 7/12), 
        freq * Math.pow(2, 10/12),
        freq * Math.pow(2, 14/12)
      ];
    } else if (chordType === 'major7') {
      // Root, Major 3rd (+4), 5th (+7), Major 7th (+11)
      freqsToPlay = [
        freq, 
        freq * Math.pow(2, 4/12), 
        freq * Math.pow(2, 7/12), 
        freq * Math.pow(2, 11/12)
      ];
    } else if (chordType === 'minorTriad') {
      freqsToPlay = [
        freq, 
        freq * Math.pow(2, 3/12), 
        freq * Math.pow(2, 7/12)
      ];
    }

    // Spawn oscillators for each voice note in chord
    freqsToPlay.forEach((f) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = waveform;
      osc.frequency.setValueAtTime(f, now);
      osc.connect(filter);
      osc.start(now);
      oscillators.push(osc);

      // Detuned twin oscillator for lush unison
      if (detuneSpread && detuneSpread > 0) {
        const osc2 = this.ctx.createOscillator();
        osc2.type = waveform;
        osc2.frequency.setValueAtTime(f, now);
        osc2.detune.setValueAtTime(detuneSpread, now);
        osc2.connect(filter);
        osc2.start(now);
        oscillators.push(osc2);
      }
    });

    // Sub oscillator for bass/808/piano
    if (subOsc) {
      const sub = this.ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(freq / 2, now);
      sub.connect(filter);
      sub.start(now);
      oscillators.push(sub);
    }

    // ADSR Envelope
    const targetGain = (0.55 / Math.sqrt(freqsToPlay.length)) * Math.max(0.2, velocity);
    masterVoiceGain.gain.setValueAtTime(0, now);
    masterVoiceGain.gain.linearRampToValueAtTime(targetGain, now + Math.max(0.005, attack));
    masterVoiceGain.gain.linearRampToValueAtTime(targetGain * Math.max(0.1, sustain), now + Math.max(0.005, attack) + decay);

    filter.connect(masterVoiceGain);
    masterVoiceGain.connect(this.masterGain);

    this.activeMelodicVoices.set(noteKey, { 
      oscillators, 
      gain: masterVoiceGain, 
      filter 
    });
  }

  public stopMelodicNote(noteKey: string) {
    const voice = this.activeMelodicVoices.get(noteKey);
    if (!voice || !this.ctx) return;

    const { oscillators, gain } = voice;
    const now = this.ctx.currentTime;
    const release = Math.max(0.05, this.currentMelodicSound.release);

    try {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + release);

      setTimeout(() => {
        try {
          oscillators.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {
              // ignore
            }
          });
          gain.disconnect();
        } catch {
          // ignore
        }
      }, release * 1000 + 40);
    } catch {
      // ignore
    }

    this.activeMelodicVoices.delete(noteKey);
  }

  public stopAllMelodicNotes() {
    this.activeMelodicVoices.forEach((_, key) => {
      this.stopMelodicNote(key);
    });
    this.activeMelodicVoices.clear();
  }
}

export const proSoundEngine = new ProSoundEngine();
