import { theme } from "antd";
import classNames from "classnames";
import { HTMLAttributes, ReactNode, useEffect } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  innerClassName?: HTMLAttributes<HTMLDivElement>["className"];
  noBg?: boolean;
  children?: ReactNode;
}

function MyContainer({
  children,
  className,
  innerClassName,
  noBg,
  style,
  ...rest
}: IProps) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div
      className={classNames("min-w-full transition", className)}
      style={{
        backgroundColor: noBg ? "transparent" : colorBgContainer,
        ...style,
      }}
    >
      <div
        {...rest}
        className={classNames("bg-red-3001 container", innerClassName)}
      >
        {children}
      </div>
    </div>
  );
}

function Center({ children, className, ...rest }: IProps) {
  return (
    <MyContainer
      {...rest}
      className="flex"
      innerClassName={classNames("mx-auto my-auto", className)}
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
    document.body.className = "overflow-x-hidden";

    const root = document.querySelector("#root");
    root && root.classList.add("flex", "min-h-full", "relative");
  }, []);

  return <>{children}</>;
}

MyContainer["Center"] = Center;
MyContainer["Raw"] = Raw;

export default MyContainer;
