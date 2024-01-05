// ** React Imports
import { useEffect, useMemo, useState } from "react";

// ** Third Party Components
import axios from "axios";

// ** Custom Components
import TinyChartStats from "@components/widgets/stats/TinyChartStats";
import { groupByDate } from "../../../../utility/Utils";
import { t } from "i18next";

const OrdersBarChart = ({ warning, orders, ordersCount }) => {
  // ** State
  const [data, setData] = useState({
    title: "Orders",
    statistics: "2,76k",
    series: [
      {
        name: "2020",
        data: [45, 85, 65, 45, 65],
      },
    ],
  });

  const options = {
    chart: {
      stacked: true,
      toolbar: {
        show: true,
      },
    },
    colors: ["#007bff"],
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
        top: -15,
        bottom: -15,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
        borderRadius: [0, 5],
        colors: {
          backgroundBarColors: [
            "#f3f3f3",
            "#f3f3f3",
            "#f3f3f3",
            "#f3f3f3",
            "#f3f3f3",
          ],
          backgroundBarRadius: 5,
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    colors: [warning],
    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      x: {
        show: false,
      },
    },
  };

  // useEffect(() => {
  //   if (orders) {
  //     const dates = groupByDate(orders);
  //     setData(dates);
  //   }
  // }, [orders]);

  // const chartData = useMemo(() => {
  //   return data?.map(({ count, date }) => {
  //     return {
  //       x: date,
  //       y: count,
  //     };
  //   });
  // }, [data]);

  // const series = useMemo(
  //   () => [
  //     {
  //       data: chartData,
  //       name: "Orders",
  //     },
  //   ],

  //   [chartData]
  // );

  return data !== null ? (
    <TinyChartStats
      height={70}
      type="bar"
      options={options}
      title={t("Orders")}
      stats={data.statistics}
      series={data.series}
    />
  ) : null;
};

export default OrdersBarChart;
