import React, { useEffect, useRef, useCallback } from "react";
import "./TetrisBackground.css";

export default function Hold({ holdPiece }) {
  const canvasRef = useRef(null);

  const drawMini = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !holdPiece) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    const size = 20;
    const w = holdPiece.shape[0].length;
    const h = holdPiece.shape.length;
    const offsetX = Math.floor((canvas.width/size - w)/2);
    const offsetY = Math.floor((canvas.height/size - h)/2);

    holdPiece.shape.forEach((row, y) =>
      row.forEach((v, x) => {
        if (v) {
          ctx.fillStyle = holdPiece.color;
          ctx.fillRect((x+offsetX)*size,(y+offsetY)*size,size,size);
        }
      })
    );
  }, [holdPiece]); // holdPiece を依存配列に追加

  useEffect(() => {
    drawMini();
  }, [drawMini]);

  return (
    <div className="tetris-hold">
      <div>Hold</div>
      <canvas ref={canvasRef} width={80} height={80}></canvas>
    </div>
  );
}