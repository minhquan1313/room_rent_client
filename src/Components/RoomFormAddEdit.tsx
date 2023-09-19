import FilesUpload, { FilesUploadRef } from "@/Components/FilesUpload";
import LocationFormInputs from "@/Components/LocationFormInputs";
import SelectCurrency from "@/Components/SelectCurrency";
import SelectMeasure from "@/Components/SelectMeasure";
import SelectRoomType from "@/Components/SelectRoomType";
import SelectService from "@/Components/SelectService";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleAdmin } from "@/constants/roleType";
import { IRoom, RoomLocationPayload, RoomPayload } from "@/types/IRoom";
import { numberFormat } from "@/utils/numberFormat";
import { Form, Input, InputNumber, SelectProps, Skeleton } from "antd";
import { useContext } from "react";

interface Props extends SelectProps {
  room2?: IRoom;
  files: React.RefObject<FilesUploadRef>;
  location: React.RefObject<RoomLocationPayload>;

  //   onChange?: (value: string[]) => void;
}

const RoomFormAddEdit = ({ room2: room, files, location }: Props) => {
  const { user } = useContext(UserContext);
  const { roomServicesConverted, roomTypes } = useContext(GlobalDataContext);

  return (
    <>
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
        <FilesUpload ref={files} accept="image/*" initImages={room?.images} />
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
              {<SelectMeasure />}
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

      <Form.Item<RoomPayload> label="Số nhà vệ sinh" name="number_of_bathroom">
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
        <LocationFormInputs ref={location} location={room?.location} />
      </Form.Item>
      {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
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
            Sửa
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
      </Form.Item> */}
    </>
  );
};

export default RoomFormAddEdit;
