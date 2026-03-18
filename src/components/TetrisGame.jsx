import React, { useEffect, useRef, useState, useCallback } from "react";
import Hold from "./Hold";
import Next from "./Next";
import GameOverAnimation from "./GameOverAnimation";
import TetrisControls from "./TetrisControls";
import TetrisPlayButton from "./TetrisPlayButton";
import "./TetrisBackground.css";

const COLS = 10;
const ROWS = 20;
const BLOCK = 70;

const SHAPES = [
  [[1,1,1,1]],             // I
  [[1,1],[1,1]],           // O
  [[0,1,0],[1,1,1]],       // T
  [[1,0,0],[1,1,1]],       // J
  [[0,0,1],[1,1,1]],       // L
  [[1,1,0],[0,1,1]],       // S
  [[0,1,1],[1,1,0]]        // Z
];

const COLORS = [
  "#00f0f0", "#f0f000", "#a000f0",
  "#0000f0", "#f0a000", "#f00000", "#00f000"
];

export default function TetrisGame() {
  const canvasRef = useRef(null);
  const ctx = useRef(null);

  const board = useRef(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const pieceRef = useRef(null);
  const pos = useRef({ x: 3, y: 0 });
  const autoPlay = useRef(true);
  const holdUsed = useRef(false);

  const [holdPiece, setHoldPiece] = useState(null);
  const [nextPieces, setNextPieces] = useState([]);
  const [nextPiece, setNextPiece] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const bag = useRef([]);
  const bagIndex = useRef(0);

  // ======= Utility Functions =======
  const shuffle = useCallback((array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const createBag = useCallback(() => {
    const pieces = SHAPES.map((shape, i) => ({ shape, color: COLORS[i] }));
    bag.current = shuffle(pieces);
    bagIndex.current = 0;
  }, [shuffle]);

  const getNextPieceFromBag = useCallback(() => {
    if (!bag.current || bagIndex.current >= bag.current.length) createBag();
    return bag.current[bagIndex.current++];
  }, [createBag]);

  const resize = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    draw();
  }, []);

  // ======= Drawing =======
  const drawBlock = useCallback((ctx, x, y, color, size = BLOCK) => {
    ctx.fillStyle = color;
    ctx.fillRect(x*size, y*size, size, size);
  }, []);

  const draw = useCallback(() => {
    if (!ctx.current) return;
    ctx.current.clearRect(0,0,window.innerWidth,window.innerHeight);

    ctx.current.save();
    ctx.current.globalAlpha = 0.5;
    const offsetX = window.innerWidth/2 - (COLS*BLOCK)/2;
    const offsetY = window.innerHeight/2.5 - (ROWS*BLOCK)/2;
    ctx.current.translate(offsetX, offsetY);

    // Grid
    ctx.current.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.current.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.current.beginPath();
      ctx.current.moveTo(x*BLOCK,0);
      ctx.current.lineTo(x*BLOCK, ROWS*BLOCK);
      ctx.current.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.current.beginPath();
      ctx.current.moveTo(0,y*BLOCK);
      ctx.current.lineTo(COLS*BLOCK,y*BLOCK);
      ctx.current.stroke();
    }

    // Existing blocks
    board.current.forEach((row,y) =>
      row.forEach((c,x) => c && drawBlock(ctx.current,x,y,c))
    );
    

    // Falling piece
    if (pieceRef.current)
      pieceRef.current.shape.forEach((row,y) =>
        row.forEach((v,x) =>
          v && drawBlock(ctx.current,pos.current.x+x,pos.current.y+y,pieceRef.current.color)
        )
      );

    ctx.current.restore();
  }, [drawBlock]);

  // ======= Game Mechanics =======
  const collide = useCallback((dx = 0, dy = 0, shape = pieceRef.current?.shape) => {
    if (!shape) return false;
    return shape.some((row,y) =>
      row.some((v,x) => {
        if (!v) return false;
        const nx = pos.current.x + x + dx;
        const ny = pos.current.y + y + dy;
        return nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && board.current[ny][nx]);
      })
    );
  }, []);

  const merge = useCallback(() => {
    pieceRef.current.shape.forEach((row, y) =>
      row.forEach((v, x) => {
        if (v) board.current[pos.current.y + y][pos.current.x + x] = pieceRef.current.color;
      })
    );
  }, []);

  const clearLines = useCallback(() => {
    const linesToClear = [];
    board.current.forEach((row, y) => {
      if (row.every(cell => cell)) linesToClear.push(y);
    });
    if (linesToClear.length === 0) return;

    let flashes = 0;
    const flashInterval = setInterval(() => {
      linesToClear.forEach(y => {
        board.current[y] = board.current[y].map(() => (flashes % 2 === 0 ? null : "white"));
      });
      draw();
      flashes++;
      if (flashes > 3) {
        clearInterval(flashInterval);
        linesToClear.sort((a,b)=>b-a).forEach(y => board.current.splice(y,1));
        for (let i=0;i<linesToClear.length;i++) board.current.unshift(Array(COLS).fill(null));
        draw();
      }
    }, 100);
  }, [draw]);

  const spawn = useCallback(() => {
    pieceRef.current = nextPiece;
    const newNext = getNextPieceFromBag();
    setNextPiece(nextPieces[0]);
    setNextPieces([...nextPieces.slice(1), newNext]);
    pos.current = { x: 3, y: 0 };
    holdUsed.current = false;
    draw();
  }, [nextPiece, nextPieces, getNextPieceFromBag, draw]);

  const drop = useCallback(() => {
    if (!pieceRef.current) return;
    if (!collide(0,1)) pos.current.y++;
    else {
      if (pos.current.y <= 0) {
        setGameOver(true);
        setPlaying(false);
        pieceRef.current = null;
        return;
      }
      merge();
      clearLines();
      spawn();
    }
    draw();
  }, [collide, merge, clearLines, spawn, draw]);

  const rotate = useCallback(() => {
    if (!pieceRef.current) return;
    const rotated = pieceRef.current.shape[0].map((_,i) =>
      pieceRef.current.shape.map(r => r[i]).reverse()
    );
    if (!collide(0,0,rotated)) pieceRef.current.shape = rotated;
    draw();
  }, [collide, draw]);

  const autoMove = useCallback(() => {
    if (!pieceRef.current) { spawn(); return; }
    const r = Math.random();
    if (r < 0.3 && !collide(-1,0)) pos.current.x--;
    else if (r < 0.6 && !collide(1,0)) pos.current.x++;
    else if (r < 0.8) rotate();
    drop();
  }, [collide, drop, rotate, spawn]);

  const onKey = useCallback((e) => {
    if (!playing || !pieceRef.current) return;
    autoPlay.current = false;
    if (["ArrowLeft","ArrowRight","ArrowDown","ArrowUp"," ","c","C"].includes(e.key))
      e.preventDefault();

    if (e.key === "ArrowLeft" && !collide(-1,0)) pos.current.x--;
    if (e.key === "ArrowRight" && !collide(1,0)) pos.current.x++;
    if (e.key === "ArrowDown") drop();
    if (e.key === "ArrowUp") rotate();
    if (e.key === " ") {
      while (!collide(0,1)) pos.current.y++;
      merge();
      clearLines();
      spawn();
    }
    if ((e.key === "c" || e.key === "C") && !holdUsed.current) {
      if (!holdPiece) {
        setHoldPiece({ ...pieceRef.current });
        pieceRef.current = nextPiece;
        const newNext = getNextPieceFromBag();
        setNextPiece(nextPieces[0]);
        setNextPieces([...nextPieces.slice(1), newNext]);
      } else {
        const temp = pieceRef.current;
        pieceRef.current = holdPiece;
        setHoldPiece({ ...temp });
        pos.current = { x:3, y:0 };
      }
      holdUsed.current = true;
    }
    draw();
  }, [playing, collide, drop, rotate, merge, clearLines, spawn, holdPiece, nextPiece, nextPieces, getNextPieceFromBag, draw]);

  // ======= Effects =======
  useEffect(() => {
    createBag();
    const first = getNextPieceFromBag();
    const next3 = [getNextPieceFromBag(), getNextPieceFromBag(), getNextPieceFromBag()];
    setNextPiece(first);
    setNextPieces(next3);
  }, [createBag, getNextPieceFromBag]);

  useEffect(() => {
    ctx.current = canvasRef.current.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onKey);

    const dropTimer = setInterval(() => { if (playing) drop(); }, 600);
    const autoTimer = setInterval(() => { if (!playing && autoPlay.current) autoMove(); }, 800);

    return () => {
      clearInterval(dropTimer);
      clearInterval(autoTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, [playing, resize, onKey, drop, autoMove]);

  useEffect(() => { if (!pieceRef.current) spawn(); }, [spawn]);

  const restartGame = useCallback(() => {
    board.current = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    pieceRef.current = null;
    pos.current = { x:3, y:0 };
    holdUsed.current = false;
    setHoldPiece(null);
    createBag();
    setNextPiece(getNextPieceFromBag());
    setNextPieces([getNextPieceFromBag(), getNextPieceFromBag(), getNextPieceFromBag()]);
    setGameOver(false);
    setPlaying(false);
    autoPlay.current = true;
  }, [createBag, getNextPieceFromBag]);

  return (
    <>
      <canvas ref={canvasRef} className="tetris-bg" />
      {!playing && !gameOver && <TetrisPlayButton onClick={() => setPlaying(true)} />}
      <Hold holdPiece={holdPiece} />
      <Next nextPiece={nextPiece} nextPieces={nextPieces} />
      <TetrisControls blockSize={BLOCK} rows={ROWS} />
      {gameOver && <GameOverAnimation playing={true} onRestart={restartGame} />}
    </>
  );
}