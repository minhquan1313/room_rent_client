import MyContainer from "@/Components/MyContainer";
import AvatarEdit from "@/Components/UserSetting/AvatarEdit";
import NormalInfoEdit from "@/Components/UserSetting/NormalInfoEdit";
import NotifyEdit from "@/Components/UserSetting/NotifyEdit";
import PasswordEdit from "@/Components/UserSetting/PasswordEdit";
import { UserContext } from "@/Contexts/UserProvider";
import { IUser } from "@/types/IUser";
import logger from "@/utils/logger";
import { pageTitle } from "@/utils/pageTitle";
import { Grid, Tabs } from "antd";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export type TUserEditFields = Partial<IUser> & {
  old_password?: string;
  passwordConfirm?: string;

  file?: File;
  file_to?: "avatar" | "banner";
};
const UserInfo = () => {
  const { t } = useTranslation();

  const { user } = useContext(UserContext);
  const [query, setQuery] = useSearchParams();
  const screens = Grid.useBreakpoint();

  pageTitle(t("page name.Profile settings"));

  useEffect(() => {
    screens;
    logger(`🚀 ~ useEffect ~ screens:`, screens);

    // if (!query.get("tab")) setQuery(`tab=avatar`);
  }, [screens]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);
  return (
    <MyContainer className="flex min-h-full py-5">
      {user && (
        // <div className=" flex gap-2">
        <Tabs
          items={[
            {
              label: t("User.Information"),
              key: "info",
              children: <NormalInfoEdit />,
            },
            {
              label: t("User.Cover"),
              key: "avatar",
              children: <AvatarEdit />,
            },
            {
              label: t("User.Password"),
              key: "password",
              children: <PasswordEdit />,
            },
            {
              label: t("User.Notification"),
              key: "notify",
              children: <NotifyEdit />,
            },
          ]}
          onChange={(e) => {
            setQuery(`tab=${e}`);
          }}
          activeKey={query.get("tab") || undefined}
          tabPosition={screens.xs ? "top" : "left"}
          className="min-h-full w-full"
          animated
          centered
        />
        // </div>
      )}
    </MyContainer>
  );
};

export default UserInfo;
