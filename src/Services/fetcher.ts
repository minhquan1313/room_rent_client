import { IUser } from "@/types/IUser";
import axios, { AxiosInstance } from "axios";

const API = import.meta.env.VITE_API;
if (!API) throw new Error(`Missing API`);

interface MyAxiosInstance extends AxiosInstance {
  update: (data: { token?: string | null }) => void;
}

export const fetcher = (() => {
  const i: MyAxiosInstance = axios.create({
    baseURL: API,
    headers: {
      // "Content-Type": "application/json",
    },
  }) as never;

  i.interceptors.request.use(
    function (config) {
      // console.log(`🚀 ~ fetcher ~ config:`, config);

      return config;
    },
    function (error) {
      // throw new Error(error);
      return Promise.reject(error);
    },
  );

  i.interceptors.response.use(
    function (response) {
      console.log(`🚀 ~ fetcher ~ response.data:`, response.data);

      const r = response.data as unknown as IUser;

      if (r?.image && r?.username) {
        r.image = import.meta.env.VITE_SERVER + r.image;
      }

      return response.data;
    },
    function (error) {
      console.log(`🚀 ~ fetcher ~ error:`, error);

      throw error;
      // return Promise.reject(error);
    },
  );

  i.update = function ({ token }) {
    if (token)
      this.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else if (token == null)
      delete this.defaults.headers.common["Authorization"];
  };

  const token = localStorage.getItem("token");
  if (token) i.update({ token });

  return i;
})();
