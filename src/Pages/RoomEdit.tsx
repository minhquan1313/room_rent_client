import { FilesUploadRef } from "@/Components/FilesUpload";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import RoomFormAddEdit from "@/Components/RoomFormAddEdit";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { fetcher } from "@/services/fetcher";
import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";
import { IRoom, RoomLocationPayload, RoomPayload } from "@/types/IRoom";
import { isMobile } from "@/utils/isMobile";
import { formatObject } from "@/utils/objectToPayloadParams";
import { pageTitle } from "@/utils/pageTitle";
import { Affix, Alert, Form, Space, Switch, Typography, message } from "antd";
import { useContext, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useSWR from "swr";

const RoomEdit = () => {
  // const navigate = useNavigate();
  const location = useLocation();

  const { isLogging } = useContext(UserContext);
  const [messageApi, contextHolder] = message.useMessage();
  const { roomServicesConverted, roomTypes } = useContext(GlobalDataContext);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ErrorJsonResponse>();
  const files = useRef<FilesUploadRef>(null);
  const locationRef = useRef<RoomLocationPayload>(null);

  const { id } = useParams();
  const { data: room_ } = useSWR<IRoom>(`/rooms/${id}`, fetcher);
  const room = room_ || (location.state?.room as IRoom | undefined);

  pageTitle(room?.name ? `Sửa - ${room.name}` : "Đang tải");

  return (
    <div>
      <MyContainer className="my-10">
        {contextHolder}
        {room && (
          <Form
            onFinish={async (values: RoomPayload) => {
              console.log(`🚀 ~ onFinish={ ~ values:`, values);

              console.log(`🚀 ~ RoomEdit ~ files.current:`, files.current);
              console.log(`🚀 ~ onFinish ~ location:`, locationRef.current);
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
              console.log(`🚀 ~ obj:`, obj);

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

              owner: room.owner,
              room_type: room.room_type.title,
              services: room.services.map((e) => e.title),
            }}
            name="room"
            className="w-full"
            layout="vertical"
            onChange={() => setError(undefined)}
            disabled={submitting || isLogging}
            size={isMobile() ? "large" : undefined}
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
                <Switch disabled />
              </Form.Item>

              <Form.Item<IRoom>
                name={"verified"}
                valuePropName="checked"
                label={"Admin đã duyệt bài"}
                tooltip="Chỉ quản trị mới có quyền thay đổi"
              >
                <Switch disabled />
              </Form.Item>

              <Form.Item<IRoom>
                name={"verified_real"}
                valuePropName="checked"
                label={"Admin đã xem tận nơi"}
                tooltip="Chỉ quản trị mới có quyền thay đổi"
              >
                <Switch disabled />
              </Form.Item>
            </Space>

            <RoomFormAddEdit files={files} location={locationRef} room={room} />
            {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */}
            <Affix offsetBottom={8}>
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
        )}
      </MyContainer>
    </div>
  );
};

export default RoomEdit;
