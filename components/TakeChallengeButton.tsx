"use client";

import { useRouter } from "next/navigation";

export default function TakeChallengeButton({ score }: { score: number }) {
  const router = useRouter();

  function go() {
    try {
      // Remember the friend's score so the result page can compare
      sessionStorage.setItem("bangladesh-flex-beat", String(score));
    } catch {
      // storage can be blocked; the quiz still works without the comparison
    }
    router.push("/quiz");
  }

  return (
    <button
      type="button"
      onClick={go}
      className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-cream px-9 py-5 text-xl font-extrabold text-ink shadow-xl shadow-black/30 transition hover:scale-[1.02] hover:bg-white active:scale-100 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-marigold"
    >
      Take the Challenge <span aria-hidden="true">→</span>
    </button>
  );
}