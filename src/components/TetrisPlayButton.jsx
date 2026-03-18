import React from "react";

export default function TetrisPlayButton({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        fontFamily: "monospace",
        fontSize: "24px",
        padding: "12px 24px",
        backgroundColor: "#a8e05f",
        color: "#000",
        borderRadius: "6px",
        zIndex: 100
      }}
    >
      Play
    </div>
  );
}