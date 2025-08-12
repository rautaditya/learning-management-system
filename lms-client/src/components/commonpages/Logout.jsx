import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let redirectTo = "/";

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.role;

        // Determine where to redirect after logout
        if (role === "admin") {
          redirectTo = "/admin/login";
        } else if (role === "superadmin") {
          redirectTo = "/superadmin/login";
        } else if (role === "student") {
          redirectTo = "/student/login";
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    // Clear token and redirect
    localStorage.removeItem("token");
    navigate(redirectTo, { replace: true });
  }, [navigate]);

  return <p>Logging out...</p>;
};

export
default Logout;