import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { currencyCodes } from "@/constants/currencyCodes";
import { measureUnitCodes } from "@/constants/measureUnitCodes";
import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";
import { RoomLocationPayload, RoomPayload } from "@/types/IRoom";
import { pageTitle } from "@/utils/pageTitle";
import {
  Alert,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
  Skeleton,
  Space,
  Typography,
} from "antd";

import { useContext, useEffect, useMemo, useState } from "react";

export default function AddRoom() {
  pageTitle("Thêm phòng");

  const { isLogging } = useContext(UserContext);
  const { roomServices, roomTypes } = useContext(GlobalDataContext);
  const [submitting, setSubmitting] = useState(false);
  // const [editorState, setEditorState] = useState(EditorState.createEmpty);
  const [error, setError] = useState<ErrorJsonResponse>();

  const onFinish = (values: RoomPayload) => {
    console.log(`🚀 ~ onFinish ~ values:`, values);

    // setError(undefined);
    // setSubmitting(true);
    // // const { remember } = values;

    // (async () => {
    //   try {
    //     // const d = await login(values, remember);
    //   } catch (error: any) {
    //     console.log(`🚀 ~ error:`, error);

    //     setError(error.response.data as ErrorJsonResponse);
    //   }
    // })();
    // setSubmitting(false);
  };

  const currencySelectJsx = useMemo(
    () => (
      <Select defaultValue={"VND"} className="min-w-[8rem]">
        {currencyCodes.map(({ code, label }) => (
          <Select.Option key={code} value={code}>
            {code}({label})
          </Select.Option>
        ))}
      </Select>
    ),
    [],
  );
  const serviceSelectOptions = useMemo(
    () =>
      roomServices &&
      roomServices.map(({ display_name, title }) => ({
        label: display_name,
        value: title,
      })),
    [roomServices],
  );
  const roomTypesSelectJsx = useMemo(
    () =>
      roomTypes && (
        <Select defaultValue={"nt"}>
          {roomTypes.map(({ display_name, title }) => (
            <Select.Option key={title} value={title}>
              {display_name}
            </Select.Option>
          ))}
        </Select>
      ),
    [roomTypes],
  );
  const measureSelectJsx = useMemo(
    () => (
      <Select defaultValue={"m2"} className="min-w-[4rem]">
        {measureUnitCodes.map(({ code, label, sup }) => (
          <Select.Option key={code} value={code}>
            {label}
            <sup>{sup}</sup>
          </Select.Option>
        ))}
      </Select>
    ),
    [],
  );

  useEffect(() => {
    //
    // const z = convert(2000, "m2").to("best");
    // console.log(`🚀 ~ useEffect ~ z:`, z.toString());
  });

  const serviceFilterOption = (
    input: string,
    option?: { label: string | null },
  ) => {
    if (!option?.label) return false;

    return option.label.toLowerCase().includes(input.toLowerCase());
  };
  return (
    <MyContainer className="py-5">
      <Typography.Title>Thêm phòng mới</Typography.Title>
      <Form
        name="room"
        className="w-full"
        layout="vertical"
        onChange={() => setError(undefined)}
        disabled={submitting || isLogging}
        initialValues={{
          number_of_living_room: 0,
          number_of_bathroom: 1,
          number_of_bedroom: 1,
          number_of_floor: 1,
        }}
        // size="large"
        onFinish={onFinish}
        autoComplete="on"
      >
        <Form.Item<RoomPayload> label="ID chủ phòng" name="owner">
          <Input />
        </Form.Item>

        <Form.Item<RoomPayload>
          rules={[
            {
              required: true,
              message: "Tên phòng không bỏ trống",
            },
          ]}
          label="Tên phòng"
          name="name"
        >
          <Input />
        </Form.Item>

        <Form.Item<RoomPayload> label="Giới thiệu ngắn" name="sub_name">
          <Input />
        </Form.Item>

        <Form.Item noStyle={!!roomTypes}>
          {!roomTypes ? (
            <Skeleton.Input active block />
          ) : (
            <Form.Item<RoomPayload>
              rules={[
                {
                  required: true,
                  message: " không bỏ trống",
                },
              ]}
              label="Kiểu phòng"
              name="room_type"
            >
              {roomTypesSelectJsx}
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item noStyle={!!roomServices}>
          {!roomServices ? (
            <Skeleton.Input active block />
          ) : (
            <Form.Item<RoomPayload> label="Các dịch vụ" name="services">
              <Select
                notFoundContent={
                  <Empty
                    description="Không có dữ liệu nha"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="m-2"
                  />
                }
                options={serviceSelectOptions}
                filterOption={serviceFilterOption}
                mode="multiple"
              />
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item<RoomPayload> label="Chọn ảnh cho phòng" name="images">
          <Input />
        </Form.Item>

        <Form.Item<RoomLocationPayload>
          rules={[
            {
              required: true,
              message: " không bỏ trống",
            },
          ]}
          label="location.lat"
          name="lat"
        >
          <Input />
        </Form.Item>

        <Form.Item<RoomPayload>
          label="Mô tả chi tiết về phòng"
          name="description"
        >
          {/* <Editor
            editorState={editorState}
            onChange={(s) => {
              console.log(`🚀 ~ AddRoom ~ s:`, s);

              setEditorState(s);
            }}
          /> */}
          <Input />
        </Form.Item>

        <Form.Item<RoomPayload>
          rules={[
            {
              required: true,
              message: " không bỏ trống",
            },
          ]}
          label="Giá tiền thuê mỗi tháng"
          name="price_per_month"
        >
          <InputNumber
            className="w-full"
            addonAfter={
              <Form.Item<RoomPayload> name="price_currency_code" noStyle>
                {currencySelectJsx}
              </Form.Item>
            }
          />
        </Form.Item>

        <Form.Item<RoomPayload> label="Diện tích phòng" name="usable_area">
          <InputNumber className="w-full" addonAfter={measureSelectJsx} />
        </Form.Item>

        <Form.Item<RoomPayload>
          label="Số phòng khách"
          name="number_of_living_room"
        >
          <InputNumber className="w-full" />
        </Form.Item>

        <Form.Item<RoomPayload> label="Số phòng ngủ" name="number_of_bedroom">
          <InputNumber className="w-full" />
        </Form.Item>

        <Form.Item<RoomPayload>
          label="Số nhà vệ sinh"
          name="number_of_bathroom"
        >
          <InputNumber className="w-full" />
        </Form.Item>

        <Form.Item<RoomPayload> label="Số tầng" name="number_of_floor">
          <InputNumber className="w-full" />
        </Form.Item>
        {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */}
        <Form.Item noStyle={!error}>
          <Space.Compact block>
            <MyButton
              block
              type="primary"
              loading={submitting || isLogging}
              disabled={!roomServices || !roomTypes}
              danger={!!error}
              htmlType="submit"
            >
              Thêm
            </MyButton>
          </Space.Compact>
        </Form.Item>

        <Form.Item noStyle>
          {error && (
            <Alert
              type="error"
              message={error.error.map(({ msg }) => (
                <div key={msg} className="text-center">
                  <Typography.Text type="danger">{msg}</Typography.Text>
                </div>
              ))}
            />
          )}
        </Form.Item>
      </Form>
    </MyContainer>
  );
}
