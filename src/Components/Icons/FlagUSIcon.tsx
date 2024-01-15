import IconSvg from "@/assets/icons/flag_us.svg?react";
import Icon from "@ant-design/icons";
import type { GetProps } from "antd";
import { memo } from "react";

type CustomIconComponentProps = GetProps<typeof Icon>;

const FlagUSIcon = memo((props: Partial<CustomIconComponentProps>) => {
  return <Icon component={IconSvg} {...props} />;
});

export default FlagUSIcon;
