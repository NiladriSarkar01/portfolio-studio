let openWindowFn = null;

export function registerOpenWindow(fn) {
  openWindowFn = fn;
}

export const openApp = (app, desk) => {
  const openWindow = desk?.openWindow || openWindowFn;

  if (!openWindow) {
    console.warn("Desktop is not initialized.");
    return;
  }

  openWindow(app);
};
