import MyButton from "@/Components/MyButton";
import { ChatSocketContext } from "@/Contexts/ChatSocketProvider";
import { routeChat } from "@/constants/route";
import { memo, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  to: string;
  userId: string;
}
const QuickChatBtn_ = ({ userId, to }: Props) => {
  const navigate = useNavigate();

  const { searchForChatRoom } = useContext(ChatSocketContext);
  const [clicked, setClicked] = useState(false);

  return (
    <MyButton
      onClick={async () => {
        setClicked(true);
        /**
         * Search cuộc trò chuyện có sẵn trong db
         */
        try {
          const chatRoom = await searchForChatRoom([to, userId]);
          console.log(`🚀 ~ onClick={ ~ chatRoom:`, chatRoom);

          if (chatRoom.length) {
            // Chat cũ
            // const chatRoom=
            navigate(`${routeChat}/${chatRoom[0].room}`);
          } else {
            // Chat mới
            navigate(`${routeChat}?to=${to}`);
          }
        } catch (error) {
          /* empty */
        }
        setClicked(false);
      }}
      loading={clicked}
    >
      Chat ngay
    </MyButton>
  );
};

export const QuickChatBtn = memo(QuickChatBtn_);
