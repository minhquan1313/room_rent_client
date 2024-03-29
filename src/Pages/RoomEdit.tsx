import { FilesUploadRef } from "@/Components/FilesUpload";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import RoomFormAddEdit from "@/Components/RoomFormAddEdit";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleAdmin } from "@/constants/roleType";
import { fetcher } from "@/services/fetcher";
import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";
import { IRoom, RoomLocationPayload, RoomPayload } from "@/types/IRoom";
import { isMobile } from "@/utils/isMobile";
import logger from "@/utils/logger";
import { formatObject } from "@/utils/objectToPayloadParams";
import { pageTitle } from "@/utils/pageTitle";
import { Affix, Alert, Form, Space, Switch, Typography, message } from "antd";
import { useContext, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useSWR from "swr";

interface Props {
  room?: IRoom;
  onSaveSuccess?(): void;
}
const RoomEdit = ({ onSaveSuccess, room: roomPassed }: Props) => {
  const { isLogging, user } = useContext(UserContext);
  const { roomServicesConverted, roomTypes } = useContext(GlobalDataContext);

  const location = useLocation();
  const { id } = useParams();

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ErrorJsonResponse>();

  const files = useRef<FilesUploadRef>(null);
  const locationRef = useRef<RoomLocationPayload>(null);

  const { data: room_ } = useSWR<IRoom>(id ? `/rooms/${id}` : null, fetcher);

  const room =
    roomPassed || room_ || (location.state?.room as IRoom | undefined);

  pageTitle(room?.name ? `Sửa - ${room.name}` : "Đang tải");

  return (
    <MyContainer className="py-5">
      {contextHolder}
      {room && (
        <>
          <Typography.Title>Chỉnh sửa phòng</Typography.Title>
          <Form
            onFinish={async (values: RoomPayload) => {
              logger(`🚀 ~ onFinish={ ~ values:`, values);

              logger(`🚀 ~ RoomEdit ~ files.current:`, files.current);
              logger(`🚀 ~ onFinish ~ location:`, locationRef.current);
              if (!locationRef.current) {
                messageApi.open({
                  type: "error",
                  content: "Điền thông tin về vị trí",
                });
              } else if (
                locationRef.current.lat === 0 ||
                locationRef.current.long === 0
              ) {
                messageApi.open({
                  type: "error",
                  content: "Hãy ghim trên bản đồ",
                });

                return;
              } else if (locationRef.current.country === "") {
                messageApi.open({
                  type: "error",
                  content: "Thiếu thông tin về quốc gia",
                });

                return;
              } else if (locationRef.current.province === "") {
                messageApi.open({
                  type: "error",
                  content: "Thiếu thông tin về tỉnh thành",
                });
                return;
              } else if (locationRef.current.detail_location === "") {
                messageApi.open({
                  type: "warning",
                  content:
                    "Nếu có hãy thêm địa chỉ chi tiết để mọi người dễ tìm hơn",
                });
              }

              values.location = locationRef.current!;
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
              logger(`🚀 ~ obj:`, obj);

              setSubmitting(true);
              setError(undefined);
              try {
                await fetcher.patchForm(`/rooms/${room._id}`, payload);

                // navigate(`${routeRoomDetail}/${room._id}`, {
                //   state: {
                //     room,
                //   },
                // });

                messageApi.open({
                  type: "success",
                  content: "Sửa thành công",
                });

                onSaveSuccess && onSaveSuccess();
              } catch (error) {
                setError((error as any).response.data as ErrorJsonResponse);
              }
              setSubmitting(false);
            }}
            initialValues={{
              ...room,

              location: {
                ...room.location,
                lat: room.location?.lat_long.coordinates[1],
                long: room.location?.lat_long.coordinates[0],
              },

              room_type: room.room_type?.title,
              services: room.services.map((e) => e.title),
            }}
            name="room"
            className="w-full"
            layout="vertical"
            onChange={() => setError(undefined)}
            disabled={submitting || isLogging}
            size={isMobile() ? "large" : undefined}
            form={form}
          >
            <Space>
              <Form.Item<IRoom>
                name={"is_visible"}
                label="Trạng thái hiển thị"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item<IRoom>
                name={"disabled"}
                valuePropName="checked"
                label={"Bài bị cấm"}
                tooltip="Chỉ quản trị mới có quyền thay đổi"
              >
                <Switch disabled={!isRoleAdmin(user?.role?.title)} />
              </Form.Item>

              <Form.Item<IRoom>
                name={"verified"}
                valuePropName="checked"
                label={"Admin đã duyệt bài"}
                tooltip="Chỉ quản trị mới có quyền thay đổi"
              >
                <Switch disabled={!isRoleAdmin(user?.role?.title)} />
              </Form.Item>

              <Form.Item<IRoom>
                name={"verified_real"}
                valuePropName="checked"
                label={"Admin đã xem tận nơi"}
                tooltip="Chỉ quản trị mới có quyền thay đổi"
              >
                <Switch disabled={!isRoleAdmin(user?.role?.title)} />
              </Form.Item>
            </Space>

            <RoomFormAddEdit files={files} location={locationRef} room={room} />
            {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */}
            <Affix offsetBottom={8}>
              <Form.Item noStyle={!error}>
                <Space.Compact block>
                  <MyButton block onClick={() => form.resetFields()}>
                    Reset
                  </MyButton>
                  <MyButton
                    block
                    type="primary"
                    loading={submitting || isLogging}
                    disabled={!roomServicesConverted || !roomTypes}
                    danger={!!error}
                    htmlType="submit"
                  >
                    Lưu
                  </MyButton>
                </Space.Compact>
              </Form.Item>
            </Affix>
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
        </>
      )}
    </MyContainer>
  );
};

export default RoomEdit;
