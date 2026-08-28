import { create } from "zustand";

/**
 * Reads the saved login out of localStorage when the app first loads.
 *
 * This runs once, when the store is created. Without it the app would forget
 * who you are every time you refresh the page — the token would still be in
 * localStorage, but the store would start empty and the route guard would
 * bounce you back to the login screen.
 */
const readSavedAuth = () => {
  try {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");

    if (!token || !rawUser) {
      return { user: null, token: null };
    }

    return { user: JSON.parse(rawUser), token };
  } catch {
    // Corrupted localStorage (hand-edited, or a half-written value).
    // Treat it as logged out rather than crashing the whole app on startup.
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return { user: null, token: null };
  }
};

const useAuthStore = create((set) => ({
  ...readSavedAuth(),

  login: (user, token) => {
    console.log("MY AUTH TOKEN:", token);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({ user, token });
},

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({ user: null, token: null });
  },
}));

export default useAuthStore;
