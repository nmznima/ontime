'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  running: boolean;
  onTimeUpdate: (seconds: number) => void;   // parent receives elapsed seconds
  onReset: (resetFn: () => void) => void;    // expose reset() to parent
};

export default function CountUpTimer({ running, onTimeUpdate, onReset }: Props) {
  // Accumulated seconds across previous runs (updated on each pause)
  const baseSecondsRef = useRef(0);
  // Timestamp when the current run started (ms) or null when paused
  const startMsRef = useRef<number | null>(null);
  // Interval id for ticking while running
  const intervalRef = useRef<number | null>(null);

  // What we show on screen (and also emit up)
  const [displaySeconds, setDisplaySeconds] = useState(0);

  // Expose reset to parent once
  useEffect(() => {
    const reset = () => {
      // clear any running interval
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      baseSecondsRef.current = 0;
      startMsRef.current = null;
      setDisplaySeconds(0);
      onTimeUpdate(0);
    };
    onReset(reset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start/stop logic driven by `running`
  useEffect(() => {
    // Always clear any previous interval on transition
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (running) {
      // Start a fresh segment from now
      startMsRef.current = Date.now();
      // Immediately sync UI once
      const nowSeconds = baseSecondsRef.current;
      setDisplaySeconds(nowSeconds);
      onTimeUpdate(nowSeconds);

      intervalRef.current = window.setInterval(() => {
        if (startMsRef.current == null) return; // safety
        const delta = Math.floor((Date.now() - startMsRef.current) / 1000);
        const total = baseSecondsRef.current + delta;
        setDisplaySeconds(total);
        onTimeUpdate(total);
      }, 1000);
    } else {
      // PAUSE: accumulate the current segment into baseSeconds, freeze the value
      if (startMsRef.current != null) {
        const delta = Math.floor((Date.now() - startMsRef.current) / 1000);
        baseSecondsRef.current += delta;
        startMsRef.current = null;
      }
      const frozen = baseSecondsRef.current;
      setDisplaySeconds(frozen);
      onTimeUpdate(frozen);
    }

    // Cleanup on unmount or toggle
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Utility to render 00:00:00
  const timeString = useMemo(() => {
    const s = displaySeconds;
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }, [displaySeconds]);

  return (
    <div className="text-5xl font-mono tabular-nums tracking-tight">
      {timeString}
    </div>
  );
}
