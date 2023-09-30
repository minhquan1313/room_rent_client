import { FilesUploadRef } from "@/Components/FilesUpload";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import RoomFormAddEdit from "@/Components/RoomFormAddEdit";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { routeRoomDetail } from "@/constants/route";
import { fetcher } from "@/services/fetcher";
import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";
import { IRoom, RoomLocationPayload, RoomPayload } from "@/types/IRoom";
import { isMobile } from "@/utils/isMobile";
import { pageTitle } from "@/utils/pageTitle";
import { Alert, Form, Space, Typography, message } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddRoom() {
  pageTitle("Thêm phòng");

  const navigate = useNavigate();

  const { isLogging, user } = useContext(UserContext);
  const { roomServicesConverted, roomTypes } = useContext(GlobalDataContext);
  const [messageApi, contextHolder] = message.useMessage();
  // const [form] = Form.useForm();

  const [submitting, setSubmitting] = useState(false);
  // const [editorState, setEditorState] = useState(EditorState.createEmpty);
  const [error, setError] = useState<ErrorJsonResponse>();
  const files = useRef<FilesUploadRef>(null);
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

        const payload: {
          json: string;
          files?: File[];
        } = { json };

        if (files.current?.files) {
          payload.files = files.current.files;
        }

        const r = await fetcher.postForm<any, IRoom>("/rooms", payload);

        navigate(`${routeRoomDetail}/${r._id}`, {
          state: {
            room: r,
          },
        });

        setSubmitting(false);
        console.log(`🚀 ~ r:`, r);

        messageApi.open({
          type: "success",
          content: "Thêm thành công",
        });
        // form.resetFields();
      } catch (error: any) {
        setSubmitting(false);
        setError(error.response.data as ErrorJsonResponse);
      }
    })();
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <MyContainer className="py-5">
      {contextHolder}
      {!user?.phone?.verified ? (
        <>
          <Alert
            message="Số điện thoại chưa xác thực!"
            description="Hãy vào Cài đặt và xác thực số điện thoại để có thể đăng tin!"
            type="error"
            showIcon
          />
        </>
      ) : (
        <>
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
          >
            <RoomFormAddEdit files={files} location={location} />

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
        </>
      )}
    </MyContainer>
  );
}

export default AddRoom;
