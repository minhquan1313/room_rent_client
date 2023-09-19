import { FilesUploadRef } from "@/Components/FilesUpload";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import RoomFormAddEdit from "@/Components/RoomFormAddEdit";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { RoomContext } from "@/Contexts/RoomProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { routeRoomDetail } from "@/constants/route";
import { fetcher } from "@/services/fetcher";
import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";
import { IRoom, RoomLocationPayload, RoomPayload } from "@/types/IRoom";
import { isMobile } from "@/utils/isMobile";
import { formatObject } from "@/utils/objectToPayloadParams";
import { pageTitle } from "@/utils/pageTitle";
import { Alert, Form, Space, Typography, message } from "antd";
import { useContext, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";

const imageGutter: [number, number] = [8, 8];

const RoomEdit = () => {
  const navigate = useNavigate();

  const { currentRoom, setCurrentRoom } = useContext(RoomContext);
  // const { loadMapTo, addMarker } = useContext(GoogleMapContext);
  const { isLogging } = useContext(UserContext);
  const [messageApi, contextHolder] = message.useMessage();
  const { roomServicesConverted, roomTypes } = useContext(GlobalDataContext);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ErrorJsonResponse>();
  const files = useRef<FilesUploadRef>(null);
  const location = useRef<RoomLocationPayload>(null);

  const { id } = useParams();
  const { data: room_ } = useSWR<IRoom>(
    `/rooms/${id}`,
    // currentRoom ? undefined : `/rooms/${id}`,
    fetcher,
  );
  const room = room_ || currentRoom;

  pageTitle(room?.name ? `Sửa - ${room.name}` : "Đang tải");

  return (
    <div>
      <MyContainer className="my-10">
        {contextHolder}
        {room && (
          <Form
            initialValues={{
              ...room,

              owner: room.owner._id,
              room_type: room.room_type.title,
              services: room.services.map((e) => e.title),
            }}
            name="room"
            className="w-full"
            layout="vertical"
            onChange={() => setError(undefined)}
            disabled={submitting || isLogging}
            size={isMobile() ? "large" : undefined}
            onFinish={async (values: RoomPayload) => {
              console.log(`🚀 ~ onFinish={ ~ values:`, values);

              console.log(`🚀 ~ RoomEdit ~ files.current:`, files.current);
              console.log(`🚀 ~ onFinish ~ location:`, location.current);
              return;
              if (!location.current) {
                messageApi.open({
                  type: "error",
                  content: "Điền thông tin về vị trí",
                });

                return;
              } else if (
                location.current.lat === 0 ||
                location.current.long === 0
              ) {
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
                  content:
                    "Nếu có hãy thêm địa chỉ chi tiết để mọi người dễ tìm hơn",
                });
              }

              values.location = location.current!;
              if (values.owner === "") {
                delete values.owner;
              }

              //   const json = JSON.stringify(values);
              const obj: RoomPayload = formatObject(values) as any;

              const payload: {
                json?: string;
                files?: File[];
              } = {};

              if (files.current?.files) {
                payload.files = files.current.files;

                obj.imagesOrders = files.current.order;
                obj.images = files.current.keeps;
              }
              const json = JSON.stringify(obj);
              payload.json = json;
              console.log(`🚀 ~ obj:`, obj);

              setSubmitting(true);
              setError(undefined);
              try {
                await fetcher.patchForm(`/rooms/${room._id}`, payload);
                setCurrentRoom(undefined);
                navigate(`${routeRoomDetail}/${room._id}`);

                messageApi.open({
                  type: "success",
                  content: "Sửa thành công",
                });
              } catch (error) {
                setError((error as any).response.data as ErrorJsonResponse);
              }
              setSubmitting(false);
            }}
          >
            <RoomFormAddEdit files={files} location={location} room2={room} />
            {/* <Form.Item<RoomPayload>
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
              {!roomTypes ? (
                <Skeleton.Input active block />
              ) : (
                <SelectRoomType />
              )}
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
              <FilesUpload
                ref={files}
                accept="image/*"
                initImages={room.images}
              />
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

            <Form.Item<RoomPayload>
              label="Số phòng ngủ"
              name="number_of_bedroom"
            >
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
              <LocationFormInputs ref={location} location={room.location} />
            </Form.Item> */}
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
            </Form.Item>
          </Form>
        )}
      </MyContainer>
    </div>
  );
};

export default RoomEdit;
