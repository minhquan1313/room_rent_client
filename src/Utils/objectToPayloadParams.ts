export function objectToPayloadParams(
  obj: Record<string, string | number | (string | number)[]>,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const key in obj) {
    const v = obj[key];
    if (Array.isArray(v)) {
      (v as string[]).forEach((v) => {
        searchParams.append(`${key}[]`, v);
      });

      continue;
    }

    const t = typeof v;
    if (t !== "string" && t !== "number" && t !== "boolean") {
      continue;
    }

    if (t === "boolean" && !v) continue;

    searchParams.append(key, String(v));
  }

  return searchParams;
}

export function formatObject(obj: Record<string, any>) {
  const z: Record<string, string | number> = {};
  for (const key in obj) {
    const value = obj[key];
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" && !value.trim()) {
      continue;
    }

    if (Array.isArray(value) && value.length === 0) {
      continue;
    }

    // if (Array.isArray(value)) {
    //   value = value.join(",");
    // }

    z[key] = value;
  }

  return z;
}
