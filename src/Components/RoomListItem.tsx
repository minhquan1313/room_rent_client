import ActionRoomCard from "@/Components/ActionRoomCard";
import MyImage from "@/Components/MyImage";
import RoomStateTags from "@/Components/RoomStateTags";
import { UserLocationContext } from "@/Contexts/UserLocationProvider";
import { routeRoomDetail } from "@/constants/route";
import { IRoom } from "@/types/IRoom";
import { calculateDistance } from "@/utils/calculateDistance";
import { dateFormat } from "@/utils/dateFormat";
import { numberFormat } from "@/utils/numberFormat";
import roomLocToCoord from "@/utils/roomLocToCoord";
import { toStringCurrencyCode, toStringLocation } from "@/utils/toString";
import { List, Typography } from "antd";
import convert from "convert";
import { memo, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface RoomCardProps {
  room: IRoom;
  showState?: boolean;
}

const RoomListItem = memo(({ room, showState }: RoomCardProps) => {
  const { t } = useTranslation();
  const { t: tLocation } = useTranslation("location");

  const { _id, images, name, location, createdAt, price_per_month, price_currency_code } = room;

  const { coords } = useContext(UserLocationContext);

  return (
    <List.Item actions={ActionRoomCard({ room })} className="">
      <div className="flex flex-col gap-2 md:flex-row">
        <Link state={{ room }} to={`${routeRoomDetail}/${_id}`} className="block flex-1">
          <div className="flex justify-between">
            <Typography.Paragraph>{tLocation("translate", { val: location?.province ?? " " })}</Typography.Paragraph>
          </div>

          <Typography.Title level={5} className="leading-6">
            {name}
          </Typography.Title>

          <Typography.Paragraph className="!mt-auto leading-6">{location ? toStringLocation(location, false) : "..."}</Typography.Paragraph>

          {coords && location && (
            <Typography.Paragraph className="text-right">
              {(() => {
                const v = convert(calculateDistance(coords, roomLocToCoord(location)), "m").to("best");

                return `${v.quantity.toFixed(0)} ${v.unit}`;
              })()}
            </Typography.Paragraph>
          )}

          <Typography.Paragraph>
            {numberFormat(price_per_month)}
            {toStringCurrencyCode(price_currency_code)} / {t("Extra.Month")}
          </Typography.Paragraph>

          <Typography.Paragraph>
            {dateFormat(createdAt).fromNow()} - {dateFormat(createdAt).format("LLL")}
          </Typography.Paragraph>

          {showState !== false && <RoomStateTags room={room} />}
        </Link>

        <Link
          to={`${routeRoomDetail}/${_id}`}
          state={{
            room,
          }}
          className="block w-full md:w-96"
        >
          <MyImage src={images[0]?.image} addServer width={"100%"} className="aspect-video rounded-md object-cover" preview={false} />
        </Link>
      </div>
    </List.Item>
  );
});

export default RoomListItem;
