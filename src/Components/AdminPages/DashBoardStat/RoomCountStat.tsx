import { fetcher } from "@/services/fetcher";
import { TCountData } from "@/types/IRoom";
import { Card, Statistic } from "antd";
import useSWR from "swr";

function RoomCountStat() {
  const { data, isLoading } = useSWR<TCountData[]>(() => {
    return `/stats/count-room`;
  }, fetcher);

  return (
    <Card loading={isLoading}>
      <Statistic title="Phòng" value={data?.[0].count} loading={isLoading} />
    </Card>
  );
}

export default RoomCountStat;
