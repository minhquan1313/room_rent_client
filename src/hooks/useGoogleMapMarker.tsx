import { TGeocoderRequest } from "@/types/TGGMapProps";
import { ggMapLanguageMap, ggMapRegionMap } from "@/utils/ggMapRegionMap";
import logger from "@/utils/logger";
import { Coords } from "google-map-react";
import { useEffect, useMemo, useState } from "react";

type TAdvancedMarkerElement = google.maps.MarkerLibrary["AdvancedMarkerElement"];

export interface GeneratedMarker {
  coord: Coords;
  marker: google.maps.marker.AdvancedMarkerElement;
}

export type useGoogleMapMarkerProps = {
  map?: google.maps.Map;
  maps?: typeof google.maps;
};

const geoCodeTypes = ["route", "premise", "point_of_interest"];

const useGoogleMapMarker = (props: useGoogleMapMarkerProps) => {
  const { map, maps } = props;

  const [aMarker, setAME] = useState<TAdvancedMarkerElement>();
  const [geocoder, setG] = useState<google.maps.Geocoder>();

  const fetchMarker = async () => {
    if (!maps) return;
    setG(new maps.Geocoder());

    const { AdvancedMarkerElement } = (await maps.importLibrary("marker")) as google.maps.MarkerLibrary;
    setAME(() => AdvancedMarkerElement);
  };

  const generateTransparentMarker = (coord: Coords): GeneratedMarker | undefined => {
    if (!aMarker) return undefined;

    const transparent = false;

    const div = document.createElement("div");

    div.innerHTML = "";

    const mk = new aMarker({
      map,
      content: transparent ? div : undefined,
      position: coord,
    });

    return {
      coord,
      marker: mk,
    };
  };

  const getAddressFromCoord = (coord: Coords, opts?: TGeocoderRequest) => {
    return new Promise<google.maps.GeocoderResult | null>((r, rj) => {
      if (!geocoder) return rj("Provide maps api!");
      // map?.data.

      // map?.
      geocoder.geocode(
        {
          ...opts,
          location: coord,
          language: ggMapLanguageMap(opts?.language),
          region: ggMapRegionMap(opts?.region),
        },
        function (results, status) {
          if (status === "OK") {
            if (results && results?.[0]) {
              logger(`🚀 ~ results:`, results);

              let locSelected: google.maps.GeocoderResult;
              const filteredLoc = results.find((v) => v.types.some((type) => geoCodeTypes.includes(type)));
              // logger(`🚀 ~ file: useGoogleMapMarker.tsx:64 ~ filteredLoc:`, filteredLoc);

              if (filteredLoc) {
                locSelected = filteredLoc;
              } else {
                locSelected = results.sort((a, b) => b.address_components.length - a.address_components.length)[0];
              }

              logger(`🚀 ~ file: useGoogleMapMarker.tsx:71 ~ locSelected:`, locSelected);

              const address = locSelected.formatted_address;
              logger(`🚀 ~ file: useGoogleMapMarker.tsx:74 ~ address:`, address);

              return r(locSelected);
            } else {
              logger("Không tìm thấy địa chỉ");
              return r(null);
            }
          }

          logger("Lỗi khi lấy địa chỉ: " + status);
          return rj(status);
        },
      );
    });
  };

  const getCoordsFromAddress = (address: string, opts?: TGeocoderRequest) => {
    return new Promise<google.maps.GeocoderResult[]>((r, rj) => {
      if (!geocoder) return rj("Provide maps api!");

      geocoder.geocode(
        {
          ...opts,
          address,
          language: ggMapLanguageMap(opts?.language),
          region: ggMapRegionMap(opts?.region),
        },
        function (results, status) {
          if (status === "OK") {
            if (results?.[0]) {
              return r(results);
            } else {
              logger("Không tìm thấy địa chỉ");
              return r([]);
            }
          }

          logger("Lỗi khi lấy địa chỉ: " + status);
          return rj(status);
        },
      );
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
      getAddressFromCoord,
      getCoordsFromAddress,
    };
  }, [aMarker]);

  return v;
};

export default useGoogleMapMarker;
