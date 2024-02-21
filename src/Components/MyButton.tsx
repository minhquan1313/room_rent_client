import { Button, ButtonProps } from "antd";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import { Link } from "react-router-dom";

export interface MyButtonProps extends ButtonProps {
  to?: string;
  display?: "inline";
}

export type MyButtonRef = HTMLElement;

const MyButton = memo(
  forwardRef<MyButtonRef, MyButtonProps>(function MyButton(
    { to, type = "default", children, ...rest },
    ref,
  ) {
    const btnRef = useRef<HTMLElement>(null as any);

    const props = {
      ...rest,
      type: type,
    };

    useImperativeHandle(ref, () => btnRef.current);

    if (!to)
      return (
        <Button {...props} ref={btnRef}>
          {children}
        </Button>
      );

    if (to.startsWith("http")) {
      // external
      return (
        <Button {...props} ref={btnRef}>
          <a href={to} target="_blank" rel="noopener" className="inline-block">
            {children}
            {/* MASK */}
            <div className="absolute inset-0 opacity-0" />
          </a>
        </Button>
      );
    } else {
      // internal
      return (
        <Button {...props} ref={btnRef}>
          <Link to={to} className="inline-block">
            {children}
            {/* MASK */}
            <div className="absolute inset-0 opacity-0" />
          </Link>
        </Button>
      );
    }
  }),
);

export default MyButton;
