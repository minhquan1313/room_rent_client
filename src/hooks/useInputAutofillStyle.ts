import { theme } from "antd";
import { HTMLAttributes } from "react";
type Style = HTMLAttributes<HTMLInputElement>["style"];

export default function useInputAutofillStyle() {
  const {
    token: { colorBgContainer, colorTextBase, fontFamily },
  } = theme.useToken();

  const inputAutofillStyle: Style = {
    WebkitBoxShadow: `0 0 0 50px ${colorBgContainer} inset`,
    WebkitTextFillColor: colorTextBase,
    fontFamily: fontFamily,
  };

  return inputAutofillStyle;
}
