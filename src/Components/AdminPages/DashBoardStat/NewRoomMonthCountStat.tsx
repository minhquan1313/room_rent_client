import { fetcher } from "@/services/fetcher";
import { TCountData } from "@/types/IRoom";
import { dateFormat } from "@/utils/dateFormat";
import { green } from "@ant-design/colors";
import { Card, Statistic } from "antd";
import QueryString from "qs";
import useSWR from "swr";

const from = dateFormat().startOf("M").toDate();
const to = dateFormat().endOf("M").toDate();

function NewRoomMonthCountStat() {
  const { data, isLoading } = useSWR<TCountData[]>(() => {
    const q = QueryString.stringify({
      from,
      to,
      countBy: "all",
    });

    return `/stats/count-room?${q}`;
  }, fetcher);

  return (
    <Card loading={isLoading}>
      <Statistic
        title="Phòng mới tháng này"
        value={data?.[0].count}
        loading={isLoading}
        valueStyle={{ color: green[5] }}
      />
    </Card>
  );
}

export default NewRoomMonthCountStat;
