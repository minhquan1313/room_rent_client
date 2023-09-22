import MyButton from "@/Components/MyButton";
import MyImage from "@/Components/MyImage";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleTopAdmin } from "@/constants/roleType";
import { IChatMember } from "@/types/IChatMember";
import { IChatMessageWithSeen } from "@/types/IChatRoom";
import { IUser } from "@/types/IUser";
import { toStringUserName } from "@/utils/toString";
import { DeleteOutlined } from "@ant-design/icons";
import { Avatar, Badge, Spin, Typography } from "antd";
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
          <Badge
            dot={!lastMsg.seen.find((u) => u.seen_by === me?._id)}
            // status="processing"
          >
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
              size={"large"}
              className="flex-shrink-0"
            >
              {user?.first_name[0]}
            </Avatar>
          </Badge>

          <div className="flex-1 overflow-hidden">
            <Typography.Paragraph
              ellipsis={{ rows: 1 }}
              // className="!m-0 whitespace-normal"
              className="!m-0"
            >
              {members.length <= 2 ? (
                <>
                  {/* {toStringUserName(user)} */}
                  {toStringUserName(user)} / {user?._id} / {user?.username}
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

          {isRoleTopAdmin(me?.role.title) && (
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