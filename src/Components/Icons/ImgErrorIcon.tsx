import { ReactComponent as IconSvg } from "@/assets/imgError.svg";
import Icon from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

export default function ImgErrorIcon(props: Partial<CustomIconComponentProps>) {
  return <Icon component={IconSvg} {...props} />;
}
