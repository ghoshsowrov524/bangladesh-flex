"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FlexCard from "@/components/FlexCard";
import { calculateResult, type Result } from "@/data/scoring";
import { drawShareCard } from "@/lib/drawShareCard";

const STORAGE_KEY = "bangladesh-flex-selected";
const BEAT_KEY = "bangladesh-flex-beat";
const FILE_NAME = "my-bangladesh-flex.png";

function Background() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-ink">
      <Image
        src="/images/beach.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-125 object-cover blur-3xl"
      />
      <div className="absolute inset-0 bg-ink/60" />
    </div>
  );
}

export default function ResultPage() {
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [beat, setBeat] = useState<number | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [message, setMessage] = useState("");

  // 1. Read the user's taps (and a friend's score, if they came from a challenge)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ids: unknown = JSON.parse(raw);
        if (Array.isArray(ids)) {
          setResult(
            calculateResult(ids.filter((x): x is string => typeof x === "string"))
          );
        }
      }
      const friend = sessionStorage.getItem(BEAT_KEY);
      if (friend !== null) {
        const n = Number(friend);
        if (Number.isInteger(n) && n >= 0 && n <= 100) setBeat(n);
      }
    } catch {
      // storage blocked or data corrupted: we just show the "no result" screen
    }
    setLoaded(true);
  }, []);

  // 2. Count the score up from 0
  useEffect(() => {
    if (!result) return;
    const target = result.score;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion || target === 0) {
      setDisplayScore(target);
      setRevealed(true);
      return;
    }

    const duration = 2400;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(target * eased));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setRevealed(true);
      }
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [result]);

  // 3. Once the reveal is done, quietly prepare the share image
  useEffect(() => {
    if (!result || !revealed) return;
    let cancelled = false;
    drawShareCard(result)
      .then((blob) => {
        if (!cancelled) setImageBlob(blob);
      })
      .catch(() => {
        if (!cancelled) {
          setMessage(
            "Couldn't make the image on this device. You can still take a screenshot of the card."
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [result, revealed]);

  if (!loaded) return <main className="min-h-dvh bg-ink" />;

  if (!result) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center px-6 text-center text-cream">
        <Background />
        <div className="glass-dark max-w-md rounded-[2rem] p-8">
          <h1 className="font-display text-4xl font-extrabold uppercase leading-none">
            No Flex yet
          </h1>
          <p className="mt-4 text-lg text-cream/75">
            Take the quick quiz first and your score will show up here.
          </p>
          <Link
            href="/quiz"
            className="mt-8 inline-block rounded-full bg-cream px-8 py-4 text-lg font-extrabold text-ink transition hover:bg-white focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-marigold"
          >
            Start My Flex →
          </Link>
        </div>
      </main>
    );
  }

  const downloadImage = () => {
    if (!imageBlob) return;
    const url = URL.createObjectURL(imageBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = FILE_NAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const saveImage = () => {
    downloadImage();
    setMessage("Image saved! Post it from your gallery or downloads.");
  };

  const shareImage = async () => {
    if (!imageBlob) return;
    const file = new File([imageBlob], FILE_NAME, { type: "image/png" });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Bangladesh Flex",
          text: `I scored ${result.score}/100 on Bangladesh Flex. What's yours?`,
        });
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
    downloadImage();
    setMessage(
      "Image saved! Open Instagram, Facebook, Messenger or WhatsApp and post it from your gallery."
    );
  };

  const shareChallenge = async () => {
    const url = `${window.location.origin}/challenge/${result.score}`;
    const text = `I scored ${result.score}/100 on Bangladesh Flex 🇧🇩 Can you beat me?`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Bangladesh Flex challenge", text, url });
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setMessage(
        "Challenge link copied! Paste it in Messenger, WhatsApp or Facebook."
      );
    } catch {
      setMessage(`Copy this link and send it to a friend: ${url}`);
    }
  };

  const imageReady = imageBlob !== null;

  let banner = "";
  if (beat !== null) {
    if (result.score > beat) banner = `🏆 You beat your friend's ${beat}!`;
    else if (result.score === beat) banner = `🤝 A tie with your friend's ${beat}. Rematch?`;
    else banner = `Your friend's ${beat} still leads by ${beat - result.score}. Try again?`;
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-x-clip px-5 pb-12 pt-6 text-cream">
      <Background />

      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-base font-extrabold tracking-tight text-cream/90 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-marigold"
        >
          Bangladesh Flex
        </Link>
      </header>

      <h1 className="mt-6 text-center font-display text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-4xl">
        Your Bangladesh Flex
      </h1>

      {banner && (
        <p
          className={`glass mt-5 rounded-2xl px-4 py-3 text-center text-sm font-bold transition-all duration-700 ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
        >
          {banner}
        </p>
      )}

      <div className="mt-6">
        <FlexCard
          result={result}
          displayScore={displayScore}
          revealed={revealed}
        />
      </div>

      {/* Buttons (they fade in after the reveal) */}
      <div
        className={`mt-8 flex flex-col gap-3 transition-all duration-700 ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        style={{ transitionDelay: revealed ? "800ms" : "0ms" }}
      >
        <button
          type="button"
          onClick={shareImage}
          disabled={!imageReady}
          className="rounded-full bg-cream px-8 py-4 text-lg font-extrabold text-ink shadow-xl shadow-black/30 transition hover:bg-white focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-marigold disabled:opacity-60"
        >
          {imageReady ? "Share My Flex" : "Getting your image ready…"}
        </button>
        <button
          type="button"
          onClick={shareChallenge}
          className="rounded-full bg-marigold px-8 py-4 text-lg font-extrabold text-ink transition hover:brightness-105 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-cream"
        >
          Challenge a Friend
        </button>
        <button
          type="button"
          onClick={saveImage}
          disabled={!imageReady}
          className="glass rounded-full px-8 py-4 text-lg font-bold transition hover:bg-white/25 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-marigold disabled:opacity-40"
        >
          Save Image
        </button>
        <Link
          href="/quiz"
          className="rounded-full px-8 py-3 text-center font-bold text-cream/70 underline-offset-4 transition hover:text-cream hover:underline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-marigold"
        >
          Try Another Score
        </Link>

        <p
          className="min-h-5 break-words text-center text-sm font-semibold text-marigold"
          aria-live="polite"
        >
          {message}
        </p>

        <p className="text-center text-xs font-medium text-cream/50">
          Prefer a screenshot? The card above is made for it.
          <br />
          Just for fun. This score isn&apos;t research or real statistics.
        </p>
      </div>
    </main>
  );
}