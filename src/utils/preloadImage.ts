import { VITE_SERVER } from "@/constants/env";

type TPreloadImgParams = {
  url?: string;
  onDone?: () => void;
  addServer?: boolean;
};

export function preloadImage(params: TPreloadImgParams = {}) {
  return new Promise<void>((r, rj) => {
    const { url, onDone, addServer } = params;

    if (!url) return r();

    const prefix = addServer ? VITE_SERVER : "";

    const image = new Image();
    image.src = prefix + url;

    image.onload = () => {
      onDone?.();
      r();
    };

    image.onerror = rj;
  });
}
