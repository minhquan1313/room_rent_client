import Icon from "@ant-design/icons";
import type { GetProps } from "antd";
import { memo } from "react";
import { GrMapLocation } from "react-icons/gr";

type CustomIconComponentProps = GetProps<typeof Icon>;

const GoogleMapIcon = memo((props: Partial<CustomIconComponentProps>) => {
  return <Icon component={GrMapLocation} {...props} />;
});

export default GoogleMapIcon;
