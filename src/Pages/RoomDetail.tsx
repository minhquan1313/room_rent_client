import { RoomContext } from "@/Contexts/RoomProvider";
import { fetcher } from "@/services/fetcher";
import { IRoom } from "@/types/IRoom";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

const RoomDetail = () => {
  const { id } = useParams();
  const { currentRoom, setCurrentRoom } = useContext(RoomContext);
  const { data: room } = useSWR<IRoom>(
    currentRoom ? undefined : `/rooms/${id}`,
    fetcher,
  );

  useEffect(() => {
    id;
    currentRoom;
    room;
    console.log(`🚀 ~ useEffect ~ room:`, room);

    console.log(`🚀 ~ useEffect ~ currentRoom:`, currentRoom);

    console.log(`🚀 ~ useEffect ~ id:`, id);
  });

  useEffect(() => {
    if (!room) return;
    setCurrentRoom(room);
  }, [room]);
  return <div className="">detail</div>;
};

export default RoomDetail;
