import { useEffect, useMemo, useState } from "react";

import { getProjects } from "../../services/api";

const STATIC_FS = {
  Desktop: {
    type: "dir",
    children: {},
  },

  Downloads: {
    type: "dir",
    children: {},
  },

  tools: {
    type: "dir",
    children: {
      git: {
        type: "file",
        size: "128K",
      },

      docker: {
        type: "file",
        size: "256K",
      },

      node: {
        type: "file",
        size: "64K",
      },
    },
  },

  ".bashrc": {
    type: "file",
    size: "3.5K",
  },

  ".zshrc": {
    type: "file",
    size: "5.1K",
  },
};

const FILE_ICONS = {
  dir: "▰",
  file: "▱",
  ".txt": "▤",
  ".sh": "⚙",
  ".json": "{}",
  ".md": "▧",
  ".js": "JS",
  ".ts": "TS",
};

function getIcon(name, type) {
  if (type === "dir") {
    return FILE_ICONS.dir;
  }

  const dotIndex = name.lastIndexOf(".");

  if (dotIndex === -1) {
    return FILE_ICONS.file;
  }

  const extension = name.slice(dotIndex);

  return FILE_ICONS[extension] || FILE_ICONS.file;
}

function createProjectDirectory(project) {
  return {
    type: "dir",

    appId: "projects",

    projectId: project.id,

    project,

    children: {
      "README.md": {
        type: "file",
        size: "1.2K",
        appId: "projects",
        projectId: project.id,
      },
    },
  };
}

function createFilesystem(projects) {
  const projectChildren = {};

  projects.forEach((project) => {
    projectChildren[project.name] = createProjectDirectory(project);
  });

  return {
    "/portfolio": {
      type: "dir",

      children: {
        ...STATIC_FS,

        projects: {
          type: "dir",

          children: projectChildren,
        },

        "resume.txt": {
          type: "file",
          appId: "resume",
          size: "4.2K",
        },

        "contact.sh": {
          type: "file",
          appId: "contact",
          size: "1.1K",
        },

        "skills.json": {
          type: "file",
          appId: "skills",
          size: "2.8K",
        },
      },
    },
  };
}

function normalizeProjectName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function FilesApp({ onOpenApp }) {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const [path, setPath] = useState("/portfolio");

  const [history, setHistory] = useState(["/portfolio"]);

  const [histIdx, setHistIdx] = useState(0);

  const [selected, setSelected] = useState(null);

  /*
   * --------------------------------------------------
   * Load portfolio data
   * --------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    async function loadPortfolio() {
      setLoading(true);

      try {
        const projectsResponse = await getProjects();

        if (!mounted) return;

        setProjects(Array.isArray(projectsResponse) ? projectsResponse : []);
        setOffline(false);
      } catch (error) {
        if (!mounted) return;

        console.warn("Portfolio API unavailable.");

        setProjects([]);
        setOffline(true);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPortfolio();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * --------------------------------------------------
   * Virtual filesystem
   * --------------------------------------------------
   */

  const FS = useMemo(() => createFilesystem(projects), [projects]);

  /*
   * --------------------------------------------------
   * Resolve filesystem path
   * --------------------------------------------------
   */

  const resolvePath = (currentPath) => {
    if (currentPath === "/portfolio") {
      return FS["/portfolio"];
    }

    const relative = currentPath
      .replace("/portfolio", "")
      .split("/")
      .filter(Boolean);

    let node = FS["/portfolio"];

    for (const part of relative) {
      if (!node?.children?.[part]) {
        return null;
      }

      node = node.children[part];
    }

    return node;
  };

  const current = resolvePath(path);

  const entries =
    current?.type === "dir" ? Object.entries(current.children || {}) : [];

  /*
   * --------------------------------------------------
   * Navigation
   * --------------------------------------------------
   */

  const navigate = (newPath) => {
    if (newPath === path) return;

    const trimmed = history.slice(0, histIdx + 1);

    setHistory([...trimmed, newPath]);

    setHistIdx(trimmed.length);
    setPath(newPath);
    setSelected(null);
  };

  const goBack = () => {
    if (histIdx <= 0) return;

    const nextIndex = histIdx - 1;

    setHistIdx(nextIndex);
    setPath(history[nextIndex]);
    setSelected(null);
  };

  const goForward = () => {
    if (histIdx >= history.length - 1) {
      return;
    }

    const nextIndex = histIdx + 1;

    setHistIdx(nextIndex);
    setPath(history[nextIndex]);
    setSelected(null);
  };

  const goUp = () => {
    if (path === "/portfolio") return;

    const parent = path.slice(0, path.lastIndexOf("/")) || "/portfolio";

    navigate(parent);
  };

  /*
   * --------------------------------------------------
   * Open file / folder
   * --------------------------------------------------
   */

  const handleOpen = (name, entry) => {
    if (entry.type === "dir") {
      navigate(`${path}/${name}`);
      return;
    }

    if (!entry.appId) {
      return;
    }

    if (entry.appId === "projects") {
      onOpenApp?.("projects");
      return;
    }

    onOpenApp?.(entry.appId);
  };

  /*
   * --------------------------------------------------
   * Sidebar
   * --------------------------------------------------
   */

  const SIDEBAR = [
    {
      label: "Home",
      icon: "⌂",
      path: "/portfolio",
    },

    {
      label: "Desktop",
      icon: "▣",
      path: "/portfolio/Desktop",
    },

    {
      label: "Downloads",
      icon: "↓",
      path: "/portfolio/Downloads",
    },

    {
      label: "Projects",
      icon: "▰",
      path: "/portfolio/projects",
    },

    {
      label: "Tools",
      icon: "⚙",
      path: "/portfolio/tools",
    },
  ];

  /*
   * --------------------------------------------------
   * Render
   * --------------------------------------------------
   */

  return (
    <div className="flex h-full font-mono text-xs bg-portfolio-surface">
      {/* ================= SIDEBAR ================= */}

      <aside className="hidden sm:flex w-36 shrink-0 flex-col border-r border-portfolio-border bg-portfolio-panel">
        {/* Header */}

        <div className="px-3 py-3 border-b border-portfolio-border">
          <div className="flex items-center gap-2">
            <span className="text-portfolio-red">▣</span>

            <span className="text-[12px] font-bold tracking-widest text-portfolio-text">
              EXPLORER
            </span>
          </div>
        </div>

        {/* Places */}

        <div className="p-2">
          <div className="px-2 mb-2 text-[10px] tracking-[0.18em] text-portfolio-muted/50">
            PLACES
          </div>

          <div className="space-y-0.5">
            {SIDEBAR.map((item) => {
              const active = path === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full
                    flex
                    items-center
                    gap-2
                    px-2
                    py-1.5
                    rounded-md
                    text-left
                    text-[12px]
                    transition-all
                    ${
                      active
                        ? `
                          text-portfolio-red
                          bg-portfolio-red/10
                          border
                          border-portfolio-red/10
                        `
                        : `
                          text-portfolio-muted
                          hover:text-portfolio-text
                          hover:bg-portfolio-surface
                        `
                    }
                  `}
                >
                  <span className="w-4 text-center">{item.icon}</span>

                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Portfolio */}

        <div className="p-2 pt-1">
          <div className="px-2 mb-2 text-[10px] tracking-[0.18em] text-portfolio-muted/50">
            PORTFOLIO
          </div>

          <div className="space-y-0.5">
            <button
              onClick={() => onOpenApp?.("projects")}
              className="
                w-full
                flex
                items-center
                gap-2
                px-2
                py-1.5
                rounded-md
                text-left
                text-[12px]
                text-portfolio-muted
                hover:text-portfolio-text
                hover:bg-portfolio-surface
                transition-colors
              "
            >
              <span className="w-4 text-center text-portfolio-red">▰</span>
              Projects
            </button>

            <button
              onClick={() => onOpenApp?.("resume")}
              className="
                w-full
                flex
                items-center
                gap-2
                px-2
                py-1.5
                rounded-md
                text-left
                text-[12px]
                text-portfolio-muted
                hover:text-portfolio-text
                hover:bg-portfolio-surface
                transition-colors
              "
            >
              <span className="w-4 text-center text-portfolio-amber">▤</span>
              Resume
            </button>

            <button
              onClick={() => onOpenApp?.("contact")}
              className="
                w-full
                flex
                items-center
                gap-2
                px-2
                py-1.5
                rounded-md
                text-left
                text-[12px]
                text-portfolio-muted
                hover:text-portfolio-text
                hover:bg-portfolio-surface
                transition-colors
              "
            >
              <span className="w-4 text-center text-portfolio-green">◉</span>
              Contact
            </button>
          </div>
        </div>

        {/* Status */}

        <div className="mt-auto border-t border-portfolio-border p-3">
          <div className="text-[10px] text-portfolio-muted">DATA SOURCE</div>

          <div
            className={`
              mt-1
              text-[11px]
              ${offline ? "text-portfolio-amber" : "text-portfolio-green"}
            `}
          >
            ● {offline ? "API OFFLINE" : "API CONNECTED"}
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Toolbar */}

        <div className="shrink-0 border-b border-portfolio-border bg-portfolio-panel">
          <div className="flex items-center gap-1.5 px-3 py-2">
            <button
              onClick={goBack}
              disabled={histIdx <= 0}
              className={`
                w-6 h-6
                rounded-sm
                text-sm
                ${
                  histIdx > 0
                    ? "text-portfolio-text hover:bg-portfolio-surface hover:text-portfolio-red"
                    : "text-portfolio-border"
                }
              `}
            >
              ←
            </button>

            <button
              onClick={goForward}
              disabled={histIdx >= history.length - 1}
              className={`
                w-6 h-6
                rounded-sm
                text-sm
                ${
                  histIdx < history.length - 1
                    ? "text-portfolio-text hover:bg-portfolio-surface hover:text-portfolio-red"
                    : "text-portfolio-border"
                }
              `}
            >
              →
            </button>

            <button
              onClick={goUp}
              disabled={path === "/portfolio"}
              className={`
                w-6 h-6
                rounded-sm
                text-sm
                ${
                  path !== "/portfolio"
                    ? "text-portfolio-text hover:bg-portfolio-surface hover:text-portfolio-red"
                    : "text-portfolio-border"
                }
              `}
            >
              ↑
            </button>

            {/* Path */}

            <div className="flex-1 min-w-0 flex items-center gap-2 bg-portfolio-surface border border-portfolio-border rounded-md px-2.5 py-1.5">
              <span className="text-portfolio-green text-[11px]">$</span>

              <span className="text-[12px] text-portfolio-muted truncate">
                {path}
              </span>
            </div>

            {offline && (
              <span className="hidden md:block text-[11px] text-portfolio-amber">
                ⚠ offline
              </span>
            )}
          </div>

          {/* Mobile path */}

          <div className="sm:hidden px-3 pb-2">
            <select
              value={path}
              onChange={(e) => navigate(e.target.value)}
              className="
                w-full
                bg-portfolio-surface
                border
                border-portfolio-border
                rounded-md
                px-2
                py-1.5
                text-[11px]
                text-portfolio-muted
                outline-hidden
              "
            >
              {SIDEBAR.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= FILE AREA ================= */}

        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-portfolio-red text-xl animate-pulse mb-3">
                  ▣
                </div>

                <div className="text-portfolio-muted text-[12px]">
                  Building filesystem...
                </div>

                <div className="text-portfolio-muted/40 text-[11px] mt-1">
                  syncing portfolio data
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Directory header */}

              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[13px] text-portfolio-text">
                    {path === "/portfolio" ? "Home" : path.split("/").pop()}
                  </div>

                  <div className="text-[10px] text-portfolio-muted mt-0.5">
                    {entries.length} items
                  </div>
                </div>

                {selected && (
                  <div className="text-[11px] text-portfolio-red">
                    selected: {selected}
                  </div>
                )}
              </div>

              {/* Files */}

              {entries.length > 0 ? (
                <div
                  className="
                  grid
                  grid-cols-3
                  sm:grid-cols-4
                  md:grid-cols-5
                  lg:grid-cols-6
                  gap-2
                "
                >
                  {entries.map(([name, entry]) => {
                    const isSelected = selected === name;

                    return (
                      <button
                        key={name}
                        onClick={() => setSelected(name)}
                        onDoubleClick={() => handleOpen(name, entry)}
                        className={`
                            group
                            relative
                            flex
                            flex-col
                            items-center
                            gap-2
                            min-w-0
                            p-3
                            rounded-xl
                            border
                            transition-all
                            ${
                              isSelected
                                ? `
                                  border-portfolio-red/50
                                  bg-portfolio-red/5
                                `
                                : `
                                  border-transparent
                                  hover:border-portfolio-border
                                  hover:bg-portfolio-panel
                                `
                            }
                          `}
                      >
                        {/* Icon */}

                        <div
                          className={`
                              w-11
                              h-11
                              rounded-lg
                              border
                              flex
                              items-center
                              justify-center
                              text-[15px]
                              transition-all
                              ${
                                isSelected
                                  ? "border-portfolio-red/40 bg-portfolio-red/10 text-portfolio-red"
                                  : "border-portfolio-border bg-portfolio-panel text-portfolio-muted group-hover:text-portfolio-red group-hover:border-portfolio-red/30"
                              }
                            `}
                        >
                          {getIcon(name, entry.type)}
                        </div>

                        {/* Name */}

                        <span
                          className={`
                              w-full
                              text-[11px]
                              text-center
                              leading-tight
                              break-all
                              ${isSelected ? "text-portfolio-red" : "text-portfolio-text"}
                            `}
                        >
                          {name}
                        </span>

                        {/* Size */}

                        {entry.size && (
                          <span className="text-[10px] text-portfolio-muted">
                            {entry.size}
                          </span>
                        )}

                        {/* Folder indicator */}

                        {entry.type === "dir" && (
                          <span className="absolute top-2 right-2 text-[9px] text-portfolio-red/50">
                            ›
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-portfolio-muted text-xl mb-2">∅</div>

                    <div className="text-[12px] text-portfolio-muted">
                      Empty directory
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ================= STATUS BAR ================= */}

        <div className="shrink-0 border-t border-portfolio-border bg-portfolio-panel px-3 py-1.5 flex items-center gap-3 text-[11px] text-portfolio-muted">
          <span className="text-portfolio-green">●</span>

          <span>{entries.length} items</span>

          <span className="hidden sm:inline">{path}</span>

          <span className="ml-auto">
            {offline ? "api offline" : "portfolio synced"}
          </span>
        </div>
      </main>
    </div>
  );
}
