import { ReactComponent as IconSvg } from "@/assets/216-moon-3.svg";
import Icon from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

export default function MoonIcon(props: Partial<CustomIconComponentProps>) {
  return (
    <Icon
      component={IconSvg}
      {...props}
    />
  );
}
