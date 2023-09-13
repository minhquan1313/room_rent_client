export function preloadImage(url?: string, onDone?: () => void) {
  return new Promise<void>((r, rj) => {
    if (!url) return r();

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
