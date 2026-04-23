import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    title: "Neon Cascade (AI Gen)",
    artist: "Synth Mind 1",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Digital Horizon (AI Gen)",
    artist: "Neural Flow",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "Quantum Pulse (AI Gen)",
    artist: "The Algorhitms",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync play state
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-xl border-t border-fuchsia-500/30 p-3 sm:p-4 fixed bottom-0 z-50">
      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].src}
        onEnded={handleNext}
      />
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center gap-3 sm:gap-4 w-1/3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-fuchsia-950 border border-fuchsia-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.3)] shrink-0">
            <Music className="text-fuchsia-400" size={20} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-fuchsia-100 font-medium whitespace-nowrap overflow-hidden text-ellipsis shadow-fuchsia-500/50 drop-shadow-md text-sm sm:text-base">
              {TRACKS[currentTrack].title}
            </span>
            <span className="text-fuchsia-400/70 text-xs sm:text-sm truncate mt-0.5">
              {TRACKS[currentTrack].artist}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 sm:gap-6 w-1/3 justify-center">
          <button onClick={handlePrev} className="text-fuchsia-400 hover:text-fuchsia-200 transition-colors">
            <SkipBack size={24} />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 flex items-center justify-center text-white border border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all shrink-0"
          >
            {isPlaying ? <Pause size={20} className="sm:w-6 sm:h-6" /> : <Play size={20} className="sm:w-6 sm:h-6 ml-1" />}
          </button>
          <button onClick={handleNext} className="text-fuchsia-400 hover:text-fuchsia-200 transition-colors">
            <SkipForward size={24} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center w-1/3 gap-3 justify-end">
          <button onClick={() => setIsMuted(!isMuted)} className="text-fuchsia-400 hover:text-fuchsia-200 transition-colors hidden sm:block">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-16 sm:w-24 accent-fuchsia-500 hidden sm:block"
          />
        </div>
      </div>
    </div>
  );
}
