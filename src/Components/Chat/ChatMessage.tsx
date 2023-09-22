import MyImage from "@/Components/MyImage";
import { UserContext } from "@/Contexts/UserProvider";
import { IUser } from "@/types/IUser";
import { dateFormat } from "@/utils/dateFormat";
import { toStringUserName } from "@/utils/toString";
import { Avatar, Card, Space, Tooltip, Typography, theme } from "antd";
import classNames from "classnames";
import { memo, useContext } from "react";

interface Props {
  user?: IUser | null;
  message: string;
  showDetailUser?: boolean;
  date: string;
}
const ChatMessage_ = ({ user, message, date, showDetailUser }: Props) => {
  const { token } = theme.useToken();

  const { user: me } = useContext(UserContext);
  return (
    <Card
      className={classNames("w-full max-w-md", {
        "ml-auto": user?._id === me?._id,
      })}
      size="small"
      style={{
        backgroundColor: user?._id === me?._id ? token.colorPrimary : undefined,
      }}
      loading={!user}
    >
      <div>
        {user?._id === me?._id ? (
          <Typography.Text>{message}</Typography.Text>
        ) : (
          <Space className="items-start">
            <Avatar
              src={
                user?.image ? (
                  <MyImage
                    src={user.image}
                    addServer
                    preview={false}
                    width={`100%`}
                    height={`100%`}
                  />
                ) : null
              }
              size={50}
            >
              {user?.first_name[0]}
            </Avatar>

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
      {/* [{String(message.createdAt)}] */}

      <div className="flex">
        <Tooltip title={dateFormat(date).format("LLL:ss")}>
          <div className="ml-auto">{dateFormat(date).fromNow()}</div>
        </Tooltip>
      </div>
      {/* <div className="">[{date.format("LTS")}]</div> */}
    </Card>
  );
};

export const ChatMessage = memo(ChatMessage_);
