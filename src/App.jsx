// src/App.jsx
import React from "react";
import TetrisGame from "./components/TetrisGame";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#222",
        color: "#fff",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "40px"
      }}
    >
      <h1 style={{ marginBottom: "20px", fontSize: "36px" }}>React Tetris</h1>
      <TetrisGame />
      <footer style={{ marginTop: "50px", fontSize: "14px", opacity: 0.6 }}>
        © 2026 Kiyu Kawai
      </footer>
    </div>
  );
}