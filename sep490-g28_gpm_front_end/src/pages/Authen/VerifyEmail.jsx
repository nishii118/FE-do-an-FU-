import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { routes } from "../../config";
import useUserStore from "../../store/useUserStore";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const location = useLocation();
  const navigate = useNavigate();
  const { email, fullname, password, confirmPassword } = location.state || {};
  const { register, sendOtp } = useUserStore();

  useEffect(() => {
    let interval;
    if (isButtonDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsButtonDisabled(false);
            setTimer(60);
            return prevTimer;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isButtonDisabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await register({
      email,
      fullname,
      password,
      confirmPassword,
      otp,
    });

    if (res && res.status === 200) {
      toast.success("Bạn đã đăng ký thành công");
      navigate(routes.login);
    }

    if (res.status > 300) {
      toast.error(res.data.error.message);
    }
  };

  const handleResendOtp = async () => {
    setIsButtonDisabled(true);
    // await sendOtp(email)
    //   .then((res) => {
    //     toast.success("Mã OTP đã được gửi đến email của bạn");
    //   })
    //   .catch((error) => {
    //     toast.error("Error");
    //   });
    const res = await sendOtp(email);
    console.log(res);

    if (res && res.status === 200) {
      toast.success("Mã OTP đã được gửi đến email của bạn");
    }

    if (res.status > 300) {
      console.log(res.data.error.message);
      toast.error(res.data.error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          XÁC MINH TÀI KHOẢN
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="my-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="otp"
            >
              OTP
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="otp"
              type="text"
              placeholder="Mã xác nhận"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div className="">
            <button
              className="bg-primary hover:bg-orange-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              XÁC NHẬN
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <button
            className="text-blue-500 hover:text-blue-700 text-sm"
            onClick={handleResendOtp}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? `Gửi lại OTP sau ${timer} giây` : "Gửi lại OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
