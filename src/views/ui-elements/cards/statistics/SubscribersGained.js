// ** React Imports
import { useEffect, useMemo, useState } from "react";

// ** Third Party Components
import axios from "axios";
import { Users } from "react-feather";

// ** Custom Components
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";
import { t } from "i18next";
import { useGetUsers } from "../../../../utility/gqlHelpers/useGetUsers";
import { groupByDate } from "../../../../utility/Utils";
import moment from "jalali-moment";

const SubscribersGained = ({ kFormatter, color }) => {
  // ** State
  const [data, setData] = useState(null);
  const [count, setCount] = useState(null);

  const { users } = useGetUsers(100);

  const options = {
    chart: {
      id: "revenue",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      show: false,
    },
    colors: [color],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.9,
        opacityFrom: 0.7,
        opacityTo: 0.5,
        stops: [0, 80, 100],
      },
    },

    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
      // @ts-ignore
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return `<div class="custom-pricing">
                      <strong>${t("Count")}:</strong> ${
          w.globals.stackedSeriesTotals[dataPointIndex]
        }
                      <br />
                      ${moment(w.globals.categoryLabels[dataPointIndex]).format(
                        "YYYY/MM/DD"
                      )}
                    </div>`;
      },
    },
  };

  useEffect(() => {
    if (users?.users) {
      setCount(users?.count ?? 0);
      const dates = groupByDate(users.users);
      setData(dates);
    }
  }, [users]);

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
        name: "Users",
      },
    ],

    [chartData]
  );

  return data !== null ? (
    <StatsWithAreaChart
      icon={<Users size={21} />}
      color="primary"
      options={options}
      stats={kFormatter(count)}
      statTitle={t("Subscribers Gained")}
      series={series}
      type="area"
    />
  ) : null;
};

export default SubscribersGained;
