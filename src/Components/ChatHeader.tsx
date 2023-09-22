import MyButton from "@/Components/MyButton";
import { ChatSocketContext } from "@/Contexts/ChatSocketProvider";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { routeChat } from "@/constants/route";
import { MessageFilled, MessageOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useContext } from "react";
import { Link } from "react-router-dom";

const ChatHeader = () => {
  const { chatList } = useContext(ChatSocketContext);
  const { myTheme } = useContext(ThemeContext);
  const { user: me } = useContext(UserContext);

  const count = chatList.reduce((t, r) => {
    const seenByMe = r.messages
      .slice(-1)[0]
      .seen.find((r) => r.seen_by === me?._id);

    return t + (seenByMe ? 0 : 1);
  }, 0);

  // if (!chatList.length) return null;

  return (
    <Link to={routeChat}>
      <Badge count={count}>
        <MyButton
          icon={myTheme === "dark" ? <MessageFilled /> : <MessageOutlined />}
          shape="circle"
          size="large"
        />
      </Badge>
    </Link>
  );
};

export default ChatHeader;
