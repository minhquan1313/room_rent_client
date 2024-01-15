import Icon from "@ant-design/icons";
import type { GetProps } from "antd";
import { VN } from "country-flag-icons/react/3x2";
import { memo } from "react";

type CustomIconComponentProps = GetProps<typeof Icon>;

const FlagVNIcon = memo((props: Partial<CustomIconComponentProps>) => {
  return <Icon component={VN as any} {...props} />;
});

export default FlagVNIcon;
