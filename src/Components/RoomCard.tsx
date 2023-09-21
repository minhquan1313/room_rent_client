import MyImage from "@/Components/MyImage";
import { UserLocationContext } from "@/Contexts/UserLocationProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleAdmin } from "@/constants/roleType";
import { IRoom } from "@/types/IRoom";
import { calculateDistance } from "@/utils/calculateDistance";
import { dateFormat } from "@/utils/dateFormat";
import { numberFormat } from "@/utils/numberFormat";
import { toStringLocation } from "@/utils/toString";
import { EditOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Badge, Card, Tooltip, Typography } from "antd";
import convert from "convert";
import { ReactNode, useContext } from "react";

interface RoomCardProps {
  room: IRoom;
  saved?: boolean;
  actions?: ReactNode[];
  onSave?(saved: boolean): void;
}
export const RoomCard = ({
  room: { _id, images, name, location, createdAt, owner, price_per_month },
  saved,
  onSave,
}: RoomCardProps) => {
  const { user } = useContext(UserContext);
  const { coords } = useContext(UserLocationContext);

  const SavedComponent = saved ? HeartFilled : HeartOutlined;

  const actions: ReactNode[] = [
    <div className="pointer-events-none">
      <SavedComponent
        key="save"
        onClick={(e) => {
          e.preventDefault();

          onSave && onSave(!!saved);
        }}
      />
    </div>,
  ];
  user?._id === owner._id ||
    (isRoleAdmin(user?.role.title) &&
      actions.push(
        ...[
          //
          <Tooltip title="Sửa thông tin">
            {/* <Link to={routeRoomEdit + "/" + _id}> */}
            <EditOutlined key="edit" />
            {/* </Link> */}
          </Tooltip>,
        ],
      ));

  return (
    <Badge.Ribbon
      text={numberFormat(String(price_per_month), true)}
      color={(() => {
        if (price_per_month >= 3000000) return "red";
        if (price_per_month >= 2000000) return "gold";
        if (price_per_month >= 1000000) return "pink";
        if (price_per_month >= 500000) return "lime";

        return "blue";
        // return "blue";
      })()}
    >
      <Card
        cover={
          <MyImage
            src={images[0]?.image}
            addServer
            width={"100%"}
            className="aspect-video object-cover"
            preview={false}
          />
        }
        // className="transition hover:shadow-lg"
        actions={actions}
        size="small"
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
      </Card>
    </Badge.Ribbon>
  );
};
