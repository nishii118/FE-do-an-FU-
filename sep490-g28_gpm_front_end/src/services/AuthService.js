import axios from "axios";
import { BASE_API_URL } from "../config";
import useUserStore from "../store/useUserStore";

export const login = async (email, password) => {
  const { setUser } = useUserStore.getState();
  try {
    const response = await axios.post(BASE_API_URL + `/auth/login`, {
      email,
      password,
    });

    const userData = {
      email,
      token: response.data.data.token,
      refreshToken: response.data.data.refresh_token,
      role: response.data.data.role,
      expire: response.data.data.expiry_time,
      refreshExpire: response.data.data.refresh_expiry_time,
      isAuth: true,
      code: response.data.data.code,
      avatar: response.data.data.avatar ?? null
    };

    localStorage.setItem("token", userData.token);
    localStorage.setItem("refreshToken", userData.refreshToken);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("expire", userData.expire);
    localStorage.setItem("refreshExpire", userData.refreshExpire);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("userCode", userData.code);
    localStorage.setItem("avatar", userData.avatar);

    setUser(userData);
  } catch (error) {
    console.error("Error login user:", error);
    throw error;
  }
};

export const register = async ({
  email,
  fullname,
  password,
  confirmPassword,
  otp,
}) => {
  return axios.post(BASE_API_URL + `/auth/register`, {
    email,
    password,
    fullname,
    confirm_password: confirmPassword,
    otp,
  });
};

export const sendOtp = async (email) => {
  return axios.post(BASE_API_URL + `/auth/send-otp`, { email });
  // Return the data property of the response
};

export const forgotPassword = async (email) => {
  try {
    return axios.post(BASE_API_URL + `/auth/forgot-password`, { email });
    // Return the data property of the response
  } catch (error) {
    console.error(error);
    return error; // Re-throw the error to be caught by the caller
  }
};

export const changePassword = async (
  oldPassword,
  newPassword,
  confirmNewPassword
) => {
  try {
    return axios.put(BASE_API_URL + `/auth/change-password`, {
      oldPassword,
      newPassword,
      confirmNewPassword,
    });
    // Return the data property of the response
  } catch (error) {
    console.error(error);
    return error; // Re-throw the error to be caught by the caller
  }
};

export const logout = async () => {
  try {
    return axios.post(BASE_API_URL + `/auth/logout`);
  } catch (error) {
    console.error(error);
    return error; // Re-throw the error to be caught by the caller
  }
};
