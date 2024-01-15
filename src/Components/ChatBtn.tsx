import MyButton from "@/Components/MyButton";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import { IButtonIconProps } from "@/types/IButtonIconProps";
import { MessageFilled, MessageOutlined } from "@ant-design/icons";
import { memo, useContext } from "react";

const ChatBtn = memo(
  ({ iconClassName, iconStyle, ...rest }: IButtonIconProps) => {
    const { myTheme } = useContext(ThemeContext);

    return (
      <MyButton
        // icon={
        //   myTheme === "dark" ? (
        //     <MessageFilled className={iconClassName} style={iconStyle} />
        //   ) : (
        //     <MessageOutlined className={iconClassName} style={iconStyle} />
        //   )
        // }
        shape="circle"
        style={{
          padding: 0,
        }}
        {...rest}
      >
        {myTheme === "dark" ? (
          <MessageFilled className={iconClassName} style={iconStyle} />
        ) : (
          <MessageOutlined className={iconClassName} style={iconStyle} />
        )}
      </MyButton>
    );
  },
);

export default ChatBtn;
