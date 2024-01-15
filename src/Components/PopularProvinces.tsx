import { MyFlickity } from "@/Components/MyFlickity";
import MyImage from "@/Components/MyImage";
import { routeRoomSearch } from "@/constants/route";
import { fetcher } from "@/services/fetcher";
import { TCountData } from "@/types/IRoom";
import logger from "@/utils/logger";
import { Typography } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";

export const PopularProvinces = () => {
  const { data: roomCounts } = useSWR<TCountData[]>(
    "/stats/count-room?limit=4&province",
    fetcher,
  );

  useEffect(() => {
    if (!roomCounts) return;
    logger(`🚀 ~ useEffect ~ roomCounts:`, roomCounts);
  }, [roomCounts]);

  return (
    <MyFlickity>
      {roomCounts?.[0] &&
        roomCounts.map(({ count, label, image }) => (
          <div
            className="aspect-[4/5] w-full sm:w-1/2 lg:w-1/3 2xl:w-1/4"
            key={label}
          >
            <Link
              to={`${routeRoomSearch}?province=${label}`}
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
                    {label}
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
