import { MyFlickity } from "@/Components/MyFlickity";
import { RoomCard } from "@/Components/RoomCard";
import { InteractedUserProviderContext } from "@/Contexts/InteractedUserProvider";
import { fetcher } from "@/services/fetcher";
import { IRoom } from "@/types/IRoom";
import { useContext, useEffect } from "react";
import useSWR from "swr";

export const RecentRooms = () => {
  const { getUser } = useContext(InteractedUserProviderContext);

  const { data: roomsRecent } = useSWR<IRoom[]>(
    "/rooms?sort_field=createdAt&sort=-1&limit=4&disabled=false&is_visible=true&saved",
    fetcher,
  );
  // console.log(`🚀 ~ RecentRooms ~ roomsRecent:`, roomsRecent);

  useEffect(() => {
    console.log(`🚀 ~ RecentRooms ~ roomsRecent:`, roomsRecent);
    //   roomsRecent?.forEach((r) => addUser(r.owner));
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <MyFlickity>
      {roomsRecent?.length &&
        roomsRecent.map((room) => (
          <div
            className="w-full px-2 sm:w-1/2 lg:w-1/3 2xl:w-1/4"
            key={room._id}
          >
            {/* <Link
              to={`${routeRoomDetail}/${room._id}`}
              state={{
                room,
              }}
            > */}
            <RoomCard room={room} />
            {/* </Link> */}
          </div>
        ))}
    </MyFlickity>
    // <div ref={ref} className="-mx-2 ">
    //   {roomsRecent?.length ? (
    //     roomsRecent.map((room) => (
    //       <div
    //         className="carousel-cell w-full sm:w-1/2 lg:w-1/3 2xl:w-1/4"
    //         key={room._id}
    //       >
    //         <Link
    //           to={`/room/${room._id}`}
    //           className="block px-2"
    //           onClick={() => setCurrentRoom(room)}
    //         >
    //           <RoomCard room={room} />
    //         </Link>
    //       </div>
    //     ))
    //   ) : (
    //     <div>no data</div>
    //   )}
    // </div>
  );
};
