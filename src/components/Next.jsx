import React, { useEffect, useRef, useCallback } from "react";
import "./TetrisBackground.css";

export default function Next({ nextPiece }) {
  const canvasRef = useRef(null);

  const drawNext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !nextPiece) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    const size = 20;
    const w = nextPiece.shape[0].length;
    const h = nextPiece.shape.length;
    const offsetX = Math.floor((canvas.width/size - w)/2);
    const offsetY = Math.floor((canvas.height/size - h)/2);

    nextPiece.shape.forEach((row, y) =>
      row.forEach((v, x) => {
        if (v) {
          ctx.fillStyle = nextPiece.color;
          ctx.fillRect((x+offsetX)*size,(y+offsetY)*size,size,size);
        }
      })
    );
  }, [nextPiece]); // nextPiece を依存配列に追加

  useEffect(() => {
    drawNext();
  }, [drawNext]);

  return (
    <div className="tetris-next">
      <div>Next</div>
      <canvas ref={canvasRef} width={80} height={80}></canvas>
    </div>
  );
}