import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const STARTUP_STEPS = [
  "Waking up the creative studio",
  "Gathering projects and ideas",
  "Setting the scene",
  "Almost ready to say hello",
];

export default function BootScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeStep = Math.min(
    STARTUP_STEPS.length - 1,
    Math.floor((progress / 100) * STARTUP_STEPS.length),
  );

  useEffect(() => {
    const startedAt = Date.now();
    const duration = 4200;
    let interval;
    let completionTimeout;

    const updateProgress = () => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        window.clearInterval(interval);
        completionTimeout = window.setTimeout(onDone, 550);
      }
    };

    interval = window.setInterval(updateProgress, 40);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(completionTimeout);
    };
  }, [onDone]);

  return (
    <main className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#f4ede3] px-5 py-8 text-[#35271f]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(#d0bca4 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="pointer-events-none absolute -left-16 top-8 h-48 w-48 rounded-full bg-[#ddcdb9]/60 blur-3xl sm:left-12 sm:top-12 sm:h-64 sm:w-64" />
      <div className="pointer-events-none absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-[#b9855f]/70 blur-3xl sm:right-12 sm:h-72 sm:w-72" />

      <div className="relative z-10 grid w-full max-w-4xl items-center gap-8 sm:gap-12 md:grid-cols-[1fr_1.1fr]">
        <div className="relative mx-auto flex aspect-square w-full max-w-[300px] items-center justify-center sm:max-w-[360px]">
          <motion.div
            aria-hidden="true"
            className="absolute inset-[8%] rounded-full border-2 border-dashed border-[#d0bca4]"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-[20%] rounded-[2.5rem] border-2 border-[#35271f] bg-[#d9b782] shadow-[7px_7px_0_#35271f]"
            animate={
              reduceMotion
                ? undefined
                : { rotate: [8, -8, 8], y: [0, -8, 0] }
            }
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute left-[9%] top-[22%] flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#35271f] bg-[#8b5e3c] text-2xl shadow-[3px_3px_0_#35271f]"
            animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ☕
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute bottom-[15%] right-[11%] flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#35271f] bg-[#c7b69a] text-2xl shadow-[3px_3px_0_#35271f]"
            animate={reduceMotion ? undefined : { y: [0, 10, 0], rotate: [0, -12, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            ↗
          </motion.div>

          <motion.div
            className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border-2 border-[#35271f] bg-[#8b5e3c] text-5xl shadow-[6px_6px_0_#35271f] sm:h-36 sm:w-36 sm:text-6xl"
            initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 12 }}
          >
            <motion.span
              aria-hidden="true"
              animate={reduceMotion ? undefined : { rotate: [0, 8, 0, -8, 0], y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 48 48" className="h-16 w-16 sm:h-20 sm:w-20" fill="none" aria-hidden="true">
                <path d="M12 21h22v11a8 8 0 0 1-8 8h-6a8 8 0 0 1-8-8V21Z" fill="#f4ede3" stroke="#35271f" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M34 24h3a5 5 0 0 1 0 10h-4" stroke="#35271f" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M19 16c-2-3 2-4 0-7m8 7c-2-3 2-4 0-7" stroke="#f4ede3" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M10 43h29" stroke="#35271f" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </motion.span>
          </motion.div>
        </div>

        <section className="mx-auto w-full max-w-lg text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="inline-flex rotate-[-2deg] items-center gap-2 rounded-full border-2 border-[#35271f] bg-[#c7b69a] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] shadow-[3px_3px_0_#35271f]"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#77734f]" />
            Portfolio is getting ready
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.07em] sm:text-6xl"
          >
            A little
            <br />
            <span className="text-[#805239]">world of work</span>
            <br />
            is on its way.
          </motion.h1>

          <motion.p
            key={activeStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 min-h-6 text-sm font-medium text-[#786b5f] sm:text-base"
            aria-live="polite"
          >
            {STARTUP_STEPS[activeStep]}...
          </motion.p>

          <div className="mt-7 rounded-2xl border-2 border-[#35271f] bg-white p-4 shadow-[5px_5px_0_#35271f] sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
              <span>Getting everything in place</span>
              <span className="text-[#805239]">{progress}%</span>
            </div>
            <div
              className="h-3 overflow-hidden rounded-full border-2 border-[#35271f] bg-[#f4ede3] p-0.5"
              role="progressbar"
              aria-label="Portfolio startup progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <motion.div
                className="h-full rounded-full bg-[#805239]"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.2 }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              {STARTUP_STEPS.map((step, index) => (
                <div key={step} className="flex items-center gap-1.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full border border-[#35271f] transition-colors ${
                      index <= activeStep ? "bg-[#c7b69a]" : "bg-[#f4ede3]"
                    }`}
                  />
                  <span className="hidden font-mono text-[9px] text-[#786b5f] sm:inline">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
              <span className="ml-auto text-xl" aria-hidden="true">
                04
              </span>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#78766b]"
          >
            Portfolio studio · Loading
          </motion.p>
        </section>
      </div>
    </main>
  );
}
