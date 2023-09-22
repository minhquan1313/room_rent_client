import MyButton from "@/Components/MyButton";
import { ChatSocketContext } from "@/Contexts/ChatSocketProvider";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import { routeChat } from "@/constants/route";
import { MessageFilled, MessageOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useContext } from "react";
import { Link } from "react-router-dom";

const ChatHeader = () => {
  const { chatList } = useContext(ChatSocketContext);
  const { myTheme } = useContext(ThemeContext);

  const count = 1;

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
