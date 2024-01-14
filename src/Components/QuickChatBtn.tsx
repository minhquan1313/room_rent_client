import ChatBtn from "@/Components/ChatBtn";
import { ChatSocketContext } from "@/Contexts/ChatSocketProvider";
import { routeChat } from "@/constants/route";
import { ButtonProps } from "antd";
import { memo, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props extends ButtonProps {
  toUserId: string;
  fromUserId: string;
}
const QuickChatBtn_ = ({ fromUserId, toUserId, ...rest }: Props) => {
  const navigate = useNavigate();

  const { searchForChatRoom } = useContext(ChatSocketContext);
  const [clicked, setClicked] = useState(false);

  return (
    <ChatBtn
      {...rest}
      onClick={async () => {
        setClicked(true);
        /**
         * Search cuộc trò chuyện có sẵn trong db
         */
        try {
          const chatRoom = await searchForChatRoom([toUserId, fromUserId]);
          console.log(`🚀 ~ onClick={ ~ chatRoom:`, chatRoom);

          if (chatRoom.length) {
            // Chat cũ
            // const chatRoom=
            navigate(`${routeChat}/${chatRoom[0].room}`);
          } else {
            // Chat mới
            navigate(`${routeChat}?to=${toUserId}`);
          }
        } catch (error) {
          /* empty */
        }
        setClicked(false);
      }}
      type="primary"
      loading={clicked}
    />
  );
};

export const QuickChatBtn = memo(QuickChatBtn_);
