import NotFoundContent from "@/Components/NotFoundContent";
import { IRoom } from "@/types/IRoom";
import { FallOutlined, RiseOutlined } from "@ant-design/icons";
import { Select, SelectProps } from "antd";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

const SelectSortField = memo((rest: SelectProps) => {
  const { t } = useTranslation();

  const fields: {
    title: `${keyof IRoom}#${1 | -1}`;
    display_name: string | JSX.Element;
  }[] = useMemo(
    () => [
      //
      {
        title: "price_per_month#1",
        display_name: (
          <>
            {t("Search page.Cost")} <RiseOutlined />
          </>
        ),
      },
      {
        title: "price_per_month#-1",
        display_name: (
          <>
            {t("Search page.Cost")} <FallOutlined />
          </>
        ),
      },
      {
        title: "createdAt#1",
        display_name: (
          <>
            {t("Search page.Date submitted")} <RiseOutlined />
          </>
        ),
      },
      {
        title: "createdAt#-1",
        display_name: (
          <>
            {t("Search page.Date submitted")} <FallOutlined />
          </>
        ),
      },
      {
        title: "usable_area#1",
        display_name: (
          <>
            {t("Search page.Usable area")} <RiseOutlined />
          </>
        ),
      },
      {
        title: "usable_area#-1",
        display_name: (
          <>
            {t("Search page.Usable area")} <FallOutlined />
          </>
        ),
      },
    ],
    [],
  );

  return (
    <Select
      notFoundContent={<NotFoundContent />}
      placeholder={t("Search page.Sort")}
      {...rest}
    >
      {fields.map(({ display_name, title }) => (
        <Select.Option value={title} key={title}>
          {display_name}
        </Select.Option>
      ))}
    </Select>
  );
});

export default SelectSortField;
