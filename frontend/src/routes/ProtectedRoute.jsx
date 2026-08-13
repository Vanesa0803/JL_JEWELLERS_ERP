import { Navigate, useLocation } from "react-router-dom";

import useAuthStore from "../store/authStore";

/**
 * Wraps any page that requires you to be logged in.
 *
 * No token in the store  ->  send the user to /login
 * Token present          ->  show the page
 *
 * We remember which page was being asked for in `state.from`, so that after a
 * successful login the user can be sent back where they were heading instead
 * of always landing on the dashboard.
 *
 * NOTE: this is a *frontend* guard only. It stops the screen from rendering; it
 * does not stop anyone calling the API directly. The backend still needs its own
 * check on every route — see S1-3 in REMEDIATION_BACKLOG.md.
 */
const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
