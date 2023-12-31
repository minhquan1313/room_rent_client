import MyButton from "@/Components/MyButton";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import { MessageFilled, MessageOutlined } from "@ant-design/icons";
import { ButtonProps } from "antd";
import { memo, useContext } from "react";

const ChatBtn_ = (rest: ButtonProps) => {
  const { myTheme } = useContext(ThemeContext);

  return (
    <MyButton
      icon={myTheme === "dark" ? <MessageFilled /> : <MessageOutlined />}
      shape="circle"
      {...rest}
    />
  );
};

export const ChatBtn = memo(ChatBtn_);
