import { useCallback, useEffect, useRef, useState } from "react";

import useDesktop from "../../hooks/useDesktop";

import TopPanel from "../TopPanel/TopPanel";
import Taskbar from "../Taskbar/Taskbar";
import DesktopIcons from "./DesktopIcons";
import AppWindow from "../Window/AppWindow";

import { WINDOW_DEFAULTS } from "./windowDefs";
import { registerOpenWindow } from "../../utils/desktopController";

const MOBILE_BREAKPOINT = 768;
const WORKSPACE_PADDING = 32;

export default function Desktop() {
  const desk = useDesktop();

  const desktopRef = useRef(null);
  const openWindowRef = useRef(null);

  const [workspaceSize, setWorkspaceSize] = useState({
    width: 1024,
    height: 600,
  });

  const measureWorkspace = useCallback(() => {
    const element = desktopRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();

    const next = {
      width: Math.max(1, Math.floor(rect.width)),
      height: Math.max(1, Math.floor(rect.height)),
    };

    setWorkspaceSize((prev) => {
      if (prev.width === next.width && prev.height === next.height) {
        return prev;
      }

      return next;
    });
  }, []);

  // Measure the actual desktop workspace.
  useEffect(() => {
    const element = desktopRef.current;

    if (!element) return;

    measureWorkspace();

    let observer;

    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measureWorkspace);
      observer.observe(element);
    }

    window.addEventListener("resize", measureWorkspace);
    window.addEventListener("orientationchange", measureWorkspace);
    window.visualViewport?.addEventListener("resize", measureWorkspace);

    return () => {
      observer?.disconnect();

      window.removeEventListener("resize", measureWorkspace);
      window.removeEventListener("orientationchange", measureWorkspace);
      window.visualViewport?.removeEventListener("resize", measureWorkspace);
    };
  }, [measureWorkspace]);

  const handleContextMenu = useCallback((event) => {
    if (event.target.closest(".app-window")) return;

    event.preventDefault();
  }, []);

  const isMobile = workspaceSize.width < MOBILE_BREAKPOINT;

  const availableWidth = Math.max(
    1,
    workspaceSize.width - (isMobile ? 0 : WORKSPACE_PADDING),
  );

  const availableHeight = Math.max(
    1,
    workspaceSize.height - (isMobile ? 0 : WORKSPACE_PADDING),
  );

  const openWindow = useCallback(
    (id) => {
      const cfg = WINDOW_DEFAULTS[id];

      if (!cfg) {
        desk.openWindow(id);
        return;
      }

      const isTablet =
        workspaceSize.width >= MOBILE_BREAKPOINT && workspaceSize.width < 1024;
      const maxWidth = Math.min(
        cfg.w,
        availableWidth,
        workspaceSize.width * (isTablet ? 0.94 : 0.88),
      );
      const maxHeight = Math.min(
        cfg.h,
        availableHeight,
        workspaceSize.height * (isTablet ? 0.9 : 0.88),
      );
      const maxX = Math.max(0, workspaceSize.width - maxWidth);
      const maxY = Math.max(0, workspaceSize.height - maxHeight);

      const randomPosition = {
        x: isMobile ? 0 : Math.round(Math.random() * maxX),
        y: isMobile ? 0 : Math.round(Math.random() * maxY),
      };

      desk.openWindow(id, randomPosition);
    },
    [availableHeight, availableWidth, desk.openWindow, isMobile, workspaceSize],
  );

  openWindowRef.current = openWindow;

  useEffect(() => {
    registerOpenWindow(openWindow);
  }, [openWindow]);

  // Auto-open about and terminal on first load.
  useEffect(() => {
    const aboutTimer = window.setTimeout(() => {
      openWindowRef.current?.("about");
    }, 400);

    const terminalTimer = window.setTimeout(() => {
      openWindowRef.current?.("terminal");
    }, 900);

    return () => {
      window.clearTimeout(aboutTimer);
      window.clearTimeout(terminalTimer);
    };
  }, []);

  return (
    <div
      className="
        relative flex h-full w-full min-h-0 min-w-0 flex-col
        overflow-hidden select-none
        bg-[#f4ede3] text-[#35271f]
      "
      onContextMenu={handleContextMenu}
    >
      {/* Coffee-toned wallpaper with warm, abstract bean-like shapes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundColor: "#efe3d2",
          backgroundImage: [
            "radial-gradient(ellipse at 88% 68%, rgba(177, 122, 69, 0.18) 0 48px, transparent 50px)",
            "radial-gradient(ellipse at 88% 68%, transparent 0 70px, rgba(115, 81, 59, 0.14) 71px 73px, transparent 74px)",
            "radial-gradient(ellipse at 100% 100%, rgba(217, 183, 130, 0.3) 0, rgba(217, 183, 130, 0.16) 14%, transparent 14.3%)",
            "radial-gradient(ellipse at 0% 100%, rgba(139, 94, 60, 0.11) 0, rgba(139, 94, 60, 0.06) 14%, transparent 14.3%)",
            "linear-gradient(rgba(83, 59, 43, 0.025) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(83, 59, 43, 0.025) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "auto, auto, auto, auto, 64px 64px, 64px 64px",
        }}
      />

      {/* Top panel */}
      <div className="relative z-[1000] shrink-0">
        <TopPanel onOpenApp={openWindow} />
      </div>

      {/* Desktop workspace */}
      <main
        ref={desktopRef}
        className="
          relative z-10 flex-1 min-h-0 min-w-0
          overflow-hidden
        "
      >
        {/* Desktop icons */}
        <div className="absolute w-full inset-0 z-0 min-h-0 min-w-0">
          <DesktopIcons
            onOpen={openWindow}
            openIds={desk.openIds}
            compact={workspaceSize.height < 560}
          />
        </div>

        {/* Application windows */}
        {desk.openIds.map((id) => {
          const win = desk.windows[id];
          const cfg = WINDOW_DEFAULTS[id];

          if (!win || win.minimized || !cfg?.app) {
            return null;
          }

          const AppContent = cfg.app;

          const width = Math.min(cfg.w, availableWidth);

          const height = Math.min(cfg.h, availableHeight);

          const defaultPosition = win.position || { x: 0, y: 0 };

          return (
            <AppWindow
              key={id}
              id={id}
              title={cfg.title}
              icon={cfg.icon}
              defaultSize={{
                width,
                height,
              }}
              defaultPosition={defaultPosition}
              zIndex={desk.getZIndex(id)}
              focused={desk.isFocused(id)}
              maximized={win.maximized}
              onFocus={() => desk.focusWindow(id)}
              onClose={() => desk.closeWindow(id)}
              onMinimize={() => desk.minimizeWindow(id)}
              onMaximize={() => {
                if (!isMobile) {
                  desk.toggleMaximize(id);
                }
              }}
              titleBarColor={cfg.titleBarColor}
            >
              <AppContent onOpenApp={openWindow} />
            </AppWindow>
          );
        })}
      </main>

      {/* Bottom taskbar */}
      <div
        className="
          relative z-[1000] shrink-0
          border-t-2 border-dashed border-[#d0bca4]
          bg-[#fbf7f0]/90
        "
      >
        <Taskbar
          openIds={desk.openIds}
          windows={desk.windows}
          focusedId={desk.focusedId}
          onOpenApp={openWindow}
          onFocus={desk.focusWindow}
          onMinimize={desk.minimizeWindow}
        />
      </div>
    </div>
  );
}
