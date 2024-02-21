import NotFoundContent from "@/Components/NotFoundContent";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import logger from "@/utils/logger";
import { Select, SelectProps } from "antd";
import { memo, useContext } from "react";
import { useTranslation } from "react-i18next";

interface Props extends SelectProps {
  // value?: string[];
  // onChange?: (value: string[]) => void;
}

const SelectRoomType = memo(({ ...rest }: Props) => {
  const { t } = useTranslation();
  const { t: tApi } = useTranslation("api");
  const { roomTypes } = useContext(GlobalDataContext);
  logger(`🚀 ~ SelectRoomType ~ roomTypes:`, roomTypes);

  return (
    <Select
      notFoundContent={<NotFoundContent />}
      placeholder={t("home page.Room type")}
      {...rest}
    >
      {roomTypes &&
        roomTypes.map(({ title }) => (
          <Select.Option value={title} key={title}>
            {tApi(`data code.room type.${title}`)}
          </Select.Option>
        ))}
    </Select>
  );
});

export default SelectRoomType;
