// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Components
import axios from "axios";
import classnames from "classnames";
import * as Icon from "react-feather";
import Chart from "react-apexcharts";

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

const Customers = (props) => {
  // ** State
  const [data, setData] = useState({
    last_days: ["Last 28 Days", "Last Month", "Last Year"],
    listData: [
      {
        icon: "Circle",
        iconColor: "text-primary",
        text: "New",
        result: 690,
      },
      {
        icon: "Circle",
        iconColor: "text-warning",
        text: "Returning",
        result: 258,
      },
      {
        icon: "Circle",
        iconColor: "text-danger",
        text: "Referrals",
        result: 149,
      },
    ],
  });

  const options = {
      chart: {
        toolbar: {
          show: false,
        },
      },
      labels: ["New", "Returning", "Referrals"],
      dataLabels: {
        enabled: false,
      },
      legend: { show: false },
      stroke: {
        width: 4,
      },
      colors: [props.primary, props.warning, props.danger],
    },
    series = [690, 258, 149];

  const renderChartInfo = () => {
    return data.listData.map((item, index) => {
      const IconTag = Icon[item.icon];

      return (
        <div
          key={index}
          className={classnames("d-flex justify-content-between", {
            "mb-1": index !== data.listData.length - 1,
          })}
        >
          <div className="d-flex align-items-center">
            <IconTag
              size={15}
              className={classnames({
                [item.iconColor]: item.iconColor,
              })}
            />
            <span className="fw-bold ms-75">{item.text}</span>
          </div>
          <span>{item.result}</span>
        </div>
      );
    });
  };

  return data !== null ? (
    <Card>
      <CardHeader className="align-items-end">
        <CardTitle tag="h4">Customers</CardTitle>
        <UncontrolledDropdown className="chart-dropdown">
          <DropdownToggle
            color=""
            className="bg-transparent btn-sm border-0 p-50"
          >
            Last 7 days
          </DropdownToggle>
          <DropdownMenu end>
            {data.last_days.map((item) => (
              <DropdownItem className="w-100" key={item}>
                {item}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type="pie" height={325} />
        <div className="pt-25">{renderChartInfo()}</div>
      </CardBody>
    </Card>
  ) : null;
};
export default Customers;
