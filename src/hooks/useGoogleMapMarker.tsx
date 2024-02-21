import logger from "@/utils/logger";
import { Coords } from "google-map-react";
import { useEffect, useMemo, useState } from "react";

type TAdvancedMarkerElement =
  google.maps.MarkerLibrary["AdvancedMarkerElement"];

export interface GeneratedMarker {
  coord: Coords;
  marker: google.maps.marker.AdvancedMarkerElement;
}

export type useGoogleMapMarkerProps = {
  map?: google.maps.Map;
  maps?: typeof google.maps;
};

const useGoogleMapMarker = (props: useGoogleMapMarkerProps) => {
  const { map, maps } = props;

  const [aMarker, setAME] = useState<TAdvancedMarkerElement>();
  const [geocoder, setG] = useState<google.maps.Geocoder>();

  const fetchMarker = async () => {
    if (!maps) return;

    const { AdvancedMarkerElement } = (await maps.importLibrary(
      "marker",
    )) as google.maps.MarkerLibrary;

    setAME(() => AdvancedMarkerElement);
    setG(new maps.Geocoder());
  };

  const generateTransparentMarker = (
    coord: Coords,
  ): GeneratedMarker | undefined => {
    if (!aMarker) return undefined;

    const transparent = false;

    const div = document.createElement("div");

    div.innerHTML = "";

    const mk = new aMarker({
      map,
      content: transparent ? div : undefined,
      position: coord,
      zIndex: 1,
    });

    return {
      coord,
      marker: mk,
    };
  };

  const getAddressFromMarker = (coord: Coords) => {
    return new Promise<google.maps.GeocoderResult | null>((r, rj) => {
      if (!geocoder) return r(null);

      geocoder.geocode({ location: coord }, function (results, status) {
        if (status === "OK") {
          if (results && results[0]) {
            logger(`🚀 ~ results:`, results);

            const res = results.sort(
              (a, b) =>
                b.address_components.length - a.address_components.length,
            )[0];
            logger(`🚀 ~ res:`, res);

            const address = res.formatted_address;
            logger(`🚀 ~ address:`, address);

            return r(res);
          } else {
            logger("Không tìm thấy địa chỉ");
            return r(null);
          }
        }

        logger("Lỗi khi lấy địa chỉ: " + status);
        return rj(status);
      });
    });
  };

  const removeMarker = (marker?: GeneratedMarker) => {
    marker && (marker.marker.map = null);
  };

  useEffect(() => {
    fetchMarker();
  }, [maps]);

  const v = useMemo(() => {
    return {
      removeMarker,
      generateTransparentMarker,
      getAddressFromMarker,
    };
  }, [aMarker]);

  return v;
};

export default useGoogleMapMarker;
