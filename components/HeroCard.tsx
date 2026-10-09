"use client";

import { useEffect, useState } from "react";

const TARGET = 84;

export default function HeroCard() {
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setScore(TARGET);
      setDone(true);
      return;
    }

    const delay = 900;
    const duration = 2000;
    const begin = performance.now() + delay;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - begin) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      setScore(Math.round(TARGET * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setDone(true);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="glass rounded-[2rem] p-7 text-cream sm:p-8"
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-extrabold tracking-widest">
          BANGLADESH FLEX
        </span>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
          SAMPLE
        </span>
      </div>

      <div className="mt-6 flex items-end gap-2">
        <span className="font-display text-[7.5rem] font-extrabold leading-none tabular-nums">
          {score}
        </span>
        <span className="pb-4 text-2xl font-bold text-cream/60">/ 100</span>
      </div>

      <div
        className={`transition-all duration-700 ${
          done ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-marigold px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-ink">
          🔥 Top-Tier Explorer
        </p>
        <p className="mt-4 text-lg italic text-cream/85">
          &ldquo;Bangladesh has been thoroughly explored.&rdquo;
        </p>
        <div className="mt-5 flex gap-2 text-xl">
          <span className="rounded-xl bg-white/15 px-3 py-2">🏝️</span>
          <span className="rounded-xl bg-white/15 px-3 py-2">🍗</span>
          <span className="rounded-xl bg-white/15 px-3 py-2">🚂</span>
          <span className="rounded-xl bg-white/15 px-3 py-2">🌧️</span>
        </div>
      </div>
    </div>
  );
}