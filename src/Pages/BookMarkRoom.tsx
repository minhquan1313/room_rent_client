import MyContainer from "@/Components/MyContainer";
import NotFoundContent from "@/Components/NotFoundContent";
import RoomListItem from "@/Components/RoomListItem";
import { SavedContext } from "@/Contexts/SavedProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { fetcher } from "@/services/fetcher";
import { IRoom } from "@/types/IRoom";
import { pageTitle } from "@/utils/pageTitle";
import { Divider, List, Skeleton } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const LIMIT = 5;
// let page = 1;
const BookMarkRoom = () => {
  pageTitle("Đã lưu");

  const { user } = useContext(UserContext);
  const { saved, add, page, setPage, hasMore, setHasMore } =
    useContext(SavedContext);

  const [rooms, setRooms] = useState<IRoom[]>(saved);
  const [loading, setLoading] = useState(false);
  // const [hasMore, setHasMore] = useState(saved.length === 0);

  const fetched = useRef(rooms.length !== 0);
  console.log(`🚀 ~ BookMarkRoom ~ page:`, page);

  console.log(`🚀 ~ BookMarkRoom ~ fetched:`, fetched);

  // const [f, setF] = useState(true);
  // const { data } = useSWR<IRoom[]>(
  //   f ? `/rooms?owner=${userId}&limit=${LIMIT}&page=${page}&saved` : null,
  //   fetcher,
  // );
  // console.log(`🚀 ~ data:`, data);

  async function loadMoreData() {
    fetched.current = true;
    console.log(`🚀 ~ loadMoreData`);

    if (loading || !hasMore || !user) return;

    setLoading(true);
    try {
      const d = await fetcher<any, IRoom[]>(
        `/saved?user=${user!._id}&limit=${LIMIT}&page=${page}&to_room&saved`,
      );
      console.log(`🚀 ~ loadMoreData ~ d:`, d);

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
      console.log(`🚀 ~ loadMoreData ~ error:`, error);
    }
    setLoading(false);
  }

  // useEffect(() => {
  //   console.log(`🚀 ~ loadMoreData ~ hasMore:`, hasMore);
  //   console.log(`🚀 ~ loadMoreData ~ loading:`, loading);
  // });

  // useEffect(() => {
  /**
   * Khi user logout thì
   */

  // return () => {
  //   console.log(`🚀 ~ return ~ user:`, user);
  //   if (user) return;

  //   reset();
  //   setRooms([]);
  //   setLoading(false);
  //   setHasMore(true);
  //   page = 1;
  // };
  // }, [user]);

  useEffect(() => {
    if (fetched.current) return;
    loadMoreData();
  }, []);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  // useEffect(() => {
  //   console.log("asd");

  //   setRooms(data || rooms);
  //   console.log(`🚀 ~ useEffect ~ rooms:`, rooms);

  //   console.log(`🚀 ~ useEffect ~ data:`, data);

  //   if (!data) return;

  //   setPage(page + 1);
  //   if (data.length < LIMIT) setHasMore(false);
  //   setF(false);
  // }, [data]);

  // useEffect(() => {
  //   console.log(`🚀 ~ useEffect ~ userId:`, userId);

  //   if (data) return;

  //   setLoading(false);
  //   setHasMore(true);
  //   setPage(1);
  //   setF(true);
  // }, [userId]);

  return (
    <MyContainer>
      <InfiniteScroll
        dataLength={rooms.length}
        next={loadMoreData}
        hasMore={hasMore}
        loader={<Skeleton paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>Hết rùi</Divider>}
        className="asd"
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
