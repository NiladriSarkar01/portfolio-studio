import { useCallback, useEffect, useState } from "react";

/**
 * Load data from the backend.
 *
 *   const { data, loading, error, reload } = useApi(getProjects);
 *
 * There is deliberately NO fallback/offline copy of the data in the frontend:
 * the backend is the single source of truth. If the request fails, `error` is set
 * and the caller should render <ApiError onRetry={reload} />.
 *
 * `fetcher` must be a stable function (e.g. the ones exported from services/api.js).
 */
export default function useApi(fetcher) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetcher()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));

    return () => {
      alive = false;
    };
  }, [fetcher, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, reload };
}
