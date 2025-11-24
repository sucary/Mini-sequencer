import React, { useEffect } from 'react';
import './App.scss';
import { Display } from './components/Display/Display';
import { Sequencer } from './components/Sequencer/Sequencer';
import { Keyboard } from './components/Keyboard/Keyboard';
import { Controls } from './components/Controls/Controls';
import { audioEngine } from './audio/AudioEngine';

function App() {
  
  // Initialize audio engine on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      audioEngine.initialize();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return (
    <div className="app-container">
      <div className="device-casing">
        <div className="top-section">
          <Display />
          <Controls />
        </div>
        <div className="middle-section">
          <Sequencer />
        </div>
        <div className="bottom-section">
          <Keyboard />
        </div>
      </div>
    </div>
  );
}

export default App;
