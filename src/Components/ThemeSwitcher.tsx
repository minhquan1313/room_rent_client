import MoonIcon from "@/Components/Icons/MoonIcon";
import SunIcon from "@/Components/Icons/SunIcon";
import MyButton from "@/Components/MyButton";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import { Popover, Space } from "antd";
import { useContext } from "react";

export default function ThemeSwitcher() {
  const { myTheme, systemTheme, themeChangedManually, switchTheme } =
    useContext(ThemeContext);

  return (
    <Popover
      content={
        <Space direction="vertical">
          <MyButton
            type={
              myTheme === "light" && themeChangedManually
                ? "primary"
                : "default"
            }
            onClick={() => switchTheme("light")}
            className="text-left"
            block
            icon={<SunIcon />}
          >
            Sáng
          </MyButton>

          <MyButton
            type={
              myTheme === "dark" && themeChangedManually ? "primary" : "default"
            }
            onClick={() => switchTheme("dark")}
            className="text-left"
            block
            icon={<MoonIcon />}
          >
            Tối
          </MyButton>

          <MyButton
            type={!themeChangedManually ? "primary" : "dashed"}
            onClick={() => switchTheme("system")}
            className="text-left"
            block
            icon={systemTheme === "dark" ? <MoonIcon /> : <SunIcon />}
          >
            Hệ thống
          </MyButton>
        </Space>
      }
      placement="bottomRight"
      trigger="click"
      arrow={false}
    >
      <MyButton
        // onClick={() => setOpen(!isOpen)}
        type={themeChangedManually ? "primary" : "dashed"}
        icon={myTheme === "dark" ? <MoonIcon /> : <SunIcon />}
        shape="circle"
        size="large"
      />
    </Popover>
  );
}
