import MyContainer from "@/Components/MyContainer";
import NotFoundContent from "@/Components/NotFoundContent";
import RoomListItem from "@/Components/RoomListItem";
import { SavedContext } from "@/Contexts/SavedProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { fetcher } from "@/services/fetcher";
import { IRoom } from "@/types/IRoom";
import logger from "@/utils/logger";
import { pageTitle } from "@/utils/pageTitle";
import { Divider, List, Skeleton, Typography } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

const LIMIT = 5;
// let page = 1;
const BookMarkRoom = () => {
  const { t } = useTranslation();

  pageTitle(t("page name.Bookmark"));

  const { user } = useContext(UserContext);
  const { saved, add, page, setPage, hasMore, setHasMore } =
    useContext(SavedContext);

  const [rooms, setRooms] = useState<IRoom[]>(saved);
  const [loading, setLoading] = useState(false);

  const fetched = useRef(rooms.length !== 0);
  logger(`🚀 ~ BookMarkRoom ~ page:`, page);

  logger(`🚀 ~ BookMarkRoom ~ fetched:`, fetched);

  async function loadMoreData() {
    fetched.current = true;
    logger(`🚀 ~ loadMoreData`);

    if (loading || !hasMore || !user) return;

    setLoading(true);
    try {
      const d = await fetcher<any, IRoom[]>(
        `/saved?user=${user!._id}&limit=${LIMIT}&page=${page}&to_room&saved`,
      );
      logger(`🚀 ~ loadMoreData ~ d:`, d);

      const newData = rooms.concat(d);
      newData.forEach((r) => {
        add(r);
        setRooms((pre) => {
          if (pre.find((p) => p._id === r._id)) return pre;

          return [...pre, r];
        });
      });

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

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <MyContainer>
      <Divider orientation="left">
        <Typography.Title level={3}>
          {t("User.Bookmark page.Bookmarked rooms")}
        </Typography.Title>
      </Divider>
      <InfiniteScroll
        dataLength={rooms.length}
        next={loadMoreData}
        hasMore={hasMore}
        loader={<Skeleton paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>{t("Extra.No more content")}</Divider>}
      >
        <List
          renderItem={(room) => <RoomListItem room={room} key={room._id} />}
          locale={{
            emptyText: <NotFoundContent />,
          }}
          loading={!rooms}
          dataSource={rooms}
          itemLayout="vertical"
        />
      </InfiniteScroll>
    </MyContainer>
  );
};

export default BookMarkRoom;
