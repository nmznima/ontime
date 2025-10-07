'use client'

import { useEffect, useMemo, useRef, useState } from "react";

export default function TimerApp() {
  const [title, setTitle] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<{ title: string; seconds: number; finishedAt: string }[]>([]);

  // keep interval stable
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  const timeString = useMemo(() => formatSeconds(seconds), [seconds]);
  const totalSeconds = useMemo(() => history.reduce((acc, h) => acc + h.seconds, 0), [history]);
  const totalTimeString = useMemo(() => formatSeconds(totalSeconds), [totalSeconds]);

  function formatSeconds(s: number) {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  function handleStart() {
    if (!title.trim()) return; // require a title before starting
    setRunning(true);
  }

  function handlePauseResume() {
    setRunning((r) => !r);
  }

  function handleFinish() {
    if (!title.trim()) return; // nothing to save without title
    const finishedAt = new Date().toLocaleString();
    setHistory((h) => [{ title: title.trim(), seconds, finishedAt }, ...h]);
    // reset timer & title (you can keep the title if you prefer)
    setSeconds(0);
    setRunning(false);
    setTitle("");
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex items-start justify-center p-6">
      <div className="w-full max-w-2xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Simple Count-Up Timer</h1>
          <p className="text-sm text-slate-500 mt-1">Enter an activity title, start the timer, then pause/resume or finish to log it.</p>
        </header>

        <div className="flex flex-col bg-white rounded-2xl shadow border border-slate-200">
          <input
            id="title"
            type="text"
            placeholder="What are you working on?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={running}
            className="w-full p-4 rounded-t-2xl border-b-1 border-slate-200 outline-none disabled:bg-slate-100"
          />

          <div className="m-4 flex items-center justify-between">
            <div className="text-5xl font-mono tabular-nums tracking-tight">{timeString}</div>
            <div className="flex items-center gap-3">
              {!running && seconds === 0 ? (
                <button
                  onClick={handleStart}
                  className="rounded-xl px-4 py-2 text-white bg-slate-900 hover:bg-slate-800 active:scale-[.98]"
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={handlePauseResume}
                  className="rounded-xl px-4 py-2 border border-slate-300 hover:bg-slate-50"
                >
                  {running ? "Pause" : "Resume"}
                </button>
              )}

              {(seconds > 0 || running) && (
                <button
                  onClick={handleFinish}
                  className="rounded-xl px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>

        <section className="mt-8">
          <div className="flex flex-row">
            <h2 className="flex basis-2/3 text-lg font-semibold">Completed activities</h2>
            <h2 className="flex basis-1/3 justify-end text-lg font-semibold">Total: {totalTimeString}</h2>
          </div>
          {history.length === 0 ? (
            <p className="text-slate-500 mt-2">Nothing here yet. Finish an activity to see it below.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {history.map((item, idx) => (
                <li key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-slate-500">Finished at {item.finishedAt}</div>
                  </div>
                  <div className="font-mono tabular-nums">{formatSeconds(item.seconds)}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
