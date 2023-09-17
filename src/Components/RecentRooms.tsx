import { RoomCard } from "@/Components/RoomCard";
import { RoomContext } from "@/Contexts/RoomProvider";
import { fetcher } from "@/services/fetcher";
import { IRoom } from "@/types/IRoom";
import Flickity from "flickity";
import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";

export const RecentRooms = () => {
  const { setCurrentRoom } = useContext(RoomContext);

  const ref = useRef<HTMLDivElement>(null);

  const { data: roomsRecent } = useSWR<IRoom[]>(
    "/rooms?sort_field=createdAt&sort=-1&limit=4&disabled=false",
    fetcher,
  );

  useEffect(() => {
    if (!ref.current || !roomsRecent) return;

    const f = new Flickity(ref.current, {
      imagesLoaded: true,
      contain: true,
      cellAlign: "left",
      prevNextButtons: false,
      draggable: true,
      groupCells: true,
    });

    return () => f.destroy();
  }, [roomsRecent]);

  return (
    <div ref={ref} className="-mx-2 ">
      {roomsRecent ? (
        roomsRecent.map((room) => (
          <div
            className="carousel-cell w-full sm:w-1/2 lg:w-1/3 2xl:w-1/4"
            key={room._id}
          >
            <Link
              to={`/room/${room._id}`}
              className="block px-2"
              onClick={() => setCurrentRoom(room)}
            >
              <RoomCard room={room} />
            </Link>
          </div>
        ))
      ) : (
        <div>no data</div>
      )}
    </div>
  );
};
