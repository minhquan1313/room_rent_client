import { fetcher } from "@/services/fetcher";
import { TCountData } from "@/types/IRoom";
import { dateFormat } from "@/utils/dateFormat";
import logger from "@/utils/logger";
import { green } from "@ant-design/colors";
import { Card, Statistic } from "antd";
import QueryString from "qs";
import useSWR from "swr";

const from = dateFormat().startOf("M").toDate();
logger(`🚀 ~ from:`, from);

const to = dateFormat().endOf("M").toDate();
logger(`🚀 ~ to:`, to);

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
        value={data?.[0]?.count || 0}
        loading={isLoading}
        valueStyle={{ color: green[5] }}
      />
    </Card>
  );
}

export default NewUserMonthCountStat;
