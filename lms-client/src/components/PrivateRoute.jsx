import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  let token = null;
  let role = null;

  if (allowedRoles.includes('student')) {
    token = localStorage.getItem('student_token');
    role = localStorage.getItem('student_role');
  } else if (allowedRoles.includes('admin') || allowedRoles.includes('superadmin')) {
    token = localStorage.getItem('admin_token');
    role = localStorage.getItem('admin_role');
  }

  if (!token || !allowedRoles.includes(role)) {
    // Redirect to respective login page
    if (allowedRoles.includes('admin') || allowedRoles.includes('superadmin')) {
      return <Navigate to="/adminsuperadmin/login" replace />;
    }
    if (allowedRoles.includes('student')) {
      return <Navigate to="/student/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
