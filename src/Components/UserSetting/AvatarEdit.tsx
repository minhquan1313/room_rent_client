import FilesUpload, {
  FilesUploadRef,
} from "@/Components/FilesUpload/FilesUpload";
import MyButton from "@/Components/MyButton";
import { UserContext } from "@/Contexts/UserProvider";
import { TUserEditFields } from "@/Pages/UserInfo";
import { bannerAspect } from "@/constants/bannerAspect";
import { isRoleOwner } from "@/constants/roleType";
import { fetcher } from "@/services/fetcher";
import logger from "@/utils/logger";
import { Form, message } from "antd";
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const AvatarEdit = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const { user, refresh } = useContext(UserContext);

  const avatar = useRef<FilesUploadRef>(null);
  const banner = useRef<FilesUploadRef>(null);

  const [uploading, setUploading] = useState(false);

  if (!user) return null;

  return (
    <Form
      onFinish={async (e: TUserEditFields) => {
        logger(`🚀 ~ AvatarEdit ~ e:`, e);
        avatar;
        logger(`🚀 ~ AvatarEdit ~ avatar:`, avatar);

        if (!avatar.current?.files.length && !banner.current?.files.length)
          return;

        let partialSuccess = false;
        setUploading(true);

        if (avatar.current?.files.length) {
          //
          try {
            const payload: TUserEditFields = {
              file_to: "avatar",
              file: avatar.current.files[0],
            };
            logger(`🚀 ~ AvatarEdit ~ payload:`, payload);

            await fetcher.patchForm(`/users/${user._id}`, payload);

            partialSuccess = true;

            messageApi.open({
              type: "success",
              content: "Cập nhật avatar thành công!",
            });
          } catch (error) {
            messageApi.open({
              type: "error",
              content: "Có lỗi khi up avatar!",
            });
          }
        }
        if (banner.current?.files.length) {
          //
          try {
            const payload: TUserEditFields = {
              file_to: "banner",
              file: banner.current.files[0],
            };
            logger(`🚀 ~ AvatarEdit ~ payload:`, payload);

            await fetcher.patchForm(`/users/${user._id}`, payload);

            partialSuccess = true;

            messageApi.open({
              type: "success",
              content: "Cập nhật banner thành công!",
            });
          } catch (error) {
            logger(`🚀 ~ onFinish={ ~ error:`, error);

            messageApi.open({
              type: "error",
              content: "Có lỗi khi up banner!",
            });
          }
        }

        partialSuccess && refresh();
        setUploading(false);

        banner;
        logger(`🚀 ~ AvatarEdit ~ banner:`, banner);
      }}
      initialValues={user}
      layout="vertical"
      className="min-h-full w-full"
    >
      {contextHolder}
      {isRoleOwner(user.role?.title) && (
        <Form.Item<TUserEditFields> label={t("User.Cover tab.Change cover")}>
          <FilesUpload
            ref={banner}
            multiple={false}
            imageAspect={bannerAspect}
            accept="image/*"
          />
        </Form.Item>
      )}

      <Form.Item<TUserEditFields>
        label={t("User.Cover tab.Change avatar")}
        className="mx-auto max-w-sm"
      >
        <FilesUpload ref={avatar} multiple={false} avatar accept="image/*" />
      </Form.Item>

      <Form.Item>
        <MyButton
          block
          type="primary"
          loading={uploading}
          //   disabled={!roomServicesConverted || !roomTypes}
          //   danger={!!error}
          htmlType="submit"
        >
          {t("Extra.Save")}
        </MyButton>
      </Form.Item>
    </Form>
  );
};

export default AvatarEdit;
