import NotFoundContent from "@/Components/NotFoundContent";
import RoomListItem from "@/Components/RoomListItem";
import { UserContext } from "@/Contexts/UserProvider";
import { fetcher } from "@/services/fetcher";
import { IRoom } from "@/types/IRoom";
import logger from "@/utils/logger";
import { Divider, List, Skeleton } from "antd";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
  userId: string;
}

const LIMIT = 5;
const RoomListOfUser = memo(({ userId }: Props) => {
  const { t } = useTranslation();

  const { user } = useContext(UserContext);

  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetched = useRef(rooms.length !== 0);

  async function loadMoreData() {
    fetched.current = true;
    logger(`🚀 ~ loadMoreData`);
    logger(`🚀 ~ loadMoreData ~ hasMore:`, hasMore);
    logger(`🚀 ~ loadMoreData ~ loading:`, loading);
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const d = await fetcher<any, IRoom[]>(
        `/rooms?owner=${userId}&limit=${LIMIT}&page=${page}&saved`,
      );
      logger(`🚀 ~ loadMoreData ~ d:`, d);

      setRooms(rooms.concat(d));

      setPage(page + 1);
      if (d.length < LIMIT) setHasMore(false);
    } catch (error) {
      logger(`🚀 ~ loadMoreData ~ error:`, error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (fetched.current) return;

    loadMoreData();
  }, []);

  return (
    <InfiniteScroll
      dataLength={rooms.length}
      next={loadMoreData}
      hasMore={hasMore}
      loader={<Skeleton paragraph={{ rows: 1 }} active />}
      endMessage={<Divider plain>{t("Extra.No more content")}</Divider>}
      // scrollableTarget="scrollableDiv"
    >
      <List
        renderItem={(room) => {
          logger(`🚀 ~ room:`, room);
          if (!room.verified || !room.is_visible || room.disabled) {
            if (user?._id !== room.owner) return null;
          }

          return <RoomListItem room={room} key={room._id} />;
        }}
        locale={{
          emptyText: <NotFoundContent />,
        }}
        loading={!rooms}
        //   loadMore={loadMore}
        dataSource={rooms}
        itemLayout="vertical"
      />
    </InfiniteScroll>
  );
});

export default RoomListOfUser;
