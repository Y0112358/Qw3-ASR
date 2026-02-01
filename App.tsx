import React, { useState } from 'react';
import { NavBar } from './components/NavBar';
import { GeneratorView } from './views/GeneratorView';
import { ArchitectureView } from './views/ArchitectureView';
import { GuideView } from './views/GuideView';
import { PrototypeView } from './views/PrototypeView';
import { ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.GENERATOR);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <NavBar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-grow">
        {currentView === ViewState.GENERATOR && <GeneratorView />}
        {currentView === ViewState.ARCHITECTURE && <ArchitectureView />}
        {currentView === ViewState.GUIDE && <GuideView />}
        {currentView === ViewState.PROTOTYPE && <PrototypeView />}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 Qwen3-ASR Deployment Planner. Designed for offline Android environments.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;