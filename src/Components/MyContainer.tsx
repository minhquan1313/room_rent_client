import { theme } from "antd";
import classNames from "classnames";
import { HTMLAttributes, ReactNode, useEffect } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  outerClassName?: HTMLAttributes<HTMLDivElement>["className"];
  children?: ReactNode;
}

function MyContainer({
  children,
  className,
  outerClassName,
  style,
  ...rest
}: IProps) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div
      className={classNames("min-w-full", outerClassName)}
      style={{
        backgroundColor: colorBgContainer,
        ...style,
      }}
    >
      <div {...rest} className={classNames("bg-red-3001 container", className)}>
        {children}
      </div>
    </div>
  );
}

function Center({ children, className, ...rest }: IProps) {
  return (
    <MyContainer
      {...rest}
      outerClassName="flex"
      className={classNames("mx-auto my-auto", className)}
    >
      {/* <div className="my-auto flex flex-1 flex-col items-center"> */}
      {children}
      {/* </div> */}
    </MyContainer>
  );
}

function Raw({ children }: Pick<IProps, "children">) {
  useEffect(() => {
    // document.documentElement.className = "overflow-y-scroll";
    // document.body.className = "overflow-y-scroll";
  }, []);

  return <>{children}</>;
}

MyContainer["Center"] = Center;
MyContainer["Raw"] = Raw;

export default MyContainer;
