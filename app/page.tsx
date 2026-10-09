import Image from "next/image";
import Link from "next/link";
import HeroCard from "@/components/HeroCard";
import { categories, experiences } from "@/data/experiences";

function Flag({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 60"
      className={className}
      role="img"
      aria-label="Flag of Bangladesh"
    >
      <rect width="100" height="60" rx="6" fill="#006a4e" />
      <circle cx="45" cy="30" r="19" fill="#f42a41" />
    </svg>
  );
}

// Photos for the scrolling strip
const strip = [
  { src: "/images/beach.jpg", label: "Golden hours" },
  { src: "/images/food.jpg", label: "Food worth the trip" },
  { src: "/images/boat.jpg", label: "River life" },
  { src: "/images/city.jpg", label: "Dhaka nights" },
  { src: "/images/tea.jpg", label: "Green escapes" },
  { src: "/images/culture.jpg", label: "Village evenings" },
];

const steps = [
  {
    n: "01",
    title: "Tap what you've done",
    text: "Six quick rounds covering travel, food, chaos and more.",
  },
  {
    n: "02",
    title: "Get your score",
    text: "Rare experiences count for more. Find out your level.",
  },
  {
    n: "03",
    title: "Flex it",
    text: "Share your card and challenge your friends to beat it.",
  },
];

const ctaClass =
  "inline-flex items-center gap-3 rounded-full bg-cream px-9 py-5 text-xl font-extrabold text-ink shadow-xl shadow-black/30 transition hover:scale-[1.03] hover:bg-white active:scale-100 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-marigold";

function StripCards({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex" aria-hidden={hidden || undefined}>
      {strip.map((p) => (
        <div
          key={p.src}
          className="relative mr-4 h-64 w-48 shrink-0 overflow-hidden rounded-3xl sm:h-80 sm:w-60"
        >
          <Image
            src={p.src}
            alt=""
            fill
            sizes="240px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <p className="glass-dark absolute inset-x-3 bottom-3 rounded-2xl px-4 py-2.5 text-sm font-bold">
            {p.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="overflow-x-clip bg-ink text-cream">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* Animated glow background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 overflow-hidden bg-ink"
        >
          <div className="animate-drift-c absolute left-1/2 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-forest blur-3xl sm:h-[48rem] sm:w-[48rem]" />
          <div className="animate-drift-a absolute -right-24 -top-24 h-[24rem] w-[24rem] rounded-full bg-sun/70 blur-3xl sm:h-[36rem] sm:w-[36rem]" />
          <div className="animate-drift-b absolute -bottom-32 -left-24 h-[22rem] w-[22rem] rounded-full bg-marigold/35 blur-3xl sm:h-[32rem] sm:w-[32rem]" />
        </div>

        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 pt-5 sm:px-6 sm:pt-7">
          <div className="glass flex items-center gap-3 rounded-full py-2 pl-3 pr-5">
            <Flag className="h-5 w-8" />
            <span className="font-display text-base font-extrabold tracking-tight">
              Bangladesh Flex
            </span>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:pb-20 lg:pt-14">
          <div>
            <p
              className="animate-fade-up glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
              style={{ animationDelay: "100ms" }}
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-marigold"
              />
              Takes about 2 minutes
            </p>

            <h1
              className="animate-fade-up font-display text-[2.9rem] font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.5rem]"
              style={{ animationDelay: "200ms" }}
            >
              How much have you experienced{" "}
              <span className="text-marigold">Bangladesh?</span>
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-md text-lg font-medium text-cream/85 sm:text-xl"
              style={{ animationDelay: "350ms" }}
            >
              Find out how much Bangladesh you&apos;ve actually lived.
            </p>

            <div
              className="animate-fade-up mt-9"
              style={{ animationDelay: "500ms" }}
            >
              <Link href="/quiz" className={ctaClass}>
                Start My Flex <span aria-hidden="true">→</span>
              </Link>

              <ul className="mt-6 flex flex-wrap gap-2 text-sm font-bold">
                <li className="glass rounded-full px-4 py-1.5">
                  {experiences.length} experiences
                </li>
                <li className="glass rounded-full px-4 py-1.5">
                  {categories.length} categories
                </li>
                <li className="glass rounded-full px-4 py-1.5">No sign-up</li>
              </ul>
            </div>
          </div>

          <div
            className="animate-fade-up mx-auto w-full max-w-sm"
            style={{ animationDelay: "650ms" }}
          >
            <HeroCard />
          </div>
        </div>
      </section>

      {/* PHOTO STRIP */}
      <section aria-label="Photos of Bangladesh" className="pb-16 lg:pb-24">
        <div className="overflow-hidden">
          <div className="animate-scroll-x flex w-max hover:[animation-play-state:paused]">
            <StripCards />
            <StripCards hidden />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-6 lg:pb-24">
        <h2 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl">
          How it works
        </h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="glass-dark rounded-3xl p-6">
              <span className="font-display text-5xl font-extrabold text-marigold">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-2xl font-extrabold leading-tight">
                {s.title}
              </h3>
              <p className="mt-2 font-medium text-cream/70">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FINAL CTA */}
      <section className="relative isolate overflow-hidden px-5 py-24 text-center sm:px-6 lg:py-32">
        <Image
          src="/images/culture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/55" />
        <h2 className="font-display text-5xl font-extrabold uppercase leading-none tracking-tight [text-shadow:0_2px_30px_rgba(0,0,0,0.4)] sm:text-7xl">
          Ready to see
          <br />
          your number?
        </h2>
        <div className="mt-10">
          <Link href="/quiz" className={ctaClass}>
            Start My Flex <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <footer className="px-5 py-8 text-center text-sm font-medium text-cream/50">
        Just for fun. Scores aren&apos;t research or real statistics.
      </footer>
    </main>
  );
}