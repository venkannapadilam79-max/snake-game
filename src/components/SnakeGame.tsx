import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

const GRID_SIZE = 20;
const GAME_SPEED = 120; // Lower is faster

export function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Use refs for values needed in interval to avoid resetting it
  const directionRef = useRef(direction);
  useEffect(() => { directionRef.current = direction; }, [direction]);

  const foodRef = useRef(food);
  useEffect(() => { foodRef.current = food }, [food]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setFood({ x: 5, y: 15 });
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    while (currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    }
    return newFood;
  }, []);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const intervalId = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = { x: head.x + directionRef.current.x, y: head.y + directionRef.current.y };

        // Collision with walls
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }

        // Collision with self
        if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Eat food
        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
          setScore(s => {
            const newScore = s + 10;
            setHighScore(hs => Math.max(hs, newScore));
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          // Normal move, remove tail
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(intervalId);
  }, [isPaused, gameOver, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent page scrolling on web
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // Handle grid sizing responsively by using percentage or fixed calc
  const cellSize = 20;
  const boardSize = cellSize * GRID_SIZE;

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 md:p-6 w-full">
      {/* Header & Stats */}
      <div className="flex items-center justify-between w-full max-w-[400px] border border-cyan-500/30 bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-[0_0_20px_rgba(0,255,255,0.15)] mt-2">
        <div className="flex items-center gap-2 text-cyan-400">
          <Trophy size={18} className="md:w-5 md:h-5" />
          <span className="font-mono text-lg md:text-xl font-bold flex gap-3 md:gap-4 items-center">
            <span>{score.toString().padStart(4, '0')}</span>
            <span className="text-cyan-800 text-sm md:text-base">|</span>
            <span className="text-cyan-600 text-sm md:text-base">HI: {highScore.toString().padStart(4, '0')}</span>
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => isPaused ? (gameOver ? resetGame() : setIsPaused(false)) : setIsPaused(true)}
            className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500 text-cyan-400 flex items-center justify-center hover:bg-cyan-900 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all"
          >
            {isPaused && !gameOver ? <Play size={20} className="ml-1" /> : (gameOver ? <RotateCcw size={20} /> : <div className="w-3 h-4 flex gap-1"><div className="w-1 bg-current h-full"/><div className="w-1 bg-current h-full"/></div>)}
          </button>
          <button
            onClick={resetGame}
            className="w-10 h-10 rounded-lg bg-red-950 border border-red-500 text-red-400 flex items-center justify-center hover:bg-red-900 hover:text-red-300 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] transition-all"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Game Board Container */}
      <div 
        className="relative border-2 border-cyan-500/50 bg-black/60 shadow-[0_0_40px_rgba(0,255,255,0.2)] rounded-lg overflow-hidden backdrop-blur-xl touch-none"
        style={{ width: boardSize, height: boardSize }}
      >
        {/* Grid Background Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.05)_1px,transparent_1px)]" style={{ backgroundSize: `${cellSize}px ${cellSize}px` }} />

        {/* Snake rendering */}
        {snake.map((seg, i) => {
           const isHead = i === 0;
           return (
             <div
               key={`${seg.x}-${seg.y}-${i}`}
               className={`absolute rounded-sm ${isHead ? 'bg-cyan-300 z-10 shadow-[0_0_10px_#67e8f9]' : 'bg-cyan-500/80 shadow-[0_0_8px_rgba(6,182,212,0.6)]'}`}
               style={{
                 width: cellSize - 2,
                 height: cellSize - 2,
                 left: seg.x * cellSize + 1,
                 top: seg.y * cellSize + 1,
                 transition: 'all 0.1s linear' // Adds a tiny bit of smoothness matching tick speed
               }}
             />
           );
        })}

        {/* Food rendering */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], filter: ['drop-shadow(0 0 5px #ff00ff)', 'drop-shadow(0 0 15px #ff00ff)', 'drop-shadow(0 0 5px #ff00ff)'] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute bg-fuchsia-500 rounded-full"
          style={{
            width: cellSize - 4,
            height: cellSize - 4,
            left: food.x * cellSize + 2,
            top: food.y * cellSize + 2,
          }}
        />

        {/* Overlays / Menus */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center flex-col z-20 transition-all duration-300">
            {gameOver ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-6 bg-black/50 border border-red-500/30 rounded-xl backdrop-blur-md container shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">SYSTEM FAILURE</h2>
                <p className="text-cyan-400 mb-6 font-mono font-semibold">FINAL SCORE: {score}</p>
                <button 
                   onClick={resetGame}
                   className="px-6 py-3 bg-red-950/50 border border-red-500 text-red-400 rounded-lg hover:bg-red-900 hover:text-red-100 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] font-bold tracking-widest transition-all w-full"
                >
                  REBOOT SESH
                </button>
              </motion.div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-cyan-400 mb-6 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] tracking-widest">SYSTEM PAUSED</h2>
                <button 
                   onClick={() => setIsPaused(false)}
                   className="px-8 py-3 bg-cyan-950/50 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-900 hover:text-cyan-100 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] font-bold tracking-widest transition-all"
                >
                  RESUME
                </button>
                <p className="text-cyan-600/80 mt-6 text-xs md:text-sm font-mono flex items-center justify-center gap-2 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
                   PRESS <kbd className="font-sans px-2 py-0.5 bg-cyan-900 border border-cyan-700 rounded text-cyan-300 shadow">SPACE</kbd> TO PAUSE
                </p>
                <div className="mt-4 flex gap-4 justify-center text-cyan-600/60 items-center">
                   <span className="text-xs">USE WSAD / ARROWS</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile controls spacer */}
      <div className="h-10 md:hidden"></div>
    </div>
  );
}
