// src/components/TetrisControls.jsx
import React from "react";

export default function TetrisControls({
  top = 1500,       // 上からの位置(px)
  left = "50%",  // 左位置(px または %)
  fontSize = 40  // 文字サイズ
}) {
  return (
    <div
      className="tetris-controls"
      style={{
        position: "fixed",
        top: 2200,
        left: left,
        transform: left === "50%" ? "translateX(-50%)" : "none",
        textAlign: "center",
        fontSize: fontSize,
        pointerEvents: "none",
        zIndex: 50
      }}
    >
      <div>Arrow Keys: ← → ↓ ↑</div>
      <div>Space: Drop</div>
      <div>C: Hold</div>
    </div>
  );
}