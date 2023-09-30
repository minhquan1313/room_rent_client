import ActionRoomCard from "@/Components/ActionRoomCard";
import MyImage from "@/Components/MyImage";
import RoomStateTags from "@/Components/RoomStateTags";
import { UserLocationContext } from "@/Contexts/UserLocationProvider";
import { routeRoomDetail } from "@/constants/route";
import { IRoom } from "@/types/IRoom";
import { calculateDistance } from "@/utils/calculateDistance";
import { dateFormat } from "@/utils/dateFormat";
import { numberFormat } from "@/utils/numberFormat";
import { toStringLocation } from "@/utils/toString";
import { List, Typography } from "antd";
import convert from "convert";
import { memo, useContext } from "react";
import { Link } from "react-router-dom";

interface RoomCardProps {
  room: IRoom;
  showState?: boolean;
}

function RoomListItem_({ room, showState }: RoomCardProps) {
  const { _id, images, name, location, createdAt, price_per_month } = room;

  // const { user } = useContext(UserContext);
  const { coords } = useContext(UserLocationContext);

  // const SavedComponent = saved ? HeartFilled : HeartOutlined;

  // const actions: ReactNode[] = [
  //   <SavedComponent
  //     onClick={(e) => {
  //       e.preventDefault();
  //       console.log(room._id);

  //       onSave && onSave(!!saved);
  //     }}
  //   />,
  // ];

  // (user?._id === owner || isRoleAdmin(user?.role.title)) &&
  //   actions.push(
  //     ...[
  //       //
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
    <List.Item actions={ActionRoomCard({ room })} className="">
      <div className="flex flex-col gap-2 md:flex-row">
        <Link
          state={{
            room,
          }}
          to={`${routeRoomDetail}/${_id}`}
          className="block flex-1"
        >
          <div className="flex justify-between">
            <Typography.Paragraph>
              {location?.province ?? " "}
            </Typography.Paragraph>
          </div>

          <Typography.Title level={5} className="leading-6">
            {name}
          </Typography.Title>

          <Typography.Paragraph className="!mt-auto leading-6">
            {location ? toStringLocation(location, false) : "..."}
          </Typography.Paragraph>

          {coords && location && (
            <Typography.Paragraph className="text-right">
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
            </Typography.Paragraph>
          )}

          <Typography.Paragraph>
            {numberFormat(price_per_month)} / tháng
          </Typography.Paragraph>

          <Typography.Paragraph>
            {dateFormat(createdAt).fromNow()} -{" "}
            {dateFormat(createdAt).format("LLL")}
          </Typography.Paragraph>

          {RoomStateTags({ room })}
        </Link>

        <Link
          to={`${routeRoomDetail}/${_id}`}
          state={{
            room,
          }}
          className="block w-full md:w-96"
        >
          <MyImage
            src={images[0]?.image}
            addServer
            width={"100%"}
            className="aspect-video object-cover"
            preview={false}
          />
        </Link>
      </div>
    </List.Item>
  );
}

const RoomListItem = memo(RoomListItem_);
export default RoomListItem;
