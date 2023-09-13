import FilesUpload3 from "@/Components/FilesUpload";
import LocationFormInputs from "@/Components/LocationFormInputs";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { currencyCodes } from "@/constants/currencyCodes";
import { measureUnitCodes } from "@/constants/measureUnitCodes";
import { fetcher } from "@/services/fetcher";
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
  message,
} from "antd";
import { useContext, useMemo, useRef, useState } from "react";

function AddRoom() {
  pageTitle("Thêm phòng");

  const [messageApi, contextHolder] = message.useMessage();

  const { isLogging } = useContext(UserContext);
  const { roomServices, roomTypes } = useContext(GlobalDataContext);
  const [submitting, setSubmitting] = useState(false);
  // const [editorState, setEditorState] = useState(EditorState.createEmpty);
  const [error, setError] = useState<ErrorJsonResponse>();
  const files = useRef<File[]>();
  const location = useRef<RoomLocationPayload>();
  // const [files, setFiles] = useState<MyFile[]>();

  const onFinish = (values: RoomPayload) => {
    console.log(`🚀 ~ onFinish ~ files:`, files);
    console.log(`🚀 ~ onFinish ~ location:`, location);
    console.log(`🚀 ~ onFinish ~ values:`, values);

    if (!location.current) {
      messageApi.open({
        type: "error",
        content: "Hãy chọn toạ độ trên bản đồ và điền đầy đủ thông tin",
      });

      return;
    }

    setError(undefined);
    setSubmitting(true);
    // const { remember } = values;

    (async () => {
      try {
        values.location = location.current!;
        if (values.owner === "") {
          delete values.owner;
        }

        const json = JSON.stringify(values);

        const r = await fetcher.postForm("/rooms", {
          files: files.current,
          json,
        });
        setSubmitting(false);
        console.log(`🚀 ~ r:`, r);

        // const d = await login(values, remember);
      } catch (error: any) {
        setSubmitting(false);
        setError(error.response.data as ErrorJsonResponse);
      }
    })();
  };

  const currencySelectJsx = useMemo(
    () => (
      <Select className="min-w-[8rem]">
        {currencyCodes.map(({ code, label }) => (
          <Select.Option key={code} value={code}>
            {code}({label})
          </Select.Option>
        ))}
      </Select>
    ),
    [],
  );

  const serviceSelectJsx = useMemo(
    () => (
      <Select
        notFoundContent={
          <Empty
            description="Không có dữ liệu nha"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="m-2"
          />
        }
        filterOption={(input: string, option?: { label: string | null }) => {
          if (!option?.label) return false;

          return option.label.toLowerCase().includes(input.toLowerCase());
        }}
        mode="multiple"
      >
        {roomServices &&
          roomServices.map(({ display_name, title }) => (
            <Select.Option key={title} value={title}>
              {display_name}
            </Select.Option>
          ))}
      </Select>
    ),
    [roomServices],
  );
  const roomTypesSelectJsx = useMemo(
    () => (
      <Select>
        {roomTypes &&
          roomTypes.map(({ display_name, title }) => (
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
      <Select className="min-w-[4rem]">
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

  // useEffect(() => {
  //
  // const z = convert(2000, "m2").to("best");
  // console.log(`🚀 ~ useEffect ~ z:`, z.toString());
  // });

  return (
    <MyContainer className="py-5">
      {contextHolder}
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
          price_currency_code: "VND",

          usable_area: 12,
          usable_area_unit: "m2",

          room_type: "nt",
          name: "Tên phòng nè " + Math.random(),

          price_per_month: 2,

          // lat: 2,
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
          {!roomTypes ? <Skeleton.Input active block /> : roomTypesSelectJsx}
        </Form.Item>

        <Form.Item<RoomPayload> label="Các dịch vụ" name="services">
          {!roomServices ? <Skeleton.Input active block /> : serviceSelectJsx}
        </Form.Item>

        <Form.Item<RoomPayload>
          label="Chọn ảnh cho phòng"
          tooltip="Sau khi chọn ảnh, bấm giữ ảnh và kéo để thay đổi thứ tự"
        >
          <FilesUpload3 ref={files} />
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
          <Input.TextArea />
        </Form.Item>

        <Form.Item<RoomPayload>
          // rules={[
          //   {
          //     required: true,
          //     message: " không bỏ trống",
          //   },
          // ]}
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
          <InputNumber
            className="w-full"
            addonAfter={
              <Form.Item<RoomPayload> name="usable_area_unit" noStyle>
                {measureSelectJsx}
              </Form.Item>
            }
          />
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

        <Form.Item label="Chọn vị trí">
          <LocationFormInputs ref={location} />
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

export default AddRoom;
