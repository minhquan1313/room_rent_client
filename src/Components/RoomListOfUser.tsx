import NotFoundContent from "@/Components/NotFoundContent";
import RoomListItem from "@/Components/RoomListItem";
import { fetcher } from "@/services/fetcher";
import { IRoom } from "@/types/IRoom";
import { Divider, List, Skeleton } from "antd";
import { memo, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useSWR from "swr";

interface Props {
  userId: string;
}

const LIMIT = 5;
function RoomListOfUser_({ userId }: Props) {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [f, setF] = useState(true);
  const { data } = useSWR<IRoom[]>(
    f ? `/rooms?owner=${userId}&limit=${LIMIT}&page=${page}` : null,
    fetcher,
  );
  console.log(`🚀 ~ data:`, data);

  async function loadMoreData() {
    console.log(`🚀 ~ loadMoreData`);
    console.log(`🚀 ~ loadMoreData ~ hasMore:`, hasMore);
    console.log(`🚀 ~ loadMoreData ~ loading:`, loading);
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const d = await fetcher<any, IRoom[]>(
        `/rooms?owner=${userId}&limit=${LIMIT}&page=${page}`,
      );
      console.log(`🚀 ~ loadMoreData ~ d:`, d);

      setRooms(rooms.concat(d));

      setPage(page + 1);
      if (d.length < LIMIT) setHasMore(false);
    } catch (error) {
      console.log(`🚀 ~ loadMoreData ~ error:`, error);
    }
    setLoading(false);
  }

  useEffect(() => {
    console.log("asd");

    setRooms(data || rooms);
    console.log(`🚀 ~ useEffect ~ rooms:`, rooms);

    console.log(`🚀 ~ useEffect ~ data:`, data);

    if (!data) return;

    setPage(page + 1);
    if (data.length < LIMIT) setHasMore(false);
    setF(false);
  }, [data]);

  useEffect(() => {
    console.log(`🚀 ~ useEffect ~ userId:`, userId);

    if (data) return;

    setLoading(false);
    setHasMore(true);
    setPage(1);
    setF(true);
  }, [userId]);

  return (
    <InfiniteScroll
      dataLength={rooms.length}
      next={loadMoreData}
      hasMore={hasMore}
      loader={<Skeleton paragraph={{ rows: 1 }} active />}
      endMessage={<Divider plain>Hết rùi</Divider>}
      // scrollableTarget="scrollableDiv"
    >
      <List
        renderItem={(room) => (
          // <List.Item
          //   actions={[
          //     <a key="list-loadmore-edit">edit</a>,
          //     <a key="list-loadmore-more">more</a>,
          //   ]}
          // >
          <RoomListItem room={room} />
          // </List.Item>
        )}
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
}

const RoomListOfUser = memo(RoomListOfUser_);
export default RoomListOfUser;
