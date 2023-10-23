import MyContainer from "@/Components/MyContainer";
import AvatarEdit from "@/Components/UserSetting/AvatarEdit";
import NormalInfoEdit from "@/Components/UserSetting/NormalInfoEdit";
import NotifyEdit from "@/Components/UserSetting/NotifyEdit";
import PasswordEdit from "@/Components/UserSetting/PasswordEdit";
import { UserContext } from "@/Contexts/UserProvider";
import { IUser } from "@/types/IUser";
import { pageTitle } from "@/utils/pageTitle";
import { Grid, Tabs } from "antd";
import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export type TUserEditFields = Partial<IUser> & {
  old_password?: string;
  passwordConfirm?: string;

  file?: File;
  file_to?: "avatar" | "banner";
};
const UserInfo = () => {
  const { user } = useContext(UserContext);
  const [query, setQuery] = useSearchParams();
  const screens = Grid.useBreakpoint();

  pageTitle("Cài đặt");

  useEffect(() => {
    screens;
    console.log(`🚀 ~ useEffect ~ screens:`, screens);

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
              label: `Thông tin`,
              key: "info",
              children: <NormalInfoEdit />,
            },
            {
              label: `Hình ảnh`,
              key: "avatar",
              children: <AvatarEdit />,
            },
            {
              label: `Mật khẩu`,
              key: "password",
              children: <PasswordEdit />,
            },
            {
              label: `Thông báo`,
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
