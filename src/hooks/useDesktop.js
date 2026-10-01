import { useState, useCallback, useRef } from "react";
import { WINDOW_DEFAULTS } from "../components/Desktop/windowDefs";

export default function useDesktop() {
  const [windows, setWindows] = useState({}); // id → { minimized, maximized, prevBounds }
  const [focusOrder, setFocus] = useState([]); // most-recent last
  const zBase = useRef(50);

  const getZ = () => ++zBase.current;

  const openWindow = useCallback((id, position) => {
    setWindows((prev) => {
      if (prev[id]) {
        // Already open — unminimize and focus
        return { ...prev, [id]: { ...prev[id], minimized: false } };
      }
      return {
        ...prev,
        [id]: {
          minimized: false,
          maximized: false,
          prevBounds: null,
          position,
        },
      };
    });
    setFocus((prev) => [...prev.filter((i) => i !== id), id]);
  }, []);

  const closeWindow = useCallback((id) => {
    setWindows((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
    setFocus((prev) => prev.filter((i) => i !== id));
  }, []);

  const minimizeWindow = useCallback((id) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], minimized: true } }));
    setFocus((prev) => prev.filter((i) => i !== id));
  }, []);

  const toggleMaximize = useCallback((id) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], maximized: !prev[id].maximized },
    }));
  }, []);

  const focusWindow = useCallback((id) => {
    setWindows((prev) => {
      if (!prev[id]) return prev;

      return {
        ...prev,
        [id]: {
          ...prev[id],
          minimized: false,
        },
      };
    });

    setFocus((prev) => [...prev.filter((i) => i !== id), id]);
  }, []);

  const getZIndex = (id) => {
    const idx = focusOrder.indexOf(id);
    return idx === -1 ? zBase.current : zBase.current + idx;
  };

  const isFocused = (id) => focusOrder[focusOrder.length - 1] === id;
  const isOpen = (id) => !!windows[id];
  const openIds = Object.keys(windows);
  const defaults = (id) => WINDOW_DEFAULTS[id] || WINDOW_DEFAULTS.about;
  const focusedId = focusOrder[focusOrder.length - 1] || null;

  return {
    windows,
    openIds,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    getZIndex,
    isFocused,
    focusedId,
    isOpen,
    defaults,
    getZ,
  };
}
