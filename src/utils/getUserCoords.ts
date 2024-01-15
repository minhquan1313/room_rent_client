import { Coords } from "google-map-react";
import logger from "./logger";

export function getUserCoords() {
  // d: {
  //   watch?: (newCoords: Coords) => void;
  // } = {},
  return new Promise<Coords | null | undefined>((r) => {
    logger(`getting coords`);

    const to = setTimeout(() => {
      r(undefined);
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      function (success) {
        const { latitude, longitude } = success.coords;
        const obj = { lat: latitude, lng: longitude };

        r(obj);

        // if (d.watch) {
        //   const watchId = navigator.geolocation.watchPosition(
        //     (pos) => {
        //       const { latitude, longitude } = pos.coords;
        //       d.watch && d.watch({ lat: latitude, lng: longitude });
        //     },
        //     (err) => {
        //       logger(`🚀 ~ getUserCoords~watch ~ err:`, err);

        //       navigator.geolocation.clearWatch(watchId);
        //     },
        //   );
        // }

        logger(`🚀 ~ getUserCoords ~ obj:`, obj);
      },
      (error) => {
        if (error.code === 1) r(null);
        else r(undefined);
      },
    );
  });
}
