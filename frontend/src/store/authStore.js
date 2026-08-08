import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,

  login: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      user,
      token,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      user: null,
      token: null,
    });
  },

  initializeAuth: () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      set({
        token,
        user,
      });
    }
  },
}));

export default useAuthStore;