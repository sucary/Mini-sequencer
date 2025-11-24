import React from 'react';
import { Play, Square, Pause, X } from 'lucide-react';
import { useSequencerStore } from '../../store/useSequencerStore';
import { audioEngine } from '../../audio/AudioEngine';
import './Controls.scss';

export const Controls: React.FC = () => {
  const { isPlaying, togglePlay, pausePlay, stopPlay, bpm, setBpm, isMetronomeOn, toggleMetronome, sectionCount, setSectionCount, clearAllSteps } = useSequencerStore();
  const { selectedStep } = useSequencerStore();

  const handlePlay = () => {
    if (!isPlaying) {
      togglePlay();
      // If a step is selected AND we are currently stopped (not paused), start playing from there.
      // If we are paused (currentStep != -1), we should resume from where we left off.
      const { currentStep } = useSequencerStore.getState();
      
      if (currentStep === -1 && selectedStep !== null) {
        audioEngine.start(selectedStep);
      } else {
        // Resume or start from beginning
        audioEngine.start();
      }
    }
  };

  const handlePause = () => {
    if (isPlaying) {
      pausePlay();
      audioEngine.pause();
    }
  };

  const handleStop = () => {
    stopPlay();
    audioEngine.stop();
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newBpm = parseInt(e.target.value);
    if (isNaN(newBpm)) return;
    if (newBpm > 240) newBpm = 240;
    if (newBpm < 1) newBpm = 1;
    
    setBpm(newBpm);
    audioEngine.setBpm(newBpm);
  };

  return (
    <div className="controls-container">
      <div className="transport-buttons">
        {!isPlaying ? (
          <>
            <button
              className="control-btn play-btn"
              onClick={handlePlay}
              title="Play"
            >
              <Play size={32} fill="currentColor" />
            </button>
            {/* Show stop button if we are paused (currentStep != -1) */}
            {useSequencerStore.getState().currentStep !== -1 && (
              <button
                className="control-btn stop-btn"
                onClick={handleStop}
                title="Stop (Reset)"
              >
                <Square size={28} fill="currentColor" />
              </button>
            )}
          </>
        ) : (
          <>
            <button
              className="control-btn pause-btn"
              onClick={handlePause}
              title="Pause"
            >
              <Pause size={32} fill="currentColor" />
            </button>
            <button
              className="control-btn stop-btn"
              onClick={handleStop}
              title="Stop (Reset)"
            >
              <Square size={28} fill="currentColor" />
            </button>
          </>
        )}

        <div className="metronome-wrapper">
          <button
            className={`control-btn small metronome-btn ${isMetronomeOn ? 'active' : ''}`}
            onClick={toggleMetronome}
            title="Metronome"
          >
            <div className="metronome-icon">
              <div className="stick"></div>
            </div>
          </button>
          <span className="metronome-label">METRONOME</span>
        </div>

        <div className="clear-wrapper">
          <button
            className="control-btn small clear-btn"
            onClick={clearAllSteps}
            title="Clear All"
          >
            <X size={24} />
          </button>
          <span className="clear-label">CLEAR</span>
        </div>
      </div>
      
      <div className="bpm-control">
        <label>TEMPO</label>
        <div className="bpm-inputs">
          <input
            type="range"
            min="60"
            max="240"
            value={bpm}
            onChange={handleBpmChange}
          />
          <input
            type="number"
            min="1"
            max="240"
            value={bpm}
            onChange={handleBpmChange}
            className="bpm-number-input"
          />
        </div>
      </div>

      <div className="section-control">
        <label>SEQUENCE</label>
        <div className="section-buttons">
          {[1, 2].map(count => (
            <button
              key={count}
              className={`section-btn ${sectionCount === count ? 'active' : ''}`}
              onClick={() => setSectionCount(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};