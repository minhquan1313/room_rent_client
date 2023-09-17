import FilesUpload from "@/Components/FilesUpload";
import LocationFormInputs from "@/Components/LocationFormInputs";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import SelectCurrency from "@/Components/SelectCurrency";
import SelectRoomType from "@/Components/SelectRoomType";
import SelectService from "@/Components/SelectService";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { measureUnitCodes } from "@/constants/measureUnitCodes";
import { isRoleAdmin } from "@/constants/roleType";
import { fetcher } from "@/services/fetcher";
import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";
import { RoomLocationPayload, RoomPayload } from "@/types/IRoom";
import { isMobile } from "@/utils/isMobile";
import { numberFormat } from "@/utils/numberFormat";
import { pageTitle } from "@/utils/pageTitle";
import {
  Alert,
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
  const [form] = Form.useForm();

  const { isLogging, user } = useContext(UserContext);
  const { roomServicesConverted, roomTypes } = useContext(GlobalDataContext);
  const [submitting, setSubmitting] = useState(false);
  // const [editorState, setEditorState] = useState(EditorState.createEmpty);
  const [error, setError] = useState<ErrorJsonResponse>();
  const files = useRef<File[]>();
  const location = useRef<RoomLocationPayload>(null);
  // const [files, setFiles] = useState<MyFile[]>();

  const onFinish = (values: RoomPayload) => {
    console.log(`🚀 ~ onFinish ~ files:`, files);
    console.log(`🚀 ~ onFinish ~ location:`, location);
    console.log(`🚀 ~ onFinish ~ values:`, values);

    if (!location.current) {
      messageApi.open({
        type: "error",
        content: "Điền thông tin về vị trí",
      });

      return;
    } else if (location.current.lat === 0 || location.current.long === 0) {
      messageApi.open({
        type: "error",
        content: "Hãy ghim trên bản đồ",
      });

      return;
    } else if (location.current.country === "") {
      messageApi.open({
        type: "error",
        content: "Thiếu thông tin về quốc gia",
      });

      return;
    } else if (location.current.province === "") {
      messageApi.open({
        type: "error",
        content: "Thiếu thông tin về tỉnh thành",
      });
      return;
    } else if (location.current.detail_location === "") {
      messageApi.open({
        type: "warning",
        content: "Nếu có hãy thêm địa chỉ chi tiết để mọi người dễ tìm hơn",
      });
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

        messageApi.open({
          type: "success",
          content: "Thêm thành công",
        });
        form.resetFields();
      } catch (error: any) {
        setSubmitting(false);
        setError(error.response.data as ErrorJsonResponse);
      }
    })();
  };

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
        initialValues={{
          number_of_living_room: 1,
          number_of_bathroom: 1,
          number_of_bedroom: 1,
          number_of_floor: 1,
          price_currency_code: "VND",

          usable_area: 100,
          usable_area_unit: "m2",

          room_type: "nt",
          name: "Tên phòng ",
          //  + Math.random()
          price_per_month: 450000,

          // lat: 2,
        }}
        name="room"
        className="w-full"
        layout="vertical"
        onChange={() => setError(undefined)}
        disabled={submitting || isLogging}
        size={isMobile() ? "large" : undefined}
        onFinish={onFinish}
        autoComplete="on"
        form={form}
      >
        <Form.Item<RoomPayload>
          label="ID chủ phòng"
          name="owner"
          hidden={!isRoleAdmin(user?.role.title)}
        >
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
          <Input maxLength={50} showCount />
        </Form.Item>

        <Form.Item<RoomPayload> label="Giới thiệu ngắn" name="sub_name">
          <Input maxLength={50} showCount />
        </Form.Item>

        <Form.Item<RoomPayload> label="Mô tả chi tiết" name="description">
          <Input.TextArea maxLength={1000} showCount autoSize />
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
          {!roomTypes ? <Skeleton.Input active block /> : <SelectRoomType />}
        </Form.Item>

        <Form.Item<RoomPayload> label="Các dịch vụ" name="services">
          {!roomServicesConverted ? (
            <Skeleton.Input active block />
          ) : (
            <SelectService />
          )}
        </Form.Item>

        <Form.Item<RoomPayload>
          label="Chọn ảnh cho phòng"
          tooltip="Sau khi chọn ảnh, bấm giữ ảnh và kéo để thay đổi thứ tự"
        >
          <FilesUpload ref={files} accept="image/*" />
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
            addonAfter={
              <Form.Item<RoomPayload> name="price_currency_code" noStyle>
                <SelectCurrency />
              </Form.Item>
            }
            formatter={numberFormat}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            className="w-full"
          />
        </Form.Item>

        <Form.Item<RoomPayload>
          rules={[
            {
              required: true,
              message: " không bỏ trống",
            },
          ]}
          label="Diện tích sử dụng"
          name="usable_area"
        >
          <InputNumber
            addonAfter={
              <Form.Item<RoomPayload> name="usable_area_unit" noStyle>
                {measureSelectJsx}
              </Form.Item>
            }
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            className="w-full"
          />
        </Form.Item>

        <Form.Item<RoomPayload>
          label="Số phòng khách"
          name="number_of_living_room"
        >
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            className="w-full"
          />
        </Form.Item>

        <Form.Item<RoomPayload> label="Số phòng ngủ" name="number_of_bedroom">
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            className="w-full"
          />
        </Form.Item>

        <Form.Item<RoomPayload>
          label="Số nhà vệ sinh"
          name="number_of_bathroom"
        >
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            className="w-full"
          />
        </Form.Item>

        <Form.Item<RoomPayload> label="Số tầng" name="number_of_floor">
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            className="w-full"
          />
        </Form.Item>

        <Form.Item noStyle>
          <LocationFormInputs ref={location} />
        </Form.Item>
        {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */}
        <Form.Item noStyle={!error}>
          <Space.Compact block>
            <MyButton
              block
              type="primary"
              loading={submitting || isLogging}
              disabled={!roomServicesConverted || !roomTypes}
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
