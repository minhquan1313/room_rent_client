import MyButton from "@/Components/MyButton";
import NotFoundContent from "@/Components/NotFoundContent";
import {
  SelectDistrict,
  SelectProvince,
  SelectWard,
} from "@/Components/SelectProvince";
import { GoogleMapContext } from "@/Contexts/GoogleMapProvider";
import { UserLocationContext } from "@/Contexts/UserLocationProvider";
import { fetcher } from "@/services/fetcher";
import { locationResolve } from "@/services/locationResolve";
import { GoogleClickEvent } from "@/types/GoogleClickEvent";
import { RoomLocationPayload } from "@/types/IRoom";
import { IRoomLocation } from "@/types/IRoomLocation";
import { Location3rd } from "@/types/Location3rd";
import { isProduction } from "@/utils/isProduction";
import logger from "@/utils/logger";
import { searchFilterTextHasLabel } from "@/utils/searchFilterTextHasLabel";
import { StopOutlined } from "@ant-design/icons";
import {
  Card,
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
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

const LocationFormInputs = memo(
  forwardRef<
    RoomLocationPayload | undefined,
    {
      location?: IRoomLocation | null;
    }
  >(({ location }, ref) => {
    const { loadMapTo, addMarker, clearMarker, getAddressFromMarker } =
      useContext(GoogleMapContext);
    const { t } = useTranslation();
    const { t: tApi } = useTranslation("api");

    const { locationDenied, refreshCoords } = useContext(UserLocationContext);
    const [messageApi, contextHolder] = message.useMessage();

    const mapRef = useRef<HTMLDivElement>(null);
    // const detailRef = useRef<InputRef>(null);
    const [map, setMap] = useState<google.maps.Map>();
    const [mk, setMk] = useState<google.maps.Marker>();

    const [coord, setCoords] = useState<Coords | undefined>(
      location
        ? {
            lat: location.lat_long.coordinates[1],
            lng: location.lat_long.coordinates[0],
          }
        : undefined,
    );

    const [detailLocation, setDetailLocation] = useState<string | undefined>(
      location?.detail_location,
    );

    const [country, setCountry] = useState<string | undefined>("Việt Nam");
    const [province, setProvince] = useState<string | undefined>(
      location?.province,
    );

    const [district, setDistrict] = useState<string | undefined>(
      location?.district,
    );
    const [ward, setWard] = useState<string | undefined>(location?.ward);

    const [gettingLocation, setGettingLocation] = useState(false);
    const [allowSpecialFeature, setAllowSpecialFeature] = useState(true);
    const [resolving, setResolving] = useState(false);

    const loaded = useRef(false);

    const [thirdCountryCode, setThirdCountryCode] = useState<
      string | undefined
    >("1");
    const [thirdProvinceCode, setThirdProvinceCode] = useState<
      string | undefined
    >();
    const [thirdDistrictCode, setThirdDistrictCode] = useState<
      string | undefined
    >();

    const { data: allCountryVn, isLoading: loadingCountryVn } = useSWR<
      Location3rd[]
    >(`/location/countries-all`, fetcher);

    const thirdCountrySelect = useCallback<SelectOptionProps["onSelect"]>(
      ({ code, name }) => {
        setCountry(name);
        setThirdCountryCode(code);

        setProvince(undefined);
        setThirdProvinceCode(undefined);

        setDistrict(undefined);
        setThirdDistrictCode(undefined);

        setWard(undefined);
        // setThirdWardCode(undefined);

        setDetailLocation(undefined);
      },
      [],
    );
    const thirdProvinceSelect = useCallback<SelectOptionProps["onSelect"]>(
      ({ code, name }) => {
        setProvince(name);
        setThirdProvinceCode(code);

        setDistrict(undefined);
        setThirdDistrictCode(undefined);
        setWard(undefined);
        // setThirdWardCode(undefined);
      },
      [],
    );
    const thirdDistrictSelect = useCallback<SelectOptionProps["onSelect"]>(
      ({ code, name }) => {
        setDistrict(name);
        setThirdDistrictCode(code);

        setWard(undefined);
        // setThirdWardCode(undefined);
      },
      [],
    );
    const thirdWardSelect = useCallback<SelectOptionProps["onSelect"]>(
      ({ name }) => {
        setWard(name);
        // setThirdWardCode(code);
      },
      [],
    );

    const resolveLocationFromGG = async (
      country: string,
      province: string | undefined,
      district: string | undefined,
      ward: string | undefined,
    ) => {
      logger(`resolveLocationFromGG`);

      setResolving(true);
      const data = await locationResolve("Viet nam", province, district, ward);
      logger(`🚀 ~ onCoordChange ~ data:`, data);
      Object.keys(data).length;
      logger(`🚀 ~ Object.keys(data).length:`, Object.keys(data).length);

      if (!Object.keys(data).length) {
        //
        messageApi.open({
          type: "error",
          content: t("Extra.Not supported region"),
        });
      } else {
        setThirdCountryCode(data.country ? data.country.code : undefined);
        setCountry(() => (data.country ? data.country.name : undefined));

        setThirdProvinceCode(data.province ? data.province.code : undefined);
        setProvince(() => (data.province ? data.province.name : undefined));

        setThirdDistrictCode(data.district ? data.district.code : undefined);
        setDistrict(() => (data.district ? data.district.name : undefined));

        // setThirdWardCode(data.ward ? data.ward.code : undefined);
        setWard(() => (data.ward ? data.ward.name : undefined));
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
        logger(`🚀 ~ onCoordChange ~ error:`, error);

        messageApi.open({
          type: "error",
          content:
            error === "OVER_QUERY_LIMIT"
              ? t("Add room page.API ran out of request")
              : t("Add room page.Error getting address!"),
          duration: 30,
          icon: <StopOutlined />,
        });
      }
      setResolving(false);

      if (geoLocation) {
        logger({ geoLocation });

        const [district, province, country] = geoLocation.address_components
          .slice(-3)
          .map((e) => e.long_name);
        const str = geoLocation.formatted_address.split(", ").slice(0, -3);

        const ward = str.pop();

        const detailLocation = str.join(", ");

        setDetailLocation(detailLocation);

        await resolveLocationFromGG("Viet nam", province, district, ward);
      }
    }

    useEffect(() => {
      if (!mapRef.current || loaded.current) return;
      (async () => {
        if (!mapRef.current) return;

        const { map } = await loadMapTo({
          ref: mapRef.current,
        });
        setMap(() => map);
      })();
      loaded.current = true;
    }, [loadMapTo]);

    useEffect(() => {
      logger(`🚀 ~ useEffect ~ map:`, map);
      if (!map) return;

      map.addListener("click", (env: GoogleClickEvent) => {
        setCoords({
          lat: env.latLng.lat(),
          lng: env.latLng.lng(),
        });
      });

      if (coord) onCoordChange();
      if (location) {
        resolveLocationFromGG("Viet nam", province, district, ward);
      }
    }, [map]);

    useEffect(() => {
      onCoordChange();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coord]);

    useImperativeHandle(ref, () => {
      if (!coord?.lat && !coord?.lng && !country && !province && !district) {
        return undefined;
      }

      const obj: RoomLocationPayload = {
        lat: coord?.lat ?? 0,
        long: coord?.lng ?? 0,
        country: country ?? "",
        province: province ?? "",
        district: district ?? "",
        ward,
        detail_location: detailLocation,
      };

      return obj;
    });

    return (
      <>
        {contextHolder}
        <Form.Item label={tApi("data code.room.location")} required>
          <Space.Compact direction="vertical" block className="relative">
            <div className="relative">
              <div
                ref={mapRef}
                className="aspect-square w-full rounded-t-lg lg:aspect-[21/9]"
              />
              <Card
                // onClick={() => {
                //   setAllowSpecialFeature(!allowSpecialFeature);
                // }}
                size="small"
                className="absolute bottom-4 right-2"
              >
                <Space aria-disabled>
                  <Switch
                    checked={allowSpecialFeature}
                    disabled={locationDenied || gettingLocation}
                    onChange={setAllowSpecialFeature}
                  />
                  {/* {allowSpecialFeature ?  */}
                  {t("Add room page.Auto fill")}
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
                ? t("Permission.Denied")
                : locationDenied == true
                  ? t("Permission.Denied")
                  : t("Add room page.Get current location")}
            </MyButton>
          </Space.Compact>
        </Form.Item>

        {!isProduction && (
          <Form.Item>
            <Space.Compact block>
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

        {!isProduction && (
          <>
            <Form.Item<RoomLocationPayload> label="[DEV] Vĩ độ">
              <Input value={coord?.lat} />
            </Form.Item>

            <Form.Item<RoomLocationPayload> label="[DEV] Kinh độ">
              <Input value={coord?.lng} />
            </Form.Item>
          </>
        )}

        <Form.Item<RoomLocationPayload>
          label="[DEV] Quốc gia"
          required
          hidden={isProduction}
        >
          {loadingCountryVn || resolving ? (
            <Skeleton.Input active block />
          ) : (
            <SelectOptions
              onSelect={thirdCountrySelect}
              data={allCountryVn}
              value={country}
            />
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

        <Form.Item<RoomLocationPayload>
          label={tApi("data code.location.province")}
          required
        >
          {resolving ? (
            <Skeleton.Input active block />
          ) : (
            // <SelectOptions
            //   onSelect={thirdProvinceSelect}
            //   data={allProvincesVn}
            //   value={province}
            // />
            <SelectProvince
              onSelect={thirdProvinceSelect}
              value={province}
              code={thirdCountryCode}
            />
          )}

          {/* <Input
          onChange={(e) => {
            setProvince(e.target.value);
          }}
          value={province}
          // disabled={!!province}
        /> */}
        </Form.Item>

        <Form.Item<RoomLocationPayload>
          label={tApi("data code.location.district")}
          required
        >
          {resolving ? (
            <Skeleton.Input active block />
          ) : (
            // <SelectOptions
            //   onSelect={thirdDistrictSelect}
            //   data={allDistrictsVn}
            //   value={district}
            // />
            <SelectDistrict
              onSelect={thirdDistrictSelect}
              value={district}
              code={thirdProvinceCode}
            />
          )}
          {/* <Input
          onChange={(e) => {
            setDistrict(e.target.value);
          }}
          value={district}
          // disabled={!!district}
        /> */}
        </Form.Item>

        <Form.Item<RoomLocationPayload> label={tApi("data code.location.ward")}>
          {resolving ? (
            <Skeleton.Input active block />
          ) : (
            // <SelectOptions
            //   onSelect={thirdWardSelect}
            //   data={allWardsVn}
            //   value={ward}
            // />
            <SelectWard
              onSelect={thirdWardSelect}
              value={ward}
              code={thirdDistrictCode}
            />
          )}
          {/* <Input
          onChange={(e) => {
            setWard(e.target.value);
          }}
          value={ward}
          // disabled={!!ward}
        /> */}
        </Form.Item>

        <Form.Item<RoomLocationPayload>
          label={tApi("data code.location.detail")}
        >
          <Input
            onChange={(e) => {
              setDetailLocation(e.target.value);
            }}
            value={detailLocation}
            disabled={resolving}
            maxLength={100}
            showCount
            placeholder={tApi("data code.location.detail placeholder")}
            // ref={detailRef}
            // disabled={!!detailLocation}
          />
        </Form.Item>
      </>
    );
  }),
);

interface SelectOptionProps {
  data?: Location3rd[];
  value?: string;
  onSelect: (value: Location3rd) => void;
}

const SelectOptions = memo(function SelectOptions({
  data,
  value,
  onSelect,
}: SelectOptionProps) {
  return (
    <Select
      notFoundContent={<NotFoundContent />}
      onSelect={(_e, o) => {
        if (!o.value || !o.key) return;

        const obj: Location3rd = {
          name: String(o.value),
          // name: o.children,
          code: o.key,
        };
        if (obj.name === value) return;

        onSelect(obj);
      }}
      filterOption={searchFilterTextHasLabel}
      showSearch
      value={value}
    >
      {data &&
        data.map(({ code, name }) => (
          <Select.Option key={code} value={name} label={name}>
            {/* <Select.Option key={code} value={removeAccents(name)}> */}
            {name}
          </Select.Option>
        ))}
    </Select>
  );
});

export default LocationFormInputs;
