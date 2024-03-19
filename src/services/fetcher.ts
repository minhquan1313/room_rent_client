import { VITE_API } from "@/constants/env";
import axios, { AxiosInstance } from "axios";

if (!VITE_API) throw new Error(`Missing API`);

interface MyAxiosInstance extends AxiosInstance {
  update: (data: { token?: string | null }) => void;
}

export const fetcher = (() => {
  const instance: MyAxiosInstance = axios.create({
    baseURL: VITE_API,
    headers: {
      // "Content-Type": "application/json",
    },
  }) as never;

  instance.interceptors.request.use(
    function (config) {
      // if (config.url?.startsWith("/chat"))
      //   logger(`🚀 ~ fetcher ~ config:`, config);

      return config;
    },
    function (error) {
      // throw new Error(error);
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    function (response) {
      // logger(`🚀 ~ fetcher ~ response.data:`, response.data);

      return response.data;
    },
    function (error) {
      // logger(`🚀 ~ fetcher ~ error:`, error);

      // throw error;

      // if (error?.response?.status !== 304)
      return Promise.reject(error);
    },
  );

  instance.update = function ({ token }) {
    if (token)
      this.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else if (token == null)
      delete this.defaults.headers.common["Authorization"];
  };

  const token = localStorage.getItem("token");
  if (token) instance.update({ token });

  return instance;
})();
