import { useCallback, useEffect, useRef, useState } from "react";

import api from "../services/api";

/**
 * Fetches from the API and tracks loading and error state.
 *
 * Deliberately small and dependency-free. The project has no data-fetching
 * library on this branch, and adding one mid-consolidation would be a decision
 * for the team rather than a side effect of wiring up the first screen.
 * If caching, retries or background refetching are wanted later, this is the
 * single place that changes.
 *
 *     const { data, loading, error, reload } = useApi("/dashboard");
 *
 * Note it uses services/api, the axios instance that attaches the auth token —
 * NOT api/axios, which does not. See S3-9.
 */
export const useApi = (path, { enabled = true } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);

  // Guards against setting state after the component has gone, which happens
  // routinely when a user clicks through screens faster than a request returns.
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!enabled || !path) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(path);

      // The backend is not consistent about its envelope yet: some modules
      // return { success, data }, others { statusCode, data }, and a few
      // return the payload directly. Unwrap whichever arrived.
      const body = response.data;
      const payload = body && typeof body === "object" && "data" in body ? body.data : body;

      if (alive.current) setData(payload);
    } catch (requestError) {
      if (!alive.current) return;

      const message =
        requestError.response?.data?.message ||
        requestError.response?.data?.error ||
        requestError.message ||
        "Could not reach the server";

      setError(message);
    } finally {
      if (alive.current) setLoading(false);
    }
  }, [path, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
};

export default useApi;
