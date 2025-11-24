import React from 'react';
import classNames from 'classnames';
import { useSequencerStore } from '../../store/useSequencerStore';
import { audioEngine } from '../../audio/AudioEngine';
import './Sequencer.scss';

export const Sequencer: React.FC = () => {
  const { sequence, currentStep, selectedStep, setSelectedStep, clearStep } = useSequencerStore();

  const handleStepClick = (index: number) => {
    if (selectedStep === index) {
      // If clicking the already selected step
      if (sequence[index].active) {
        clearStep(index);
      } else {
        setSelectedStep(null);
      }
    } else {
      setSelectedStep(index);
      
      if (sequence[index].active && sequence[index].note) {
        audioEngine.playNote(sequence[index].note!);
      }
    }
  };
  
  const { totalSteps } = useSequencerStore();
  const visibleSteps = sequence.slice(0, totalSteps);

  return (
    <div className="sequencer-wrapper">
      <div className="sequencer-grid">
        {visibleSteps.map((step, index) => (
          <button
            key={index}
            className={classNames('step-btn', {
              'active': step.active,
              'current': currentStep === index,
              'selected': selectedStep === index,
              'has-note': step.note !== null
            })}
            onClick={() => handleStepClick(index)}
          >
            <span className="step-number">{index + 1}</span>
            {step.note && <span className="note-name">{step.note}</span>}
            <div className="led"></div>
          </button>
        ))}
      </div>
    </div>
  );
};