import React from 'react';
import { useSequencerStore } from '../../store/useSequencerStore';
import './Display.scss';

export const Display: React.FC = () => {
  const { bpm, isPlaying, currentStep, sequence, selectedStep } = useSequencerStore();
  
  const currentNote = sequence[currentStep]?.note || '---';
  const selectedNote = selectedStep !== null ? (sequence[selectedStep]?.note || '---') : null;

  return (
    <div className="display-container">
      <div className="screen">
        <div className="row">
          <span className="label">BPM:</span>
          <span className="value">{Math.round(bpm)}</span>
        </div>
        <div className="row main-info">
          {selectedStep !== null ? (
             <>
               <span className="label">EDIT STEP {selectedStep + 1}:</span>
               <span className="value large">{selectedNote}</span>
             </>
          ) : (
            <>
              <span className="label">PLAYING:</span>
              <span className="value large">{currentNote}</span>
            </>
          )}
        </div>
        <div className="row status-bar">
          <span className={`status-indicator ${isPlaying ? 'active' : ''}`}>
            {isPlaying ? '▶ PLAYING' : ''}
          </span>
          <span className="step-counter">
            STEP: {currentStep + 1}/16
          </span>
        </div>
      </div>
    </div>
  );
};