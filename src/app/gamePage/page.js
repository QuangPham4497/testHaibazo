"use client";

import styles from "./page.module.css";
import { useEffect, useState, useRef } from "react";
import ToggleButtons from "./analytics/ToggleButton";
import Timer from "./analytics/Timer";

export default function GamePage() {
  //state Timer
  const [isRunning, setIsRunning] = useState(false);
  const [key, setKey] = useState(0);
  //state circle
  const [circles, setCircles] = useState([]);
  //state input
  const [points, setPoints] = useState(5);
  //state check game start
  const [hasStarted, setHasStarted] = useState(false);
  //state check circles disappeared
  const [allCleared, setAllCleared] = useState(false);
  //state check order of disappeared circle
  const [currentCircle, setCurrentCircle] = useState(1);
  //state check game over
  const [gameOver, setGameOver] = useState(false);
  //state check pausing-circle
  const [pausedCircles, setPausedCircles] = useState([]);
  //state save circle opacities
  const [circleOpacities, setCircleOpacities] = useState([]);
  //state check autoplaying
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const intervalRefs = useRef([]);
  const autoPlayingRef = useRef(false);
  const autoPlayIntervalRef = useRef(null);

  //handle change points input
  const handleChange = (e) => {
    setPoints(e.target.value);
  };

  //function button
  const handlePlay = () => {
    setIsRunning(true);
    setHasStarted(true);
    setAllCleared(false);
    setGameOver(false);
    setCurrentCircle(1);
  };

  const handleRestart = () => {
    setKey((prevKey) => prevKey + 1);
    setIsRunning(true);
    setHasStarted(true);
    setAllCleared(false);
    setGameOver(false);
    setCurrentCircle(1);
  };

  const handleAutoPlay = () => {
    if (isAutoPlaying) {
      // Tắt AutoPlay
      setIsAutoPlaying(false);
      autoPlayingRef.current = false;
      // Dừng tất cả các interval của AutoPlay
      clearInterval(autoPlayIntervalRef.current);
    } else {
      // Bật AutoPlay
      setIsAutoPlaying(true);
      autoPlayingRef.current = true;
      let currentIndex = currentCircle - 1;
      autoPlayIntervalRef.current = setInterval(() => {
        if (currentIndex < circles.length) {
          handleClickCircle(currentIndex);
          currentIndex++;
        } else {
          clearInterval(autoPlayingRef.current);
          setIsAutoPlaying(false);
          autoPlayingRef.current = false;
        }
        // Khoảng thời gian giữa các lần nhấp tự động (1000ms = 1 giây)
      }, 1000);
    }
  };

  //function click circle
  const handleClickCircle = (index) => {
    //setting circles
    setCircles((prevCircles) => {
      const newCircles = [...prevCircles];
      if (newCircles[index]) {
        newCircles[index].countdown = 3.0;
        newCircles[index].opacity = 1.0;
        newCircles[index].clicked = true;
        newCircles[index].color = "#af8814";
      }
      return newCircles;
    });
    // check order click
    if (!autoPlayingRef.current && index + 1 !== currentCircle) {
      setIsRunning(false);
      setGameOver(true);
      setHasStarted(false);
      // save status of circles
      setPausedCircles(circles.map((circle) => ({ ...circle })));

      //stop all running-intervals
      intervalRefs.current.forEach(clearInterval);
      //

      return;
    }

    const countdownInterval = setInterval(() => {
      setCircles((prevCircles) => {
        const newCircles = [...prevCircles];
        if (newCircles[index] && newCircles[index].countdown > 0) {
          newCircles[index].countdown -= 0.1;
          newCircles[index].opacity = Math.max(
            newCircles[index].opacity - 0.1,
            0
          );
          // update value of opacity in state
          setCircleOpacities((prevOpacities) => {
            const newOpacities = [...prevOpacities];
            newOpacities[index] = newCircles[index].opacity;
            return newOpacities;
          });
        } else if (newCircles[index] && newCircles[index].countdown <= 0) {
          clearInterval(countdownInterval);
        }
        return newCircles;
      });
    }, 100);

    intervalRefs.current.push(countdownInterval);
    //update order of next circle
    setCurrentCircle((prev) => prev + 1);
  };

  //mounting
  useEffect(() => {
    const generateRandomPositions = () => {
      const positions = [];
      const numCircles = points;
      for (let i = 0; i < numCircles; i++) {
        const left = Math.random() * 90;
        const top = Math.random() * 90;
        positions.push({
          left: `${left}%`,
          top: `${top}%`,
          countdown: null,
          opacity: 1,
          clicked: false,
          color: "#ffc107",
        });
      }
      return positions;
    };

    setCircles(generateRandomPositions());

    return () => {
      intervalRefs.current.forEach(clearInterval);
      intervalRefs.current = [];
    };
  }, [key, points, hasStarted]);

  useEffect(() => {
    const allGone = circles.every((circle) => circle.opacity <= 0.1);
    if (allGone) {
      setAllCleared(true);
      setIsRunning(false);
    }
  }, [circles]);

  return (
    <div className={styles.container}>
      {/* display title */}
      <div className={styles.title}>
        {gameOver ? (
          <span style={{ color: "orange", fontWeight: "bold" }}>game over</span>
        ) : hasStarted ? (
          allCleared ? (
            <span style={{ color: "green", fontWeight: "bold" }}>
              All Cleared
            </span>
          ) : (
            "Let's Play"
          )
        ) : (
          "Let's Play"
        )}
      </div>
      <div className={styles.header}>
        <div>
          <label htmlFor="points">Points:</label>
          <input
            type="number"
            value={points}
            onChange={handleChange}
            className="input-number"
          />
        </div>
        <Timer key={key} isRunning={isRunning} />
      </div>
      {/* display all button */}
      <ToggleButtons
        isRunning={isRunning}
        onPlay={handlePlay}
        onRestart={handleRestart}
        onAutoPlay={handleAutoPlay}
        allCleared={allCleared}
        hasStarted={hasStarted}
        gameOver={gameOver}
        isAutoPlaying={isAutoPlaying}
      />
      {/* display game circles */}
      <div className={styles.gameArea}>
        {gameOver
          ? pausedCircles.map(
              (circle, index) =>
                circle.opacity > 0 && ( // Chỉ hiển thị vòng tròn có opacity lớn hơn 0
                  <div
                    key={index}
                    className={styles.circle}
                    style={{
                      left: circle.left,
                      top: circle.top,
                      opacity: circle.clicked ? 0.5 : circle.opacity,
                      backgroundColor: circle.color,
                    }}
                  >
                    <div>{index + 1}</div>
                    <div>
                      {circle.countdown !== null && (
                        <div>{circle.countdown.toFixed(1)}s</div>
                      )}
                    </div>
                  </div>
                )
            )
          : hasStarted &&
            circles.map((circle, index) => (
              <div
                key={index}
                className={`${styles.circle} ${
                  circle.opacity === 0 ? styles.disappearing : ""
                }`}
                style={{
                  left: circle.left,
                  top: circle.top,
                  opacity: circle.opacity,
                  backgroundColor: circle.color,
                }}
                onClick={() => handleClickCircle(index)}
              >
                <div>{index + 1}</div>
                <div>
                  {circle.countdown !== null && (
                    <div>{circle.countdown.toFixed(1)}s</div>
                  )}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
