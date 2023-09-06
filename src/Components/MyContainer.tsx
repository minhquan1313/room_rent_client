import { theme } from "antd";
import { HTMLAttributes, ReactNode } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function MyContainer({ children, ...rest }: IProps) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div style={{ backgroundColor: colorBgContainer }}>
      <div
        {...rest}
        className={"bg-red-3001 container bg-red-300" + rest.className}
      >
        {children}
      </div>
    </div>
  );
}

export default MyContainer;
