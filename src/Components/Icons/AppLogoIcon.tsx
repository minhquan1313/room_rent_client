import { ReactComponent as IconSvg } from "@/assets/appLogo.svg";
import Icon from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

export default function AppLogoIcon(props: Partial<CustomIconComponentProps>) {
  return <Icon component={IconSvg} {...props} />;
}
