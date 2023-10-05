import MyAvatar from "@/Components/MyAvatar";
import MyButton from "@/Components/MyButton";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleTopAdmin } from "@/constants/roleType";
import { IChatMember } from "@/types/IChatMember";
import { IChatMessageWithSeen } from "@/types/IChatRoom";
import { IUser } from "@/types/IUser";
import { isMobile } from "@/utils/isMobile";
import { toStringUserName } from "@/utils/toString";
import { DeleteOutlined } from "@ant-design/icons";
import { Badge, Spin, Typography } from "antd";
import { BaseButtonProps } from "antd/es/button/button";
import { memo, useContext } from "react";

interface Props {
  onChangeRoom(room: string): void;
  onDelete(room: string): void;
  room: string;
  type: BaseButtonProps["type"];
  user?: IUser | null;
  lastMsg: IChatMessageWithSeen;
  members: IChatMember[];
}
const SideChatItem_ = ({
  onChangeRoom,
  onDelete,
  room,
  type,
  user,
  members,
  lastMsg,
}: Props) => {
  const { user: me } = useContext(UserContext);

  return (
    <Spin spinning={!user}>
      <MyButton
        onClick={() => onChangeRoom(room)}
        type={type}
        block
        className="h-fit rounded-none border-none"
      >
        <div className="flex space-x-2 py-2 text-left">
          <Badge dot={!lastMsg.seen.find((u) => u.seen_by === me?._id)}>
            <MyAvatar
              src={user?.image}
              size={isMobile() ? "default" : "large"}
              addServer
              className="flex-shrink-0"
              alt={user?.first_name[0]}
            />
          </Badge>

          <div className="hidden flex-1 overflow-hidden sm:block">
            <Typography.Paragraph ellipsis={{ rows: 1 }} className="!m-0">
              {members.length <= 2 ? (
                <>
                  {/* {toStringUserName(user)} */}
                  {user?.username} / {user?._id} / {toStringUserName(user)}
                </>
              ) : (
                <>Nhóm chat {members.length} người</>
              )}

              {/* {!lastMsg.seen.find((u) => u.seen_by === me?._id) &&
                `Chưa xem nhe`} */}
            </Typography.Paragraph>
            {/* <Typography.Title level={5} ellipsis={{ rows: 1 }} className="!m-0">
            {toStringUserName(user)}
          </Typography.Title> */}
            <Typography.Paragraph ellipsis={{ rows: 1 }} className="!m-0">
              {lastMsg.sender === me?._id && "Bạn: "}
              {lastMsg.message}
            </Typography.Paragraph>
          </div>

          {isRoleTopAdmin(me?.role?.title) && (
            <MyButton
              onClick={async (e) => {
                e.stopPropagation();

                onDelete(room);
              }}
              icon={<DeleteOutlined />}
              danger
              type="primary"
            />
          )}
        </div>
      </MyButton>
    </Spin>
  );
};

export const SideChatItem = memo(SideChatItem_);
