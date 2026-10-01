import { useState } from "react";
import { getProfile } from "../../services/api";
import useApi from "../../hooks/useApi";
import ApiError from "../../components/ApiError/ApiError";

export default function AboutApp() {
  const profileQ = useApi(getProfile);

  if (profileQ.error) {
    return <ApiError endpoint="/api/profile" onRetry={profileQ.reload} />;
  }

  if (profileQ.loading || !profileQ.data) {
    return (
      <div className="min-h-full flex items-center justify-center bg-portfolio-bg text-[#775c50] text-sm">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full border-2 border-portfolio-border border-t-portfolio-red animate-spin" />
          Getting to know me...
        </div>
      </div>
    );
  }

  return <AboutContent me={profileQ.data} />;
}

function AboutContent({ me }) {
  const [expanded, setExpanded] = useState(false);
  const stats = Object.entries(me.stats || {});
  const interests = [
    "Backend Engineering",
    "System Design",
    "Developer Tools",
    "Problem Solving",
    "Open Source",
  ];

  return (
    <main className="relative h-full min-h-0 w-full overflow-y-auto overflow-x-hidden bg-portfolio-bg text-portfolio-text selection:bg-[#ffb39f]">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#ffd66b] opacity-70 blur-[1px] animate-[float_7s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -left-20 top-72 h-40 w-40 rounded-full bg-[#ddcdb9] opacity-45 animate-[float_9s_ease-in-out_1s_infinite]" />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-5 sm:px-7 sm:py-8">
        <header className="mb-5 flex items-center justify-between gap-3 animate-[popIn_0.55s_ease-out_both]">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-portfolio-red">
              Hello, world!
            </p>
            <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-portfolio-text">
              A little about me{" "}
              <span className="inline-block animate-[wiggle_2.5s_ease-in-out_infinite]">
                ✦
              </span>
            </h2>
          </div>
          <div className="rotate-2 rounded-full border-2 border-portfolio-text bg-[#c7b69a] px-3 py-1.5 font-mono text-[10px] font-bold uppercase shadow-[3px_3px_0_#35271f]">
            Open to ideas
          </div>
        </header>

        <section className="relative overflow-hidden rounded-4xl border-2 border-portfolio-text bg-[#ac7c58] p-5 shadow-[7px_7px_0_#35271f] animate-[popIn_0.6s_ease-out_0.08s_both] sm:p-8">
          <div className="absolute -right-8 -top-10 text-[9rem] leading-none text-[#b9855f] opacity-70">
            ✳
          </div>
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div className="flex h-28 w-28 rotate-[-4deg] items-center justify-center overflow-hidden rounded-[1.6rem] border-2 border-portfolio-text bg-[#d9b782] shadow-[5px_5px_0_#35271f] transition-transform duration-300 hover:rotate-3 hover:scale-105 sm:h-36 sm:w-36">
                {me.avatar ? (
                  <img
                    src={me.avatar}
                    alt={me.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-7xl font-black text-portfolio-red">
                    {me.name?.charAt(0)}
                  </span>
                )}
              </div>
              <span className="absolute -bottom-3 -right-3 flex h-10 w-10 rotate-12 items-center justify-center rounded-full border-2 border-portfolio-text bg-[#c7b69a] text-lg shadow-[3px_3px_0_#35271f]">
                ↗
              </span>
            </div>

            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#614431]">
                Developer / builder / curious human
              </p>
              <h1 className="mt-2 wrap-break-word text-4xl font-black leading-[0.95] tracking-[-0.07em] text-portfolio-text sm:text-6xl">
                {me.name}
              </h1>
              <p className="mt-3 max-w-xl text-sm font-bold leading-6 text-[#614431] sm:text-base">
                {me.speciality}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] font-bold text-portfolio-text">
                <span className="rounded-full border-2 border-portfolio-text bg-[#d9b782] px-2.5 py-1">
                  📍 Kolkata, India
                </span>
                <span className="rounded-full border-2 border-portfolio-text bg-[#ddcdb9] px-2.5 py-1">
                  ✎ CS &amp; Engineering
                </span>
              </div>
            </div>
          </div>

          <div className="relative mt-7 rounded-2xl border-2 border-portfolio-text bg-portfolio-bg p-4 sm:p-5">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-portfolio-red">
              Currently thinking about
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#5c4545] sm:text-base">
              {me.bio}
            </p>
          </div>
        </section>

        {stats.length > 0 && (
          <section className="mt-6 grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-4 gap-3">
            {stats.map(([key, value], index) => {
              const colors = [
                "bg-[#d9b782]",
                "bg-[#c7b69a]",
                "bg-[#ddcdb9]",
                "bg-[#b9855f]",
              ];
              return (
                <div
                  key={key}
                  className={`min-w-0 rounded-2xl border-2 border-portfolio-text ${colors[index % colors.length]} p-3 shadow-[4px_4px_0_#35271f] transition duration-300 hover:-translate-y-1 hover:rotate-1 sm:p-4`}
                >
                  <div className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#5f5145] sm:text-[10px]">
                    {key}
                  </div>
                  <div className="mt-2 text-lg font-black leading-tight tracking-[-0.04em] [wrap-anywhere] sm:text-xl">
                    {value}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        <section className="mt-7 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.7rem] border-2 border-portfolio-text bg-white p-5 shadow-[5px_5px_0_#ddcdb9] animate-[popIn_0.65s_ease-out_0.16s_both]">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#73513b]">
              The short version
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tighter">
              I make complicated things feel simple.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5f5145]">
              I enjoy designing backend systems, building APIs, exploring
              software architecture, and turning ideas into useful applications.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span className="font-mono text-2xl font-bold">{"</>"}</span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#73513b]">
                Build with care, ship with joy
              </span>
            </div>
          </div>

          <div className="rounded-[1.7rem] border-2 border-portfolio-text bg-[#c7b69a] p-5 shadow-[5px_5px_0_#35271f] animate-[popIn_0.65s_ease-out_0.22s_both]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#76563c]">
                  My approach
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tighter">
                  Curious first.
                </h2>
              </div>
              <span className="font-mono text-2xl font-bold">01</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#5f5145]">
              Understand the problem, choose the right tool, and make space for
              the details that turn good software into great software.
            </p>
            <button
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              className="mt-4 rounded-full border-2 border-portfolio-text bg-portfolio-bg px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] shadow-[3px_3px_0_#35271f] transition hover:-translate-y-0.5"
            >
              {expanded ? "Hide note ↑" : "Read my note ↓"}
            </button>
            <div
              className={`grid transition-all duration-500 ${expanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}
            >
              <p className="overflow-hidden text-sm leading-6 text-[#5f5145]">
                I focus on maintainable code, understanding how systems behave
                beyond the happy path, and learning through practical
                implementation rather than relying only on theory.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-7">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-portfolio-red">
            Things I like to tinker with
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <span
                key={interest}
                className="rounded-full border-2 border-portfolio-text bg-white px-3 py-2 text-[11px] font-bold shadow-[2px_2px_0_#35271f] transition hover:-translate-y-1 hover:bg-[#d9b782]"
                style={{ transform: `rotate(${index % 2 ? "1deg" : "-1deg"})` }}
              >
                <span className="mr-1 font-mono text-[#73513b]">
                  {String(index + 1).padStart(2, "0")} /
                </span>{" "}
                {interest}
              </span>
            ))}
          </div>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-portfolio-border py-5 font-mono text-[10px] font-bold text-[#78766b]">
          <span>Curiosity, craft &amp; continuous learning.</span>
          <span>
            © {new Date().getFullYear()} {me.name}
          </span>
        </footer>
      </div>

      <style>{`
        @keyframes popIn { from { opacity: 0; transform: translateY(16px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(14px) rotate(8deg); } }
        @keyframes wiggle { 0%, 80%, 100% { transform: rotate(0); } 85% { transform: rotate(15deg); } 90% { transform: rotate(-12deg); } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
      `}</style>
    </main>
  );
}
