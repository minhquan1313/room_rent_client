import { ImagesUploadRef } from "@/Components/FilesUpload/ImagesUpload";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import RoomFormAddEdit from "@/Components/RoomFormAddEdit";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { routeRoomDetail } from "@/constants/route";
import { fetcher } from "@/services/fetcher";
import { IRoom, RoomPayload } from "@/types/IRoom";
import { isMobile } from "@/utils/isMobile";
import logger from "@/utils/logger";
import { pageSeparator, pageTitle } from "@/utils/pageTitle";
import { Alert, Form, Space, Typography, message } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ServerErrorResponse from "@/Components/ServerResponse/ServerErrorResponse";
import { memo } from "react";

export interface RoomAddProps {
  room?: IRoom;
  onSaveSuccess?(): void;
}

type TField = RoomPayload;

const RoomAdd = memo(function RoomAdd(props: RoomAddProps) {
  const { onSaveSuccess } = props;

  const { t } = useTranslation();

  const [form] = Form.useForm<TField>();
  const [roomName, setRoomName] = useState("");
  logger(`🚀 ~ file: RoomAdd.tsx:37 ~ RoomAdd ~ roomName:`, roomName);

  pageTitle(
    t("page name.Add room", {
      val: roomName ? (roomName.includes("script") ? "" : `${pageSeparator}${roomName}`) : "",
    }),
  );

  const { isLogging, user } = useContext(UserContext);
  const { roomServicesConverted, roomTypes } = useContext(GlobalDataContext);

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>();

  const files = useRef<ImagesUploadRef>(null);

  const onFinishHandle = async (values: TField) => {
    logger(`🚀 ~ onFinish ~ files:`, files);
    logger(`🚀 ~ onFinish ~ values:`, values);
    // eslint-disable-next-line no-constant-condition
    // if (!0) return;

    if (!user) return;

    setError(undefined);
    setSubmitting(true);

    try {
      // values.location = location.current!;
      if (values.owner === "") {
        // delete values.owner;
        values.owner = user._id;
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

      logger(`🚀 ~ r:`, r);

      messageApi.open({
        type: "success",
        content: t("Extra.Added successfully!"),
      });

      form.resetFields();

      if (onSaveSuccess) {
        onSaveSuccess();

        return;
      }

      navigate(`${routeRoomDetail}/${r._id}`, {
        state: {
          room: r,
        },
      });
    } catch (error: any) {
      setError((error as any)?.response?.data);
    }

    setSubmitting(false);
  };

  const onChangeHandle = () => {
    setError(undefined);
    setRoomName(form.getFieldValue("name"));
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  if (!user) return null;

  return (
    <div>
      {contextHolder}

      {!user.phone?.verified ? (
        <Alert
          message={t("User.Phone tab.Tel number haven't verified yet!")}
          description={t("Add room page.Please go to profile setting and verify your tel number to post your rooms!")}
          type="error"
          showIcon
        />
      ) : (
        <>
          <Form<TField>
            name="room"
            onFinish={onFinishHandle}
            initialValues={{
              number_of_living_room: 0,
              number_of_bathroom: 0,
              number_of_bedroom: 0,
              number_of_floor: 0,

              owner: user._id,
              price_currency_code: "VND",
              usable_area_unit: "m2",

              is_visible: true,

              room_type: "nt",
              name: `Phòng ${new Date().getTime()}`,
              //   //  + Math.random()
              price_per_month: 400000 + new Date().getSeconds() * 1000,
              usable_area: 100,

              //   // lat: 2,
            }}
            scrollToFirstError
            className="w-full"
            layout="vertical"
            onChange={onChangeHandle}
            disabled={submitting || isLogging}
            size={isMobile() ? "large" : undefined}
            autoComplete="on"
            form={form}
          >
            <MyContainer className="py-5" noBg>
              <Typography.Title>{t("Add room page.Add new room")}</Typography.Title>

              <RoomFormAddEdit files={files} />

              <Form.Item noStyle>
                <ServerErrorResponse errors={error} />
              </Form.Item>

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
                    {t("Extra.Add")}
                  </MyButton>
                </Space.Compact>
              </Form.Item>
            </MyContainer>
          </Form>
        </>
      )}
    </div>
  );
});

export default RoomAdd;
