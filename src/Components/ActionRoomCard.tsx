import { SavedContext } from "@/Contexts/SavedProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleAdmin } from "@/constants/roleType";
import { routeRoomEdit } from "@/constants/route";
import { deleteSaved, saveRoom } from "@/services/saveRoom";
import { IRoom } from "@/types/IRoom";
import logger from "@/utils/logger";
import { EditOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import { ReactNode, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Props {
  room: IRoom;
}
const ActionRoomCard = ({ room }: Props): ReactNode[] => {
  const { t } = useTranslation();

  const { saved, _id } = room;

  const { add, remove } = useContext(SavedContext);
  const { user } = useContext(UserContext);
  const [_, set_] = useState({});

  function update() {
    set_({});
  }

  const SavedComponent = saved?.find((r) => r.user === user?._id)
    ? HeartFilled
    : HeartOutlined;

  const actions: ReactNode[] = [
    <Space>
      {room.saved?.[0] && room.saved.length}
      <SavedComponent
        onClick={async () => {
          logger(_id, saved);
          if (!user || !saved) return;

          const isSaved = saved.find((r) => r.user === user._id);
          logger(`🚀 ~ onClick={ ~ isSaved:`, isSaved);

          try {
            if (isSaved) {
              // unSave
              remove(isSaved.room);
              await deleteSaved(isSaved._id);
              room.saved = saved.filter((r) => r !== isSaved);
            } else {
              // save
              const doc = await saveRoom(user._id, _id);
              room.saved = saved.concat(doc);
              add(room, "left");
            }
            update();
          } catch (error) {
            logger(`🚀 ~ error:`, error);

            //
          }
        }}
      />
    </Space>,
  ];

  if (user?._id === room.owner || isRoleAdmin(user?.role?.title)) {
    actions.push(
      ...[
        <Tooltip title={t("Extra.Update")}>
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
  }

  return actions;
};

export default ActionRoomCard;
