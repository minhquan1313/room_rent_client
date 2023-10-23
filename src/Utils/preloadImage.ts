import { VITE_SERVER } from "@/constants/env";

export function preloadImage({
  url,
  onDone,
  addServer,
}: {
  url?: string;
  onDone?: () => void;
  addServer?: boolean;
} = {}) {
  return new Promise<void>((r, rj) => {
    if (!url) return r();

    if (addServer) {
      url = VITE_SERVER + url;
    }
    const image = new Image();
    image.src = url;

    image.onload = () => {
      onDone && onDone();
      r();
    };
    image.onerror = () => {
      rj();
    };
  });
}
