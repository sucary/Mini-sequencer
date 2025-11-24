import React from 'react';
import classNames from 'classnames';
import { useSequencerStore } from '../../store/useSequencerStore';
import { audioEngine } from '../../audio/AudioEngine';
import './Keyboard.scss';

const NOTES = [
  // Octave 3
  { note: 'C3', type: 'white' },
  { note: 'C#3', type: 'black' },
  { note: 'D3', type: 'white' },
  { note: 'D#3', type: 'black' },
  { note: 'E3', type: 'white' },
  { note: 'F3', type: 'white' },
  { note: 'F#3', type: 'black' },
  { note: 'G3', type: 'white' },
  { note: 'G#3', type: 'black' },
  { note: 'A3', type: 'white' },
  { note: 'A#3', type: 'black' },
  { note: 'B3', type: 'white' },
  // Octave 4
  { note: 'C4', type: 'white' },
  { note: 'C#4', type: 'black' },
  { note: 'D4', type: 'white' },
  { note: 'D#4', type: 'black' },
  { note: 'E4', type: 'white' },
  { note: 'F4', type: 'white' },
  { note: 'F#4', type: 'black' },
  { note: 'G4', type: 'white' },
  { note: 'G#4', type: 'black' },
  { note: 'A4', type: 'white' },
  { note: 'A#4', type: 'black' },
  { note: 'B4', type: 'white' },
  // Octave 5
  { note: 'C5', type: 'white' },
];

export const Keyboard: React.FC = () => {
  const { selectedStep, setStepNote, setSelectedStep, totalSteps } = useSequencerStore();

  const handleKeyClick = (note: string) => {
    // Always play the note for feedback
    audioEngine.playNote(note);

    // If a step is selected, assign the note to it
    if (selectedStep !== null) {
      setStepNote(selectedStep, note);
      
      // Auto-advance to next step, looping based on totalSteps
      const nextStep = (selectedStep + 1) % totalSteps;
      setSelectedStep(nextStep);
    }
  };

  return (
    <div className="keyboard-container">
      <div className="keys-wrapper">
        {NOTES.map((key) => (
          <button
            key={key.note}
            className={classNames('piano-key', key.type)}
            onClick={() => handleKeyClick(key.note)}
            data-note={key.note}
          >
          </button>
        ))}
      </div>
    </div>
  );
};