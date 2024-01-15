import MoonIcon from "@/Components/Icons/MoonIcon";
import SunIcon from "@/Components/Icons/SunIcon";
import MyButton from "@/Components/MyButton";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import { Dropdown } from "antd";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export default function ThemeSwitcher() {
  const { myTheme, systemTheme, isUsingSystemTheme, switchTheme } =
    useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "light",
            onClick: () => switchTheme("light"),
            label: t("Theme.Light"),
            icon: <SunIcon />,
          },
          {
            key: "dark",
            onClick: () => switchTheme("dark"),
            label: t("Theme.Dark"),
            icon: <MoonIcon />,
          },
          {
            key: "system",
            onClick: () => switchTheme("system"),
            label: t("Theme.System"),
            icon: systemTheme === "dark" ? <MoonIcon /> : <SunIcon />,
          },
        ],
        selectable: true,
        selectedKeys: [isUsingSystemTheme ? "system" : myTheme],
      }}
      arrow
      placement="bottomRight"
      trigger={["click"]}
    >
      <MyButton
        type={isUsingSystemTheme ? "default" : "primary"}
        icon={myTheme === "dark" ? <MoonIcon /> : <SunIcon />}
        shape="circle"
        size="large"
      />
    </Dropdown>
  );
}
