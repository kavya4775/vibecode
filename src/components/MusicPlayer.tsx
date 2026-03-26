import { useState, useRef, useEffect } from 'react';
import { Play, Square, SkipBack, SkipForward, Volume2, VolumeX, Cpu, Activity, Sparkles } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "Cybernetic Horizon", artist: "AI Generator Alpha", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", icon: Cpu },
  { id: 2, title: "Neon Pulse", artist: "AI Generator Beta", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", icon: Activity },
  { id: 3, title: "Digital Dreams", artist: "AI Generator Gamma", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", icon: Sparkles }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    playNext();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black border-4 border-[#f0f] p-6 shadow-[8px_8px_0px_#0ff] relative">
      <div className="absolute top-0 left-0 bg-[#f0f] text-black px-2 py-1 text-sm font-bold tracking-widest">AUDIO_SUBSYS.exe</div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="relative z-10 flex flex-col items-center mt-6">
        <div className={`w-24 h-24 border-4 border-[#0ff] flex items-center justify-center mb-6 ${isPlaying ? 'animate-pulse bg-[#0ff]/20' : 'bg-black'}`}>
          <currentTrack.icon className={`w-12 h-12 ${isPlaying ? 'text-[#f0f]' : 'text-[#0ff]'}`} />
        </div>

        <h3 className="text-3xl font-bold text-[#0ff] mb-2 text-center glitch" data-text={currentTrack.title}>
          {currentTrack.title}
        </h3>
        <p className="text-xl font-mono text-[#f0f] mb-8 tracking-widest">
          &gt; {currentTrack.artist}_
        </p>

        {/* Progress Bar */}
        <div className="w-full h-4 border-2 border-[#0ff] bg-black mb-8 p-0.5">
          <div 
            className="h-full bg-[#f0f] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between w-full px-4">
          <button onClick={toggleMute} className="text-[#0ff] hover:text-[#f0f] transition-colors">
            {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
          </button>

          <div className="flex items-center gap-6">
            <button onClick={playPrev} className="text-[#0ff] hover:text-[#f0f] transition-colors">
              <SkipBack className="w-8 h-8" />
            </button>
            
            <button 
              onClick={togglePlay} 
              className="w-16 h-16 flex items-center justify-center bg-black border-4 border-[#f0f] text-[#f0f] hover:bg-[#f0f] hover:text-black transition-colors"
            >
              {isPlaying ? <Square className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
            
            <button onClick={playNext} className="text-[#0ff] hover:text-[#f0f] transition-colors">
              <SkipForward className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
