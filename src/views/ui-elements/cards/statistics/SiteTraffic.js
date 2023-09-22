// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Components
import axios from "axios";
import { Monitor } from "react-feather";

// ** Custom Components
import StatsWithLineChart from "@components/widgets/stats/StatsWithLineChart";
import { useGetScans } from "../../../../utility/gqlHelpers/useGetScans";
import { useMemo } from "react";
import { t } from "i18next";
import { groupByDate } from "../../../../utility/Utils";

const SiteTraffic = ({ kFormatter, color }) => {
  const { scans, count } = useGetScans();
  const [data, setData] = useState(null);

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
    // colors: [color],
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
    if (scans) {
      const dates = groupByDate(scans);
      setData(dates);
    }
  }, [scans]);

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

  return scans !== null ? (
    <StatsWithLineChart
      icon={<Monitor size={21} />}
      stats={kFormatter(count)}
      options={options}
      statTitle={t("Scans")}
      series={series}
      type="area"
    />
  ) : null;
};

export default SiteTraffic;
