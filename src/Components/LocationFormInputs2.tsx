import MyButton from "@/Components/MyButton";
import {
  SelectCountry,
  SelectDistrict,
  SelectLocation,
  SelectProvince,
  SelectWard,
} from "@/Components/SelectProvince";
import { GoogleMapContext } from "@/Contexts/GoogleMapProvider";
import { UserLocationContext } from "@/Contexts/UserLocationProvider";
import { locationResolve } from "@/services/locationResolve";
import { GoogleClickEvent } from "@/types/GoogleClickEvent";
import { RoomLocationPayload } from "@/types/IRoom";
import { isProduction } from "@/utils/isProduction";
import { StopOutlined } from "@ant-design/icons";
import { Card, Form, Input, Skeleton, Space, Switch, message } from "antd";
import { Coords } from "google-map-react";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Fields = Partial<RoomLocationPayload>;
export const LocationFormInputs2: FC<{
  value?: Fields | null;

  onChange?(value: Fields): void;
}> = ({ value, onChange }) => {
  console.log(`🚀 ~ value:`, value);
  const {
    loadMapTo,
    addMarker,
    clearMarker,
    getAddressFromMarker,
    // getCoordsFromAddress,
    // placeSearch,
  } = useContext(GoogleMapContext);
  const { locationDenied, refreshCoords } = useContext(UserLocationContext);
  const [messageApi, contextHolder] = message.useMessage();

  const mapRef = useRef<HTMLDivElement>(null);
  // const detailRef = useRef<InputRef>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [mk, setMk] = useState<google.maps.Marker>();

  const [coord, setCoords] = useState<Coords | undefined>(
    value?.lat && value?.long
      ? {
          lat: value.lat,
          lng: value.long,
        }
      : undefined,
  );
  // const [detailLocation, setDetailLocation] = useState<string | undefined>(
  //   value?.detail_location,
  // );

  // const [country, setCountry] = useState<string | undefined>("Việt Nam");
  // const [province, setProvince] = useState<string | undefined>(
  //   location?.province,
  // );

  // const [district, setDistrict] = useState<string | undefined>(
  //   location?.district,
  // );
  // const [ward, setWard] = useState<string | undefined>(location?.ward);

  const [gettingLocation, setGettingLocation] = useState(false);
  // const [locationDenied, setLocationDenied] = useState<boolean>();
  const [allowSpecialFeature, setAllowSpecialFeature] = useState(false);
  const [resolving, setResolving] = useState(false);

  const loaded = useRef(false);

  const [thirdCountryCode, setThirdCountryCode] = useState<string | undefined>(
    "1",
  );
  const [thirdProvinceCode, setThirdProvinceCode] = useState<
    string | undefined
  >();
  const [thirdDistrictCode, setThirdDistrictCode] = useState<
    string | undefined
  >();
  // const [thirdWardCode, setThirdWardCode] = useState<string>();

  // const { data: allCountryVn, isLoading: loadingCountryVn } = useSWR<
  //   Location3rd[]
  // >(`/location/countries-all`, fetcher);
  // const { data: allProvincesVn, isLoading: loadingProvincesVn } = useSWR<
  //   Location3rd[]
  // >(
  //   thirdCountryCode
  //     ? `/location/provinces-all?country=${thirdCountryCode}`
  //     : undefined,
  //   fetcher,
  // );
  // const { data: allDistrictsVn, isLoading: loadingDistrictsVn } = useSWR<
  //   Location3rd[]
  // >(
  //   thirdProvinceCode
  //     ? `/location/districts-all?province=${thirdProvinceCode}`
  //     : undefined,
  //   fetcher,
  // );
  // const { data: allWardsVn, isLoading: loadingWardsVn } = useSWR<Location3rd[]>(
  //   thirdDistrictCode
  //     ? `/location/wards-all?district=${thirdDistrictCode}`
  //     : undefined,
  //   fetcher,
  // );

  const onChangeHandle = useCallback(
    (o: Fields) => {
      onChange &&
        onChange({
          ...value,
          ...o,
        });
    },
    [onChange, value],
  );

  const thirdCountrySelect = useCallback<
    NonNullable<SelectLocation["onSelect"]>
  >(({ code, name }) => {
    // setCountry(name);
    setThirdCountryCode(code);

    // setProvince(undefined);
    setThirdProvinceCode(undefined);

    // setDistrict(undefined);
    setThirdDistrictCode(undefined);

    // setWard(undefined);
    // setThirdWardCode(undefined);

    // setDetailLocation(undefined);

    onChangeHandle({
      country: name,
      province: undefined,
      district: undefined,
      ward: undefined,
      detail_location: undefined,
    });
  }, []);
  const thirdProvinceSelect = useCallback<
    NonNullable<SelectLocation["onSelect"]>
  >(
    ({ code, name }) => {
      // setProvince(name);
      setThirdProvinceCode(code);

      // setDistrict(undefined);
      setThirdDistrictCode(undefined);
      // setWard(undefined);
      // setThirdWardCode(undefined);

      onChangeHandle({
        province: name,
        district: undefined,
        ward: undefined,
      });
    },
    [onChangeHandle],
  );
  const thirdDistrictSelect = useCallback<
    NonNullable<SelectLocation["onSelect"]>
  >(
    ({ code, name }) => {
      // setDistrict(name);
      setThirdDistrictCode(code);

      // setWard(undefined);
      // setThirdWardCode(undefined);

      onChangeHandle({
        district: name,
        ward: undefined,
      });
    },
    [onChangeHandle],
  );
  const thirdWardSelect = useCallback<NonNullable<SelectLocation["onSelect"]>>(
    ({ name }) => {
      onChangeHandle({
        ward: name,
      });

      // setWard(name);
      // setThirdWardCode(code);
    },
    [onChangeHandle],
  );

  const resolveLocationFromGG = async (
    country: string,
    province: string | undefined,
    district: string | undefined,
    ward: string | undefined,
  ) => {
    console.log(`resolveLocationFromGG`);

    setResolving(true);
    const data = await locationResolve("Viet nam", province, district, ward);
    console.log(`🚀 ~ onCoordChange ~ data:`, data);
    Object.keys(data).length;
    console.log(`🚀 ~ Object.keys(data).length:`, Object.keys(data).length);

    if (!Object.keys(data).length) {
      //
      messageApi.open({
        type: "error",
        content: "Vùng không hỗ trợ",
      });
    } else {
      setThirdCountryCode(data.country ? data.country.code : undefined);
      // setCountry(() => (data.country ? data.country.name : undefined));

      setThirdProvinceCode(data.province ? data.province.code : undefined);
      // setProvince(() => (data.province ? data.province.name : undefined));

      setThirdDistrictCode(data.district ? data.district.code : undefined);
      // setDistrict(() => (data.district ? data.district.name : undefined));

      // setThirdWardCode(data.ward ? data.ward.code : undefined);
      // setWard(() => (data.ward ? data.ward.name : undefined));

      onChangeHandle({
        country: data.country?.name,
        province: data.province?.name,
        district: data.district?.name,
        ward: data.ward?.name,
      });
    }
    setResolving(false);
  };

  async function onCoordChange() {
    if (!coord || !map) return;
    mk && clearMarker(mk);

    const mk_ = addMarker(map, coord);
    if (!mk_) return;
    setMk(mk_);
    map.setCenter(coord);

    const z = map.getZoom();
    z && z < 18 && map.setZoom(18);

    if (!allowSpecialFeature) return;
    setAllowSpecialFeature(false);

    let geoLocation;
    setResolving(true);
    try {
      geoLocation = await getAddressFromMarker(coord);
    } catch (error) {
      console.log(`🚀 ~ onCoordChange ~ error:`, error);

      messageApi.open({
        type: "error",
        content:
          error === "OVER_QUERY_LIMIT"
            ? "API hết lượt dùng rồi :>"
            : "Có lỗi khi lấy địa chỉ, mở console",
        duration: 30,
        icon: <StopOutlined />,
      });
    }
    setResolving(false);

    if (geoLocation) {
      const [district, province, country] = geoLocation.address_components
        .slice(-3)
        .map((e) => e.long_name);
      // const [dis, pro, cou] = geoLocation.address_components.slice(-3);
      const str = geoLocation.formatted_address.split(", ").slice(0, -3);
      // const str = geoLocation.formatted_address.split(", ");

      // const country = cou.long_name;
      // const country = str.pop();

      // const province = pro.long_name;
      // const province = str.pop();

      // const district = dis.long_name;
      // const district = str.pop();

      const ward = str.pop();

      const detailLocation = str.join(", ");

      // if (geoLocation.address_components.length >= 5) {
      //   const s = [];
      //   for (const r of geoLocation.address_components) {
      //     if (r.types.includes("political")) break;
      //     s.push(r.long_name);
      //   }
      //   detailLocation = s.join(", ");
      // }

      // setDetailLocation(detailLocation);
      onChangeHandle({ detail_location: detailLocation });

      await resolveLocationFromGG("Viet nam", province, district, ward);
      // const data = await locationResolve("Viet nam", province, district, ward);
      // console.log(`🚀 ~ onCoordChange ~ data:`, data);

      // if (!Object.keys(data).length) {
      //   //
      //   messageApi.open({
      //     type: "error",
      //     content: "Vùng không hỗ trợ",
      //   });
      // } else {
      //   setThirdCountryCode(data.country ? data.country.code : undefined);
      //   setCountry(() => (data.country ? data.country.name : undefined));

      //   setThirdProvinceCode(data.province ? data.province.code : undefined);
      //   setProvince(() => (data.province ? data.province.name : undefined));

      //   setThirdDistrictCode(data.district ? data.district.code : undefined);
      //   setDistrict(() => (data.district ? data.district.name : undefined));

      //   // setThirdWardCode(data.ward ? data.ward.code : undefined);
      //   setWard(() => (data.ward ? data.ward.name : undefined));
      // }

      // resolveLocationFromGG(country, province, district, ward);
      // console.log(`🚀 ~ onCoordChange ~ country, province, district, ward:`, {
      //   country,
      //   province,
      //   district,
      //   ward,
      // });
    }
  }

  useEffect(() => {
    if (!mapRef.current || loaded.current) return;
    (async () => {
      if (!mapRef.current) return;

      const { map } = await loadMapTo({
        ref: mapRef.current,
        // extra: {
        //   autocomplete: {
        //     ref: detailRef.current!.input!,
        //     onChange(places) {
        //       console.log(`🚀 ~ onChange ~ places:`, places);
        //     },
        //   },
        // },
      });
      setMap(() => map);
    })();
    loaded.current = true;
  }, [loadMapTo]);

  useEffect(() => {
    console.log(`🚀 ~ useEffect ~ map:`, map);
    if (!map) return;

    map.addListener("click", (env: GoogleClickEvent) => {
      setCoords({
        lat: env.latLng.lat(),
        lng: env.latLng.lng(),
      });
    });

    console.log(`🚀 ~ useEffect ~ value:`, value);
    if (value) {
      resolveLocationFromGG(
        "Viet nam",
        value.province,
        value.district,
        value.ward,
      );
    }
  }, [map]);

  useEffect(() => {
    onCoordChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coord]);

  return (
    <>
      {contextHolder}
      <Form.Item label="Chọn vị trí" required>
        <Space.Compact direction="vertical" block className="relative">
          <div className="relative">
            <div
              ref={mapRef}
              className="aspect-square w-full rounded-t-lg lg:aspect-[21/9]"
            />
            <Card
              onClick={() => {
                setAllowSpecialFeature(!allowSpecialFeature);
              }}
              size="small"
              className="absolute bottom-4 right-2 cursor-pointer"
            >
              <Space>
                <Switch
                  checked={allowSpecialFeature}
                  disabled={locationDenied}
                />
                {/* {allowSpecialFeature ?  */}
                Lấy địa chỉ
                {/*   : "Lấy địa chỉ"} */}
              </Space>
            </Card>
          </div>
          <MyButton
            onClick={async () => {
              setGettingLocation(true);
              const coord = await refreshCoords();
              if (!coord) {
                // setLocationDenied(true);
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

      {!isProduction && (
        <Form.Item>
          <Space.Compact block>
            {/* <MyButton
              disabled={!country || !province || !district || !ward}
              block
              onClick={() => {
                const addr = toStringLocation({
                  district,
                  province,
                  ward,
                  detail_location: detailLocation,
                });

                // placeSearch()
              }}
            >
              [DEV] Resolve coords
            </MyButton> */}

            <MyButton
              to={`https://www.google.com/maps/place/${encodeURIComponent(
                coord?.lat + "," + coord?.lng,
              )}`}
              disabled={!coord?.lat || !coord?.lng}
              block
            >
              [DEV] Click mở google map
            </MyButton>
          </Space.Compact>
        </Form.Item>
      )}

      <Form.Item<Fields> label="[DEV] Vĩ độ" hidden={isProduction}>
        <Input value={value?.lat} />
      </Form.Item>

      <Form.Item<Fields> label="[DEV] Kinh độ" hidden={isProduction}>
        <Input value={value?.long} />
      </Form.Item>

      <Form.Item<Fields> label="[DEV] Quốc gia" required hidden={isProduction}>
        {resolving ? (
          <Skeleton.Input active block />
        ) : (
          <SelectCountry onSelect={thirdCountrySelect} value={value?.country} />
        )}
      </Form.Item>

      <Form.Item<Fields> label="Tỉnh" required>
        {resolving ? (
          <Skeleton.Input active block />
        ) : (
          <SelectProvince
            onSelect={thirdProvinceSelect}
            value={value?.province}
            code={thirdCountryCode}
          />
        )}
      </Form.Item>

      <Form.Item<Fields> label="Quận / Huyện" required>
        {resolving ? (
          <Skeleton.Input active block />
        ) : (
          <SelectDistrict
            onSelect={thirdDistrictSelect}
            value={value?.district}
            code={thirdProvinceCode}
          />
        )}
      </Form.Item>

      <Form.Item<Fields> label="Xã / Phường">
        {resolving ? (
          <Skeleton.Input active block />
        ) : (
          <SelectWard
            onSelect={thirdWardSelect}
            // value={value?.ward}
            code={thirdDistrictCode}
          />
        )}
      </Form.Item>

      <Form.Item<Fields> label="Địa chỉ chi tiết">
        <Input
          onChange={(e) => {
            onChangeHandle({ detail_location: e.target.value });
          }}
          value={value?.detail_location}
          disabled={resolving}
          maxLength={100}
          showCount
        />
      </Form.Item>
    </>
  );
};
