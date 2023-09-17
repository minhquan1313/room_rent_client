import MyImage from "@/Components/MyImage";
import { UserContext } from "@/Contexts/UserProvider";
import { IRoom } from "@/types/IRoom";
import { dateFormat } from "@/utils/dateFormat";
import { numberFormat } from "@/utils/numberFormat";
import { locationToString } from "@/utils/toString";
import { EditOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Badge, Card, Tooltip, Typography } from "antd";
import { ReactNode, useContext } from "react";

interface RoomCardProps {
  room: IRoom;
  saved?: boolean;
  actions?: ReactNode[];
  onSave?(saved: boolean): void;
}
export const RoomListItem = ({
  room: { images, name, location, createdAt, owner, price_per_month },
  saved,
  onSave,
}: RoomCardProps) => {
  const { user } = useContext(UserContext);
  const SavedComponent = saved ? HeartFilled : HeartOutlined;

  const actions: ReactNode[] = [
    <SavedComponent key="save" onClick={() => onSave && onSave(!!saved)} />,
  ];
  user?._id === owner._id &&
    actions.push(
      ...[
        //
        <Tooltip title="Sửa thông tin">
          <EditOutlined key="edit" />
        </Tooltip>,
      ],
    );

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
          {location ? locationToString(location, false) : "..."}
        </Typography.Paragraph>
      </Card>
    </Badge.Ribbon>
  );
};
