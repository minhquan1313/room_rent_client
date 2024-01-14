import IconSvg from "@/assets/icons/google_translate.svg?react";
import Icon from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

export default function MoonIcon(props: Partial<CustomIconComponentProps>) {
  return <Icon component={IconSvg} {...props} />;
}
