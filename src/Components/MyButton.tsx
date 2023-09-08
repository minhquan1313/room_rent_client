import { Button, ButtonProps } from "antd";
import { Link } from "react-router-dom";

interface IProps extends ButtonProps {
  to?: string;
  loading?: boolean;
  display?: "inline";
}
function MyButton({ to, type = "default", children, ...rest }: IProps) {
  const props: IProps = {
    ...rest,
    type: type,
  };

  if (!to) return <Button {...props}>{children}</Button>;

  return (
    <Button {...props}>
      <Link to={to} className="inline-block">
        {children}

        {/* MASK */}
        <div className="absolute inset-0 opacity-0" />
      </Link>
    </Button>
  );
}

export default MyButton;
