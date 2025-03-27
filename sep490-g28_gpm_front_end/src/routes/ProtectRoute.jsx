import { Navigate } from "react-router-dom";
import { isValidRole } from "../utils/auth";
import { ADMIN_ROLE } from "../utils/const";
import { routes } from "../config";

// Component để kiểm tra quyền admin và điều hướng
const ProtectedRoute = ({ element: Component, ...rest }) => {
  const hasAdminRole = ADMIN_ROLE.some((role) => isValidRole(role));

  return hasAdminRole ? (
    <Component {...rest} />
  ) : (
    <Navigate to={routes.login} />
  );
};

export default ProtectedRoute;
