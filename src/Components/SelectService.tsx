import NotFoundContent from "@/Components/NotFoundContent";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { roomServiceIcon } from "@/utils/roomServiceIcon";
import { searchFilterTextHasLabel } from "@/utils/searchFilterTextHasLabel";
import { Select, SelectProps, Space } from "antd";
import { memo, useContext } from "react";
import { useTranslation } from "react-i18next";

interface Props extends SelectProps {}

const SelectService = memo(({ ...rest }: Props) => {
  const { t } = useTranslation();
  const { t: tApi } = useTranslation("api");
  const { roomServicesConverted } = useContext(GlobalDataContext);

  return (
    <Select
      filterOption={searchFilterTextHasLabel}
      notFoundContent={<NotFoundContent />}
      mode="multiple"
      showSearch={true}
      placeholder={t("home page.Room service")}
      {...rest}
    >
      {
        roomServicesConverted &&
          roomServicesConverted.map(({ category, services }) => (
            <Select.OptGroup
              label={tApi(
                `data code.room service cate.${category === "unknown" ? "unknown" : category.title}`,
              )}
              // label={
              //   category === "unknown"
              //     ? "Chưa phân loại"
              //     : category.display_name ?? category.title
              // }
              key={category === "unknown" ? -1 : category.title}
            >
              {services.map(({ display_name, title }) => (
                <Select.Option
                  value={title}
                  key={title}
                  label={tApi(`data code.room service.${title}`)}
                  // label={display_name}
                >
                  <Space>
                    {roomServiceIcon(title)}{" "}
                    {tApi(`data code.room service.${title}`)}
                    {/* {roomServiceIcon(title)} {display_name} */}
                  </Space>
                </Select.Option>
              ))}
            </Select.OptGroup>
          ))
        // roomServices.map(({ display_name, title }) => (
        //   <Select.Option key={title} value={title}>
        //     {display_name}
        //   </Select.Option>
        // ))
      }
    </Select>
  );
});

export default SelectService;
