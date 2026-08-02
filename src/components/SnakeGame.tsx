"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { initAudio } from "./LinksSection";

const GRID = 20;

// Audio context singleton (shared with LinksSection via initAudio)
let audioCtx: AudioContext | null = null;

function ensureAudio() {
  initAudio();
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playEat() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g);
  g.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.06);
  g.gain.setValueAtTime(0.04, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc.start();
  osc.stop(ctx.currentTime + 0.06);
}

function playDie() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g);
  g.connect(ctx.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);
  g.gain.setValueAtTime(0.05, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const snakeRef = useRef<Point[]>([]);
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const dirRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirRef = useRef<Point>({ x: 1, y: 0 });
  const speedRef = useRef(140);
  const runningRef = useRef(false);
  const cellSizeRef = useRef(0);

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [overlayState, setOverlayState] = useState<
    "start" | "gameover" | "hidden"
  >("start");
  const [finalScore, setFinalScore] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // Load best score
  useEffect(() => {
    const saved = parseInt(localStorage.getItem("snake-best") || "0", 10);
    setBestScore(saved);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const size = Math.floor(rect.width);
    canvas.width = size;
    canvas.height = size;
    cellSizeRef.current = size / GRID;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cellSize = cellSizeRef.current;
    const snake = snakeRef.current;
    const food = foodRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid dots
    ctx.fillStyle = "#EEEEEE";
    for (let x = 0; x < GRID; x++) {
      for (let y = 0; y < GRID; y++) {
        ctx.beginPath();
        ctx.arc(
          x * cellSize + cellSize / 2,
          y * cellSize + cellSize / 2,
          1,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    // Food (Diamond shape)
    ctx.fillStyle = "#1A1A1A";
    const fx = food.x * cellSize + cellSize / 2;
    const fy = food.y * cellSize + cellSize / 2;
    const fr = cellSize * 0.35;
    ctx.beginPath();
    ctx.moveTo(fx, fy - fr);
    ctx.lineTo(fx + fr, fy);
    ctx.lineTo(fx, fy + fr);
    ctx.lineTo(fx - fr, fy);
    ctx.fill();

    // Snake
    snake.forEach((seg, i) => {
      const alpha = 1 - (i / snake.length) * 0.6;
      ctx.fillStyle = `rgba(26, 26, 26, ${alpha})`;
      const padding = i === 0 ? 1 : 2;
      const radius = i === 0 ? cellSize * 0.15 : cellSize * 0.1;
      const sx = seg.x * cellSize + padding;
      const sy = seg.y * cellSize + padding;
      const sw = cellSize - padding * 2;
      const sh = cellSize - padding * 2;
      ctx.beginPath();
      ctx.moveTo(sx + radius, sy);
      ctx.lineTo(sx + sw - radius, sy);
      ctx.quadraticCurveTo(sx + sw, sy, sx + sw, sy + radius);
      ctx.lineTo(sx + sw, sy + sh - radius);
      ctx.quadraticCurveTo(sx + sw, sy + sh, sx + sw - radius, sy + sh);
      ctx.lineTo(sx + radius, sy + sh);
      ctx.quadraticCurveTo(sx, sy + sh, sx, sy + sh - radius);
      ctx.lineTo(sx, sy + radius);
      ctx.quadraticCurveTo(sx, sy, sx + radius, sy);
      ctx.fill();
    });
  }, []);

  const placeFood = useCallback(() => {
    let pos: Point;
    const snake = snakeRef.current;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID),
      };
    } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
    foodRef.current = pos;
  }, []);

  const initGame = useCallback(() => {
    resizeCanvas();
    const mid = Math.floor(GRID / 2);
    snakeRef.current = [
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid },
    ];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    setScore(0);
    speedRef.current = 140;
    placeFood();
    draw();
  }, [resizeCanvas, placeFood, draw]);

  const gameOver = useCallback(() => {
    runningRef.current = false;
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    playDie();

    const currentScore = snakeRef.current.length - 3; // initial snake is 3
    setFinalScore(currentScore);

    setBestScore((prev) => {
      const newBest = Math.max(prev, currentScore);
      localStorage.setItem("snake-best", String(newBest));
      return newBest;
    });

    setOverlayState("gameover");
  }, []);

  const update = useCallback(() => {
    dirRef.current = { ...nextDirRef.current };
    const snake = snakeRef.current;
    const head: Point = {
      x: snake[0].x + dirRef.current.x,
      y: snake[0].y + dirRef.current.y,
    };

    // Wrap around
    if (head.x < 0) head.x = GRID - 1;
    if (head.x >= GRID) head.x = 0;
    if (head.y < 0) head.y = GRID - 1;
    if (head.y >= GRID) head.y = 0;

    // Self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      gameOver();
      return;
    }

    snake.unshift(head);
    const food = foodRef.current;

    // Eat food
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => {
        const newScore = prev + 1;
        // Speed up every 5 points
        if (newScore % 5 === 0 && speedRef.current > 60) {
          speedRef.current -= 10;
          if (gameLoopRef.current) clearInterval(gameLoopRef.current);
          gameLoopRef.current = setInterval(() => {
            update();
          }, speedRef.current);
        }
        return newScore;
      });
      placeFood();
      playEat();
    } else {
      snake.pop();
    }

    draw();
  }, [draw, placeFood, gameOver]);

  const startGame = useCallback(() => {
    if (runningRef.current) return;
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    setOverlayState("hidden");
    initGame();
    runningRef.current = true;
    gameLoopRef.current = setInterval(() => {
      update();
    }, speedRef.current);
  }, [initGame, update]);

  const setDirection = useCallback((d: string) => {
    if (!runningRef.current) return;
    const dir = dirRef.current;
    switch (d) {
      case "up":
        if (dir.y !== 1) nextDirRef.current = { x: 0, y: -1 };
        break;
      case "down":
        if (dir.y !== -1) nextDirRef.current = { x: 0, y: 1 };
        break;
      case "left":
        if (dir.x !== 1) nextDirRef.current = { x: -1, y: 0 };
        break;
      case "right":
        if (dir.x !== -1) nextDirRef.current = { x: 1, y: 0 };
        break;
    }
  }, []);

  // Lazy init via IntersectionObserver
  useEffect(() => {
    const section = wrapRef.current?.closest(".snake-section");
    if (!section || !("IntersectionObserver" in window)) {
      setInitialized(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInitialized(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "100px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Initialize game when visible
  useEffect(() => {
    if (!initialized) return;
    initGame();
  }, [initialized, initGame]);

  // Keyboard controls
  useEffect(() => {
    if (!initialized) return;
    const keyMap: Record<string, string> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      W: "up",
      s: "down",
      S: "down",
      a: "left",
      A: "left",
      d: "right",
      D: "right",
    };

    const handler = (e: KeyboardEvent) => {
      if (keyMap[e.key]) {
        e.preventDefault();
        setDirection(keyMap[e.key]);
      }
      if (
        (e.key === " " || e.key === "Enter") &&
        !runningRef.current
      ) {
        const wrap = wrapRef.current;
        if (wrap) {
          const rect = wrap.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            e.preventDefault();
            startGame();
          }
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [initialized, setDirection, startGame]);

  // Swipe support
  useEffect(() => {
    if (!initialized) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const touchStartHandler = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const touchEndHandler = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (Math.max(absDx, absDy) < 20) return;
      if (absDx > absDy) {
        setDirection(dx > 0 ? "right" : "left");
      } else {
        setDirection(dy > 0 ? "down" : "up");
      }
    };

    wrap.addEventListener("touchstart", touchStartHandler, { passive: true });
    wrap.addEventListener("touchend", touchEndHandler, { passive: true });
    return () => {
      wrap.removeEventListener("touchstart", touchStartHandler);
      wrap.removeEventListener("touchend", touchEndHandler);
    };
  }, [initialized, setDirection]);

  // Handle resize
  useEffect(() => {
    if (!initialized) return;
    const handler = () => {
      resizeCanvas();
      if (!runningRef.current) draw();
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [initialized, resizeCanvas, draw]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []);

  return (
    <section className="snake-section" id="snake-section">
      <div className="snake-header">
        <h2 className="snake-title">Snake</h2>
        <div className="snake-score">
          Score <strong>{score}</strong>
        </div>
      </div>

      <div className="snake-canvas-wrap" ref={wrapRef}>
        <canvas ref={canvasRef} />
        <div
          className={`snake-overlay ${overlayState === "hidden" ? "hidden" : ""}`}
          ref={overlayRef}
        >
          <div className="snake-overlay-title">
            {overlayState === "gameover" ? "Game Over" : "Snake"}
          </div>
          <div className="snake-overlay-sub">
            {overlayState === "gameover"
              ? "Better luck next time"
              : "A little nostalgia break"}
          </div>
          {overlayState === "gameover" && (
            <div className="snake-overlay-score">Score: {finalScore}</div>
          )}
          <button className="snake-play-btn" onClick={startGame}>
            {overlayState === "gameover" ? "Retry →" : "Play →"}
          </button>
        </div>
      </div>

      <div className="snake-controls">
        <button
          className="snake-dpad-btn up"
          aria-label="Up"
          onTouchStart={(e) => {
            e.preventDefault();
            setDirection("up");
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            setDirection("up");
          }}
        >
          ↑
        </button>
        <button
          className="snake-dpad-btn down"
          aria-label="Down"
          onTouchStart={(e) => {
            e.preventDefault();
            setDirection("down");
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            setDirection("down");
          }}
        >
          ↓
        </button>
        <button
          className="snake-dpad-btn left"
          aria-label="Left"
          onTouchStart={(e) => {
            e.preventDefault();
            setDirection("left");
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            setDirection("left");
          }}
        >
          ←
        </button>
        <button
          className="snake-dpad-btn right"
          aria-label="Right"
          onTouchStart={(e) => {
            e.preventDefault();
            setDirection("right");
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            setDirection("right");
          }}
        >
          →
        </button>
      </div>

      <p className="snake-hint">Arrow keys or WASD to move</p>
      <p className="snake-best">{bestScore > 0 ? `Best: ${bestScore}` : ""}</p>
    </section>
  );
}
