import Marker from "@/Components/GoogleMap/Marker";
import MyButton from "@/Components/MyButton";
import {
  ggMapCenter,
  ggMapOptions,
  ggMapZoom,
} from "@/constants/googleMapConstants";
import useGoogleMapMarker from "@/hooks/useGoogleMapMarker";
import { TAvailableLanguage } from "@/translations/i18n";
import { GGMapProps, GGMapPropsOmit } from "@/types/TGGMapProps";
import { ggMapKeyGenerator } from "@/utils/googleMapUtils";
import logger from "@/utils/logger";
import { StopOutlined } from "@ant-design/icons";
import { message } from "antd";
import GoogleMapReact, { Coords } from "google-map-react";
import { ReactNode, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type MyGoogleMapProps = GGMapPropsOmit & {
  allowAddPin?: "single" | "multiple";
  pins?: Coords[];
  icon?: ReactNode | ((coord: Coords) => ReactNode);
  onPinsChange?: (coords: Coords[]) => void;

  onAddressesChange?: (
    addresses: {
      coord: Coords;
      address: google.maps.GeocoderResult | null;
    }[],
  ) => void;
  onAddressesChangeError?: (error: google.maps.GeocoderStatus) => void;
  onResolvingAddressChange?: (status: boolean) => void;
};

const MyGoogleMap = memo(function MyGoogleMap(props: MyGoogleMapProps) {
  const {
    pins: _pins,

    allowAddPin,
    icon,
    onPinsChange,

    onAddressesChange,
    onAddressesChangeError,
    onResolvingAddressChange,

    onClick,
    ..._props
  } = props as MyGoogleMapProps;

  const { t, i18n } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const [pins, setPins] = useState<Coords[]>([]);
  const [map, setM] = useState<google.maps.Map>();
  const [maps, setMs] = useState<typeof google.maps>();
  const { getAddressFromMarker } = useGoogleMapMarker({ map, maps });

  const addPinHandle = ({ lat, lng }: Coords) => {
    setPins((old) => {
      switch (allowAddPin) {
        case "single":
          return [{ lat, lng }];

        case "multiple":
          return [...old, { lat, lng }];

        default:
          return [];
      }
    });
  };

  const mapClickHandle: GGMapProps["onClick"] = (value) => {
    onClick?.(value);

    allowAddPin && addPinHandle(value);
  };

  const onPinsChangeWithAddress = async () => {
    onResolvingAddressChange?.(true);

    try {
      onPinsChange?.(pins);

      const addresses = await pins.mapAsync(async (pin) => ({
        coord: pin,
        address: await getAddressFromMarker(pin),
      }));

      onAddressesChange?.(addresses);
    } catch (error) {
      logger(new Error(error as any));

      messageApi.open({
        type: "error",
        content:
          error === google.maps.GeocoderStatus.OVER_QUERY_LIMIT
            ? t("Add room page.API ran out of request")
            : t("Add room page.Error getting address!"),
        duration: 30,
        icon: <StopOutlined />,
      });

      onAddressesChangeError?.(error as google.maps.GeocoderStatus);
    }

    onResolvingAddressChange?.(false);
  };

  const onGoogleApiLoadedHandle: GGMapProps["onGoogleApiLoaded"] = ({
    maps,
    map,
  }) => {
    setM(map);
    setMs(maps);
  };

  useEffect(() => {
    if (!onPinsChange || pins.length === 0) return;

    if (onAddressesChange) onPinsChangeWithAddress();
    else onPinsChange(pins);
  }, [pins]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {contextHolder}

      <div>
        {(_pins || pins).map((pin) => (
          <Marker
            key={JSON.stringify(pin)}
            onDrag={logger}
            coord={pin}
            map={map}
            maps={maps}
          >
            {icon ? (
              typeof icon === "function" ? (
                icon(pin)
              ) : (
                icon
              )
            ) : (
              <MyButton>P</MyButton>
            )}
          </Marker>
        ))}
      </div>

      <GoogleMapReact
        bootstrapURLKeys={ggMapKeyGenerator(
          i18n.language as TAvailableLanguage,
        )}
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
});

export default MyGoogleMap;
