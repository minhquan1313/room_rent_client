import { Coords } from "google-map-react";
import logger from "./logger";

// const delay = 5000;

export function getUserCoords() {
  return new Promise<Coords | "PERMISSION_DENIED" | "POSITION_UNAVAILABLE" | "TIMEOUT">((r) => {
    logger(`getting coords`);

    navigator.geolocation.getCurrentPosition(
      function (success) {
        const { latitude, longitude } = success.coords;
        const obj = { lat: latitude, lng: longitude };

        logger(`🚀 ~ getUserCoords ~ obj:`, obj);
        return r(obj);
      },
      (error) => {
        switch (error.code) {
          case 1:
            return r("PERMISSION_DENIED");

          case 2:
            return r("POSITION_UNAVAILABLE");

          default:
            r("TIMEOUT");
            break;
        }
      },
      {
        enableHighAccuracy: true,
      },
    );
  });
}
