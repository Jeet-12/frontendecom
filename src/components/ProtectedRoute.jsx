import { Navigate } from "react-router-dom";

// ProtectedRoute component to guard routes by role
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Fetch user from localStorage

  if (!user) {
    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    // If the role doesn't match, redirect based on user role
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  }

 

  // Allow access if authenticated and role matches
  return children;
};

export { ProtectedRoute };
