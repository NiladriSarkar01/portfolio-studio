import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Rnd } from "react-rnd";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

const MIN_WIDTH = 320;
const MIN_HEIGHT = 240;

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), Math.max(min, max));

const getViewportSize = () => ({
  width: typeof window !== "undefined" ? window.innerWidth : 1024,
  height: typeof window !== "undefined" ? window.innerHeight : 768,
});

function Dot({ color, onClick, label, large }) {
  const stop = (e) => e.stopPropagation();

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onMouseDown={stop}
      onTouchStart={stop}
      onDoubleClick={stop}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`
        no-drag shrink-0 rounded-full border border-black/20
        ${color}
        ${large ? "h-4 w-4" : "h-3 w-3"}
        transition-all hover:brightness-125
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-amber-400
      `}
    />
  );
}

function fitGeometry(geometry, workspace) {
  const widthLimit = Math.max(1, workspace.width);
  const heightLimit = Math.max(1, workspace.height);

  const minWidth = Math.min(MIN_WIDTH, widthLimit);
  const minHeight = Math.min(MIN_HEIGHT, heightLimit);

  const width = clamp(geometry.width, minWidth, widthLimit);
  const height = clamp(geometry.height, minHeight, heightLimit);

  return {
    width,
    height,
    x: clamp(geometry.x, 0, Math.max(0, widthLimit - width)),
    y: clamp(geometry.y, 0, Math.max(0, heightLimit - height)),
  };
}

function createInitialGeometry(defaultSize, defaultPosition, workspace) {
  const isTablet =
    workspace.width >= MOBILE_BREAKPOINT && workspace.width < TABLET_BREAKPOINT;

  return fitGeometry(
    {
      width: Math.min(
        defaultSize.width,
        workspace.width * (isTablet ? 0.94 : 0.88),
      ),
      height: Math.min(
        defaultSize.height,
        workspace.height * (isTablet ? 0.9 : 0.88),
      ),
      x: defaultPosition.x,
      y: defaultPosition.y,
    },
    workspace,
  );
}

export default function AppWindow({
  title,
  icon,
  children,
  defaultSize = { width: 900, height: 600 },
  defaultPosition = { x: 80, y: 50 },
  zIndex,
  focused,
  maximized,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  titleBarColor = "bg-portfolio-surface",
}) {
  const workspaceRef = useRef(null);
  const hasInitialized = useRef(false);

  const [workspace, setWorkspace] = useState(getViewportSize);

  const [geometry, setGeometry] = useState(() =>
    createInitialGeometry(defaultSize, defaultPosition, getViewportSize()),
  );

  // Measure the actual parent workspace.
  useEffect(() => {
    const element = workspaceRef.current;

    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();

      if (rect.width <= 0 || rect.height <= 0) return;

      const next = {
        width: Math.floor(rect.width),
        height: Math.floor(rect.height),
      };

      setWorkspace((previous) =>
        previous.width === next.width && previous.height === next.height
          ? previous
          : next,
      );
    };

    measure();

    let observer;

    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      observer.observe(element);
    }

    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    window.visualViewport?.addEventListener("resize", measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, []);

  const isMobile = workspace.width < MOBILE_BREAKPOINT;
  const fullscreen = isMobile || !!maximized;

  // Initialize the saved window geometry once the real workspace is available.
  useEffect(() => {
    if (hasInitialized.current) return;

    if (workspace.width <= 0 || workspace.height <= 0) return;

    hasInitialized.current = true;

    setGeometry(createInitialGeometry(defaultSize, defaultPosition, workspace));
  }, [workspace, defaultSize, defaultPosition]);

  // Keep normal windows within the resized workspace.
  const fittedGeometry = useMemo(
    () => fitGeometry(geometry, workspace),
    [geometry, workspace],
  );

  const displayed = fullscreen
    ? {
        x: 0,
        y: 0,
        width: workspace.width,
        height: workspace.height,
      }
    : fittedGeometry;

  const handleDragStop = useCallback((_event, data) => {
    setGeometry((previous) => ({
      ...previous,
      x: data.x,
      y: data.y,
    }));
  }, []);

  const handleResizeStop = useCallback(
    (_event, _direction, element, _delta, position) => {
      setGeometry({
        width: element.offsetWidth,
        height: element.offsetHeight,
        x: position.x,
        y: position.y,
      });
    },
    [],
  );

  const handleTitleDoubleClick = () => {
    if (!isMobile) onMaximize?.();
  };

  const handleKeyDown = (event) => {
    if (event.altKey && event.key === "Enter" && !isMobile) {
      event.preventDefault();
      onMaximize?.();
    }
  };

  const borderColor = focused ? "border-[#805239]" : "border-[#d0bca4]";

  return (
    <div
      ref={workspaceRef}
      className="absolute inset-0 min-h-0 min-w-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <Rnd
        position={{
          x: displayed.x,
          y: displayed.y,
        }}
        size={{
          width: displayed.width,
          height: displayed.height,
        }}
        minWidth={Math.min(MIN_WIDTH, workspace.width)}
        minHeight={Math.min(MIN_HEIGHT, workspace.height)}
        maxWidth={workspace.width}
        maxHeight={workspace.height}
        disableDragging={fullscreen}
        enableResizing={!fullscreen}
        bounds="parent"
        dragHandleClassName="drag-handle"
        cancel=".no-drag"
        onDragStart={onFocus}
        onResizeStart={onFocus}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        onMouseDown={onFocus}
        onTouchStart={onFocus}
        style={{
          zIndex,
          position: "absolute",
          pointerEvents: "auto",
          touchAction: "auto",
        }}
        className="app-window"
      >
        <div
          role="dialog"
          aria-label={title}
          aria-modal="false"
          onKeyDown={handleKeyDown}
          className={`
            flex h-full w-full min-h-0 min-w-0 flex-col
            overflow-hidden
            border bg-[#fbf7f0]
            ${borderColor}
            ${fullscreen ? "rounded-none" : "rounded-md"}
            shadow-2xl
            animate-fade-in motion-reduce:animate-none
          `}
          style={{
            boxShadow: fullscreen
              ? "none"
              : focused
                ? "0 12px 48px rgba(59,47,53,0.16)"
                : "0 6px 24px rgba(59,47,53,0.12)",
            paddingTop: isMobile ? "env(safe-area-inset-top, 0px)" : undefined,
            paddingBottom: isMobile
              ? "env(safe-area-inset-bottom, 0px)"
              : undefined,
          }}
        >
          {/* Title bar */}
          <div
            onDoubleClick={handleTitleDoubleClick}
            className={`
              drag-handle flex h-10 shrink-0 items-center gap-2
              border-b-2 border-dashed border-[#d0bca4] px-3 select-none
              sm:h-8
              ${titleBarColor === "bg-portfolio-surface" ? "bg-[#d9b782]" : "bg-[#d9b782]"}
              ${fullscreen ? "cursor-default" : "cursor-move"}
            `}
          >
            <div className="flex shrink-0 items-center gap-2 sm:gap-1.5">
              <Dot
                color="bg-red-500"
                label="Close window"
                onClick={onClose}
                large={isMobile}
              />

              <Dot
                color="bg-yellow-400"
                label="Minimize window"
                onClick={onMinimize}
                large={isMobile}
              />

              {!isMobile && (
                <Dot
                  color="bg-green-500"
                  label={maximized ? "Restore window" : "Maximize window"}
                  onClick={onMaximize}
                />
              )}
            </div>

            <div className="pointer-events-none min-w-0 flex-1 truncate text-center text-xs font-bold text-[#5f5145] sm:text-[13px]">
              {icon} {title}
            </div>

            <div
              className={`shrink-0 ${isMobile ? "w-10" : "w-[54px]"}`}
              aria-hidden="true"
            />
          </div>

          {/* Application content */}
          <div
            className="
              flex-1 min-h-0 min-w-0
              overflow-x-hidden overflow-y-auto
              overscroll-contain
            "
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="app-content min-h-full min-w-0 w-full">{children}</div>
          </div>
        </div>
      </Rnd>
    </div>
  );
}
