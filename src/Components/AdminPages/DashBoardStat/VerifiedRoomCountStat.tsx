import { fetcher } from "@/services/fetcher";
import { TCountData } from "@/types/IRoom";
import { Card, Progress, Space, Tooltip, Typography } from "antd";
import useSWR from "swr";

function VerifiedRoomCountStat() {
  const { data, isLoading } = useSWR<TCountData[]>(() => {
    return `/stats/count-room?notVerified`;
  }, fetcher);
  const { data: all, isLoading: isLoadingAll } = useSWR<TCountData[]>(() => {
    return `/stats/count-room`;
  }, fetcher);

  const percent =
    data?.[0] && all?.[0]
      ? Math.round(((all[0].count - data[0].count) / all[0].count) * 100)
      : 0;

  return (
    <Card loading={isLoading || isLoadingAll}>
      <Space className="w-full">
        <Tooltip
          title={
            data?.[0] && all?.[0] && `Còn ${data[0].count} phòng chờ duyệt`
          }
        >
          <Progress type="circle" percent={percent} />
        </Tooltip>
        <Typography.Text>Phòng đã duyệt</Typography.Text>
      </Space>
    </Card>
  );
}

export default VerifiedRoomCountStat;
