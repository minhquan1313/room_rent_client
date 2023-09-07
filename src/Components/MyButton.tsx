import { Button, ButtonProps } from "antd";
import classNames from "classnames";
import { Link } from "react-router-dom";

interface IProps extends ButtonProps {
  to?: string;
  rawTo?: boolean;
  loading?: boolean;
  display?: "inline";
}
function MyButton({ to, rawTo, type = "default", children, ...rest }: IProps) {
  const props: IProps = {
    ...rest,
    type: type,
  };

  if (!to) return <Button {...props}>{children}</Button>;

  // const className=rawTo?classNames("inline-block", rest.className):
  const r = rawTo ? rest : {};
  const MyLink = (
    <Link
      to={to}
      {...r}
      className={classNames("inline-block", rawTo && rest.className)}
    >
      {children}

      {/* MASK */}
      <div className="absolute inset-0 opacity-0" />
    </Link>
  );

  return rawTo ? MyLink : <Button {...props}>{MyLink}</Button>;
}

export default MyButton;
