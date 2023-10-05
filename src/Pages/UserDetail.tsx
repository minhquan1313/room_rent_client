import MyAvatar from "@/Components/MyAvatar";
import MyContainer from "@/Components/MyContainer";
import MyImage from "@/Components/MyImage";
import { QuickChatBtn } from "@/Components/QuickChatBtn";
import RoomListOfUser from "@/Components/RoomListOfUser";
import { SettingBtn } from "@/Components/SettingBtn";
import { InteractedUserProviderContext } from "@/Contexts/InteractedUserProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { bannerAspect } from "@/constants/bannerAspect";
import { isRoleOwner } from "@/constants/roleType";
import { routeUpdate } from "@/constants/route";
import { fetcher } from "@/services/fetcher";
import { IUser } from "@/types/IUser";
import { pageTitle } from "@/utils/pageTitle";
import { toStringUserName } from "@/utils/toString";
import { Badge, Divider, Space, Typography, theme } from "antd";
import classNames from "classnames";
import { useContext, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import useSWR from "swr";

const UserDetail = () => {
  const {
    token: { colorBgSpotlight, colorBgContainer },
  } = theme.useToken();

  const { userId } = useParams();
  const location = useLocation();

  const { addUser } = useContext(InteractedUserProviderContext);
  const { user: me } = useContext(UserContext);

  const { data: user_ } = useSWR<IUser>(`/users/${userId}`, fetcher);

  const user = user_ || (location.state?.user as IUser | undefined);
  console.log(`🚀 ~ UserDetail ~ user:`, user);

  pageTitle(toStringUserName(user) || "Đang tải");

  useEffect(() => {
    if (!user_) return;

    addUser(user_);
  }, [user_]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  // const items: DescriptionsProps["items"] = getDescriptionsRoom(room);

  return (
    <div>
      {user && isRoleOwner(user.role?.title) && (
        <div className="-mb-10">
          <div
            className={classNames(
              "mx-auto w-full max-w-[100rem] overflow-hidden rounded-b-xl",
              bannerAspect,
            )}
          >
            <div
              className="h-full w-full"
              style={{
                backgroundColor: colorBgSpotlight,
              }}
            >
              {user?.owner_banner && (
                <MyImage
                  src={user?.owner_banner}
                  addServer
                  width={"100%"}
                  height={"100%"}
                  className={classNames("object-cover", bannerAspect)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <MyContainer>
        {user && (
          <div>
            <div className="flex items-end justify-between gap-2">
              <div>
                <Space align="end" className="mt-3">
                  <MyAvatar
                    src={user.image}
                    addServer
                    preview
                    alt={user.first_name[0]}
                    size={100}
                    className="border-2"
                    style={{
                      borderColor: colorBgContainer,
                      // backgroundColor: colorInfoBg,
                    }}
                  />
                  <div>
                    <Typography.Title
                      //   editable={
                      //     user._id === me?._id && {
                      //       onChange(value) {
                      //         console.log(`🚀 ~ onChange ~ value:`, value);
                      //       },
                      //     }
                      //   }
                      className="!m-0"
                      level={2}
                    >
                      {toStringUserName(user)}{" "}
                      <Badge
                        color="cyan"
                        count={user.role?.display_name}
                        showZero={false}
                      />
                    </Typography.Title>

                    <Typography.Paragraph className="!m-0">
                      {user.gender?.display_name}
                    </Typography.Paragraph>
                  </div>
                </Space>
              </div>

              {me && me._id !== user._id && (
                <div>
                  <QuickChatBtn
                    toUserId={user._id}
                    fromUserId={me._id}
                    size="large"
                  />
                </div>
              )}

              {me && me._id === user._id && (
                <Link
                  to={routeUpdate}
                  state={{
                    user,
                  }}
                >
                  <SettingBtn size="large" />
                </Link>
              )}
            </div>
          </div>
        )}

        {user && isRoleOwner(user.role?.title) && (
          <MyContainer className="mt-10">
            <Divider orientation="left">
              <Typography.Title level={3}>Các tin đang đăng</Typography.Title>
            </Divider>

            <RoomListOfUser userId={user._id} />
          </MyContainer>
        )}
      </MyContainer>
    </div>
  );
};

export default UserDetail;
