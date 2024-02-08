// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Components
import axios from "axios";
import Chart from "react-apexcharts";
import { HelpCircle } from "react-feather";

// ** Custom Components
import { useGetScans } from "../../../../utility/gqlHelpers/useGetScans";
import { useMemo } from "react";
import { t } from "i18next";
import { groupByDate } from "../../../../utility/Utils";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Row,
  Col,
} from "reactstrap";

const GoalOverview = (props) => {
  const { scans, count } = useGetScans();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (scans) {
      const enter = scans.filter((s) => s.type === "checkin");
      const dates = groupByDate(enter);
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

  const options = {
    chart: {
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        blur: 3,
        left: 1,
        top: 1,
        opacity: 0.1,
      },
    },
    colors: ["#51e5a8"],
    plotOptions: {
      radialBar: {
        offsetY: 10,
        startAngle: -150,
        endAngle: 150,
        hollow: {
          size: "77%",
        },
        track: {
          background: "#ebe9f1",
          strokeWidth: "50%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            color: "#5e5873",
            fontFamily: "Montserrat",
            fontSize: "2.86rem",
            fontWeight: "600",
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: [props.success],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    grid: {
      padding: {
        bottom: 30,
      },
    },
  };

  return data !== null ? (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">ورود و خروج</CardTitle>
      </CardHeader>
      <CardBody className="p-0">
        <Chart
          options={options}
          series={[
            Math.round(
              (scans.filter((s) => s.type === "checkin").length / count) * 100
            ),
          ]}
          type="radialBar"
          height={245}
        />
      </CardBody>
      <Row className="border-top text-center mx-0">
        <Col xs="6" className="border-end py-1">
          <CardText className="text-muted mb-0">ورود</CardText>
          <h3 className="fw-bolder mb-0">
            {scans.filter((s) => s.type === "checkin").length}
          </h3>
        </Col>
        {console.log(scans)}
        <Col xs="6" className="py-1">
          <CardText className="text-muted mb-0">خروج</CardText>
          <h3 className="fw-bolder mb-0">
            {scans.filter((s) => s.type === "checkout").length}
          </h3>
        </Col>
      </Row>
    </Card>
  ) : null;
};
export default GoalOverview;
