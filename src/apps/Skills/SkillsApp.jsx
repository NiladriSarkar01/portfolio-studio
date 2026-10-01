import { useState } from "react";

import { getSkills } from "../../services/api";
import useApi from "../../hooks/useApi";
import ApiError from "../../components/ApiError/ApiError";

const CATEGORY_META = {
  languages: {
    name: "Languages",
    icon: "</>",
    description: "Core programming languages",
    accent: "text-amber-700",
    glow: "from-amber-100",
    border: "hover:border-amber-400",
    tile: "group-hover:text-amber-700",
  },
  frontend: {
    name: "Frontend",
    icon: "◈",
    description: "Interfaces and user experience",
    accent: "text-amber-700",
    glow: "from-amber-100",
    border: "hover:border-amber-400",
    tile: "group-hover:text-amber-700",
  },
  backend: {
    name: "Backend",
    icon: "⌘",
    description: "APIs and server-side systems",
    accent: "text-amber-700",
    glow: "from-amber-100",
    border: "hover:border-amber-400",
    tile: "group-hover:text-amber-700",
  },
  databases: {
    name: "Databases",
    icon: "▤",
    description: "Data storage and management",
    accent: "text-amber-800",
    glow: "from-amber-100",
    border: "hover:border-amber-700",
    tile: "group-hover:text-amber-800",
  },
  devops: {
    name: "DevOps & Tools",
    icon: "⚙",
    description: "Development and infrastructure",
    accent: "text-amber-700",
    glow: "from-amber-100",
    border: "hover:border-amber-400",
    tile: "group-hover:text-amber-700",
  },
};

const getInitials = (name) =>
  name
    .split(/[\s/.+-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default function SkillsApp() {
  const { data, loading, error, reload } = useApi(getSkills);

  const [selected, setSelected] = useState(null);

  if (error) {
    return <ApiError endpoint="/api/skills" onRetry={reload} />;
  }

  const skills = data?.skills ?? {};
  const tools = data?.tools ?? [];
  const environment = data?.environment ?? {};

  const categories = Object.entries(skills);

  const totalSkills = categories.reduce(
    (total, [, items]) => total + (Array.isArray(items) ? items.length : 0),
    0,
  );

  const selectedSkill = selected
    ? categories
        .find(([key]) => key === selected.category)?.[1]
        ?.find((skill) => skill.name === selected.name)
    : null;

  return (
    <div className="skills-app h-full overflow-y-auto bg-portfolio-surface p-4 text-portfolio-text sm:p-6">
      {/* Header */}
      <header className="skills-enter mb-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/15 to-amber-500/10 font-mono text-sm text-amber-300">
              {"</>"}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
            </div>

            <div>
              <h1 className="text-sm font-semibold tracking-wide">
                Skill Explorer
              </h1>
              <p className="mt-1 text-[11px] text-portfolio-muted">
                Technical profile
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-portfolio-border bg-portfolio-panel px-3 py-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                loading ? "animate-pulse bg-amber-400" : "bg-amber-700"
              }`}
            />
            <span className="text-[10px] text-portfolio-muted">
              {loading ? "Syncing" : "Synced"}
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-portfolio-border bg-portfolio-panel p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-amber-500/[0.07] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-amber-500/[0.05] blur-3xl" />

          <div className="relative">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-amber-400">
              Developer Toolkit
            </p>

            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Built with curiosity.
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-400 to-amber-700 bg-clip-text text-transparent">
                Driven by technology.
              </span>
            </h2>

            <p className="mt-3 max-w-md text-[11px] leading-relaxed text-portfolio-muted">
              A collection of languages, frameworks, and tools used across my
              development journey.
            </p>
          </div>
        </div>
      </header>

      {/* Overview */}
      <section className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          {
            label: "Technologies",
            value: totalSkills,
            color: "text-amber-400",
            bg: "bg-amber-400",
          },
          {
            label: "Categories",
            value: categories.length,
            color: "text-amber-400",
            bg: "bg-amber-400",
          },
          {
            label: "Tools & Platforms",
            value: tools.length,
            color: "text-amber-700",
            bg: "bg-amber-700",
          },
        ].map((stat, index) => (
          <div
            key={stat.label}
            style={{ animationDelay: `${index * 80}ms` }}
            className="skills-enter group rounded-xl border border-portfolio-border bg-portfolio-panel p-4 transition-all duration-300 hover:-translate-y-1 hover:border-portfolio-muted/40"
          >
            <div
              className={`mb-3 h-1 w-7 rounded-full ${stat.bg} opacity-70 transition-all duration-300 group-hover:w-12 group-hover:opacity-100`}
            />

            <p className="text-[10px] text-portfolio-muted">{stat.label}</p>

            <p className={`mt-1 text-2xl font-semibold ${stat.color}`}>
              {stat.value.toString().padStart(2, "0")}
            </p>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">My Expertise</h2>
            <p className="mt-1 text-[11px] text-portfolio-muted">
              Select a technology to explore
            </p>
          </div>

          <span className="shrink-0 rounded-full border-2 border-[#35271f] bg-[#d9b782] px-2.5 py-1 font-mono text-[9px] font-bold text-[#5f5145] sm:text-[10px]">
            {categories.length} collections
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {categories.map(([key, items], index) => {
            const meta = CATEGORY_META[key] ?? {
              name: key,
              icon: "◇",
              description: "Technical competencies",
              accent: "text-slate-700",
              glow: "from-slate-100",
              border: "hover:border-slate-400",
              tile: "group-hover:text-slate-700",
            };

            const skillList = Array.isArray(items) ? items : [];

            return (
              <article
                key={key}
                style={{ animationDelay: `${index * 90}ms` }}
                className={`skills-enter group relative min-w-0 overflow-hidden rounded-2xl border border-portfolio-border bg-portfolio-panel p-3 transition-all duration-300 hover:-translate-y-1 sm:p-4 ${meta.border}`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${meta.glow} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="relative">
                  <div className="mb-4 flex min-w-0 items-start justify-between gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-portfolio-border bg-portfolio-surface font-mono text-sm ${meta.accent} transition-transform duration-300 group-hover:scale-105`}
                    >
                      {meta.icon}
                    </div>

                    <span className="shrink-0 rounded-full border-2 border-[#35271f] bg-[#d9b782] px-2 py-1 font-mono text-[9px] font-bold text-[#5f5145] sm:px-2.5 sm:text-[10px]">
                      {skillList.length} skills
                    </span>
                  </div>

                  <h3 className="break-words text-[13px] font-bold leading-tight text-[#35271f]">{meta.name}</h3>

                  <p className="mt-1 text-[11px] text-portfolio-muted">
                    {meta.description}
                  </p>

                  <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(68px,1fr))] gap-2">
                    {skillList.map((skill, skillIndex) => {
                      const isSelected =
                        selected?.category === key &&
                        selected?.name === skill.name;

                      return (
                        <button
                          key={skill.name}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() =>
                            setSelected(
                              isSelected
                                ? null
                                : {
                                    category: key,
                                    name: skill.name,
                                  },
                            )
                          }
                          style={{
                            animationDelay: `${skillIndex * 35}ms`,
                          }}
                          className={`skill-tile group/tile flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl border-2 p-2 transition-all duration-200 sm:p-3 ${
                            isSelected
                              ? "border-[#35271f] bg-[#ddcdb9] shadow-[2px_2px_0_#35271f]"
                              : "border-[#d0bca4] bg-[#f4ede3] hover:border-[#35271f] hover:bg-[#d9b782]"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-portfolio-border bg-portfolio-panel font-mono text-[11px] font-semibold transition-all duration-200 group-hover/tile:scale-110 ${meta.accent}`}
                          >
                            {getInitials(skill.name)}
                          </span>

                          <span className="w-full break-words text-center text-[10px] leading-tight text-[#5f5145] transition-colors group-hover/tile:text-[#35271f]">
                            {skill.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Selected Skill */}
      {selectedSkill && (
        <section
          key={`${selected.category}:${selected.name}`}
          className="skills-detail-enter mt-5 overflow-hidden rounded-2xl border border-amber-400/20 bg-portfolio-panel"
        >
          <div className="h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-700" />

          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-500/10 font-mono text-sm text-amber-300">
                  {getInitials(selectedSkill.name)}
                </div>

                <div>
                  <p className="text-sm font-semibold">{selectedSkill.name}</p>
                  <p className="mt-1 text-[10px] text-portfolio-muted">
                    {CATEGORY_META[selected.category]?.name ??
                      selected.category}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close skill details"
                className="rounded-lg px-2 py-1 text-portfolio-muted transition hover:bg-portfolio-surface hover:text-portfolio-text"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-portfolio-muted">
              {selectedSkill.description ||
                `${selectedSkill.name} is part of my ${
                  CATEGORY_META[selected.category]?.name ?? selected.category
                } stack.`}
            </p>
          </div>
        </section>
      )}

      {/* Tools */}
      <section className="mt-7 rounded-2xl border border-portfolio-border bg-portfolio-panel p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Tools & Platforms</h2>
            <p className="mt-1 text-[11px] text-portfolio-muted">
              My everyday development toolkit
            </p>
          </div>

          <span className="text-[11px] text-portfolio-muted">
            {tools.length} items
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tools.map((tool, index) => (
            <span
              key={tool}
              style={{ animationDelay: `${index * 25}ms` }}
              className="skills-enter rounded-lg border border-portfolio-border bg-portfolio-surface px-3 py-2 text-[11px] text-portfolio-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-700/30 hover:bg-amber-700/5 hover:text-amber-300"
            >
              {tool}
            </span>
          ))}
        </div>
      </section>

      {/* Environment */}
      <section className="mt-4 rounded-2xl border border-portfolio-border bg-portfolio-panel p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
            ⚙
          </div>

          <div>
            <h2 className="text-sm font-semibold">Development Environment</h2>
            <p className="mt-1 text-[11px] text-portfolio-muted">
              Current technical environment
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(environment).map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col justify-between gap-1 border-b border-portfolio-border/60 pb-3 last:border-0 last:pb-0 sm:flex-row sm:gap-4"
            >
              <span className="text-[11px] text-portfolio-muted">{label}</span>

              <span className="break-words text-[11px] text-portfolio-text sm:text-right">
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-5 flex items-center justify-between border-t border-portfolio-border pt-4 text-[10px] text-portfolio-muted">
        <span>
          <span className="text-amber-700">●</span> Profile synchronized
        </span>

        <span>
          {totalSkills} technologies · {tools.length} tools
        </span>
      </footer>

      {/* Local animations */}
      <style>{`
        .skills-enter {
          animation: skillsFadeUp 420ms ease both;
        }

        .skills-detail-enter {
          animation: skillsDetailIn 260ms ease both;
        }

        @keyframes skillsFadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes skillsDetailIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .skills-enter,
          .skills-detail-enter {
            animation: none;
          }

          .skills-app *,
          .skills-app *::before,
          .skills-app *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
