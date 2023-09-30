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
import { Link } from "react-router-dom";

interface RoomCardProps {
  room: IRoom;
  showState?: boolean;
  // saved?: boolean;
  // actions?: ReactNode[];
  // onSave?(saved: boolean): void;
}
export const RoomCard = ({ room, showState }: RoomCardProps) => {
  const { _id, images, name, location, createdAt, price_per_month } = room;

  // const { user } = useContext(UserContext);
  const { coords } = useContext(UserLocationContext);

  // const SavedComponent = HeartOutlined;
  // const SavedComponent = saved?.find((r) => r.user === user?._id)
  //   ? HeartFilled
  //   : HeartOutlined;

  // const actions: ReactNode[] = [
  //   <SavedComponent
  //     className="text-black"
  //     onClick={async () => {
  //       if (!user || !saved) return;

  //       console.log(room._id, saved);

  //       const isSaved = saved.find((r) => r.user === user._id);
  //       console.log(`🚀 ~ onClick={ ~ isSaved:`, isSaved);
  //       if (isSaved) {
  //         // unSave
  //         await deleteSaved(isSaved._id);
  //       } else {
  //         // save
  //         await saveRoom(user._id, _id);
  //       }
  //     }}
  //   />,
  // ];

  // (user?._id === owner || isRoleAdmin(user?.role.title)) &&
  //   actions.push(
  //     ...[
  //       <Tooltip title="Sửa thông tin">
  //         <Link
  //           to={`${routeRoomEdit}/${_id}`}
  //           state={{
  //             room,
  //           }}
  //         >
  //           <EditOutlined key="edit" />
  //         </Link>
  //       </Tooltip>,
  //     ],
  //   );

  return (
    <div
    // className={classNames({
    //   "brightness-50": !room.is_visible,
    // })}
    >
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

            <RoomStateTags room={room} />

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
    </div>
  );
};
