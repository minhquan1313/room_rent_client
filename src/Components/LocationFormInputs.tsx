import InputAddressGGMap, { InputAddressGGMapProps } from "@/Components/GoogleMap/InputAddressGGMap";
import MyGoogleMap, { MyGoogleMapProps, MyGoogleMapRef } from "@/Components/GoogleMap/MyGoogleMap";
import MyButton from "@/Components/MyButton";
import { SelectCountry, SelectDistrict, SelectProvince, SelectWard } from "@/Components/SelectProvince";
import { UserLocationContext } from "@/Contexts/UserLocationProvider";
import { ggMapZoomMarker } from "@/constants/googleMapConstants";
import { noEmptyRule } from "@/rules/noEmptyRule";
import { locationResolve } from "@/services/locationResolve";
import { RoomPayload } from "@/types/IRoom";
import { LocationResolve } from "@/types/Location3rd";
import { geoLocationExtract } from "@/utils/googleMapUtils";
import { isProduction } from "@/utils/isProduction";
import logger from "@/utils/logger";
import { roomLocPayloadToCoord } from "@/utils/roomLocToCoord";
import { StopOutlined } from "@ant-design/icons";
import { Card, Form, Input, Skeleton, Space, Spin, Switch, Typography, message } from "antd";
import { NamePath } from "antd/es/form/interface";
import { Coords } from "google-map-react";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type TField = RoomPayload;

const LocationFormInputs = memo(function LocationFormInputs() {
  const { t } = useTranslation();
  const { t: tApi } = useTranslation("api");

  const { locationDenied, refreshCoords } = useContext(UserLocationContext);
  const [messageApi, contextHolder] = message.useMessage();

  const form = Form.useFormInstance<TField>();

  const [coord, setCoord] = useState<Coords | undefined>(
    roomLocPayloadToCoord(getFieldValue("location")),
    // getFieldValue(["location", "lat"]) && getFieldValue(["location", "long"])
    //   ? {
    //       lat: getFieldValue(["location", "lat"]),
    //       lng: getFieldValue(["location", "long"]),
    //     }
    //   : undefined,
  );

  const [autoFill, setAutoFill] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [coordChanged, setCoordChanged] = useState(false);

  const [countryCode, setCountryCode] = useState<string | undefined>();
  const [provinceCode, setProvinceCode] = useState<string | undefined>();
  const [districtCode, setDistrictCode] = useState<string | undefined>();

  const ggMapRef = useRef<MyGoogleMapRef>(null);
  const [maps, setMs] = useState<typeof google.maps>();

  function setFieldValue(name: NamePath<TField>, value: any) {
    form.setFieldValue(name, value);
  }
  function getFieldValue(name: NamePath<TField>) {
    return form.getFieldValue(name);
  }

  const setLocationFields = (data: LocationResolve & { detail?: string } = {}) => {
    const { country, province, district, ward, detail } = data;

    setFieldValue(["location", "detail_location"], detail);

    if (!country) return;
    setCountryCode(country.code || undefined);
    setFieldValue(["location", "country"], country.name || undefined);

    if (!province) return;
    setProvinceCode(province.code || undefined);
    setFieldValue(["location", "province"], province.name || undefined);

    if (!district) return;
    setDistrictCode(district.code || undefined);
    setFieldValue(["location", "district"], district.name || undefined);

    if (!ward) return;
    setFieldValue(["location", "ward"], ward.name || undefined);
  };

  const resolveLoc = async (...params: Parameters<typeof locationResolve>) => {
    const data = await locationResolve(...params);
    logger(`~🤖 LocationFormInputs copy 🤖~ `, { data });

    // setCoord(coord);

    if (Object.keys(data).length === 0) {
      messageApi.error(t("Extra.Not supported region"));

      return;
    }

    return data;
  };

  const onAddressesChangeHandle: MyGoogleMapProps["onAddressesChange"] = async ([{ address }]) => {
    logger(`🚀 ~ address:`, address);

    if (!address) return;
    const loc = geoLocationExtract(address);
    logger(`~🤖 LocationFormInputs copy 🤖~ `, { loc });

    try {
      const data = await resolveLoc("viet nam", loc.province, loc.district, loc.ward);
      if (!data) return;
      setLocationFields({ ...data, detail: loc.detail });
      form.validateFields();
    } catch (error) {
      logger(`🚀 ~ file: LocationFormInputs copy.tsx:111 ~ constonAddressesChangeHandle:MyGoogleMapProps["onAddressesChange"]= ~ error:`, error);
    }
  };

  const onPinsChangeHandle: MyGoogleMapProps["onPinsChange"] = ([c]): void => {
    setCoord(c);
    setCoordChanged(true);

    setProvinceCode(undefined);
    setDistrictCode(undefined);

    setFieldValue(["location", "province"], undefined);

    setFieldValue(["location", "district"], undefined);

    setFieldValue(["location", "ward"], undefined);

    setFieldValue(["location", "detail_location"], undefined);

    setFieldValue(["location", "lat"], c.lat);
    setFieldValue(["location", "long"], c.lng);
  };

  const getCurrentLocClickHandle = async () => {
    setResolving(true);
    try {
      const coord = await refreshCoords();

      if (coord) {
        onPinsChangeHandle([coord]);

        if (ggMapRef.current && autoFill) {
          const address = await ggMapRef.current.deGeocode(coord);

          onAddressesChangeHandle([address]);
        }
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: t("Add room page.Error getting address!"),
        duration: 30,
        icon: <StopOutlined />,
      });
    }
    setResolving(false);
  };

  const onAddressesErrorHandle = (error: google.maps.GeocoderStatus): void => {
    messageApi.open({
      type: "error",
      content:
        error === google.maps.GeocoderStatus.OVER_QUERY_LIMIT ? t("Add room page.API ran out of request") : t("Add room page.Error getting address!"),
      duration: 30,
      icon: <StopOutlined />,
    });
  };

  const zoomHandle = (current: number): number | undefined => {
    return coord && current < ggMapZoomMarker ? ggMapZoomMarker : undefined;
  };

  const onSpecialFeatureChangeHandle = async (v: boolean) => {
    setAutoFill(v);

    if (!v || !coord || !ggMapRef.current || !coordChanged) return;

    setResolving(true);
    try {
      const address = await ggMapRef.current.deGeocode(coord);
      onAddressesChangeHandle([address]);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: t("Add room page.Error getting address!"),
        duration: 30,
        icon: <StopOutlined />,
      });
    }

    setCoordChanged(false);
    setResolving(false);
  };

  const countryCodeChangeHandle = (code: string) => {
    setCountryCode(code);
    setProvinceCode(undefined);
    setDistrictCode(undefined);

    setFieldValue(["location", "province"], undefined);
    setFieldValue(["location", "district"], undefined);
    setFieldValue(["location", "ward"], undefined);
    setFieldValue(["location", "detail_location"], undefined);
  };

  const provinceCodeChangeHandle = (code: string) => {
    setProvinceCode(code);
    setDistrictCode(undefined);

    setFieldValue(["location", "district"], undefined);
    setFieldValue(["location", "ward"], undefined);
    setFieldValue(["location", "detail_location"], undefined);
  };

  const districtCodeChangeHandle = (code: string) => {
    setDistrictCode(code);

    setFieldValue(["location", "ward"], undefined);
    setFieldValue(["location", "detail_location"], undefined);
  };

  const onGoogleApiLoadedHandle = (maps: { maps: any }) => {
    setMs(maps.maps);
  };

  const onChangeAddressSearchHandle: InputAddressGGMapProps["onChange"] = (v) => {
    logger(`🚀 ~ file: LocationFormInputs copy.tsx:212 ~ LocationFormInputs ~ v:`, v);

    if (!v) return;

    const coord = v.geometry.location.toJSON();

    onPinsChangeHandle([coord]);
    onAddressesChangeHandle([{ address: v, coord }]);
  };

  useEffect(() => {
    // this will run once

    const country = getFieldValue(["location", "country"]);
    const province = getFieldValue(["location", "province"]);
    const district = getFieldValue(["location", "district"]);
    const ward = getFieldValue(["location", "ward"]);
    const detail = getFieldValue(["location", "detail_location"]);

    /**
     * ['viet nam',undefined,'some','some'] => ['viet name']
     *
     * ['viet nam','some','some','some'] => ['viet nam','some','some','some']
     */
    const params = [country, province, district, ward].reduce<string[]>((t, v, i) => {
      if (!v) return t;
      if (i === t.length) return [...t, v];
      return t;
    }, []);

    if (!params[0] || !params[1]) return;

    const ref = setTimeout(() => {
      resolveLoc(params[0], params[1], params[2], params[3])
        .then((data) => {
          if (!data) return;
          setLocationFields({ ...data, detail: detail });
        })
        .catch((err) => {
          logger(`🚀 ~ file: LocationFormInputs copy.tsx:258 ~ useEffect ~ err:`, err);
        });
    }, 200);

    return () => {
      clearTimeout(ref);
    };
  }, []);

  return (
    <>
      {contextHolder}

      <Form.Item<TField>
        label={tApi("data code.room.location")}
        name={["location", "lat"]}
        validateStatus="error"
        rules={[
          () => ({
            message: t("Add room page.Please pin on map"),
            validator() {
              if (!coord) return Promise.reject();

              return Promise.resolve();
            },
            //
          }),
        ]}
      >
        <div className="relative">
          <Spin spinning={resolving}>
            <div className="relative">
              <div className="aspect-square w-full overflow-hidden rounded-t-lg outline-none md:aspect-[21/9]">
                <MyGoogleMap
                  icon={
                    <MyButton
                      onClick={() => {
                        logger("hihi");
                      }}
                      className="bg-cyan-800 opacity-40"
                      shape="round"
                    >
                      hihi
                    </MyButton>
                  }
                  allowAddPin="single"
                  allowDrag
                  onPinsChange={onPinsChangeHandle}
                  allowDeGeocode={autoFill}
                  onAddressesChange={onAddressesChangeHandle}
                  onAddressesChangeError={onAddressesErrorHandle}
                  pins={coord && [coord]}
                  onResolvingAddressChange={setResolving}
                  disabled={resolving}
                  geoCodeLanguage="Vietnamese"
                  onGoogleApiLoaded={onGoogleApiLoadedHandle}
                  center={coord}
                  zoom={zoomHandle}
                  ref={ggMapRef}
                />
              </div>

              <Card size="small" className="absolute bottom-4 right-2">
                <Space>
                  <Switch id="__allowSpecialFeature" checked={autoFill} disabled={locationDenied} onChange={onSpecialFeatureChangeHandle} />
                  <Typography.Text>
                    <label htmlFor="__allowSpecialFeature">{t("Add room page.Auto fill")}</label>
                  </Typography.Text>
                </Space>
              </Card>
            </div>
          </Spin>

          <Space.Compact block>
            <MyButton
              onClick={getCurrentLocClickHandle}
              type="primary"
              loading={resolving}
              disabled={locationDenied}
              block
              className="rounded-t-none"
            >
              {locationDenied == false
                ? t("Permission.Denied")
                : locationDenied == true
                  ? t("Permission.Denied")
                  : t("Add room page.Get current location")}
            </MyButton>

            {!isProduction && (
              <MyButton
                to={`https://www.google.com/maps/place/${encodeURIComponent(coord?.lat + "," + coord?.lng)}`}
                disabled={!coord?.lat || !coord?.lng}
                className="rounded-t-none"
                block
              >
                [DEV] Click mở google map
              </MyButton>
            )}
          </Space.Compact>
        </div>
      </Form.Item>

      <Form.Item label={t("Add room page.Find address")}>
        {maps ? <InputAddressGGMap maps={maps} onChange={onChangeAddressSearchHandle} /> : <Skeleton.Input active block />}
      </Form.Item>

      <Form.Item<TField> label="[DEV-hidden] Vĩ độ" name={["location", "lat"]} hidden={isProduction}>
        <Input readOnly />
      </Form.Item>

      <Form.Item<TField> label="[DEV-hidden] Kinh độ" name={["location", "long"]} hidden={isProduction}>
        <Input readOnly />
      </Form.Item>

      <Form.Item<TField> label="[DEV] Quốc gia" name={["location", "country"]} hidden={isProduction} rules={[noEmptyRule()]}>
        {resolving ? <Skeleton.Input active block /> : <SelectCountry onCodeChange={countryCodeChangeHandle} />}
      </Form.Item>

      <Form.Item<TField> name={["location", "province"]} label={tApi("data code.location.province")} rules={[noEmptyRule()]}>
        {resolving ? <Skeleton.Input active block /> : <SelectProvince onCodeChange={provinceCodeChangeHandle} code={countryCode} />}
      </Form.Item>

      <Form.Item<TField> name={["location", "district"]} label={tApi("data code.location.district")} rules={[noEmptyRule()]}>
        {resolving ? <Skeleton.Input active block /> : <SelectDistrict onCodeChange={districtCodeChangeHandle} code={provinceCode} />}
      </Form.Item>

      <Form.Item<TField> name={["location", "ward"]} label={tApi("data code.location.ward")} rules={[noEmptyRule()]}>
        {resolving ? <Skeleton.Input active block /> : <SelectWard code={districtCode} />}
      </Form.Item>

      <Form.Item<TField> name={["location", "detail_location"]} label={tApi("data code.location.detail")} rules={[noEmptyRule()]}>
        {resolving ? (
          <Skeleton.Input active block />
        ) : (
          <Input maxLength={100} showCount allowClear placeholder={tApi("data code.location.detail placeholder")} />
        )}
      </Form.Item>
    </>
  );
});

export default LocationFormInputs;
