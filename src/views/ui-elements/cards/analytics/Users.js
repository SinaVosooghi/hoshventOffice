// ** Third Party Components
import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";

// ** Reactstrap Imports
import { Card, CardTitle, CardText, CardBody, Row, Col } from "reactstrap";
import { groupByDate, thousandSeperator } from "../../../../utility/Utils";
import { useGetUsers } from "../../../../utility/gqlHelpers/useGetUsers";

const Earnings = () => {
  // ** State
  const [data, setData] = useState(null);
  const { users, usersCount } = useGetUsers();
  const [male, setMale] = useState(0);

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
    labels: [t("Male"), t("Female")],
    stroke: { width: 0 },
    colors: ["#28c76f66", "#28c76f33"],
    grid: {
      padding: {
        right: -20,
        bottom: -8,
        left: -20,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              offsetY: 15,
            },
            value: {
              offsetY: -15,
            },
            total: {
              show: true,
              offsetY: 15,
              label: t("Users"),
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

  const isWhatPercentOf = (x, y) => {
    return Math.round((x / y) * 100);
  };

  useEffect(() => {
    if (users) {
      const male = users?.users?.filter((u) => u.gender === "male").length;
      const female = users?.users?.filter((u) => u.gender === "female").length;

      setMale(20);
      setData([
        isWhatPercentOf(male, usersCount),
        isWhatPercentOf(female, usersCount),
      ]);
    }
  }, [users]);

  // const chartData = useMemo(() => {
  //   return data?.map(({ count, date }) => {
  //     return count;
  //   });
  // }, [data]);

  return (
    <Card className="earnings-card">
      <CardBody>
        <Row>
          <Col xs="6">
            <CardTitle className="mb-1">{t("Users")}</CardTitle>
            <div className="font-small-2">{t("به تفکیک")}</div>
            <h5 className="mb-1">{thousandSeperator(usersCount)}</h5>
            <CardText className="text-muted font-small-2">
              <span>{t("تعداد کل کاربران به تفکیک جنسیتی")}</span>
            </CardText>
          </Col>
          <Col xs="6">
            <Chart options={options} series={data} type="donut" height={120} />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Earnings;
