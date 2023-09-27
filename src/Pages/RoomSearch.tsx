import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import { RoomCard } from "@/Components/RoomCard";
import {
  SelectDistrict,
  SelectProvince,
  SelectWard,
} from "@/Components/SelectProvince";
import SelectRoomType from "@/Components/SelectRoomType";
import SelectService from "@/Components/SelectService";
import SelectSortField from "@/Components/SelectSortField";
import { UserLocationContext } from "@/Contexts/UserLocationProvider";
import { proximityThreshold } from "@/constants";
import { fetcher } from "@/services/fetcher";
import { locationResolve } from "@/services/locationResolve";
import { IRoom, RoomSearchQuery } from "@/types/IRoom";
import { isMobile } from "@/utils/isMobile";
import { isProduction } from "@/utils/isProduction";
import { numberFormat, numberParser } from "@/utils/numberFormat";
import {
  formatObject,
  objectToPayloadParams,
} from "@/utils/objectToPayloadParams";
import { pageTitle } from "@/utils/pageTitle";
import {
  Card,
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Segmented,
  Space,
  Spin,
  Switch,
  Tooltip,
} from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";

const LIMIT = [5, 10, 20, 30];

type Fields = RoomSearchQuery & {
  search_close_to?: boolean;
  search_close_to_lat?: string;
  search_close_to_long?: string;
};
const RoomSearch = () => {
  pageTitle("Tìm kiếm");

  const { locationDenied, refreshCoords } = useContext(UserLocationContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm<Fields>();
  const ref = useRef<FormInstance<Fields>>(null);

  const [provinceCode, setProvinceCode] = useState<string>();
  const [districtCode, setDistrictCode] = useState<string>();

  // const [coords, setCoords] = useState<Coords>();
  // const [locationDenied, setLocationDenied] = useState<boolean>();
  const [isSearchCloseTo, setIsSearchCloseTo] = useState(
    searchParams.get("search_close_to") === "true",
  );
  const [searchPayload, setSearchPayload] = useState<string>();
  const { data: rooms, isLoading } = useSWR<IRoom[]>(
    // `/rooms`,
    searchPayload ? `/rooms?${searchPayload}` : undefined,
    fetcher,
  );
  // const [changed, setChanged] = useState(false);

  useEffect(() => {
    // Tải thông tin của tỉnh và quận huyện khi route vừa load lần đầu
    const province = searchParams.get("province");
    if (province) {
      (async () => {
        const r = await locationResolve("Việt Nam", province);
        console.log(`🚀 ~ province:`, r);

        const c = r.province?.code;
        c && setProvinceCode(c);
      })();
    }

    const district = searchParams.get("district");
    if (district) {
      (async () => {
        const r = await locationResolve("Việt Nam", undefined, district);
        console.log(`🚀 ~ district:`, r);

        const c = r.district?.code;

        c && setDistrictCode(c);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // set setSearchPayload when route first load
    form.submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    rooms;
    console.log(`🚀 ~ useEffect ~ rooms:`, rooms);

    //   provinceCode;
    //   console.log(`🚀 ~ useEffect ~ provinceCode:`, provinceCode);
    // }, [provinceCode]);
    // useEffect(() => {
    //   districtCode;
    //   console.log(`🚀 ~ useEffect ~ districtCode:`, districtCode);
    // }, [districtCode]);
    // useEffect(() => {
    // searchParams.get("kw");
    // console.log(
    //   `🚀 ~ useEffect ~ searchParams.get("kw"):`,
    //   searchParams.get("kw"),
    // );
    // searchParams.get("services");
    // console.log(
    //   `🚀 ~ useEffect ~ searchParams.get("services"):`,
    //   searchParams.get("services")?.split(","),
    // );
    // console.log(
    //   `🚀 ~ useEffect ~ room:`,
    //   decodeURIComponent(searchParams.toString()),
    // );
    // ref.current;
    // console.log(`🚀 ~ useEffect ~ ref.current:`, ref.current);
  });
  useEffect(() => {
    if (!isSearchCloseTo) return;

    (async () => {
      const coord = await refreshCoords();

      if (!coord) {
        setIsSearchCloseTo(false);
        form.setFieldValue("search_close_to", false);

        form.setFieldValue("search_close_to_lat", undefined);
        form.setFieldValue("search_close_to_long", undefined);
      } else {
        // setCoords(coord);
        form.setFieldValue("search_close_to_lat", coord.lat);
        form.setFieldValue("search_close_to_long", coord.lng);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchCloseTo]);

  return (
    <Form
      initialValues={{
        kw: searchParams.get("kw"),
        services: searchParams.get("services")?.split(","),
        room_type: searchParams.get("room_type"),

        usable_area_from: searchParams.get("usable_area_from"),
        usable_area_to: searchParams.get("usable_area_to"),

        number_of_floor_from: searchParams.get("number_of_floor_from"),
        number_of_floor_to: searchParams.get("number_of_floor_to"),

        price_per_month_from: searchParams.get("price_per_month_from"),
        price_per_month_to: searchParams.get("price_per_month_to"),

        number_of_bedroom_from: searchParams.get("number_of_bedroom_from"),
        number_of_bedroom_to: searchParams.get("number_of_bedroom_to"),

        number_of_bathroom_from: searchParams.get("number_of_bathroom_from"),
        number_of_bathroom_to: searchParams.get("number_of_bathroom_to"),

        number_of_living_room_from: searchParams.get(
          "number_of_living_room_from",
        ),
        number_of_living_room_to: searchParams.get("number_of_living_room_to"),

        search_close_to: isSearchCloseTo,
        search_close_to_lat: searchParams.get("search_close_to_lat"),
        search_close_to_long: searchParams.get("search_close_to_long"),

        province: searchParams.get("province"),
        district: searchParams.get("district"),
        ward: searchParams.get("ward"),

        limit: Number(searchParams.get("limit")) || LIMIT[0],
      }}
      onFinish={(e: Fields) => {
        let fields: Fields = {};
        if (e.search_close_to) {
          // form.setFieldValue("ward", undefined);

          const { district, province, ward, ...rest } = e;
          fields = rest;
        } else {
          const {
            search_close_to,
            search_close_to_lat,
            search_close_to_long,
            ...rest
          } = e;
          fields = rest;
        }

        if (fields.sort_field) {
          const [sort_field, sort] = fields.sort_field.split("#");
          fields = {
            ...fields,
            sort_field,
            sort,
          };
        }

        const objFormatted = formatObject(fields);
        const query = new URLSearchParams(objFormatted as any).toString();
        const payload = objectToPayloadParams(objFormatted);

        setSearchParams(query);

        console.log(`🚀 ~ AllRoom ~ onFinish:`, e);
        console.log(`🚀 ~ AllRoom ~ query:`, query);
        console.log(
          `🚀 ~ AllRoom ~ payload:`,
          decodeURIComponent(payload.toString()),
        );

        setSearchPayload(payload.toString());
      }}
      name="room-search"
      className="my-10"
      size={isMobile() ? "large" : undefined}
      ref={ref}
      layout="vertical"
      form={form}
    >
      <MyContainer>
        <Row gutter={8} className="mb-5">
          <Col flex={"auto"}>
            <Form.Item<Fields> name="kw" noStyle>
              <Input placeholder="Từ khoá" className="text-ellipsis" />
            </Form.Item>
          </Col>

          <Col xs={4}>
            <MyButton
              htmlType="submit"
              type="primary"
              className="min-w-[6rem]"
              block
              loading={isLoading}
            >
              Tìm
            </MyButton>
          </Col>
        </Row>

        <Spin spinning={isLoading}>
          <Row gutter={20} wrap={false}>
            <Col flex={"auto"}>
              <Row gutter={[20, 20]}>
                {rooms?.length ? (
                  rooms.map((room) => (
                    <Col xs={8} key={room._id} className="w-1/5">
                      {/* <Link
                        to={`${routeRoomDetail}/${room._id}`}
                        className="block"
                        state={{
                          room,
                        }}
                      > */}
                      <RoomCard room={room} />
                      {/* </Link> */}
                    </Col>
                  ))
                ) : (
                  <div>no data</div>
                )}
              </Row>
            </Col>

            <Col xs={6}>
              <Form.Item<Fields> name="limit">
                <Segmented options={LIMIT} block />
              </Form.Item>

              <Form.Item>
                <Space.Compact block>
                  <Form.Item<Fields> name="sort_field" noStyle>
                    <SelectSortField />
                  </Form.Item>

                  <Form.Item<Fields> name="sort" noStyle></Form.Item>
                </Space.Compact>
              </Form.Item>

              <Form.Item>
                <Card
                  extra={
                    <Tooltip
                      title={`Sẽ tìm trong bán kính ${proximityThreshold}m`}
                    >
                      <div>
                        <Form.Item<Fields>
                          name="search_close_to"
                          valuePropName="checked"
                          noStyle
                        >
                          <Switch
                            disabled={locationDenied}
                            onChange={(e) => setIsSearchCloseTo(e)}
                            checkedChildren="Gần đây"
                            unCheckedChildren={
                              locationDenied ? "Bị cấm" : "Gần đây"
                            }
                          />
                        </Form.Item>
                      </div>
                    </Tooltip>
                  }
                  size="small"
                  title="Vị trí"
                >
                  <Form.Item<Fields>
                    name="search_close_to_lat"
                    hidden={isProduction}
                    label="[DEV] Vĩ độ"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item<Fields>
                    name="search_close_to_long"
                    hidden={isProduction}
                    label="[DEV] Kinh độ"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item<Fields> name="province">
                    <SelectProvince
                      onSelect={(e) => {
                        const newCode = e.code;
                        if (provinceCode === newCode) return;

                        setProvinceCode(newCode);

                        form.setFieldValue("district", undefined);
                        form.setFieldValue("ward", undefined);

                        setDistrictCode(undefined);
                      }}
                      bordered={false}
                      allowClear
                      disabled={isSearchCloseTo}
                    />
                  </Form.Item>

                  <Form.Item<Fields> name="district">
                    <SelectDistrict
                      onSelect={(e) => {
                        const newCode = e.code;
                        if (provinceCode === newCode) return;

                        setDistrictCode(newCode);
                        form.setFieldValue("ward", undefined);
                      }}
                      code={provinceCode}
                      bordered={false}
                      allowClear
                      disabled={isSearchCloseTo}
                    />
                  </Form.Item>

                  <Form.Item<Fields> name="ward" noStyle>
                    <SelectWard
                      code={districtCode}
                      bordered={false}
                      allowClear
                      disabled={isSearchCloseTo}
                    />
                  </Form.Item>

                  {/* <Form.Item>
                  <Space
                    onClick={() => {
                      form.setFieldValue("search_close_to", !isSearchCloseTo);
                      setIsSearchCloseTo(!isSearchCloseTo);
                    }}
                    className="w-full cursor-pointer bg-red-300"
                  >
                    <Form.Item<Fields>
                      name="search_close_to"
                      valuePropName="checked"
                      noStyle
                    >
                      <Switch
                        disabled={locationDenied}
                        onChange={(e) => {
                          setIsSearchCloseTo(e);
                        }}
                        checkedChildren="Tìm gần đây"
                        unCheckedChildren="..."
                      />
                    </Form.Item>
                    Tìm gần đây
                  </Space>
                </Form.Item>

                <MyButton block>Lấy vị trí</MyButton> */}
                </Card>
              </Form.Item>

              <Form.Item<Fields> name="room_type" label="Kiểu phòng">
                <SelectRoomType allowClear />
              </Form.Item>

              <Form.Item<Fields> name="services" label="Dịch vụ">
                <SelectService allowClear />
              </Form.Item>

              <Form.Item<Fields> label="Diện tích sử dụng">
                <Space.Compact block>
                  <Form.Item<Fields> name="usable_area_from" noStyle>
                    <InputNumber
                      formatter={numberFormat}
                      parser={numberParser}
                      placeholder="Từ"
                      step={10}
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item<Fields> name="usable_area_to" noStyle>
                    <InputNumber
                      formatter={numberFormat}
                      parser={numberParser}
                      placeholder="Đến"
                      step={10}
                      className="w-full"
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>

              <Form.Item<Fields> label="Số tầng" tooltip="Không tính tầng trệt">
                <Space.Compact block>
                  <Form.Item<Fields> name="number_of_floor_from" noStyle>
                    <InputNumber
                      formatter={numberFormat}
                      parser={numberParser}
                      placeholder="Từ"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item<Fields> name="number_of_floor_to" noStyle>
                    <InputNumber
                      formatter={numberFormat}
                      parser={numberParser}
                      placeholder="Đến"
                      className="w-full"
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>

              <Form.Item<Fields> label="Tiền thuê mỗi tháng">
                <Space.Compact block>
                  <Form.Item<Fields> name="price_per_month_from" noStyle>
                    <InputNumber
                      formatter={numberFormat}
                      parser={numberParser}
                      placeholder="Từ"
                      step={100000}
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item<Fields> name="price_per_month_to" noStyle>
                    <InputNumber
                      formatter={numberFormat}
                      parser={numberParser}
                      placeholder="Đến"
                      step={100000}
                      className="w-full"
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>

              <Form.Item<Fields> label="Số phòng ngủ">
                <Space.Compact block>
                  <Form.Item<Fields> name="number_of_bedroom_from" noStyle>
                    <InputNumber
                      formatter={numberFormat}
                      parser={numberParser}
                      placeholder="Từ"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item<Fields> name="number_of_bedroom_to" noStyle>
                    <InputNumber
                      formatter={numberFormat}
                      parser={numberParser}
                      placeholder="Đến"
                      className="w-full"
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>

              <Form.Item<Fields> label="Số phòng tắm">
                <Space.Compact block>
                  <Form.Item<Fields> name="number_of_bathroom_from" noStyle>
                    <InputNumber
                      formatter={numberFormat}
                      parser={numberParser}
                      placeholder="Từ"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item<Fields> name="number_of_bathroom_to" noStyle>
                    <InputNumber
                      formatter={numberFormat}
                      parser={numberParser}
                      placeholder="Đến"
                      className="w-full"
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>

              <Form.Item<Fields> label="Số phòng khách">
                <Space.Compact block>
                  <Form.Item<Fields> name="number_of_living_room_from" noStyle>
                    <InputNumber
                      formatter={numberFormat}
                      parser={numberParser}
                      placeholder="Từ"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item<Fields> name="number_of_living_room_to" noStyle>
                    <InputNumber
                      formatter={numberFormat}
                      parser={numberParser}
                      placeholder="Đến"
                      className="w-full"
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>
        </Spin>
      </MyContainer>
    </Form>
  );
};

export default RoomSearch;
