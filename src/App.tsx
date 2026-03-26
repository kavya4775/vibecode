import { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#0ff] font-mono flex flex-col relative overflow-hidden crt-flicker">
      <div className="static-bg"></div>
      <div className="scanlines"></div>

      {/* Header */}
      <header className="w-full p-4 flex items-center justify-between border-b-4 border-[#f0f] bg-black relative z-10">
        <div className="flex items-center gap-4">
          <Terminal className="w-10 h-10 text-[#f0f] animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest glitch text-[#0ff]" data-text="SYS.OVERRIDE">
            SYS.OVERRIDE
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-black px-4 py-2 border-2 border-[#0ff] shadow-[4px_4px_0px_#f0f]">
          <span className="text-xl md:text-2xl text-[#f0f] tracking-widest hidden sm:inline">DATA_YIELD:</span>
          <span className="text-3xl md:text-4xl font-bold text-[#0ff]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10 mt-4">
        <div className="lg:col-span-7 xl:col-span-8 flex justify-center">
          <SnakeGame onScoreChange={setScore} />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex justify-center w-full">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
