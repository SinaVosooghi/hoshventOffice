// ** Third Party Components
import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";

// ** Reactstrap Imports
import { Card, CardTitle, CardText, CardBody, Row, Col } from "reactstrap";
import { groupByDate, thousandSeperator } from "../../../../utility/Utils";

const Earnings = ({ success, payments, paymentsCount }) => {
  // ** State
  const [data, setData] = useState(null);

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
    comparedResult: [2, -3, 8],
    labels: [t("Course"), t("Product")],
    stroke: { width: 0 },
    colors: ["#28c76f66", "#28c76f33", success],
    grid: {
      padding: {
        right: -20,
        bottom: -8,
        left: -20,
      },
    },
    plotOptions: {
      pie: {
        startAngle: -10,
        donut: {
          labels: {
            show: true,
            name: {
              offsetY: 15,
            },
            value: {
              offsetY: -15,
              formatter(val) {
                return `${parseInt(val)} %`;
              },
            },
            total: {
              show: true,
              offsetY: 15,
              label: t("Earnings"),
              formatter() {
                return "53%";
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 1325,
        options: {
          chart: {
            height: 100,
          },
        },
      },
      {
        breakpoint: 1200,
        options: {
          chart: {
            height: 120,
          },
        },
      },
      {
        breakpoint: 1065,
        options: {
          chart: {
            height: 100,
          },
        },
      },
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 120,
          },
        },
      },
    ],
  };

  useEffect(() => {
    if (payments) {
      const dates = groupByDate(payments);
      setData(dates);
    }
  }, [payments]);

  const chartData = useMemo(() => {
    return data?.map(({ count, date }) => {
      return count;
    });
  }, [data]);

  return (
    <Card className="earnings-card">
      <CardBody>
        <Row>
          <Col xs="6">
            <CardTitle className="mb-1">{t("Earnings")}</CardTitle>
            <div className="font-small-2">{t("This Month")}</div>
            <h5 className="mb-1">
              {thousandSeperator(
                payments.reduce((n, { amount }) => n + amount, 0)
              )}
            </h5>
            <CardText className="text-muted font-small-2">
              <span>{t("Earnings for the last month.")}</span>
            </CardText>
          </Col>
          <Col xs="6">
            <Chart
              options={options}
              series={chartData}
              type="donut"
              height={120}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Earnings;
