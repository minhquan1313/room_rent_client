import MyButton from "@/Components/MyButton";
import { GoogleMapContext } from "@/Contexts/GoogleMapProvider";
import { fetcher } from "@/services/fetcher";
import { GoogleClickEvent } from "@/types/GoogleClickEvent";
import { RoomLocationPayload } from "@/types/IRoom";
import { Location3rd, LocationResolve } from "@/types/Location3rd";
import {
  Empty,
  Form,
  Input,
  Select,
  Skeleton,
  Space,
  Switch,
  message,
} from "antd";
import { Coords } from "google-map-react";
import {
  ForwardRefRenderFunction,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import useSWR from "swr";

// interface PriceInputProps {
//   value?: RoomLocationPayload;
//   onChange?: (value: RoomLocationPayload) => void;
// }
const LocationFormInputs_: ForwardRefRenderFunction<RoomLocationPayload> = (
  _p,
  ref,
) => {
  const {
    loadMapTo,
    addMarker,
    clearMarker,
    getAddressFromMarker,
    getCoordsFromAddress,
    getUserCoords,
  } = useContext(GoogleMapContext);
  const [messageApi, contextHolder] = message.useMessage();

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [mk, setMk] = useState<google.maps.Marker>();

  const [coord, setCoords] = useState<Coords>();
  const [detailLocation, setDetailLocation] = useState<string>();

  const [country, setCountry] = useState<string>();
  const [province, setProvince] = useState<string>();
  const [district, setDistrict] = useState<string>();
  const [ward, setWard] = useState<string>();

  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationDenied, setLocationDenied] = useState<boolean>();
  const [allowSpecialFeature, setAllowSpecialFeature] = useState(false);

  const loaded = useRef(false);

  const [thirdCountryCode, setThirdCountryCode] = useState<string>();
  const [thirdProvinceCode, setThirdProvinceCode] = useState<string>();
  const [thirdDistrictCode, setThirdDistrictCode] = useState<string>();
  const [thirdWardCode, setThirdWardCode] = useState<string>();

  const { data: allCountryVn, isValidating: loadingCountryVn } = useSWR<
    Location3rd[]
  >(`/location/countries?all`, fetcher);
  const { data: allProvincesVn, isValidating: loadingProvincesVn } = useSWR<
    Location3rd[]
  >(`/location/provinces?all`, fetcher);
  const { data: allDistrictsVn, isValidating: loadingDistrictsVn } = useSWR<
    Location3rd[]
  >(
    thirdProvinceCode
      ? `/location/districts?all&province=${thirdProvinceCode}`
      : undefined,
    fetcher,
  );
  const { data: allWardsVn, isValidating: loadingWardsVn } = useSWR<
    Location3rd[]
  >(
    thirdDistrictCode
      ? `/location/wards?all&district=${thirdDistrictCode}`
      : undefined,
    fetcher,
  );
  console.log(`🚀 ~ allWardsVn:`, allWardsVn);

  const thirdCountrySelectJsx = useMemo(
    () => (
      <Select
        notFoundContent={
          <Empty
            description="Không có dữ liệu nha"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="m-2"
          />
        }
        onSelect={(e, o) => {
          setCountry(e);
          setThirdCountryCode(o.value as any);
        }}
        value={country}
      >
        {allCountryVn &&
          allCountryVn.map(({ code, name }) => (
            <Select.Option key={code} value={name}>
              {name}
            </Select.Option>
          ))}
      </Select>

      // <Select
      //       options={
      //         allCountryVn &&
      //         allCountryVn.map(({ code, name }) => ({
      //           label: name,
      //           value: code,
      //         }))
      //       }
      //     />
    ),
    [allCountryVn, country],
  );
  const thirdProvinceSelectJsx = useMemo(
    () => (
      <Select
        notFoundContent={
          <Empty
            description="Không có dữ liệu nha"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="m-2"
          />
        }
        onSelect={(e, o) => {
          setProvince(e);
          setThirdProvinceCode(o.value as any);
        }}
        value={province}
      >
        {allProvincesVn &&
          allProvincesVn.map(({ code, name }) => (
            <Select.Option key={code} value={name}>
              {name}
            </Select.Option>
          ))}
      </Select>
      // <Select
      //   notFoundContent={
      //     <Empty
      //       description="Không có dữ liệu nha"
      //       image={Empty.PRESENTED_IMAGE_SIMPLE}
      //       className="m-2"
      //     />
      //   }
      //   onSelect={(e, o) => {
      //     setProvince(o.label);
      //     setThirdProvinceCode(e);
      //   }}
      //   options={
      //     allProvincesVn &&
      //     allProvincesVn.map(({ code, name }) => ({
      //       label: name,
      //       value: code,
      //     }))
      //   }
      // />
    ),
    [allProvincesVn, province],
  );
  const thirdDistrictSelectJsx = useMemo(
    () => (
      <Select
        notFoundContent={
          <Empty
            description="Không có dữ liệu nha"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="m-2"
          />
        }
        onSelect={(e, o) => {
          setDistrict(e);
          setThirdDistrictCode(o.value as any);
        }}
        value={district}
      >
        {allDistrictsVn &&
          allDistrictsVn.map(({ code, name }) => (
            <Select.Option key={code} value={name}>
              {name}
            </Select.Option>
          ))}
      </Select>
      // <Select
      //   notFoundContent={
      //     <Empty
      //       description="Không có dữ liệu nha"
      //       image={Empty.PRESENTED_IMAGE_SIMPLE}
      //       className="m-2"
      //     />
      //   }
      //   onSelect={(e, o) => {
      //     setDistrict(o.label);
      //     setThirdDistrictCode(e);
      //   }}
      //   options={
      //     allDistrictsVn &&
      //     allDistrictsVn.map(({ code, name }) => ({
      //       label: name,
      //       value: code,
      //     }))
      //   }
      // />
    ),
    [allDistrictsVn, district],
  );
  const thirdWardSelectJsx = useMemo(
    () => (
      <Select
        notFoundContent={
          <Empty
            description="Không có dữ liệu nha"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="m-2"
          />
        }
        onSelect={(e, o) => {
          setWard(e);
          setThirdWardCode(o.value as any);
        }}
        defaultValue={ward}
      >
        {allWardsVn &&
          allWardsVn.map(({ code, name }) => (
            <Select.Option key={code} value={name}>
              {name}
            </Select.Option>
          ))}
      </Select>
      // <Select
      //   notFoundContent={
      //     <Empty
      //       description="Không có dữ liệu nha"
      //       image={Empty.PRESENTED_IMAGE_SIMPLE}
      //       className="m-2"
      //     />
      //   }
      //   onSelect={(e, o) => {
      //     setWard(o.label);
      //     // setThirdWardCode(e);
      //   }}
      //   options={
      //     allWardsVn &&
      //     allWardsVn.map(({ code, name }) => ({
      //       label: name,
      //       value: code,
      //     }))
      //   }
      // />
    ),
    [allWardsVn, ward],
  );

  async function onCoordChange() {
    if (!coord || !map) return;

    mk && clearMarker(mk);

    addMarker(map, coord).then((mk) => {
      if (!mk) return;
      setMk(mk);

      map.setCenter(coord);

      const z = map.getZoom();
      z && z < 18 && map.setZoom(18);
    });

    // resolveLocationFromGG(undefined, `Tiền Giang`, "Mỹ Tho");
    if (!allowSpecialFeature) return;

    let geoLocation;
    try {
      geoLocation = await getAddressFromMarker(coord);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Có lỗi khi lấy thông tin địa chỉ",
      });
    }

    if (geoLocation) {
      const str = geoLocation.formatted_address.split(", ");

      // resolve

      const country = str.pop();
      setCountry(country);

      const province = str.pop();
      setProvince(province);

      const district = str.pop();
      setDistrict(district);

      const ward = str.pop();
      setWard(ward);

      const detailLocation = str.pop();
      setDetailLocation(detailLocation);

      resolveLocationFromGG(country, province, district, ward);
    }
  }

  async function resolveLocationFromGG(
    country?: string,
    province?: string,
    district?: string,
    ward?: string,
  ) {
    const params = new URLSearchParams();
    province && params.append("province", province);
    district && params.append("district", district);
    ward && params.append("ward", ward);

    const url = `/location/resolve?${params.toString()}`;

    console.log(`🚀 ~ resolveLocationFromGG ~ url:`, url);

    const data = await fetcher.get<never, LocationResolve>(url);
    setThirdProvinceCode(data.province ? data.province.code : undefined);
    setProvince(() => (data.province ? data.province.name : undefined));

    setThirdDistrictCode(data.district ? data.district.code : undefined);
    setDistrict(() => (data.district ? data.district.name : undefined));

    setThirdWardCode(data.ward ? data.ward.code : undefined);
    setWard(() => (data.ward ? data.ward.name : undefined));

    console.log(`🚀 ~ resolveLocationFromGG ~ data:`, data);
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

    // getCoordsFromAddress("Phạm Văn Chiêu").catch((error) => {
    //   messageApi.open({
    //     type: "error",
    //     content: error,
    //   });
    // });

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
    const obj: RoomLocationPayload = {
      lat: coord?.lat ?? 0,
      long: coord?.lng ?? 0,
      country: country ?? "",
      province: province ?? "",
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
            {locationDenied == false
              ? "Bạn đã cấm"
              : locationDenied == true
              ? "Bạn đã cấm"
              : "Lấy vị trí hiện tại"}
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
        {loadingCountryVn ? (
          <Skeleton.Input active block />
        ) : (
          thirdCountrySelectJsx
        )}

        {/* <Input
          onChange={(e) => {
            setCountry(e.target.value);
          }}
          value={country}
          // disabled={!!country}
          // disabled
        /> */}
      </Form.Item>

      <Form.Item<RoomLocationPayload> label="Tỉnh">
        {loadingProvincesVn ? (
          <Skeleton.Input active block />
        ) : (
          thirdProvinceSelectJsx
        )}

        {/* <Input
          onChange={(e) => {
            setProvince(e.target.value);
          }}
          value={province}
          // disabled={!!province}
        /> */}
      </Form.Item>

      <Form.Item<RoomLocationPayload> label="Quận / Huyện">
        {loadingDistrictsVn ? (
          <Skeleton.Input active block />
        ) : (
          thirdDistrictSelectJsx
        )}
        {/* <Input
          onChange={(e) => {
            setDistrict(e.target.value);
          }}
          value={district}
          // disabled={!!district}
        /> */}
      </Form.Item>

      <Form.Item<RoomLocationPayload> label="Xã / Phường">
        {loadingWardsVn ? <Skeleton.Input active block /> : thirdWardSelectJsx}
        {/* <Input
          onChange={(e) => {
            setWard(e.target.value);
          }}
          value={ward}
          // disabled={!!ward}
        /> */}
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
