import { Coords } from "google-map-react";
import logger from "./logger";

export function getUserCoords() {
  return new Promise<Coords | null | undefined>((r) => {
    logger(`getting coords`);

    const to = setTimeout(() => {
      r(undefined);
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      function (success) {
        const { latitude, longitude } = success.coords;
        const obj = { lat: latitude, lng: longitude };

        clearTimeout(to);

        logger(`🚀 ~ getUserCoords ~ obj:`, obj);
        return r(obj);
      },
      (error) => {
        if (error.code === 1) r(null);
        else r(undefined);
      },
    );
  });
}
