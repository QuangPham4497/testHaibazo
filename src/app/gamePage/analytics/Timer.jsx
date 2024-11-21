"use client";

import { useState, useEffect } from "react";

export default function Timer({ isRunning }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => parseFloat((prevTime + 0.1).toFixed(1)));
      }, 100);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer); // Cleanup on unmount or isRunning change
  }, [isRunning]);

  return (
    <div>
      <label htmlFor="time">Time: </label>
      <span id="time">{time.toFixed(1)}s</span>
    </div>
  );
}
