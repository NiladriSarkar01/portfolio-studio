import { useEffect, useMemo, useRef, useState } from "react";

import { getProfile, getProjects } from "../../services/api";
import useApi from "../../hooks/useApi";
import ApiError from "../../components/ApiError/ApiError";

const ACCENTS = [
  {
    name: "teal",
    soft: "bg-[#eee9fb]",
    text: "text-[#7656bd]",
    border: "border-[#d9cef5]",
    dot: "bg-[#9676d5]",
    glow: "group-hover:shadow-[0_18px_45px_rgba(118,86,189,0.10)]",
  },
  {
    name: "orange",
    soft: "bg-[#fff0e4]",
    text: "text-[#c47735]",
    border: "border-[#f4d7bc]",
    dot: "bg-[#e69a53]",
    glow: "group-hover:shadow-[0_18px_45px_rgba(196,119,53,0.10)]",
  },
  {
    name: "green",
    soft: "bg-[#e8f3e9]",
    text: "text-[#4e8a5a]",
    border: "border-[#cde5d0]",
    dot: "bg-[#72ad7b]",
    glow: "group-hover:shadow-[0_18px_45px_rgba(78,138,90,0.10)]",
  },
  {
    name: "blue",
    soft: "bg-[#e8f0fb]",
    text: "text-[#4779b8]",
    border: "border-[#cfdef4]",
    dot: "bg-[#6b9bd5]",
    glow: "group-hover:shadow-[0_18px_45px_rgba(71,121,184,0.10)]",
  },
  {
    name: "amber",
    soft: "bg-[#fae9ed]",
    text: "text-[#bd647c]",
    border: "border-[#f0ced8]",
    dot: "bg-[#d98199]",
    glow: "group-hover:shadow-[0_18px_45px_rgba(189,100,124,0.10)]",
  },
  {
    name: "teal",
    soft: "bg-[#e4f3f1]",
    text: "text-[#438b83]",
    border: "border-[#c5e4df]",
    dot: "bg-[#66aaa1]",
    glow: "group-hover:shadow-[0_18px_45px_rgba(67,139,131,0.10)]",
  },
];

const getAccent = (index) => ACCENTS[index % ACCENTS.length];

const getProjectKey = (project) => project.id || project.slug || project.name;

export default function ProjectsApp() {
  const profileQ = useApi(getProfile);
  const projectsQ = useApi(getProjects);

  if (profileQ.error || projectsQ.error) {
    return (
      <ApiError
        endpoint={profileQ.error ? "/api/profile" : "/api/projects"}
        onRetry={() => {
          profileQ.reload();
          projectsQ.reload();
        }}
      />
    );
  }

  if (
    profileQ.loading ||
    projectsQ.loading ||
    !profileQ.data ||
    !projectsQ.data
  ) {
    return (
      <div className="h-full min-h-full flex items-center justify-center bg-[#f8f7f4] text-[#777] text-sm">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#d58b59] animate-pulse" />
          Loading projects...
        </div>
      </div>
    );
  }

  const projects = Array.isArray(projectsQ.data)
    ? projectsQ.data
    : projectsQ.data.projects || [];

  return (
    <ProjectsContent projects={projects} username={profileQ.data.username} />
  );
}

function ProjectsContent({ projects, username }) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [activeProject, setActiveProject] = useState(null);

  const categories = useMemo(
    () => [
      "all",
      ...new Set(projects.map((project) => project.category).filter(Boolean)),
    ],
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        category === "all" || project.category === category;

      const searchable = [
        project.name,
        project.category,
        project.description,
        ...(project.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [projects, category, search]);

  const completedCount = projects.filter((project) => project.completed).length;

  const handleCategory = (value) => {
    setCategory(value);
    setActiveProject(null);
  };

  return (
    <main className="h-full w-full overflow-y-auto bg-[#f8f7f4] text-[#292929]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-[#f8f7f4]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <a
            href="#projects-top"
            className="text-lg font-semibold tracking-[-0.04em] text-[#222] no-underline"
          >
            {username || "Projects"}
            <span className="text-[#c77d4d]">.</span>
          </a>

          <div className="flex items-center gap-2 text-[10px] text-[#777]">
            <span className="w-2 h-2 rounded-full bg-[#65a878] animate-pulse" />
            Project archive
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="projects-top">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-11 pb-7 sm:pb-9">
          <div className="relative overflow-hidden rounded-[24px] border-2 border-[#35271f] bg-[#ddcdb9] text-[#35271f] p-5 shadow-[6px_6px_0_#35271f] sm:p-8 lg:p-10">
            <div className="absolute -right-12 -top-20 w-56 h-56 rounded-full bg-[#d9b782]/80 blur-3xl pointer-events-none" />
            <div className="absolute right-20 -bottom-24 w-52 h-52 rounded-full bg-[#b9855f]/80 blur-3xl pointer-events-none" />

            <div className="relative grid md:grid-cols-[1fr_auto] gap-7 items-end">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#6d5b9e]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#77734f]" />
                  Selected work
                </div>

                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.06em] leading-[1.02]">
                  Things I've
                  <span className="block text-[#805239]">
                    built & explored.
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-[12px] sm:text-sm leading-6 text-[#5c4c78]">
                  A collection of software projects, experiments, and practical
                  solutions built through curiosity and code.
                </p>
              </div>

              <div className="flex md:flex-col gap-3 md:items-end">
                <div className="rounded-2xl border-2 border-[#35271f] bg-[#f4ede3]/70 px-4 py-3 min-w-[112px]">
                  <div className="text-2xl sm:text-3xl font-semibold tracking-[-0.05em]">
                    {projects.length.toString().padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#6d5b9e]">
                    Projects
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-[#35271f] bg-[#f4ede3]/70 px-4 py-3 min-w-[112px]">
                  <div className="text-2xl sm:text-3xl font-semibold tracking-[-0.05em]">
                    {completedCount.toString().padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#6d5b9e]">
                    Completed
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-7 pt-4 border-t-2 border-dashed border-[#73513b]/40 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-[#6d5b9e]">
              <span>Full-stack development</span>
              <span className="text-white/20">/</span>
              <span>Backend systems</span>
              <span className="text-white/20">/</span>
              <span>Experiments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Project collection */}
      <section className="pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#999]">
                The collection
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-[-0.05em] text-[#252525]">
                Selected projects
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#777]">
                Browse the work by technology, purpose, or curiosity.
              </p>
            </div>

            <div className="relative w-full sm:w-56">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa] text-sm">
                ⌕
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setActiveProject(null);
                }}
                placeholder="Search projects..."
                aria-label="Search projects"
                className="w-full rounded-full border border-black/[0.09] bg-white pl-9 pr-4 py-2.5 text-xs text-[#292929] outline-none transition-all placeholder:text-[#aaa] focus:border-[#c99a79] focus:ring-4 focus:ring-[#d9a983]/10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((item) => {
              const active = category === item;

              return (
                <button
                  key={item}
                  onClick={() => handleCategory(item)}
                  className={`rounded-full px-4 py-2 text-[10px] sm:text-[11px] capitalize transition-all duration-200 ${
                    active
                      ? "bg-[#b9855f] text-[#35271f] shadow-[0_5px_15px_rgba(59,47,53,0.12)]"
                      : "border border-black/[0.08] bg-white text-[#777] hover:border-black/20 hover:text-[#292929] hover:-translate-y-0.5"
                  }`}
                >
                  {item === "all" ? "All projects" : item}
                </button>
              );
            })}
          </div>

          {/* Cards */}
          {filteredProjects.length > 0 ? (
            <div className="grid auto-rows-[8px] grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={getProjectKey(project)}
                  project={project}
                  index={index}
                  active={activeProject === getProjectKey(project)}
                  onClick={() =>
                    setActiveProject((current) =>
                      current === getProjectKey(project)
                        ? null
                        : getProjectKey(project),
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 px-5 py-14 text-center">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-[#f0ede7] flex items-center justify-center text-xl text-[#999]">
                ⌕
              </div>
              <h3 className="mt-4 text-sm font-medium text-[#333]">
                No projects found
              </h3>
              <p className="mt-1 text-xs text-[#888]">
                Try another search term or category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                className="mt-4 rounded-full border-2 border-[#35271f] bg-[#d9b782] px-4 py-2 text-[10px] font-bold text-[#35271f] transition-colors hover:bg-[#b9855f]"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.07] bg-white/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row gap-2 items-center justify-between text-[10px] text-[#999]">
          <span>{filteredProjects.length} projects displayed</span>
          <span>Built with curiosity & code.</span>
        </div>
      </footer>

      <style>{`
        @keyframes projectFadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .project-enter {
          animation: projectFadeUp 520ms cubic-bezier(.2,.75,.25,1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .project-enter {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}

function ProjectCard({ project, index, active, onClick }) {
  const cardRef = useRef(null);
  const accent = getAccent(index);
  const tags = Array.isArray(project.tags) ? project.tags : [];

  useEffect(() => {
    const card = cardRef.current;
    const grid = card?.parentElement;

    if (!card || !grid) return;

    const updateRowSpan = () => {
      const rowHeight = 8;
      const rowGap = Number.parseFloat(getComputedStyle(grid).rowGap) || 0;
      const height = card.getBoundingClientRect().height;
      const span = Math.ceil((height + rowGap) / (rowHeight + rowGap));
      card.style.gridRowEnd = `span ${span}`;
    };

    updateRowSpan();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateRowSpan);
    observer.observe(card);

    return () => observer.disconnect();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <article
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-expanded={active}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={{ animationDelay: `${Math.min(index * 65, 390)}ms` }}
      className={`project-enter group relative min-w-0 text-left overflow-hidden rounded-2xl border bg-white transition-all duration-300 ease-out hover:-translate-y-1.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d9a983]/25 ${
        active
          ? "border-[#c99a79] shadow-[0_16px_45px_rgba(0,0,0,0.09)]"
          : `border-black/[0.07] hover:border-black/[0.13] shadow-[0_3px_15px_rgba(0,0,0,0.025)] ${accent.glow}`
      }`}
    >
      {/* Accent strip */}
      <div className={`h-1 w-full ${accent.dot}`} />

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`w-12 h-12 rounded-2xl ${accent.soft} ${accent.text} flex items-center justify-center text-xl transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-105`}
          >
            {project.icon || "✳"}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-medium ${
                project.completed
                  ? "bg-[#eaf4eb] text-[#53865b]"
                  : "bg-[#fff2df] text-[#b47b36]"
              }`}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 align-middle" />
              {project.completed ? "Completed" : "In progress"}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <span
            className={`text-[9px] uppercase tracking-[0.16em] ${accent.text}`}
          >
            {project.category || "Project"}
          </span>
          <span className="text-[#d2cec8]">·</span>
          <span className="text-[9px] text-[#aaa]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-[#292929] transition-colors group-hover:text-[#9b6848]">
          {project.name}
        </h3>

        <p className="mt-2 text-[12px] leading-6 text-[#777] line-clamp-3">
          {project.description ||
            "A project built through practical experimentation."}
        </p>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#f5f3ef] px-2.5 py-1 text-[9px] text-[#777] transition-colors group-hover:bg-[#f0ede7]"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="px-1 py-1 text-[9px] text-[#aaa]">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}

        <div
          className={`grid transition-all duration-300 ${
            active
              ? "grid-rows-[1fr] opacity-100 mt-4"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-black/[0.07] pt-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#aaa]">
                Project details
              </p>

              <p className="mt-2 text-[11px] leading-6 text-[#777]">
                {project.description}
              </p>

              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full ${accent.soft} ${accent.text} px-2.5 py-1 text-[9px]`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="text-[10px] font-medium text-[#555] hover:text-[#a66d49] transition-colors"
              >
                GitHub ↗
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="text-[10px] font-medium text-[#555] hover:text-[#a66d49] transition-colors"
              >
                Live demo ↗
              </a>
            )}
          </div>

          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
              active
                ? `${accent.soft} ${accent.text} rotate-45`
                : "bg-[#f4f2ee] text-[#777] group-hover:bg-[#b9855f] group-hover:text-[#35271f]"
            }`}
            aria-hidden="true"
          >
            +
          </span>
        </div>
      </div>
    </article>
  );
}
