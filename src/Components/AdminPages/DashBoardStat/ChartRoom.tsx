import MyButton from "@/Components/MyButton";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import { fetcher } from "@/services/fetcher";
import { TCountData } from "@/types/IRoom";
import { dateFormat } from "@/utils/dateFormat";
import {
  Card,
  DatePicker,
  DatePickerProps,
  Segmented,
  Space,
  Spin,
  theme,
} from "antd";
import { SegmentedLabeledOption } from "antd/es/segmented";
import { EChartsOption, graphic } from "echarts";
import EChartsReact from "echarts-for-react";
import QueryString from "qs";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

type NewType = SegmentedLabeledOption & {
  value: Exclude<DatePickerProps["picker"], "time" | "quarter" | "date">;
};

const TYPE: NewType[] = [
  {
    label: "Tuần",
    value: "week",
  },
  {
    label: "Tháng",
    value: "month",
  },
  {
    label: "Năm",
    value: "year",
  },
];
const initQuery: {
  from: Date;
  to: Date;
  countBy: "day" | "month";
} = {
  from: dateFormat().startOf("w").toDate(),
  to: dateFormat().endOf("w").toDate(),
  // from: dateFormat().hour(0).minute(0).second(0).weekday(1),
  // to: dateFormat().hour(0).minute(0).second(0).weekday(7),
  countBy: "day",
};

function ChartRoom() {
  const { t } = useTranslation();

  const { myTheme } = useContext(ThemeContext);

  const { token } = theme.useToken();

  const [type, setType] = useState(TYPE[0].value);
  const [query, setQuery] = useState(initQuery);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    query.from,
  );

  const { data, isLoading } = useSWR<TCountData[]>(() => {
    const from = query.from.toISOString();
    const to = query.to.toISOString();

    // logger(`🚀 ~ ChartRoom ~ query:`, query);
    const q = QueryString.stringify({
      ...query,

      from,
      to,
    });

    return `/stats/count-room?${q}`;
  }, fetcher);

  const [dataDisplay, setDataDisplay] = useState<[string, number][]>([]);

  const updateDataDisplay = () => {
    if (!data) return;

    setDataDisplay(() => {
      const dateFrom = dateFormat(query.from);
      const dateTo = dateFormat(query.to);
      let format = "MM";
      let fillAmount = 1;

      let firstValue: (i: number) => string;
      switch (type) {
        case "week":
          format = "dddd";
          firstValue = (i) => dateFrom.weekday(i).format(format);
          //  {
          //   const d = date.weekday(i).format(format);
          //   return d[0].toUpperCase() + d.slice(1);
          // };
          fillAmount = 7;
          break;
        case "month":
          format = "DD";
          firstValue = (i) => dateFrom.date(i + 1).format(format);
          fillAmount = dateTo.date();
          break;
        case "year":
          format = "MMMM";
          firstValue = (i) => dateFrom.month(i).format(format);
          fillAmount = 12;
          break;
      }

      const z: [string, number][] = new Array(fillAmount)
        .fill(1)
        .map((_, i) => {
          return [firstValue(i), 0];
        });
      // logger(`🚀 ~ z ~ z:`, z);

      const d: [string, number][] = data.map((d) => {
        return [dateFormat(d.label).format(format), d.count];
      });
      // logger(`🚀 ~ d ~ d:`, d);

      d.forEach((dx) => {
        z[z.findIndex((zx) => zx[0] === dx[0])] = dx;
      });

      return z;
    });
    //     break;
    // }
  };

  const updateQueries = () => {
    switch (type) {
      case "year":
        setQuery((q) => ({
          ...q,
          countBy: "month",
        }));
        break;

      default:
        setQuery((q) => ({
          ...q,
          countBy: "day",
        }));
        break;
    }

    if (selectedDate) {
      const start = dateFormat(selectedDate).startOf(type).toDate();
      const end = dateFormat(selectedDate).endOf(type).toDate();

      setQuery((q) => ({
        ...q,
        from: start,
        to: end,
      }));
    }
  };

  useEffect(() => {
    updateQueries();
  }, [type, selectedDate]);

  useEffect(() => {
    updateDataDisplay();
  }, [data, JSON.stringify(query), t]);

  function previousDate(): void {
    setSelectedDate((d) => {
      return dateFormat(d).subtract(1, type).toDate();
    });
  }

  function nextDate(): void {
    setSelectedDate((d) => {
      return dateFormat(d).add(1, type).toDate();
    });
  }

  const eChartOption: EChartsOption = {
    tooltip: {
      trigger: "axis",
      // formatter: (params) => {
      //   logger(`🚀 ~ ChartRoom ~ params:`, params);
      //   return `
      //             Tooltip: <br />
      //             ${params[0].seriesName}: ${params[0].value}<br />
      //             `;
      // },
    },
    legend: {},
    xAxis: {
      type: "category",
      boundaryGap: false,
    },
    yAxis: {},
    dataset: {
      source: [
        ["product", "Số bài đăng"],
        // ...new Array(7).fill("").map((r, i) => {
        //   return [
        //     `Thứ ${i + 2}`,
        //     Math.floor(Math.random() * 100),
        //     Math.floor(Math.random() * 100),
        //   ];
        // }),
        ...dataDisplay,
      ],
    },
    emphasis: {
      focus: "series",
    },
    series: [
      {
        type: "line",
        smooth: true,
        // showSymbol: false,
        lineStyle: {
          width: 0,
        },
        areaStyle: {
          opacity: 0.8,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(255, 0, 135)",
            },
            {
              offset: 1,
              color: "rgb(135, 0, 157)",
            },
          ]),
        },
      },
    ],
    textStyle: {
      fontFamily: token.fontFamily,
      fontSize: token.fontSize,
    },
    backgroundColor: "transparent",
  };

  const title = (() => {
    if (!selectedDate) return undefined;
    let s = `Các bài đăng của `;

    const date = dateFormat(selectedDate);

    switch (type) {
      case "week":
        // s += `tuần ${selectedDate.week()} tháng ${
        //   selectedDate.month() + 1
        // } năm ${selectedDate?.year()}`;
        s += `tuần ${date.week()} ${date.format("MMMM YYYY")}`;
        break;
      case "month":
        s += date.format("MMMM YYYY");
        // s += `tháng ${date.month() + 1} năm ${date?.year()}`;
        break;
      case "year":
        s += date.format("YYYY");
        // s += `năm ${date?.year()}`;
        break;
    }

    return s;
  })();

  return (
    <Spin spinning={isLoading}>
      <Card title={title}>
        <Space direction="vertical" className="w-full" size={"large"}>
          <Space direction="vertical" className="mx-auto w-full items-center">
            <Segmented options={TYPE} value={type} onChange={setType as any} />
            <Space>
              <MyButton type="primary" onClick={previousDate}>
                Trước
              </MyButton>

              <DatePicker
                onChange={(value) => {
                  setSelectedDate(value?.toDate());
                }}
                picker={type}
                value={dateFormat(selectedDate)}
                changeOnBlur
              />

              <MyButton type="primary" onClick={nextDate}>
                Sau
              </MyButton>
            </Space>
          </Space>

          <EChartsReact
            option={eChartOption}
            style={{
              //
              height: "auto",
              maxHeight: 500,
            }}
            className="aspect-[4/3] h-auto w-full"
            notMerge={true}
            lazyUpdate={true}
            theme={myTheme}
          />
        </Space>
      </Card>
    </Spin>
  );
}

export default ChartRoom;
