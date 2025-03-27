import { create } from "zustand";
import {
  register,
  sendOtp,
  forgotPassword,
  changePassword,
  logout,
} from "../services/AuthService.js";

const useUserStore = create((set) => ({
  user: {
    email: "",
    token: "",
    refreshToken: "",
    role: "",
    expire: "",
    refreshExpire: "",
    isAuth: false
  },
  setUser: (userData) => set({ user: userData }),
  clearUser: () =>
    set({
      user: {
        email: "",
        token: "",
        refreshToken: "",
        role: "",
        expire: "",
        refreshExpire: "",
      },
    }),

  role: localStorage.getItem("role"),
  setRole: (role) => {
    set({ role: role });
  },

  avatar: localStorage.getItem("avatar"),
  setAvatar: (newAvatar) => {
    localStorage.setItem("avatar", newAvatar);
    set({ avatar: newAvatar });
  },

  isLoading: false,

  setIsLoading: (loading) => set({ isLoading: loading }),

  register: async (data) => {
    const store = useUserStore.getState();
    try {
      store.setIsLoading(true);
      const response = await register(data);
      return response;
    } catch (error) {
      return error.response;
    } finally {
      store.setIsLoading(false);
    }
  },

  sendOtp: async (email) => {
    try {
      const response = await sendOtp(email);
      return response;
    } catch (error) {
      return error.response;
    }
  },

  forgotPassword: async (email) => {
    const store = useUserStore.getState();
    try {
      store.setIsLoading(true);
      const response = await forgotPassword(email);
      return response;
    } catch (error) {
      return error.response;
    } finally {
      store.setIsLoading(false);
    }
  },

  logout: async () => {
    localStorage.clear();
    set({
      user: {
        email: "",
        token: "",
        refreshToken: "",
        role: "",
        expire: "",
        refreshExpire: "",
        isAuth: false,
      },
      avatar: null,
      role: null
    });
    try {
      const response = await logout();
      console.log(response);
      return response;
    } catch (error) {
      return error.response;
    }
  },

  changePasswordApi: async (oldPassword, newPassword, confirmNewPassword) => {
    const store = useUserStore.getState();
    try {
      store.setIsLoading(true);
      const response = await changePassword(
        oldPassword,
        newPassword,
        confirmNewPassword
      );
      return response;
    } catch (error) {
      return error.response;
    } finally {
      store.setIsLoading(false);
    }
  },
}));

export default useUserStore;
