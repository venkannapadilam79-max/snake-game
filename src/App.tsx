/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Terminal } from 'lucide-react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans pb-24 lg:pb-0 relative select-none">
      {/* Global Background Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(217,70,239,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(217,70,239,0.02)_1px,transparent_1px)] pointer-events-none" 
        style={{ backgroundSize: '40px 40px' }} 
      />
      
      {/* Subtle glowing orbs for neon mood background */}
      <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-cyan-600/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-fuchsia-600/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col items-center min-h-[calc(100vh-80px)]">
        {/* Header Area */}
        <div className="mt-8 md:mt-12 mb-2 text-center px-4 w-full flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-2 md:gap-3 bg-black/40 border border-fuchsia-500/30 px-5 md:px-6 py-1.5 md:py-2 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.1)] backdrop-blur-md mb-3 md:mb-4">
            <Terminal className="text-fuchsia-400 w-4 h-4 md:w-5 md:h-5" />
            <span className="text-fuchsia-400 tracking-[0.2em] font-semibold text-xs md:text-sm">CYBER_SNAKE v1.0</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(0,255,255,0.4)] tracking-tight">
            NEON DREAMS
          </h1>
        </div>

        {/* Main Interface Content */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl mx-auto pb-10">
           <SnakeGame />
        </div>
      </div>

      <MusicPlayer />
    </div>
  );
}
