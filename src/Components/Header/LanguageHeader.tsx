import FlagUSIcon from "@/Components/Icons/FlagUSIcon";
import FlagVNIcon from "@/Components/Icons/FlagVNIcon";
import GoogleTranslate from "@/Components/Icons/GoogleTranslate";
import MyButton from "@/Components/MyButton";
import { TAvailableLanguage } from "@/translations/i18n";
import { Dropdown } from "antd";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const LanguageHeader = memo(() => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: TAvailableLanguage) => {
    i18n.changeLanguage(language);
  };

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "vi",
            onClick: () => changeLanguage("vi"),
            label: "Tiếng Việt",
            icon: <FlagVNIcon className="!text-xl" />,
          },
          {
            key: "en",
            onClick: () => changeLanguage("en"),
            label: "English",
            icon: <FlagUSIcon className="!text-xl" />,
          },
        ],
        selectable: true,
        selectedKeys: [i18n.language],
      }}
      arrow
      placement="bottomRight"
      trigger={["click"]}
    >
      <MyButton icon={<GoogleTranslate />} shape="circle" size="large" />
    </Dropdown>
  );
});

export default LanguageHeader;
