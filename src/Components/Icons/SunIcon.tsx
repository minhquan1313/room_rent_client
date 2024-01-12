import IconSvg from "@/assets/sun.svg?react";
import Icon from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

export default function SunIcon(props: Partial<CustomIconComponentProps>) {
  return <Icon component={IconSvg} {...props} />;
}
