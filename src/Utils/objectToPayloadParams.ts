export function objectToPayloadParams(
  obj: Record<string, string | number | (string | number)[]>,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      (obj[key] as string[]).forEach((v) => {
        searchParams.append(`${key}[]`, v);
      });

      continue;
    }
    if (typeof obj[key] !== "string" && typeof obj[key] !== "number") continue;

    searchParams.append(key, String(obj[key]));
  }

  return searchParams;
}

export function formatObject(obj: Record<string, any>) {
  const z: Record<string, string | number> = {};
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null) {
      continue;
    }

    if (typeof obj[key] === "string" && !obj[key].trim()) {
      continue;
    }

    const value = obj[key];

    // if (Array.isArray(value)) {
    //   value = value.join(",");
    // }

    z[key] = value;
  }

  return z;
}
