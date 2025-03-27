import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { routes } from "../../config";
import useUserStore from "../../store/useUserStore";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Register() {
  const navigate = useNavigate();
  const { sendOtp, isLoading } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data) => {
    const res = await sendOtp(data.email);

    if (res && res.status === 200) {
      navigate(routes.verifyEmail, { state: { ...data } });
      toast.success("Mã OTP đã được gửi đến email của bạn");
    }

    if (res.status > 300) {
      if (res?.data?.error?.message) {
        toast.error(res.data.error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">ĐĂNG KÝ</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Fullname Field */}
          <div className="my-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fullname"
            >
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.fullname ? "border-red-500" : ""
              }`}
              id="fullname"
              type="text"
              placeholder="Họ và tên"
              {...register("fullname", {
                required: "Họ và tên là bắt buộc",
                maxLength: {
                  value: 100,
                  message: "Họ và tên không được dài quá 100 ký tự",
                },
                pattern: {
                  value: /^[a-zA-ZÀ-ỹ\s]+$/,
                  message: "Họ và tên không được chứa ký tự đặc biệt",
                },
              })}
            />
            {errors.fullname && (
              <div className="text-red-500 text-xs mt-1">
                {errors.fullname.message}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="my-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? "border-red-500" : ""
              }`}
              id="email"
              type="email"
              placeholder="E-mail"
              {...register("email", {
                required: "Email là bắt buộc",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Email không hợp lệ",
                },
              })}
            />
            {errors.email && (
              <div className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="my-6 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? "border-red-500" : ""
              }`}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              {...register("password", {
                required: "Mật khẩu là bắt buộc",
                minLength: {
                  value: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự",
                },
                maxLength: {
                  value: 15,
                  message: "Mật khẩu phải có tối đa 15 ký tự",
                },
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 top-3 right-3 flex items-center justify-center h-full text-gray-500"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            {errors.password && (
              <div className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="my-6 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Xác nhận mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              {...register("confirmPassword", {
                required: "Xác nhận mật khẩu là bắt buộc",
                validate: (value) =>
                  value === document.getElementById("password").value ||
                  "Mật khẩu xác nhận không khớp",
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 top-3 right-3 flex items-center justify-center h-full text-gray-500"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
            {errors.confirmPassword && (
              <div className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="">
            <button
              className="bg-primary hover:bg-orange-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full uppercase"
              type="submit"
              disabled={isLoading}
            >
              Đăng ký
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center mt-4">
            <a
              href={routes.login}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Bạn đã có tài khoản? Quay lại đăng nhập
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
