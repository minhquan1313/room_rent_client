import MyButton from "@/Components/MyButton";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import { SettingFilled, SettingOutlined } from "@ant-design/icons";
import { ButtonProps } from "antd";
import { memo, useContext } from "react";

const _ = (rest: ButtonProps) => {
  const { myTheme } = useContext(ThemeContext);

  return (
    <MyButton
      icon={myTheme === "dark" ? <SettingFilled /> : <SettingOutlined />}
      shape="circle"
      {...rest}
    />
  );
};

export const SettingBtn = memo(_);
