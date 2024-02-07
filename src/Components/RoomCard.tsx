import ActionRoomCard from "@/Components/ActionRoomCard";
import BadgeRoomPrice from "@/Components/BadgeRoomPrice";
import MyImage from "@/Components/MyImage";
import RoomStateTags from "@/Components/RoomStateTags";
import { UserLocationContext } from "@/Contexts/UserLocationProvider";
import { routeRoomDetail } from "@/constants/route";
import { IRoom } from "@/types/IRoom";
import { calculateDistance } from "@/utils/calculateDistance";
import { dateFormat } from "@/utils/dateFormat";
import { toStringLocation } from "@/utils/toString";
import { Card, Typography } from "antd";
import convert from "convert";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface RoomCardProps {
  room: IRoom;
  showState?: boolean;
}

const { Text, Paragraph, Title } = Typography;

export const RoomCard = ({ room, showState }: RoomCardProps) => {
  const { t } = useTranslation("location");

  const { _id, images, name, location, createdAt, price_per_month } = room;

  const { coords } = useContext(UserLocationContext);

  return (
    <div>
      <BadgeRoomPrice price={price_per_month}>
        <Card
          cover={
            <Link
              to={`${routeRoomDetail}/${_id}`}
              state={{
                room,
              }}
            >
              <MyImage
                src={images[0]?.image}
                addServer
                width={"100%"}
                className="aspect-video object-cover"
                preview={false}
              />
            </Link>
          }
          actions={ActionRoomCard({ room })}
          size="small"
        >
          <Link
            to={`${routeRoomDetail}/${_id}`}
            state={{
              room,
            }}
          >
            <div className="flex justify-between">
              <Paragraph ellipsis={{ rows: 1 }}>
                {t("translate", { val: location?.province })}
              </Paragraph>

              <Text className="whitespace-nowrap">
                {dateFormat(createdAt).fromNow()}
              </Text>
            </div>

            <Title level={5} ellipsis={{ rows: 2 }} className="h-12 leading-6">
              {name}
            </Title>

            <Paragraph
              ellipsis={{ rows: 2 }}
              className="!mb-0 !mt-auto h-12 leading-6"
            >
              {location ? toStringLocation(location, false) : "..."}
            </Paragraph>

            <RoomStateTags room={room} />

            {coords && location && (
              <Paragraph ellipsis={{ rows: 1 }} className="!mb-0 text-right">
                {(() => {
                  const v = convert(
                    calculateDistance(coords, {
                      lat: location.lat_long.coordinates[1],
                      lng: location.lat_long.coordinates[0],
                    }),
                    "m",
                  ).to("best");

                  return `${v.quantity.toFixed(0)} ${v.unit}`;
                })()}
              </Paragraph>
            )}
          </Link>
        </Card>
      </BadgeRoomPrice>
    </div>
  );
};
