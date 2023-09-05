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
      "Content-Type": "application/json",
    },
  }) as never;

  i.update = function ({ token }) {
    if (token) fetcher.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else if (token == null) delete fetcher.defaults.headers.common["Authorization"];
  };

  const token = localStorage.getItem("token");
  if (token) i.update({ token });

  i.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (error) {
      console.log(`🚀 ~ file: fetcher.ts:31 ~ error:`, error);

      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );

  return i;
})();

//
// export default async function fetcher(url: string) {
//   const res = await fetch(API + url);

//   const data = await res.json();

//   return data;
// }
// export function fetcherFake(ms: number) {
//   return function (url: string) {
//     return new Promise((rs) => {
//       setTimeout(() => {
//         rs(url);
//       }, ms);
//     });
//   };
// }
// export const fetcherPost = (obj: object) => async (url: string) => {
//   const res = await fetch(API + url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(obj),
//   });

//   const data = await res.json();

//   return data;
// };
// export const fetcherPatch = (obj: object) => async (url: string) => {
//   const res = await fetch(API + url, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(obj),
//   });
//   const data = await res.json();

//   return data;
// };

// export async function fetcherDelete(url: string) {
//   const res = await fetch(API + url, {
//     method: "DELETE",
//   });
//   const data = await res.json();

//   return data;
// }
