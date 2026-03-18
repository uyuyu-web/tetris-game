export const drawBlock = (ctx, x, y, color, size = 30) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * size, y * size, size, size);
};

export const collide = (board, piece, pos, dx = 0, dy = 0, shape = piece.shape) =>
  shape.some((row, y) =>
    row.some((v, x) => {
      if (!v) return false;
      const nx = pos.x + x + dx;
      const ny = pos.y + y + dy;
      return nx < 0 || nx >= 10 || ny >= 20 || (ny >= 0 && board[ny][nx]);
    })
  );
