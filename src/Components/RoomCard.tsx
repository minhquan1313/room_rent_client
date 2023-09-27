import BadgeRoomPrice from "@/Components/BadgeRoomPrice";
import MyImage from "@/Components/MyImage";
import { UserLocationContext } from "@/Contexts/UserLocationProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleAdmin } from "@/constants/roleType";
import { routeRoomDetail, routeRoomEdit } from "@/constants/route";
import { IRoom } from "@/types/IRoom";
import { calculateDistance } from "@/utils/calculateDistance";
import { dateFormat } from "@/utils/dateFormat";
import { toStringLocation } from "@/utils/toString";
import { EditOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Card, Tooltip, Typography } from "antd";
import convert from "convert";
import { ReactNode, useContext } from "react";
import { Link } from "react-router-dom";

interface RoomCardProps {
  room: IRoom;
  saved?: boolean;
  actions?: ReactNode[];
  onSave?(saved: boolean): void;
}
export const RoomCard = ({ room, saved, onSave }: RoomCardProps) => {
  const { _id, images, name, location, createdAt, owner, price_per_month } =
    room;

  const { user } = useContext(UserContext);
  const { coords } = useContext(UserLocationContext);

  const SavedComponent = saved ? HeartFilled : HeartOutlined;

  const actions: ReactNode[] = [
    <SavedComponent
      onClick={(e) => {
        e.preventDefault();
        console.log(room._id);

        onSave && onSave(!!saved);
      }}
    />,
  ];

  (user?._id === owner._id || isRoleAdmin(user?.role.title)) &&
    actions.push(
      ...[
        <Tooltip title="Sửa thông tin">
          <Link
            to={`${routeRoomEdit}/${_id}`}
            state={{
              room,
            }}
          >
            <EditOutlined key="edit" />
          </Link>
        </Tooltip>,
      ],
    );

  return (
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
        // className="transition hover:shadow-lg"
        actions={actions}
        size="small"
      >
        <Link
          to={`${routeRoomDetail}/${_id}`}
          state={{
            room,
          }}
        >
          <div className="flex justify-between">
            <Typography.Paragraph ellipsis={{ rows: 1 }}>
              {location?.province ?? " "}
            </Typography.Paragraph>

            <Typography.Text className="whitespace-nowrap">
              {dateFormat(createdAt).fromNow()}
            </Typography.Text>
          </div>

          <Typography.Title
            level={5}
            ellipsis={{ rows: 2 }}
            className="h-12 leading-6"
          >
            {name}
          </Typography.Title>

          <Typography.Paragraph
            ellipsis={{ rows: 2 }}
            className="!mb-0 !mt-auto h-12 leading-6"
          >
            {location ? toStringLocation(location, false) : "..."}
          </Typography.Paragraph>

          {coords && location && (
            <Typography.Paragraph
              ellipsis={{ rows: 1 }}
              className="!mb-0 text-right"
            >
              {
                // numberFormat(
                (() => {
                  const v = convert(
                    calculateDistance(coords, {
                      lat: location.lat_long.coordinates[1],
                      lng: location.lat_long.coordinates[0],
                    }),
                    "m",
                  ).to("best");

                  return `${v.quantity.toFixed(0)} ${v.unit}`;
                })()

                // )
              }
            </Typography.Paragraph>
          )}
        </Link>
      </Card>
    </BadgeRoomPrice>
  );
};
