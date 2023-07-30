// ** React Imports
import { useEffect, useMemo, useState } from "react";

// ** Third Party Components
import axios from "axios";

// ** Custom Components
import TinyChartStats from "@components/widgets/stats/TinyChartStats";
import { groupByDate } from "../../../../utility/Utils";
import { t } from "i18next";

const ProfitLineChart = ({ info, paymentsCount, payments }) => {
  // ** State
  const [data, setData] = useState(null);

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    grid: {
      borderColor: "#EBEBEB",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: -30,
        bottom: -10,
      },
    },
    stroke: {
      width: 3,
    },
    colors: [info],
    series: [
      {
        data: [0, 20, 5, 30, 15, 45],
      },
    ],
    markers: {
      size: 2,
      colors: info,
      strokeColors: info,
      strokeWidth: 2,
      strokeOpacity: 1,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [
        {
          seriesIndex: 0,
          dataPointIndex: 5,
          fillColor: "#ffffff",
          strokeColor: info,
          size: 5,
        },
      ],
      shape: "circle",
      radius: 2,
      hover: {
        size: 3,
      },
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          fontSize: "0px",
        },
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

  useEffect(() => {
    if (payments) {
      const dates = groupByDate(payments);
      setData(dates);
    }
  }, [payments]);

  const chartData = useMemo(() => {
    return data?.map(({ count, date }) => {
      return {
        x: date,
        y: count,
      };
    });
  }, [data]);

  const series = useMemo(
    () => [
      {
        data: chartData,
        name: "Payments",
      },
    ],

    [chartData]
  );

  return data !== null ? (
    <TinyChartStats
      height={70}
      type="line"
      options={options}
      title={t("Payments")}
      stats={paymentsCount}
      series={series}
    />
  ) : null;
};

export default ProfitLineChart;
