import { MyFlickity } from "@/Components/MyFlickity";
import MyImage from "@/Components/MyImage";
import { routeRoomSearch } from "@/constants/route";
import { fetcher } from "@/services/fetcher";
import { CountRoom } from "@/types/IRoom";
import { Typography } from "antd";
import { useEffect, useRef } from "react";
import Flickity from "react-flickity-component";
import { Link } from "react-router-dom";
import useSWR from "swr";

export const PopularProvinces = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { data: roomCounts } = useSWR<CountRoom[]>(
    "/stats/count-room?limit=4",
    fetcher,
  );

  useEffect(() => {
    if (!ref.current || !roomCounts) return;
    console.log(`🚀 ~ useEffect ~ roomCounts:`, roomCounts);

    const f = new Flickity(ref.current, {
      imagesLoaded: true,
      contain: true,
      cellAlign: "left",
      prevNextButtons: false,
      draggable: true,
      groupCells: true,
    });

    return () => f.destroy();
  }, [roomCounts]);

  return (
    <MyFlickity>
      {roomCounts?.length &&
        roomCounts.map(({ count, province, image }) => (
          <div
            className="aspect-[4/5] w-full sm:w-1/2 lg:w-1/3 2xl:w-1/4"
            key={province}
          >
            <Link
              to={`${routeRoomSearch}?province=${province}`}
              className="block h-full px-2"
            >
              <div className="relative h-full overflow-hidden rounded-lg">
                <MyImage
                  src={image}
                  width={"100%"}
                  height={"100%"}
                  className="object-cover"
                  preview={false}
                  addServer
                />
                <div className="absolute inset-x-0 bottom-0 z-20 p-5">
                  <Typography.Title level={3} className="!text-white">
                    {province}
                  </Typography.Title>
                  <Typography.Text className="!text-white">
                    {count} tin
                  </Typography.Text>
                </div>

                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60">
                  {/* MASK */}
                </div>
              </div>
            </Link>
          </div>
        ))}
      {/* </div> */}
    </MyFlickity>
  );
};
