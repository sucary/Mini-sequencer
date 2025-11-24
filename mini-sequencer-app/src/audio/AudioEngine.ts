import * as Tone from 'tone';
import { useSequencerStore } from '../store/useSequencerStore';

class AudioEngine {
  private synth: Tone.PolySynth | null = null;
  private metronomeSynth: Tone.MembraneSynth | null = null;
  private isInitialized = false;
  private sequence: Tone.Sequence | null = null;

  public async initialize() {
    if (this.isInitialized) return;

    await Tone.start();
    
    // Clear any existing events on the transport to prevent ghost loops (HMR issue)
    Tone.Transport.cancel();
    
    // Create a "toy" synth sound
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "triangle"
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();

    // Create metronome synth
    this.metronomeSynth = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      envelope: {
        attack: 0.0006,
        decay: 0.2,
        sustain: 0
      }
    }).toDestination();
    this.metronomeSynth.volume.value = -10; // Lower volume for metronome

    Tone.Transport.bpm.value = useSequencerStore.getState().bpm;
    this.isInitialized = true;
  }

  public playNote(note: string, duration: string = "8n") {
    if (!this.synth) return;
    this.synth.triggerAttackRelease(note, duration);
  }

  private createSequence() {
    if (this.sequence) {
      this.sequence.dispose();
    }

    const { totalSteps } = useSequencerStore.getState();
    // Create an array of indices [0, 1, 2, ... totalSteps-1]
    const events = Array.from({ length: totalSteps }, (_, i) => i);

    this.sequence = new Tone.Sequence((time, stepIndex) => {
      const { sequence, setCurrentStep, isMetronomeOn } = useSequencerStore.getState();
      const stepData = sequence[stepIndex];

      // Audio: Play Note
      if (stepData.active && stepData.note && this.synth) {
        this.synth.triggerAttackRelease(stepData.note, "4n", time);
      }

      // Audio: Metronome
      if (isMetronomeOn && this.metronomeSynth) {
        const note = stepIndex % 4 === 0 ? "C5" : "C4";
        this.metronomeSynth.triggerAttackRelease(note, "32n", time);
      }

      // Visual: Update UI at the exact time
      Tone.Draw.schedule(() => {
        setCurrentStep(stepIndex);
      }, time);

    }, events, "4n");

    this.sequence.start(0);
  }

  public async start(startStep?: number) {
    if (!this.isInitialized) await this.initialize();
    
    // Always recreate sequence to ensure it matches current totalSteps
    this.createSequence();

    // If startStep is provided, we want to start playing from that step.
    // Tone.Sequence is tied to Transport time.
    // To start at a specific step, we can set the Transport position.
    // Each step is "4n".
    if (startStep !== undefined) {
      // Calculate time offset: step * 4n
      const timeOffset = Tone.Time("4n").toSeconds() * startStep;
      Tone.Transport.position = timeOffset;
    } else if (useSequencerStore.getState().currentStep === -1) {
      // If stopped, start from 0
      Tone.Transport.position = 0;
    }
    // If paused (currentStep != -1), we just resume, so we don't touch position.
    
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }
  }

  public pause() {
    Tone.Transport.pause();
  }

  public stop() {
    Tone.Transport.stop();
    Tone.Transport.position = 0; // Reset transport to beginning
    if (this.sequence) {
      this.sequence.dispose();
      this.sequence = null;
    }
    // Reset UI to stopped state
    useSequencerStore.getState().setCurrentStep(-1);
  }

  public setBpm(bpm: number) {
    Tone.Transport.bpm.value = bpm;
  }
}

export const audioEngine = new AudioEngine();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    audioEngine.stop();
    Tone.Transport.cancel();
  });
}