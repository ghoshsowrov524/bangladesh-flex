"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  categories,
  experiences,
  type CategoryId,
} from "@/data/experiences";

// One background photo per round
const photos: Record<CategoryId, string> = {
  travel: "/images/tea.jpg",
  food: "/images/food.jpg",
  adventure: "/images/boat.jpg",
  city: "/images/city.jpg",
  culture: "/images/culture.jpg",
  everyday: "/images/beach.jpg",
};

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const category = categories[step];
  const items = experiences.filter((e) => e.category === category.id);
  const isLast = step === categories.length - 1;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function goTo(n: number) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finish() {
    try {
      sessionStorage.setItem(
        "bangladesh-flex-selected",
        JSON.stringify(Array.from(selected))
      );
    } catch {
      // storage can be blocked in some private browsers; we ignore it
    }
    router.push("/result");
  }

  return (
    <main className="relative min-h-dvh text-cream">
      {/* Soft blurred background: just a mood of colour, not a busy picture */}
      <div
        key={category.id}
        aria-hidden="true"
        className="animate-fade-in fixed inset-0 -z-10 overflow-hidden bg-ink"
      >
        <Image
          src={photos[category.id]}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-125 object-cover blur-3xl"
        />
        <div className="absolute inset-0 bg-ink/70" />
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-col px-5 pb-40 pt-6">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-base font-extrabold tracking-tight text-cream/90 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-marigold"
          >
            Bangladesh Flex
          </Link>
          <span className="text-sm font-semibold tabular-nums text-cream/70">
            {step + 1} / {categories.length}
          </span>
        </header>

        {/* Progress */}
        <div
          className="mt-4 flex gap-1.5"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={categories.length}
          aria-valuenow={step + 1}
          aria-label="Quiz progress"
        >
          {categories.map((c, i) => (
            <div
              key={c.id}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                i <= step ? "bg-marigold" : "bg-white/20"
              }`}
            />
          ))}
        </div>

        <section key={category.id} className="animate-fade-up mt-10">
          <p className="text-sm font-bold uppercase tracking-widest text-marigold">
            Round {step + 1} of {categories.length}
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-none tracking-tight sm:text-5xl">
            {category.label}
          </h1>
          <p className="mt-3 text-base text-cream/70 sm:text-lg">
            {category.tagline} Tap everything you&apos;ve done.
          </p>

          {/* Experience cards */}
          <ul className="mt-8 flex flex-col gap-3">
            {items.map((exp) => {
              const on = selected.has(exp.id);
              return (
                <li key={exp.id}>
                  <button
                    type="button"
                    onClick={() => toggle(exp.id)}
                    aria-pressed={on}
                    className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition duration-200 active:scale-[0.99] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-marigold ${
                      on
                        ? "bg-cream text-ink"
                        : "bg-white/10 ring-1 ring-inset ring-white/15 hover:bg-white/15"
                    }`}
                  >
                    <span aria-hidden="true" className="text-2xl">
                      {exp.icon}
                    </span>
                    <span className="flex-1 text-base font-semibold leading-snug">
                      {exp.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                        on
                          ? "animate-pop bg-forest text-cream"
                          : "ring-2 ring-inset ring-white/30"
                      }`}
                    >
                      {on ? "✓" : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Floating bottom pill */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto mx-auto flex max-w-xl items-center gap-2 rounded-full bg-ink/80 p-2 ring-1 ring-white/15 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            disabled={step === 0}
            className="rounded-full px-5 py-3 font-bold text-cream/80 transition hover:bg-white/10 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-marigold disabled:pointer-events-none disabled:opacity-30"
          >
            Back
          </button>

          <p
            className="flex-1 text-center text-sm font-semibold tabular-nums text-cream/70"
            aria-live="polite"
          >
            {selected.size} selected
          </p>

          <button
            type="button"
            onClick={isLast ? finish : () => goTo(step + 1)}
            className="rounded-full bg-marigold px-6 py-3 font-extrabold text-ink transition hover:brightness-105 active:scale-[0.98] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            {isLast ? "Reveal my Flex" : "Next →"}
          </button>
        </div>
      </div>
    </main>
  );
}