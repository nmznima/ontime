'use client'

import { useEffect, useMemo, useRef, useState } from "react";

// Helper function to format time (can be external or defined here)
function formatSeconds(s: number) {
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

type ResetFunction = () => void;

interface CountUpTimerProps {
  // Pass the running state down as a prop
  running: boolean;
  // Callback to update the parent with the current seconds count
  onTimeUpdate: (seconds: number) => void;
  // Callback to reset internal state when the parent is finished
onReset: (resetFunc: ResetFunction) => void;
}

export default function CountUpTimer({ running, onTimeUpdate, onReset }: CountUpTimerProps) {
  const [seconds, setSeconds] = useState(0);
  
  // Refs for background-safe time measurement
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      // If we are starting/resuming, initialize the startTimeRef.
      // Date.now() - (seconds * 1000) calculates what the start time *should have been*
      // to result in the current `seconds` count.
      if (startTimeRef.current === null) {
          startTimeRef.current = Date.now() - (seconds * 1000);
      }
      
      // Clear any existing interval before starting a new one
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }

      // Start the accurate, background-safe interval
      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current !== null) {
          const now = Date.now();
          const elapsedMs = now - startTimeRef.current;
          const newSeconds = Math.round(elapsedMs / 1000);
          
          // Update the internal state
          setSeconds(newSeconds);
          
          // Call the parent's update handler
          onTimeUpdate(newSeconds); 
        }
      }, 250); // 250ms update frequency
      
    } else {
      // When paused or finished, clear the interval and stop the ref.
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // We keep `seconds` state and `startTimeRef` intact when pausing.
      // This is necessary for the resume logic above.
    }

    // Cleanup function
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, seconds, onTimeUpdate]); // Include seconds and onTimeUpdate for accurate closure

  // Internal reset function called by the parent through the onFinish mechanism
  const resetTimer = () => {
      setSeconds(0);
      startTimeRef.current = null;
      onTimeUpdate(0); // Ensure parent also resets
  }
  
  // Expose the reset function to the parent (simpler alternative to a ref)
  useEffect(() => {
    onReset(() => resetTimer());
  }, [onReset, resetTimer]);
  
  // Display string for the timer
  const timeString = useMemo(() => formatSeconds(seconds), [seconds]);

  return (
    <div className="text-5xl font-mono tabular-nums tracking-tight">{timeString}</div>
  );
}