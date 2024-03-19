import FlagUSIcon from "@/Components/Icons/FlagUSIcon";
import FlagVNIcon from "@/Components/Icons/FlagVNIcon";
import GoogleTranslate from "@/Components/Icons/GoogleTranslate";
import MyButton from "@/Components/MyButton";
import {
  TAvailableLanguage,
  languagesLabels,
  saveLanguage,
} from "@/translations/i18n";
import { Dropdown } from "antd";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const langFlagMap = {
  vi: FlagVNIcon,
  en: FlagUSIcon,
};

const LanguageSwitcher = memo(function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // const SelectedFlag = langFlagMap[i18n.language as TAvailableLanguage];

  const changeLanguage = (language: TAvailableLanguage) => {
    i18n.changeLanguage(language);
    saveLanguage(language);
  };

  const clickHandle = (e: { key: string }) => {
    changeLanguage(e.key as TAvailableLanguage);
  };

  return (
    <Dropdown
      menu={{
        items: Object.keys(langFlagMap).map((key) => {
          const Flag = langFlagMap[key as TAvailableLanguage];
          const label = languagesLabels[key as TAvailableLanguage];

          return {
            key,
            onClick: clickHandle,
            label,
            icon: <Flag className="!text-xl" />,
          };
        }),
        selectable: true,
        selectedKeys: [i18n.language],
      }}
      arrow
      placement="bottomRight"
      trigger={["click"]}
    >
      <MyButton
        icon={<GoogleTranslate />}
        // icon={<SelectedFlag />}
        shape="circle"
        size="large"
        type="text"
      />
    </Dropdown>
  );
});

export default LanguageSwitcher;
