import { fetcher } from "@/services/fetcher";
import { TCountData } from "@/types/IRoom";
import { dateFormat } from "@/utils/dateFormat";
import { green } from "@ant-design/colors";
import { Card, Statistic } from "antd";
import QueryString from "qs";
import useSWR from "swr";

const from = dateFormat().startOf("M").toDate();
console.log(`🚀 ~ from:`, from);

const to = dateFormat().endOf("M").toDate();
console.log(`🚀 ~ to:`, to);

function NewUserMonthCountStat() {
  const { data, isLoading } = useSWR<TCountData[]>(() => {
    const q = QueryString.stringify({
      from,
      to,
      countBy: "all",
    });

    return `/stats/count-user?${q}`;
  }, fetcher);

  return (
    <Card loading={isLoading}>
      <Statistic
        title="Người dùng mới tháng này"
        value={data?.[0].count}
        loading={isLoading}
        valueStyle={{ color: green[5] }}
      />
    </Card>
  );
}

export default NewUserMonthCountStat;
