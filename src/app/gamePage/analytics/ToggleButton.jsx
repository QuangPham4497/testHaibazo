"use client";

import styles from "../page.module.css";

export default function ToggleButtons({
  isRunning,
  onPlay,
  onRestart,
  onAutoPlay,
  allCleared,
  hasStarted,
  gameOver,
  isAutoPlaying,
}) {
  return (
    <div className={styles.controls}>
      {!hasStarted && !isRunning && !gameOver && (
        <button onClick={onPlay}>Play</button>
      )}
      {(hasStarted || gameOver) && <button onClick={onRestart}>Restart</button>}
      {hasStarted &&
        !allCleared &&
        !gameOver &&
        (!isAutoPlaying ? (
          <button onClick={onAutoPlay}>Auto Play ON</button>
        ) : (
          <button onClick={onAutoPlay}>Auto Play OFF</button>
        ))}
    </div>
  );
}
