import { ButtonProps } from "antd";
import { CSSProperties } from "react";

export interface IButtonIconProps extends ButtonProps {
  iconClassName?: string;
  iconStyle?: CSSProperties;
}
