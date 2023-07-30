// ** React Imports
import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";

// ** Third Party Components
import Chart from "react-apexcharts";

// ** Reactstrap Imports
import {
  Row,
  Col,
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
import { useGetChats } from "../../../../utility/gqlHelpers/useGetChats";
import { groupByDate } from "../../../../utility/Utils";

const SupportTracker = (props) => {
  // ** State
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(0);
  const { chats, count } = useGetChats(100);

  // ** Counts

  const options = {
    plotOptions: {
      radialBar: {
        size: 150,
        offsetY: 20,
        startAngle: -150,
        endAngle: 150,
        hollow: {
          size: "65%",
        },
        track: {
          background: "#fff",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            offsetY: -5,
            fontFamily: "Montserrat",
            fontSize: "1rem",
          },
          value: {
            offsetY: 15,
            fontFamily: "Montserrat",
            fontSize: "1.714rem",
          },
        },
      },
    },
    colors: [props.danger],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: [props.primary],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      dashArray: 8,
    },
    labels: [t("Opened Tickets")],
  };

  useEffect(() => {
    if (chats) {
      const chatsLength = chats.length;
      const opened = chats?.filter((chat) => chat.from_read).length;

      const total = (100 * opened) / chatsLength;
      setTotal(total);

      setData(chats);
    }
  }, [chats]);

  return data !== null ? (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle tag="h4">{t("Tickets")}</CardTitle>
        <UncontrolledDropdown className="chart-dropdown">
          <DropdownToggle
            color=""
            className="bg-transparent btn-sm border-0 p-50"
          >
            {t("Last 7 days")}
          </DropdownToggle>
          <DropdownMenu end>
            {/* {data?.last_days.map((item) => (
              <DropdownItem className="w-100" key={item}>
                {item}
              </DropdownItem>
            ))} */}
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardHeader>
      <CardBody>
        <Row>
          <Col sm="2" className="d-flex flex-column flex-wrap text-center">
            <h1 className="font-large-2 fw-bolder mt-2 mb-0">{chats.length}</h1>
            <CardText>{t("Tickets")}</CardText>
          </Col>
          <Col sm="10" className="d-flex justify-content-center">
            <Chart
              options={options}
              series={[total]}
              type="radialBar"
              height={270}
              id="support-tracker-card"
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-between mt-1">
          <div className="text-center">
            <CardText className="mb-50">{t("New Tickets")}</CardText>
            <span className="font-large-1 fw-bold">
              {chats?.filter((chat) => !chat.from_read).length}
            </span>
          </div>
          <div className="text-center">
            <CardText className="mb-50">{t("Opened Tickets")}</CardText>
            <span className="font-large-1 fw-bold">
              {chats?.filter((chat) => chat.from_read).length}
            </span>
          </div>
          <div className="text-center">
            <CardText className="mb-50">{t("Closed Tickets")}</CardText>
            <span className="font-large-1 fw-bold">
              {chats?.filter((chat) => chat.closed).length}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  ) : null;
};
export default SupportTracker;
