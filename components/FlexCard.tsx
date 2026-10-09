import type { Result } from "@/data/scoring";

type Props = {
  result: Result;
  displayScore: number; // the number currently shown (it counts up)
  revealed: boolean; // true once the counting has finished
};

function reveal(show: boolean, delay: number) {
  return {
    className: `transition-all duration-700 ${
      show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
    }`,
    style: { transitionDelay: show ? `${delay}ms` : "0ms" },
  };
}

export default function FlexCard({ result, displayScore, revealed }: Props) {
  // Your 4 strongest categories (only ones you actually have something in)
  const tiles = [...result.breakdown]
    .sort((a, b) => b.count - a.count)
    .filter((b) => b.count > 0)
    .slice(0, 4);

  const badge = reveal(revealed, 0);
  const flex = reveal(revealed, 250);
  const deshi = reveal(revealed, 500);

  return (
    <div className="glass-dark rounded-[2rem] p-6 text-cream sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-extrabold tracking-widest">
          BANGLADESH FLEX
        </span>
        <svg
          viewBox="0 0 100 60"
          className="h-5 w-8"
          role="img"
          aria-label="Flag of Bangladesh"
        >
          <rect width="100" height="60" rx="6" fill="#006a4e" />
          <circle cx="45" cy="30" r="19" fill="#f42a41" />
        </svg>
      </div>

      {/* Score */}
      <div className="mt-6 flex items-end gap-2">
        <span
          className="font-display text-[7rem] font-extrabold leading-none tabular-nums sm:text-[8.5rem]"
          aria-live="off"
        >
          {displayScore}
        </span>
        <span className="pb-4 text-2xl font-bold text-cream/60">/ 100</span>
      </div>

      {/* Level */}
      <div className={badge.className} style={badge.style}>
        <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-marigold px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-ink sm:text-base">
          <span aria-hidden="true">{result.level.emoji}</span>
          {result.level.name}
        </p>
        <p className="mt-4 text-lg italic text-cream/85">
          &ldquo;{result.level.blurb}&rdquo;
        </p>
      </div>

      {/* Biggest flex */}
      {tiles.length > 0 && (
        <div className={flex.className} style={flex.style}>
          <p className="mt-7 text-xs font-extrabold tracking-widest text-cream/60">
            YOUR BIGGEST FLEX
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {tiles.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-3"
              >
                <span className="text-2xl" aria-hidden="true">
                  {t.icon}
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-2xl font-extrabold">
                    {t.count}
                  </span>
                  <span className="block text-xs font-semibold text-cream/70">
                    {t.label}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Most deshi thing */}
      <div className={deshi.className} style={deshi.style}>
        <p className="mt-7 text-xs font-extrabold tracking-widest text-cream/60">
          MOST DESHI THING ABOUT YOU
        </p>
        <p className="mt-2 text-xl font-bold leading-snug">
          &ldquo;{result.funLine}&rdquo;
        </p>
      </div>

      {/* Footer */}
      <p className="mt-8 border-t border-white/15 pt-4 text-center text-xs font-bold tracking-widest text-cream/60">
        BANGLADESH FLEX · {result.count} EXPERIENCES
      </p>
    </div>
  );
}