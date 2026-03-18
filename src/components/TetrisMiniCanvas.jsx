import React, { useEffect, useRef } from "react";
import "../App.css";
export default function TetrisMiniCanvas({ piece }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!piece) return;

    const size = 20;
    const w = piece.shape[0].length;
    const h = piece.shape.length;
    const offsetX = Math.floor((canvas.width / size - w) / 2);
    const offsetY = Math.floor((canvas.height / size - h) / 2);

    piece.shape.forEach((row, y) =>
      row.forEach((v, x) => {
        if (v) {
          ctx.fillStyle = piece.color;
          ctx.fillRect((x + offsetX) * size, (y + offsetY) * size, size, size);
        }
      })
    );
  }, [piece]);

  return <canvas ref={canvasRef} width={80} height={80}></canvas>;
}
