export const VITE_SERVER = import.meta.env.VITE_SERVER;
export const VITE_SERVER_GATEWAY = import.meta.env.VITE_SERVER_GATEWAY;

export const VITE_API = VITE_SERVER + VITE_SERVER_GATEWAY;
export const VITE_CHAT_SERVER = VITE_SERVER + "/chat";

export const VITE_GOOGLE_MAP_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
export const VITE_APP_NAME = import.meta.env.VITE_APP_NAME;
export const VITE_PUBLIC_PUSH_NOTI_KEY = import.meta.env.VITE_PUBLIC_PUSH_NOTI_KEY;
