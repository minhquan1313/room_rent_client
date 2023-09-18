import { Coords } from "google-map-react";

export function getUserCoords() {
  return new Promise<Coords | null>((r) => {
    navigator.geolocation.getCurrentPosition(
      function (success) {
        const { latitude, longitude } = success.coords;
        const obj = { lat: latitude, lng: longitude };

        r(obj);
        console.log(`🚀 ~ getUserCoords ~ obj:`, obj);
      },
      (error) => {
        console.log(`🚀 ~ getUserCoords ~ errorObj:`, error);

        r(null);
      },
    );
  });
}
