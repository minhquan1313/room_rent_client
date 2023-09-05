import { Button, ButtonProps } from "antd";
import { Link, useNavigate } from "react-router-dom";

interface IProps extends ButtonProps {
  to?: string;
  loading?: boolean;
  display?: "inline";
}
function MyButton({
  to = "",
  type = "default",
  onClick,

  children,
  ...rest
}: IProps) {
  const nav = useNavigate();

  return (
    <Button
      type={type}
      style={{
        position: "relative",
      }}
      onClick={(e) => {
        onClick && onClick(e);
        to &&
          nav({
            pathname: to,
          });
      }}
      {...rest}>
      {children ||
        (to && (
          <>
            {to && (
              <Link
                to={to}
                style={{ position: "absolute", inset: 0, opacity: 0 }}>
                {children}
              </Link>
            )}
          </>
        ))}
    </Button>
  );
}

export default MyButton;
