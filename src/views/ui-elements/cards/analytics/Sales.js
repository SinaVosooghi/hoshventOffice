// ** Third Party Components
import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { MoreVertical, Circle } from "react-feather";

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { useGetInvoices } from "../../../../utility/gqlHelpers/useGetInvoices";
import { groupByDate } from "../../../../utility/Utils";

const Sales = (props) => {
  const [shopOrders, setShopOrders] = useState([]);
  const [courseOrders, setCourseOrders] = useState([]);
  const { invoices, count } = useGetInvoices();

  useEffect(() => {
    if (invoices) {
      const courses = invoices.filter((invoice) => invoice.type === "course");
      const shops = invoices.filter((invoice) => invoice.type === "shop");

      const courseByDate = groupByDate(courses);
      const shopsByDate = groupByDate(shops);
      setShopOrders(shopsByDate);
      setCourseOrders(courseByDate);
    }
  }, [invoices]);

  const options = {
    chart: {
      height: 300,
      type: "radar",
      dropShadow: {
        enabled: true,
        blur: 8,
        left: 1,
        top: 1,
        opacity: 0.2,
      },
      toolbar: {
        show: false,
      },
      offsetY: 5,
    },
    stroke: {
      width: 0,
    },
    dataLabels: {
      background: {
        foreColor: ["#ebe9f1"],
      },
    },
    legend: { show: false },
    colors: [props.primary, props.info],
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: [
            "#ebe9f1",
            "transparent",
            "transparent",
            "transparent",
            "transparent",
            "transparent",
          ],
          connectorColors: "transparent",
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: [props.primary, props.info],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100],
      },
    },
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    markers: {
      size: 0,
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
      padding: {
        bottom: -27,
      },
    },
  };
  // series = [
  //   {
  //     name: t("Shop"),
  //     data: [90, 50, 86, 40, 100, 20],
  //   },
  //   {
  //     name: t("Course"),
  //     data: [70, 75, 70, 76, 20, 85],
  //   },
  // ];

  const shopData = useMemo(() => {
    return shopOrders?.map(({ count, date }) => count);
  }, [shopOrders]);

  const courseData = useMemo(() => {
    return courseOrders?.map(({ count, date }) => count);
  }, [courseOrders]);

  const series = useMemo(
    () => [
      {
        data: courseData,
        name: "Course",
      },
      {
        data: shopData,
        name: "Shop",
      },
    ],
    [courseData]
  );

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-start pb-1">
        <div>
          <CardTitle className="mb-25" tag="h4">
            {t("Sales")}
          </CardTitle>
        </div>
      </CardHeader>

      <CardBody>
        <div className="d-inline-block me-1">
          <div className="d-flex align-items-center">
            <Circle size={13} className="text-primary me-50" />
            <h6 className="mb-0">{t("Shop")}</h6>
          </div>
        </div>
        <div className="d-inline-block">
          <div className="d-flex align-items-center">
            <Circle size={13} className="text-info me-50" />
            <h6 className="mb-0">{t("Course")}</h6>
          </div>
        </div>
        <Chart options={options} series={series} type="radar" height={300} />
      </CardBody>
    </Card>
  );
};
export default Sales;
