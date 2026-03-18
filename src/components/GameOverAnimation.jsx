import React, { useEffect, useState } from "react";
import "./TetrisBackground.css";

export default function GameOverAnimation({ playing, onRestart }) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (!playing) return;

    let animFrame;
    let alpha = 0;
    let increasing = true;

    const animate = () => {
      if (increasing) {
        alpha += 0.03;
        if (alpha >= 0.6) increasing = false;
      } else {
        alpha -= 0.03;
        if (alpha <= 0) increasing = true;
      }
      setOpacity(alpha);
      animFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animFrame);
  }, [playing]);

  if (!playing) return null;

  return (
    <div
      className="tetris-gameover-grid"
      style={{ opacity, pointerEvents: "auto" }}
    >
      <div className="tetris-gameover-content">
        <div className="tetris-gameover-title">GAME OVER</div>
        <button className="tetris-play-again" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}