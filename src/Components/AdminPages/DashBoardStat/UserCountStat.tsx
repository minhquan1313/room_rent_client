import { fetcher } from "@/services/fetcher";
import { TCountData } from "@/types/IRoom";
import { Card, Statistic } from "antd";
import useSWR from "swr";

function UserCountStat() {
  const { data, isLoading } = useSWR<TCountData[]>(() => {
    return `/stats/count-user`;
  }, fetcher);

  return (
    <Card loading={isLoading}>
      <Statistic
        title="Người dùng"
        value={data?.[0].count}
        loading={isLoading}
      />
    </Card>
  );
}

export default UserCountStat;
