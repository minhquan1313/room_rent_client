import MyAvatar from "@/Components/MyAvatar";
import { InteractedUserProviderContext } from "@/Contexts/InteractedUserProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { IChatSeen } from "@/types/IChatSeen";
import { IUser } from "@/types/IUser";
import { dateFormat } from "@/utils/dateFormat";
import { isMobile } from "@/utils/isMobile";
import { toStringUserName } from "@/utils/toString";
import { Card, Space, Tooltip, Typography, theme } from "antd";
import classNames from "classnames";
import { memo, useContext } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  user?: IUser | null;
  message: string;
  showDetailUser?: boolean;
  date: string;
  seen: IChatSeen[];
}
const ChatMessage_ = ({ user, message, date, showDetailUser, seen }: Props) => {
  // need this hook but no use to get dayjs locale update and rerender as language change
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();

  const { token } = theme.useToken();

  const { getUser } = useContext(InteractedUserProviderContext);
  const { user: me } = useContext(UserContext);

  return (
    <Card
      className={classNames("w-full max-w-md", {
        "ml-auto": user?._id === me?._id,
      })}
      size="small"
      style={
        user?._id === me?._id
          ? {
              // My message
              backgroundColor: token.colorPrimary,
              color: token.colorTextLightSolid,
            }
          : {
              // Other message
            }
      }
      loading={!user}
    >
      <div>
        {user?._id === me?._id ? (
          <>{message}</>
        ) : (
          <Space className="items-start">
            <MyAvatar
              src={user?.image}
              size={isMobile() ? "default" : 50}
              addServer
              name={user?.first_name}
            />

            <Space direction="vertical" size={"small"}>
              {showDetailUser && (
                <Typography.Title level={5} className="!m-0">
                  {toStringUserName(user)}
                </Typography.Title>
              )}
              <Typography.Text>{message}</Typography.Text>
            </Space>
          </Space>
        )}
      </div>

      <div className="flex">
        <Tooltip title={dateFormat(date).format("LLL")}>
          <div className="ml-auto">{dateFormat(date).fromNow()}</div>
        </Tooltip>

        <Space>
          {seen.map((r) => (
            <Tooltip title={getUser(r.seen_by)?.username} key={r.seen_by}>
              <MyAvatar
                src={(() => {
                  const u = getUser(r.seen_by);
                  return u ? u.image : undefined;
                })()}
                size={"small"}
                addServer
                name={getUser(r.seen_by)?.first_name}
              />
            </Tooltip>
          ))}
        </Space>
      </div>
    </Card>
  );
};

export const ChatMessage = memo(ChatMessage_);
