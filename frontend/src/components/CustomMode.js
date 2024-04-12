import React, { useState, useEffect } from 'react';

const CustomMode = () => {
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [exerciseTime, setExerciseTime] = useState(0);

  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => {
        setTimeInSeconds(prevTime => prevTime + 1);
      }, 1000);
      setTimerId(id);
    } else {
      clearInterval(timerId);
    }
    return () => clearInterval(timerId);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeInSeconds(0);
  };

  const handleChangeExerciseTime = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      setExerciseTime(value);
    }
  };

  const handleStartExercise = () => {
    setTimeInSeconds(exerciseTime * 60);
    setIsRunning(true);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h2>Exercise Stopwatch</h2>
      <div>
        <label htmlFor="exerciseTime">Exercise Time (minutes): </label>
        <input type="number" id="exerciseTime" value={exerciseTime} onChange={handleChangeExerciseTime} />
        <button onClick={handleStartExercise}>Start Exercise</button>
      </div>
      <div>
        <p>{formatTime(timeInSeconds)}</p>
        <button onClick={handleStart}>Start</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default CustomMode;