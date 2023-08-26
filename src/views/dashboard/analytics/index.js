// ** React Imports
import { useContext } from "react";

// ** Icons Imports
import { List } from "react-feather";

// ** Custom Components
import Avatar from "@components/avatar";
import Timeline from "@components/timeline";
import AvatarGroup from "@components/avatar-group";

// ** Utils
import { kFormatter } from "@utils";

// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors";

// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardTitle, CardBody } from "reactstrap";

// ** Demo Components
import InvoiceList from "@src/views/apps/invoice/list";
import Sales from "@src/views/ui-elements/cards/analytics/Sales";
import AvgSessions from "@src/views/ui-elements/cards/analytics/AvgSessions";
import CardAppDesign from "@src/views/ui-elements/cards/advance/CardAppDesign";
import SupportTracker from "@src/views/ui-elements/cards/analytics/SupportTracker";
import OrdersReceived from "@src/views/ui-elements/cards/statistics/OrdersReceived";
import SubscribersGained from "@src/views/ui-elements/cards/statistics/SubscribersGained";
import ProfitLineChart from "@src/views/ui-elements/cards/statistics/ProfitLineChart";
import Earnings from "@src/views/ui-elements/cards/analytics/Earnings";
import OrdersBarChart from "@src/views/ui-elements/cards/statistics/OrdersBarChart";

// ** Images
import jsonImg from "@src/assets/images/icons/json.png";

// ** Avatar Imports
import avatar6 from "@src/assets/images/portrait/small/avatar-s-6.jpg";
import avatar7 from "@src/assets/images/portrait/small/avatar-s-7.jpg";
import avatar8 from "@src/assets/images/portrait/small/avatar-s-8.jpg";
import avatar9 from "@src/assets/images/portrait/small/avatar-s-9.jpg";
import avatar20 from "@src/assets/images/portrait/small/avatar-s-20.jpg";

// ** Styles
import "@styles/react/libs/charts/apex-charts.scss";
import StatsCard from "@src/views/ui-elements/cards/statistics/StatsCard";
import { useGetUser } from "../../../utility/gqlHelpers/useGetUser";
import { useGetInvoices } from "../../../utility/gqlHelpers/useGetInvoices";
import { useGetUsers } from "../../../utility/gqlHelpers/useGetUsers";
import { useGetProducts } from "../../../utility/gqlHelpers/useGetProducts";
import { useGetOrders } from "../../../utility/gqlHelpers/useGetOrders";
import { useGetChats } from "../../../utility/gqlHelpers/useGetChats";
import { useGetAttendees } from "../../../utility/gqlHelpers/useGetAttendees";

const AnalyticsDashboard = () => {
  // ** Context
  const { colors } = useContext(ThemeColors);
  const { invoices, invoiceCount } = useGetInvoices();
  const { usersCount } = useGetUsers();
  const { productsCount } = useGetProducts();
  const { chats } = useGetChats();
  const { user } = useGetUser();
  const { count } = useGetAttendees();

  // ** Vars
  const avatarGroupArr = [
    {
      imgWidth: 33,
      imgHeight: 33,
      title: "Billy Hopkins",
      placement: "bottom",
      img: avatar9,
    },
    {
      imgWidth: 33,
      imgHeight: 33,
      title: "Amy Carson",
      placement: "bottom",
      img: avatar6,
    },
    {
      imgWidth: 33,
      imgHeight: 33,
      title: "Brandon Miles",
      placement: "bottom",
      img: avatar8,
    },
    {
      imgWidth: 33,
      imgHeight: 33,
      title: "Daisy Weber",
      placement: "bottom",
      img: avatar7,
    },
    {
      imgWidth: 33,
      imgHeight: 33,
      title: "Jenny Looper",
      placement: "bottom",
      img: avatar20,
    },
  ];

  const data = [
    {
      title: "12 Invoices have been paid",
      content: "Invoices have been paid to the company.",
      meta: "",
      metaClassName: "me-1",
      customContent: (
        <div className="d-flex align-items-center">
          <img className="me-1" src={jsonImg} alt="data.json" height="23" />
          <span>data.json</span>
        </div>
      ),
    },
    {
      title: "Client Meeting",
      content: "Project meeting with john @10:15am.",
      meta: "",
      metaClassName: "me-1",
      color: "warning",
      customContent: (
        <div className="d-flex align-items-center">
          <Avatar img={avatar9} />
          <div className="ms-50">
            <h6 className="mb-0">John Doe (Client)</h6>
            <span>CEO of Infibeam</span>
          </div>
        </div>
      ),
    },
    {
      title: "Create a new project for client",
      content: "Add files to new design folder",
      color: "info",
      meta: "",
      metaClassName: "me-1",
      customContent: <AvatarGroup data={avatarGroupArr} />,
    },
    {
      title: "Create a new project for client",
      content: "Add files to new design folder",
      color: "danger",
      meta: "",
      metaClassName: "me-1",
    },
  ];

  const smsCount = chats.filter((c) => c.sms).length;

  return (
    <div id="dashboard-analytics">
      <Row className="match-height">
        <Col lg="6" sm="6">
          <StatsCard
            cols={{ xl: "3", sm: "6" }}
            invoiceCount={invoiceCount}
            totalSMS={user?.site[0]?.plan?.sms ?? 0}
            smsCount={smsCount}
            usersCount={usersCount}
            productsCount={productsCount}
            attendeesCount={count}
          />
        </Col>
        <Col lg="3" sm="6">
          <SubscribersGained
            kFormatter={kFormatter}
            color={colors.primary.main}
          />
        </Col>
        <Col lg="3" sm="6">
          <OrdersReceived
            kFormatter={kFormatter}
            warning={colors.warning.main}
          />
        </Col>
      </Row>
      <Row className="match-height">
        <Col lg="6" xs="12">
          <Sales primary={colors.primary.main} info={colors.info.main} />
        </Col>
        <Col lg="6" xs="12">
          <SupportTracker
            primary={colors.primary.main}
            danger={colors.danger.main}
          />
        </Col>
      </Row>
      <Row className="match-height">
        <Col xs="12">
          <InvoiceList />
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;
