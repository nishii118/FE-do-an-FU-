import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { routes } from "../../config";
import useUserStore from "../../store/useUserStore";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(""); // State for error message
  const navigate = useNavigate();
  const { forgotPassword } = useUserStore();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Email không được để trống"); // Set error message
      return;
    }

    setEmailError(""); // Clear error message if validation passes

    const res = await forgotPassword(email);

    if (res && res.status === 200) {
      toast.success("Mật khẩu đã được đặt lại");
      navigate(routes.login); // Navigate to a success page or wherever you want to go
    } else if (res.status > 300) {
      toast.error(res.data.error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          ĐẶT LẠI MẬT KHẨU
        </h2>
        <form>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                emailError ? "border-red-500" : ""
              }`}
              id="email"
              type="email"
              placeholder="Nhập địa chỉ email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>
          <div className="mb-4">
            <button
              className="bg-primary hover:bg-orange-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="button"
              onClick={handleResetPassword}
            >
              Đặt lại mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
