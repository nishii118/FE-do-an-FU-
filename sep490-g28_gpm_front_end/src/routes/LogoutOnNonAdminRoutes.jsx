import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ADMIN_ROLE } from "../utils/const";
import useUserStore from "../store/useUserStore";

const LogoutOnNonAdminRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUserStore();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    // Kiểm tra nếu vai trò thuộc ADMIN_ROLE và URL không phải /admin
    if (
      ADMIN_ROLE.includes(userRole) &&
      !location.pathname.startsWith("/admin")
    ) {
      // Xóa token và vai trò khỏi localStorage
      logout();
      // Chuyển hướng về trang đăng nhập hoặc trang chủ
      navigate("/");
    }
  }, [location.pathname, navigate]);

  return null;
};

export default LogoutOnNonAdminRoutes;
