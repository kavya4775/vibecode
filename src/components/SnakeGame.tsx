import { useEffect, useRef, useState } from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const SPEED = 120; // ms per move

type Point = { x: number; y: number };

export function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const gameState = useRef({
    snake: [{ x: 10, y: 10 }],
    direction: { x: 0, y: -1 },
    nextDirection: { x: 0, y: -1 },
    food: { x: 15, y: 5 },
    score: 0,
    lastMoveTime: 0,
  });

  const requestRef = useRef<number>(0);

  const resetGame = () => {
    gameState.current = {
      snake: [{ x: 10, y: 10 }],
      direction: { x: 0, y: -1 },
      nextDirection: { x: 0, y: -1 },
      food: { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) },
      score: 0,
      lastMoveTime: performance.now(),
    };
    setGameOver(false);
    setHasStarted(true);
    setIsPaused(false);
    onScoreChange(0);
  };

  const spawnFood = (snake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  };

  const gameLoop = (time: number) => {
    if (gameOver || isPaused || !hasStarted) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const state = gameState.current;
    if (time - state.lastMoveTime >= SPEED) {
      state.lastMoveTime = time;
      state.direction = state.nextDirection;

      const head = state.snake[0];
      const newHead = {
        x: head.x + state.direction.x,
        y: head.y + state.direction.y,
      };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Self collision
      if (state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...state.snake];

      // Food collision
      if (newHead.x === state.food.x && newHead.y === state.food.y) {
        state.score += 10;
        onScoreChange(state.score);
        state.food = spawnFood(newSnake);
      } else {
        newSnake.pop();
      }

      state.snake = newSnake;
      draw();
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameState.current;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#f0f';
    ctx.fillRect(
      state.food.x * CELL_SIZE,
      state.food.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    // Draw snake
    state.snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = '#fff';
      } else {
        ctx.fillStyle = '#0ff';
      }
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    });
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameOver, isPaused, hasStarted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const state = gameState.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (state.direction.y === 0) state.nextDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (state.direction.y === 0) state.nextDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (state.direction.x === 0) state.nextDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (state.direction.x === 0) state.nextDirection = { x: 1, y: 0 };
          break;
        case ' ':
          if (hasStarted && !gameOver) {
            setIsPaused(p => !p);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver]);

  // Initial draw
  useEffect(() => {
    draw();
  }, []);

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="relative p-2 bg-black border-4 border-[#0ff] shadow-[8px_8px_0px_#f0f]">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-black block"
        />
        
        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-[#0ff] z-10 border-4 border-[#f0f] m-2">
            {!hasStarted ? (
              <>
                <Play className="w-16 h-16 mb-4 text-[#f0f] animate-pulse cursor-pointer" onClick={resetGame} />
                <p className="text-3xl font-mono tracking-widest glitch" data-text="INITIALIZE_SEQ">INITIALIZE_SEQ</p>
              </>
            ) : gameOver ? (
              <>
                <p className="text-5xl font-bold text-[#f0f] mb-2 tracking-widest glitch" data-text="CRITICAL_FAIL">CRITICAL_FAIL</p>
                <p className="text-2xl font-mono mb-6 text-[#0ff]">DATA_LOST: {gameState.current.score}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-2 bg-black border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-colors text-2xl tracking-wider"
                >
                  <RotateCcw className="w-6 h-6" /> REBOOT_SYS
                </button>
              </>
            ) : isPaused ? (
              <>
                <Square className="w-16 h-16 mb-4 text-[#f0f] animate-pulse" />
                <p className="text-3xl font-mono tracking-widest glitch" data-text="SYS_HALTED">SYS_HALTED</p>
                <p className="text-xl font-mono text-[#0ff] mt-2">AWAITING_INPUT</p>
              </>
            ) : null}
          </div>
        )}
      </div>
      
      <div className="mt-6 flex gap-4 text-xl font-mono text-[#f0f] tracking-widest">
        <span>[W,A,S,D]: NAVIGATE</span>
        <span>//</span>
        <span>[SPACE]: INTERRUPT</span>
      </div>
    </div>
  );
}
