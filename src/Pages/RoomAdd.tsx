import { FilesUploadRef } from "@/Components/FilesUpload/FilesUpload";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import RoomFormAddEdit from "@/Components/RoomFormAddEdit";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleAdmin } from "@/constants/roleType";
import { routeRoomDetail } from "@/constants/route";
import { fetcher } from "@/services/fetcher";
import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";
import { IRoom, RoomLocationPayload, RoomPayload } from "@/types/IRoom";
import { isMobile } from "@/utils/isMobile";
import logger from "@/utils/logger";
import { pageTitle } from "@/utils/pageTitle";
import { Alert, Form, Space, Switch, Typography, message } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface Props {
  onSaveSuccess?(): void;
}
function AddRoom({ onSaveSuccess }: Props) {
  const { t, i18n } = useTranslation();
  const { t: tApi } = useTranslation("api");

  pageTitle(t("page name.Add room"));

  const navigate = useNavigate();

  const { isLogging, user } = useContext(UserContext);
  const { roomServicesConverted, roomTypes } = useContext(GlobalDataContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const [submitting, setSubmitting] = useState(false);
  // const [editorState, setEditorState] = useState(EditorState.createEmpty);
  const [error, setError] = useState<ErrorJsonResponse>();
  const files = useRef<FilesUploadRef>(null);
  const location = useRef<RoomLocationPayload>(null);
  // const [files, setFiles] = useState<MyFile[]>();

  const onFinish = (values: RoomPayload) => {
    logger(`🚀 ~ onFinish ~ files:`, files);
    logger(`🚀 ~ onFinish ~ location:`, location);
    logger(`🚀 ~ onFinish ~ values:`, values);

    if (!location.current) {
      messageApi.open({
        type: "error",
        content: t("Add room page.Please fill address fields"),
      });

      return;
    } else if (location.current.lat === 0 || location.current.long === 0) {
      messageApi.open({
        type: "error",
        content: t("Add room page.Please pin on map"),
      });

      return;
    } else if (location.current.country === "") {
      messageApi.open({
        type: "error",
        content: t("Add room page.Missing country"),
      });

      return;
    } else if (location.current.province === "") {
      messageApi.open({
        type: "error",
        content: t("Add room page.Missing province"),
      });
      return;
    } else if (location.current.detail_location === "") {
      messageApi.open({
        type: "warning",
        content: t("Add room page.Missing detail address"),
      });
    }

    setError(undefined);
    setSubmitting(true);

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

        setSubmitting(false);
        logger(`🚀 ~ r:`, r);

        messageApi.open({
          type: "success",
          content: t("Extra.Added successfully!"),
        });

        form.resetFields();

        if (onSaveSuccess) {
          onSaveSuccess();
        } else {
          navigate(`${routeRoomDetail}/${r._id}`, {
            state: {
              room: r,
            },
          });
        }
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
    <MyContainer className="py-5" noBg>
      {/* <div className="aspect-square w-full overflow-hidden rounded-lg outline-none lg:aspect-[21/9]">
        <GoogleMapReact
          // key={i18n.language}
          bootstrapURLKeys={ggMapKeyGenerator(
            i18n.language as TAvailableLanguage,
          )}
          shouldUnregisterMapOnUnmount
          defaultCenter={ggMapCenter}
          defaultZoom={ggMapZoom}
          options={ggMapOptions}
          onClick={logger}
        ></GoogleMapReact>
      </div> */}

      {contextHolder}
      {!user?.phone?.verified ? (
        <Alert
          message={t("User.Phone tab.Tel number haven't verified yet!")}
          description={t(
            "Add room page.Please go to profile setting and verify your tel number to post your rooms!",
          )}
          type="error"
          showIcon
        />
      ) : (
        <>
          <Typography.Title>{t("Add room page.Add new room")}</Typography.Title>
          <Form
            initialValues={{
              //   number_of_living_room: 1,
              //   number_of_bathroom: 1,
              //   number_of_bedroom: 1,
              //   number_of_floor: 1,

              //   usable_area: 100,

              price_currency_code: "VND",
              usable_area_unit: "m2",

              //   room_type: "nt",
              //   name: "Tên phòng ",
              //   //  + Math.random()
              //   price_per_month: 450000,

              //   // lat: 2,
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
            <Space>
              <Form.Item<IRoom>
                name={"is_visible"}
                label={tApi("data code.room.is_visible")}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item<IRoom>
                name={"disabled"}
                valuePropName="checked"
                label={tApi("data code.room.disabled")}
                tooltip={t(
                  "Add room page.Only admin have permission to change this!",
                )}
              >
                <Switch disabled={!isRoleAdmin(user?.role?.title)} />
              </Form.Item>

              <Form.Item<IRoom>
                name={"verified"}
                valuePropName="checked"
                label={tApi("data code.room.verified")}
                tooltip={t(
                  "Add room page.Only admin have permission to change this!",
                )}
              >
                <Switch disabled={!isRoleAdmin(user?.role?.title)} />
              </Form.Item>

              <Form.Item<IRoom>
                name={"verified_real"}
                valuePropName="checked"
                label={tApi("data code.room.verified_real")}
                tooltip={t(
                  "Add room page.Only admin have permission to change this!",
                )}
                hidden={!isRoleAdmin(user?.role?.title)}
              >
                <Switch />
              </Form.Item>
            </Space>

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
                  {t("Extra.Add")}
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
