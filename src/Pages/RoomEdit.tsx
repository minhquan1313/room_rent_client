import { ImagesUploadRef } from "@/Components/FilesUpload/ImagesUpload";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import RoomFormAddEdit from "@/Components/RoomFormAddEdit";
import ServerErrorResponse from "@/Components/ServerResponse/ServerErrorResponse";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { fetcher } from "@/services/fetcher";
import { IRoom, RoomPayload } from "@/types/IRoom";
import { isMobile } from "@/utils/isMobile";
import logger from "@/utils/logger";
import { formatObject } from "@/utils/objectToPayloadParams";
import { pageSeparator, pageTitle } from "@/utils/pageTitle";
import { roomLocToPayload } from "@/utils/roomLocToCoord";
import { Affix, Form, Space, Typography, message } from "antd";
import classNames from "classnames";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";

export interface RoomEditProps {
  room?: IRoom;
  floatSaveButton?: boolean;

  onSaveSuccess?(): void;
}

type TField = RoomPayload;

const RoomEdit = memo(function RoomEdit(props: RoomEditProps) {
  const {
    room: roomPassed,
    floatSaveButton = true,

    onSaveSuccess,
    // ..._props
  } = props;

  const { isLogging, user } = useContext(UserContext);
  const { roomServicesConverted, roomTypes } = useContext(GlobalDataContext);

  const { t } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>();

  const files = useRef<ImagesUploadRef>(null);
  const saveBtnBoxRef = useRef<HTMLDivElement>(null);

  const { data: room_ } = useSWR<IRoom>(id ? `/rooms/${id}` : null, fetcher);

  const room = roomPassed || room_ || (location.state?.room as IRoom | undefined);

  // pageTitle(room?.name ? `Sửa - ${room.name}` : "Đang tải");
  const [roomName, setRoomName] = useState(room?.name || "");

  pageTitle(
    roomName
      ? t("page name.Edit room", {
          val: roomName ? (roomName.includes("script") ? "" : `${pageSeparator}${roomName}`) : "",
        })
      : t("State.Loading"),
  );

  const onFinishHandle = async (values: TField) => {
    logger(`~🤖 RoomEdit 🤖~ room`, { room });

    if (!room) return;

    logger(`🚀 ~ onFinish={ ~ values:`, values);

    logger(`🚀 ~ RoomEdit ~ files.current:`, files.current);

    // eslint-disable-next-line no-constant-condition
    // if (!0) return;

    // logger(`🚀 ~ onFinish ~ location:`, locationRef.current);
    // if (!locationRef.current) {
    //   messageApi.open({
    //     type: "error",
    //     content: "Điền thông tin về vị trí",
    //   });
    // } else if (
    //   locationRef.current.lat === 0 ||
    //   locationRef.current.long === 0
    // ) {
    //   messageApi.open({
    //     type: "error",
    //     content: "Hãy ghim trên bản đồ",
    //   });
    //   return;
    // } else if (locationRef.current.country === "") {
    //   messageApi.open({
    //     type: "error",
    //     content: "Thiếu thông tin về quốc gia",
    //   });
    //   return;
    // } else if (locationRef.current.province === "") {
    //   messageApi.open({
    //     type: "error",
    //     content: "Thiếu thông tin về tỉnh thành",
    //   });
    //   return;
    // } else if (locationRef.current.detail_location === "") {
    //   messageApi.open({
    //     type: "warning",
    //     content:
    //       "Nếu có hãy thêm địa chỉ chi tiết để mọi người dễ tìm hơn",
    //   });
    // }
    // values.location = locationRef.current!;
    if (values.owner === "") {
      values.owner = user!._id;
      // delete values.owner;
    }

    //   const json = JSON.stringify(values);
    const obj = formatObject(values) as unknown as TField;

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
        content: t("Extra.Update successfully!"),
      });

      if (onSaveSuccess) onSaveSuccess();
      else navigate(-1);
    } catch (error) {
      setError((error as any)?.response?.data);
    }
    setSubmitting(false);
  };
  logger(`~🤖 RoomEdit 🤖~ `, location.state?.previous);

  const onChangeHandle = () => {
    setError(undefined);
    setRoomName(form.getFieldValue("name"));
  };

  const onAffChangeHandle = (aff: boolean | undefined): void => {
    const saveBox = saveBtnBoxRef.current;

    if (!saveBox) return;
    saveBox.style.backdropFilter = aff ? "blur(1rem)" : "transparent";
  };

  useEffect(() => {
    setRoomName(room?.name || "");
  }, [room]);

  if (!room) return null;

  return (
    <div>
      {contextHolder}

      <Form
        name="room"
        onFinish={onFinishHandle}
        initialValues={{
          ...room,

          location: {
            ...room.location,
            ...(room.location ? roomLocToPayload(room.location) : {}),
          },

          room_type: room.room_type?.title,
          services: room.services.map((e) => e.title),
        }}
        scrollToFirstError
        className="w-full"
        layout="vertical"
        onChange={onChangeHandle}
        disabled={submitting || isLogging}
        size={isMobile() ? "large" : undefined}
        form={form}
      >
        <MyContainer noBg>
          <Typography.Title className="pt-5">{t("Edit room page.Title")}</Typography.Title>

          <RoomFormAddEdit files={files} room={room} />

          <Form.Item noStyle>
            <ServerErrorResponse errors={error} />
          </Form.Item>
        </MyContainer>
        {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */}
        <Affix offsetBottom={floatSaveButton ? 0 : undefined} onChange={onAffChangeHandle}>
          <div
            className={classNames("", {
              "px-5 py-2": floatSaveButton,
            })}
            ref={saveBtnBoxRef}
          >
            <MyContainer noBg>
              {/* <Form.Item noStyle={!error}> */}
              <Space.Compact block>
                <MyButton block onClick={() => form.resetFields()}>
                  {t("Extra.Reset")}
                </MyButton>
                <MyButton
                  block
                  type="primary"
                  loading={submitting || isLogging}
                  disabled={!roomServicesConverted || !roomTypes}
                  danger={!!error}
                  htmlType="submit"
                >
                  {t("Extra.Save")}
                </MyButton>
              </Space.Compact>
              {/* </Form.Item> */}
            </MyContainer>
          </div>
        </Affix>
      </Form>
    </div>
  );
});

export default RoomEdit;
