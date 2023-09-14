export function attachServerToImageRes(image: string) {
  if (!import.meta.env.VITE_SERVER) throw new Error(`VITE_SERVER missing`);

  return import.meta.env.VITE_SERVER + image;
}

export function mutateImageFromResponse(obj: unknown) {
  if (Array.isArray(obj)) {
    obj.forEach((value, i) => {
      if (typeof value !== "string") {
        mutateImageFromResponse(value);
        return;
      }

      if (value.startsWith("/")) {
        obj[i] = attachServerToImageRes(value);
      }
    });

    return;
  }

  if (obj && typeof obj === "object") {
    for (const key in obj) {
      const value = (obj as any)[key];

      if (typeof value === "string" && value.startsWith("/")) {
        (obj as any)[key] = attachServerToImageRes(value);
      }
    }
  }
}
