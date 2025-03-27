import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_API_URL, routes } from '../config';

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: BASE_API_URL, // Base URL for your API
  // timeout: 10000, // Request timeout in milliseconds
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any custom headers or configurations before the request is sent
    const token = localStorage.getItem('token'); // Example: Adding a token
    if (token !== null && token !== "null") {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    const currDate = new Date();
    const endRefreshDate = new Date(localStorage.getItem("refreshExpire"));


    const onHandleRefreshDateExpired = () => {
      if (currDate > endRefreshDate) {
        return true;
      } else {
        return false;
      }
    };

    const refreshToken = localStorage.getItem("refreshToken");
    if (error.response && error.response.status === 401) {
      if (!onHandleRefreshDateExpired()) {
        return axios
          .post(BASE_API_URL + `/auth/refresh-token`, {
            token: refreshToken,
          })
          .then(
            (response) => {
              console.log(response);
              if (response.status === 200) {
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("refreshToken", response.data.data.refresh_token);
                localStorage.setItem("expire", response.data.data.expiry_time);
                localStorage.setItem("refreshExpire", response.data.data.refresh_expiry_time);

                // Cập nhật token mới vào config headers
                error.config.headers['Authorization'] = `Bearer ${response.data.data.token}`;
                // Continue the promise chain with updated config
                return axiosInstance(error.config);
              }
            },
            (error) => {
              // Handle the error here
              // if (error.response) {
              //   console.log("Response error:", error.response.status);
              // }
              // toast.warning("Phiên đăng nhập đã hết hạn!");
              // localStorage.clear();
              // window.location.href = routes.login;
              console.log("fail");
              return Promise.reject(error);
            }
          );
      } else {
        toast.warning("Phiên đăng nhập đã hết hạn!");
        // console.log("refresh token expired");
        // console.log(endRefreshDate);
        localStorage.clear();
        window.location.href = routes.login;
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
