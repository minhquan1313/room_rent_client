import logger from "./logger";

type ValueCallback = (value: string) => string;

export function recursiveModifyResponse<T>(
  obj: T,
  targetKeys: string[],
  newValueCallback: ValueCallback,
): T {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = recursiveModifyResponse(obj[i], targetKeys, newValueCallback);
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (targetKeys.includes(key)) {
        (obj as any)[key] = newValueCallback((obj as any)[key]);
      } else {
        obj[key] = recursiveModifyResponse(
          obj[key],
          targetKeys,
          newValueCallback,
        );
      }
    }
  }
  return obj;
}

const data = {
  name: "John",
  image: "image_url",
  nested: {
    key: "value",
    items: [
      { name: "Alice", image: "image1" },
      { name: "Bob", image: "image2" },
    ],
  },
};

const targetKeys = ["image"];

const newValueCallback: ValueCallback = (value) => `new_${value}`;

export const modifiedData = recursiveModifyResponse(
  data,
  targetKeys,
  newValueCallback,
);
logger(`🚀 ~ modifiedData:`, modifiedData);
