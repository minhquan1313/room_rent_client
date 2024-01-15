import Icon from "@ant-design/icons";
import type { GetProps } from "antd";
import { US } from "country-flag-icons/react/3x2";
import { memo } from "react";

type CustomIconComponentProps = GetProps<typeof Icon>;

const FlagUSIcon = memo((props: Partial<CustomIconComponentProps>) => {
  return <Icon component={US as any} {...props} />;
});

export default FlagUSIcon;
