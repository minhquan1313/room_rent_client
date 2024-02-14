import {
  ggMapCenter,
  ggMapOptions,
  ggMapZoom,
} from "@/constants/googleMapContants";
import { TAvailableLanguage } from "@/translations/i18n";
import { GGMapProps } from "@/types/TGGMapProps";
import {
  getAddressFromMarker,
  ggMapKeyGenerator,
} from "@/utils/googleMapUtils";
import GoogleMapReact, { Coords } from "google-map-react";
import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type PropsResolveAddressTrue = {
  allowAddPin: "single" | "multiple";
  onPinsChange?: (
    coords: Coords[],
    addresses: google.maps.GeocoderResult[],
  ) => void;
  resolveAddressOnPin: true;
};
type PropsResolveAddressFalse = {
  allowAddPin?: "single" | "multiple";
  onPinsChange?: (coords: Coords[]) => void;
  resolveAddressOnPin?: false;
};
type PropsResolveAddressMapper<T = boolean> =
  T extends PropsResolveAddressTrue["resolveAddressOnPin"]
    ? PropsResolveAddressTrue
    : PropsResolveAddressFalse;

type Props<IsResolve = boolean> = GGMapProps &
  PropsResolveAddressMapper<IsResolve> & {
    //
  };

const MyGoogleMap = memo((props: Props) => {
  const {
    //
    allowAddPin,
    onPinsChange,
    resolveAddressOnPin,

    onClick,
    ...__props
  } = props;

  const { i18n } = useTranslation();

  const [pins, setPins] = useState<Coords[]>([]);

  const geocoder = useRef<google.maps.Geocoder>();

  function addPinHandle({ lat, lng }: GoogleMapReact.ClickEventValue) {
    setPins((old) => [...old, { lat, lng }]);
  }

  const mapClickHandle: GGMapProps["onClick"] = (value) => {
    onClick && onClick(value);

    if (allowAddPin) addPinHandle(value);
  };

  const onGoogleApiLoadedHandle: GGMapProps["onGoogleApiLoaded"] = ({
    maps,
  }) => {
    geocoder.current = new maps.Geocoder();
  };

  useEffect(async () => {
    if (!onPinsChange || !geocoder.current) return;

    if (resolveAddressOnPin) {
      const addresses = await pins.map(
        async (pin) => await getAddressFromMarker(geocoder.current!, pin),
      );

      onPinsChange(pins, addresses);
    }
  }, [pins]);

  return (
    <GoogleMapReact
      bootstrapURLKeys={ggMapKeyGenerator(i18n.language as TAvailableLanguage)}
      defaultCenter={ggMapCenter}
      defaultZoom={ggMapZoom}
      options={ggMapOptions}
      onClick={mapClickHandle}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={onGoogleApiLoadedHandle}
      {...__props}
    ></GoogleMapReact>
  );
});

export default MyGoogleMap;
