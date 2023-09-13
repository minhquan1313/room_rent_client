import MyButton from "@/Components/MyButton";
import { GoogleMapContext } from "@/Contexts/GoogleMapProvider";
import { GoogleClickEvent } from "@/types/GoogleClickEvent";
import { RoomLocationPayload } from "@/types/IRoom";
import { Form, Input, Space, Switch, message } from "antd";
import { Coords } from "google-map-react";
import {
  ForwardRefRenderFunction,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// interface PriceInputProps {
//   value?: RoomLocationPayload;
//   onChange?: (value: RoomLocationPayload) => void;
// }
const LocationFormInputs_: ForwardRefRenderFunction<
  RoomLocationPayload | undefined
> = (_p, ref) => {
  const {
    loadMapTo,
    addMarker,
    clearMarker,
    getAddressFromMarker,
    getUserCoords,
  } = useContext(GoogleMapContext);
  const [messageApi, contextHolder] = message.useMessage();

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [mk, setMk] = useState<google.maps.Marker>();

  const [coord, setCoords] = useState<Coords>();
  const [country, setCountry] = useState<string>();
  const [province, setProvince] = useState<string>();
  const [district, setDistrict] = useState<string>();
  const [ward, setWard] = useState<string>();
  const [detailLocation, setDetailLocation] = useState<string>();

  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  const [allowSpecialFeature, setAllowSpecialFeature] = useState(false);

  const loaded = useRef(false);

  async function onCoordChange() {
    if (!coord || !map) return;
    console.log(`🚀 ~ useEffect ~ coord:`, coord);

    mk && clearMarker(mk);

    addMarker(map, coord).then((mk) => {
      if (!mk) return;
      setMk(mk);

      map.setCenter(coord);

      const z = map.getZoom();
      z && z < 18 && map.setZoom(18);
    });

    if (!allowSpecialFeature) return;

    const geoLocation = await getAddressFromMarker(coord);
    if (geoLocation) {
      const str = geoLocation.formatted_address.split(", ");

      setCountry(str.pop());
      setProvince(str.pop());
      setDistrict(str.pop());
      setWard(str.pop());
      setDetailLocation(str.pop());
    } else {
      messageApi.open({
        type: "error",
        content: "Có lỗi khi lấy thông tin địa chỉ",
      });

      // setAllowSpecialFeature(false);
    }
  }

  useEffect(() => {
    if (!mapRef.current || loaded.current) return;
    (async () => {
      if (!mapRef.current || loaded.current) return;

      // const coords = await getUserCoords();
      const map = await loadMapTo({ ref: mapRef.current });
      setMap(() => map);
    })();
    loaded.current = true;
  }, [loadMapTo]);

  useEffect(() => {
    if (!map) return;
    console.log(`🚀 ~ useEffect ~ map:`, map);

    map.addListener("click", (env: GoogleClickEvent) => {
      setCoords({
        lat: env.latLng.lat(),
        lng: env.latLng.lng(),
      });
    });
  }, [map]);

  useEffect(() => {
    onCoordChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coord]);

  useImperativeHandle(ref, () => {
    if (!coord || !country || !province || !detailLocation) return undefined;

    const obj: RoomLocationPayload = {
      lat: coord.lat,
      long: coord.lat,
      country,
      province,
      district,
      ward,
      detail_location: detailLocation,
    };

    return obj;
  });

  return (
    <div>
      {contextHolder}
      <Form.Item>
        <Space.Compact direction="vertical" block>
          <div ref={mapRef} className="aspect-video w-full rounded-t-lg" />
          <MyButton
            onClick={async () => {
              setGettingLocation(true);
              const coord = await getUserCoords();
              if (!coord) {
                setLocationDenied(true);
              } else {
                setCoords(coord);
              }
              setGettingLocation(false);
            }}
            type="primary"
            loading={gettingLocation}
            disabled={locationDenied}
          >
            {locationDenied ? "Hãy cho phép đi mà" : "Lấy vị trí hiện tại"}
          </MyButton>
        </Space.Compact>
      </Form.Item>

      <Form.Item<RoomLocationPayload>>
        <Space>
          <Switch
            onClick={() => {
              setAllowSpecialFeature(!allowSpecialFeature);
            }}
            checked={allowSpecialFeature}
          />
          {allowSpecialFeature ? "Lấy địa chỉ" : "Lấy địa chỉ"}
        </Space>
      </Form.Item>

      <Form.Item<RoomLocationPayload> label="Vĩ độ">
        <Input value={coord?.lat} disabled />
      </Form.Item>

      <Form.Item<RoomLocationPayload> label="Kinh độ">
        <Input value={coord?.lng} disabled />
      </Form.Item>

      <Form.Item<RoomLocationPayload> label="Quốc gia">
        <Input
          onChange={(e) => {
            setCountry(e.target.value);
          }}
          value={country}
          // disabled={!!country}
          // disabled
        />
      </Form.Item>

      <Form.Item<RoomLocationPayload> label="Tỉnh">
        <Input
          onChange={(e) => {
            setProvince(e.target.value);
          }}
          value={province}
          // disabled={!!province}
        />
      </Form.Item>

      <Form.Item<RoomLocationPayload> label="Quận / Huyện">
        <Input
          onChange={(e) => {
            setDistrict(e.target.value);
          }}
          value={district}
          // disabled={!!district}
        />
      </Form.Item>

      <Form.Item<RoomLocationPayload> label="Xã / Phường">
        <Input
          onChange={(e) => {
            setWard(e.target.value);
          }}
          value={ward}
          // disabled={!!ward}
        />
      </Form.Item>

      <Form.Item<RoomLocationPayload> label="Địa chỉ chi tiết">
        <Input
          onChange={(e) => {
            setDetailLocation(e.target.value);
          }}
          value={detailLocation}
          // disabled={!!detailLocation}
        />
      </Form.Item>
    </div>
  );
};

const LocationFormInputs = forwardRef(LocationFormInputs_);
export default LocationFormInputs;
