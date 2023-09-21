import MoonIcon from "@/Components/Icons/MoonIcon";
import SunIcon from "@/Components/Icons/SunIcon";
import MyButton from "@/Components/MyButton";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import { Popover, Space, Tooltip } from "antd";
import { useContext } from "react";

export default function ThemeSwitcher() {
  const { myTheme, systemTheme, themeChangedManually, switchTheme } =
    useContext(ThemeContext);

  return (
    <Popover
      // open={true}
      // color="transparent"
      // overlayInnerStyle={{ boxShadow: "none" }}
      trigger="hover"
      content={
        <Space direction="vertical">
          {/* <Tooltip
            placement="left"
            title="Sáng"> */}
          <MyButton
            type={
              myTheme === "light" && themeChangedManually
                ? "primary"
                : "default"
            }
            shape="circle"
            onClick={() => {
              switchTheme("light");
            }}
            icon={<SunIcon />}
          />
          {/* </Tooltip> */}

          {/* <Tooltip
            placement="left"
            title="Tối"> */}
          <MyButton
            type={
              myTheme === "dark" && themeChangedManually ? "primary" : "default"
            }
            shape="circle"
            onClick={() => {
              switchTheme("dark");
            }}
            icon={<MoonIcon />}
          />
          {/* </Tooltip> */}

          <Tooltip
            placement="left"
            autoAdjustOverflow={true}
            title="Theo hệ thống"
          >
            <MyButton
              type={!themeChangedManually ? "primary" : "dashed"}
              shape="circle"
              onClick={() => {
                switchTheme("system");
              }}
              icon={systemTheme === "dark" ? <MoonIcon /> : <SunIcon />}
            />
          </Tooltip>
        </Space>
      }
    >
      <MyButton
        type={themeChangedManually ? "primary" : "dashed"}
        shape="circle"
        onClick={() => {
          switchTheme(myTheme === "dark" ? "light" : "dark");
        }}
        icon={myTheme === "dark" ? <MoonIcon /> : <SunIcon />}
      />
    </Popover>
  );
}
