import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { routes } from "../../config";
import { login } from "./../../services/AuthService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email.trim(), password);
      toast.success("Đăng nhập thành công");
      
      const role = localStorage.getItem("role");
      if (role !== "ROLE_SYSTEM_USER") {
        navigate(routes.admin);
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Đã có lỗi xảy ra!");
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Đăng Nhập</h2>
        <p className="text-center text-gray-600">
          Đăng nhập vào tài khoản của bạn
        </p>
        <form method="POST" onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              placeholder="user@gmail.com"
              required
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              placeholder="******"
              required
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
          <div className="flex items-center justify-end mb-4">
            {/* <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                name="remember-me"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-gray-700"
              >
                Nhớ tài khoản
              </label>
            </div> */}
            <Link
              to={routes.resetPassword}
              className="text-sm text-indigo-600 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-primary rounded-md hover:hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Đăng Nhập
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            to={routes.register}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Bạn chưa có tài khoản? Đăng ký
          </Link>
        </div>
        <div className="text-center">
          <Link to="/" className="text-blue-500 hover:text-blue-700 text-sm">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
