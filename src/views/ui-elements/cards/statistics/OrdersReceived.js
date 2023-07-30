// ** React Imports
import { useEffect, useMemo, useState } from "react";

// ** Third Party Components
import { useGetOrders } from "../../../../utility/gqlHelpers/useGetOrders";
import { Package } from "react-feather";

// ** Custom Components
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";
import { groupByDate } from "../../../../utility/Utils";
import { t } from "i18next";

const OrdersReceived = ({ kFormatter, warning }) => {
  // ** State
  const [data, setData] = useState(null);
  const { orders, ordersCount } = useGetOrders(100);

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
    colors: [warning],
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
    if (orders) {
      const dates = groupByDate(orders);
      setData(dates);
    }
  }, [orders]);

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
        name: "Orders",
      },
    ],

    [chartData]
  );

  return data !== null ? (
    <StatsWithAreaChart
      icon={<Package size={21} />}
      color="warning"
      stats={kFormatter(ordersCount)}
      statTitle={t("Orders Received")}
      options={options}
      series={series}
      type="area"
    />
  ) : null;
};
export default OrdersReceived;
