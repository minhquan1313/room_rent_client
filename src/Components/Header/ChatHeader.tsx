import ChatBtn from "@/Components/ChatBtn";
import { ChatSocketContext } from "@/Contexts/ChatSocketProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { routeChat } from "@/constants/route";
import { Badge, Flex } from "antd";
import { useContext } from "react";
import { Link } from "react-router-dom";

const ChatHeader = () => {
  const { chatList } = useContext(ChatSocketContext);
  const { user: me } = useContext(UserContext);

  const count = chatList.reduce((t, r) => {
    const seenByMe = r.messages
      .slice(-1)[0]
      .seen.find((r) => r.seen_by === me?._id);

    return t + (seenByMe ? 0 : 1);
  }, 0);

  // const Wrapper = location.pathname.startsWith(routeChat) ?  : Link;

  return (
    <Flex>
      <Link to={routeChat}>
        <Badge count={count}>
          <ChatBtn size="large" type="text" />
        </Badge>
      </Link>
    </Flex>
  );
};

export default ChatHeader;
