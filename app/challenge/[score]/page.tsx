import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TakeChallengeButton from "@/components/TakeChallengeButton";
import { getLevel } from "@/data/scoring";

type Props = { params: Promise<{ score: string }> };
// Build every valid challenge page (0 to 100) ahead of time
export function generateStaticParams() {
  return Array.from({ length: 101 }, (_, i) => ({ score: String(i) }));
}

// Anything else (like /challenge/abc) is allowed to be checked on request
export const instant = false;

// Accept only whole numbers from 0 to 100
function parseScore(raw: string): number | null {
  if (!/^\d{1,3}$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 0 && n <= 100 ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { score } = await params;
  const n = parseScore(score);
  if (n === null) return { title: "Bangladesh Flex" };
  return {
    title: `A friend scored ${n}/100 on Bangladesh Flex. Can you beat them?`,
    description: "Find out how much Bangladesh you've actually lived.",
    robots: { index: false },
  };
}

export default async function ChallengePage({ params }: Props) {
  const { score } = await params;
  const n = parseScore(score);
  if (n === null) notFound();

  const level = getLevel(n);

  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden text-cream">
      <Image
        src="/images/beach.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="animate-kenburns -z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/55"
      />

      <header className="mx-auto w-full max-w-md px-5 pt-6">
        <Link
          href="/"
          className="font-display text-base font-extrabold tracking-tight text-cream/90 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-marigold"
        >
          Bangladesh Flex
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10">
        <div className="animate-fade-up glass-dark rounded-[2rem] p-7 text-center sm:p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-marigold">
            You&apos;ve been challenged
          </p>

          <h1 className="mt-4 font-display text-2xl font-extrabold leading-tight">
            Your friend scored
          </h1>

          <p className="mt-2 flex items-end justify-center gap-2">
            <span className="font-display text-[7.5rem] font-extrabold leading-none tabular-nums">
              {n}
            </span>
            <span className="pb-4 text-2xl font-bold text-cream/60">/ 100</span>
          </p>

          <p className="inline-flex items-center gap-2 rounded-full bg-marigold px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-ink">
            <span aria-hidden="true">{level.emoji}</span>
            {level.name}
          </p>

          <p className="mt-6 font-display text-3xl font-extrabold uppercase leading-none">
            Can you beat them?
          </p>

          <div className="mt-8">
            <TakeChallengeButton score={n} />
          </div>

          <p className="mt-4 text-xs font-medium text-cream/50">
            About 2 minutes · No sign-up · Just for fun
          </p>
        </div>
      </div>
    </main>
  );
}