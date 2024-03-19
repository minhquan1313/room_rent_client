import Marker from "@/Components/GoogleMap/Marker";
import MyButton from "@/Components/MyButton";
import { ggMapCenter, ggMapOptions, ggMapZoom } from "@/constants/googleMapConstants";
import useGoogleMapMarker from "@/hooks/useGoogleMapMarker";
import { TAvailableLanguage } from "@/translations/i18n";
import { GGMapProps, GGMapPropsOmit, TGeocoderRequest } from "@/types/TGGMapProps";
import { ggMapKeyGenerator } from "@/utils/googleMapUtils";
import logger from "@/utils/logger";
import classNames from "classnames";
import GoogleMapReact, { Coords } from "google-map-react";
import { ReactNode, forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type TAddressParam = {
  coord: Coords;
  address: google.maps.GeocoderResult | null;
};

type TOnAddressesChange = (addresses: TAddressParam[]) => void;

export interface MyGoogleMapProps extends GGMapPropsOmit {
  allowAddPin?: "single" | "multiple";
  pins?: Coords[];
  icon?: ReactNode | ((coord: Coords) => ReactNode);

  disabled?: boolean;
  allowDrag?: boolean;
  allowDeGeocode?: boolean;
  geoCodeLanguage?: TGeocoderRequest["language"];

  zoom?: number | ((current: number) => number | undefined);

  onPinsChange?: (coords: Coords[]) => void;
  onAddressesChange?: TOnAddressesChange;
  onAddressesChangeError?: (error: google.maps.GeocoderStatus) => void;
  onResolvingAddressChange?: (status: boolean) => void;
}

export interface MyGoogleMapRef {
  map?: google.maps.Map;
  maps?: typeof google.maps;
  deGeocode: (pin: Coords, opts?: TGeocoderRequest) => Promise<TAddressParam>;
}

const MyGoogleMap = memo(
  forwardRef<MyGoogleMapRef, MyGoogleMapProps>(function MyGoogleMap(props, ref) {
    const {
      pins: _pins,

      allowAddPin,
      icon,
      disabled,
      allowDrag,
      allowDeGeocode,
      geoCodeLanguage,

      onPinsChange,
      onAddressesChange,
      onAddressesChangeError,
      onResolvingAddressChange,

      googleMapKeys,
      zoom,
      onClick,
      onGoogleApiLoaded,
      ..._props
    } = props as MyGoogleMapProps;

    const { i18n } = useTranslation();

    const [pins, setPins] = useState<Coords[]>([]);

    const pinKeys = useRef<{ [k in string]?: number }>({});

    const [map, setM] = useState<google.maps.Map>();
    const [maps, setMs] = useState<typeof google.maps>();

    const autoID = useRef(1);

    const { getAddressFromCoord } = useGoogleMapMarker({ map, maps });

    const addPinHandle = (coord: Coords) => {
      switch (allowAddPin) {
        case "single":
          autoID.current = 1;
          pinKeys.current = {};
          createPinKey(coord);
          setPins([coord]);

          return;

        case "multiple":
          createPinKey(coord);
          setPins([...pins, coord]);

          return;

        default:
          autoID.current = 1;
          pinKeys.current = {};
          return setPins([]);
      }
    };

    const updatePinHandle = (update: Coords, old: Coords) => {
      // change where it is
      // [1,2,3,change,5,6,7] => [1,2,3,new,5,6,7]
      // const newPins = pins.map((pin) => {
      //   const match = JSON.stringify(pin) === JSON.stringify(old);

      //   if (match) {
      //     return update;
      //   }

      //   return match ? update : pin;
      // });

      // change goes to last
      // [1,2,3,change,5,6,7] => [1,2,3,5,6,7,new]
      const newPins = pins.filter((pin) => JSON.stringify(pin) !== JSON.stringify(old)).concat(update);

      setPins(newPins);
      updatePinKeys({ old, update });
    };

    const createPinKey = (coord: Coords) => {
      const v = autoID.current++;
      const key = JSON.stringify(coord);
      pinKeys.current[key] = v;

      return v;
    };
    const updatePinKeys = ({ old, update }: { old?: Coords; update: Coords }) => {
      const k = pinKeys.current[JSON.stringify(old)];

      if (!k) {
        createPinKey(update);
        return;
      }

      pinKeys.current[JSON.stringify(update)] = k;
    };

    const getKeys = (coord: Coords) => {
      const k = pinKeys.current[JSON.stringify(coord)];

      if (!k) {
        return createPinKey(coord);
      }

      return k;
    };

    const mapClickHandle: GGMapProps["onClick"] = (value) => {
      if (disabled) return;

      onClick?.(value);

      allowAddPin && addPinHandle({ lat: value.lat, lng: value.lng });
    };

    const deGeocode: MyGoogleMapRef["deGeocode"] = async (pin, opts) => {
      return {
        coord: pin,
        address: await getAddressFromCoord(pin, {
          language: geoCodeLanguage,
          ...opts,
        }),
      };
    };

    const onPinsChangeWithAddress = async () => {
      onResolvingAddressChange?.(true);

      try {
        const addresses = await pins.mapAsync((pin) =>
          deGeocode(pin, {
            language: geoCodeLanguage,
          }),
        );

        onAddressesChange?.(addresses);
      } catch (error) {
        logger(new Error(error as any));

        onAddressesChangeError?.(error as google.maps.GeocoderStatus);
      }

      onResolvingAddressChange?.(false);
    };

    const onGoogleApiLoadedHandle: GGMapProps["onGoogleApiLoaded"] = (data) => {
      const { maps, map } = data;

      setM(map);
      setMs(maps);

      onGoogleApiLoaded?.(data);
    };

    function setZoom(zoom: MyGoogleMapProps["zoom"]) {
      if (!map) return;

      let current: number | undefined;
      let z: number | undefined;

      switch (typeof zoom) {
        case "function":
          current = map.getZoom();
          if (typeof current !== "number") return;

          z = zoom(current);
          if (z === undefined) return;

          map.setZoom(z);

          break;

        case "number":
          map.setZoom(zoom);
          break;
      }
    }

    useEffect(() => {
      if (pins.length === 0 && _pins?.length === 0) return;

      zoom && setZoom(zoom);
    }, [JSON.stringify(pins), JSON.stringify(_pins)]);

    useEffect(() => {
      if (pins.length === 0) return;

      onPinsChange?.(pins);

      allowDeGeocode && onPinsChangeWithAddress?.();
    }, [JSON.stringify(pins)]);

    useImperativeHandle(
      ref,
      () => ({
        map,
        maps,
        deGeocode,
      }),
      [getAddressFromCoord, geoCodeLanguage],
    );

    return (
      <div
        className={classNames("relative h-full w-full overflow-hidden transition-all duration-300", {
          "pointer-events-none grayscale": disabled,
        })}
      >
        <div>
          {(_pins || pins).map((pin) => {
            return (
              <Marker key={(() => getKeys(pin))()} onDragEnd={allowDrag ? updatePinHandle : undefined} coord={pin} map={map} maps={maps}>
                {icon ? typeof icon === "function" ? icon(pin) : icon : <MyButton>P</MyButton>}
              </Marker>
            );
          })}
        </div>

        <GoogleMapReact
          bootstrapURLKeys={
            googleMapKeys ||
            ggMapKeyGenerator({
              language: i18n.language as TAvailableLanguage,
            })
          }
          onClick={mapClickHandle}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onGoogleApiLoadedHandle}
          defaultCenter={ggMapCenter}
          defaultZoom={ggMapZoom}
          options={ggMapOptions}
          {..._props}
        />
      </div>
    );
  }),
);

export default MyGoogleMap;
