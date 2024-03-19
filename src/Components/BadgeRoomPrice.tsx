import { moneyInputFormat } from "@/utils/numberFormat";
import { Badge, BadgeProps } from "antd";

interface Props extends BadgeProps {
  price: number;
}
const BadgeRoomPrice = ({ price, children, ...rest }: Props) => {
  return (
    <Badge.Ribbon
      {...rest}
      text={moneyInputFormat(price, true)}
      color={(() => {
        if (price >= 3000000) return "red";
        if (price >= 2000000) return "gold";
        if (price >= 1000000) return "pink";
        if (price >= 500000) return "lime";

        return "blue";
      })()}
    >
      {children}
    </Badge.Ribbon>
  );
};

export default BadgeRoomPrice;
