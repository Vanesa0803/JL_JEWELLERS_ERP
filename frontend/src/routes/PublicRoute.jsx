import { Navigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

/**
 * The opposite of ProtectedRoute — wraps pages that only make sense when you are
 * NOT logged in, such as the login screen.
 *
 * Already logged in  ->  send the user to the dashboard
 * Not logged in      ->  show the page
 *
 * Without this, a logged-in user could navigate back to /login and see the
 * sign-in form again, which is confusing.
 */
const PublicRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
