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
import { Row, Col } from "reactstrap";

// ** Demo Components
import InvoiceList from "@src/views/apps/invoice/list";
import RevenueReport from "@src/views/ui-elements/cards/analytics/RevenueReport";
import AvgSessions from "@src/views/ui-elements/cards/analytics/AvgSessions";
import CardAppDesign from "@src/views/ui-elements/cards/advance/CardAppDesign";
import GoalOverview from "@src/views/ui-elements/cards/analytics/GoalOverview";

import SupportTracker from "@src/views/ui-elements/cards/analytics/SupportTracker";
import OrdersReceived from "@src/views/ui-elements/cards/statistics/OrdersReceived";
import SubscribersGained from "@src/views/ui-elements/cards/statistics/SubscribersGained";
import ProfitLineChart from "@src/views/ui-elements/cards/statistics/ProfitLineChart";
import Earnings from "@src/views/ui-elements/cards/analytics/Earnings";
import OrdersBarChart from "@src/views/ui-elements/cards/statistics/OrdersBarChart";
import SiteTraffic from "@src/views/ui-elements/cards/statistics/SiteTraffic";
import RevenueGenerated from "@src/views/ui-elements/cards/statistics/RevenueGenerated";

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
import { useGetChats } from "../../../utility/gqlHelpers/useGetChats";
import { useGetAttendees } from "../../../utility/gqlHelpers/useGetAttendees";
import { useGetScans } from "../../../utility/gqlHelpers/useGetScans";
import UsersWidget from "../../ui-elements/cards/analytics/Users";
import ScansList from "../../apps/scans/list";

const AnalyticsDashboard = () => {
  // ** Context
  const { colors } = useContext(ThemeColors);
  const { invoices, invoiceCount } = useGetInvoices();
  const { usersCount } = useGetUsers();
  const { productsCount } = useGetProducts();
  const { chats } = useGetChats();
  const { user } = useGetUser();
  const { count } = useGetAttendees();
  const { count: scanCount } = useGetScans();

  const smsCount = chats.filter((c) => c.sms).length;

  return (
    <div id="dashboard-analytics">
      <Row className="match-height">
        <Col lg="12" sm="6">
          <StatsCard
            cols={{ xl: "2", sm: "6" }}
            invoiceCount={invoiceCount}
            totalSMS={user?.site[0]?.plan?.sms ?? 0}
            smsCount={smsCount}
            usersCount={usersCount}
            productsCount={productsCount}
            attendeesCount={count}
            scanCount={scanCount}
          />
        </Col>
        <Col lg="3" sm="6">
          <UsersWidget />
        </Col>
        <Col lg="3" sm="6">
          <SubscribersGained
            kFormatter={kFormatter}
            color={colors.primary.main}
          />
        </Col>
        <Col lg="3" sm="6">
          <SiteTraffic kFormatter={kFormatter} />
        </Col>
        <Col lg="3" sm="6">
          <RevenueGenerated
            kFormatter={kFormatter}
            color={colors.primary.main}
          />
        </Col>
      </Row>
      <Row className="match-height">
        <Col lg="6" xs="12">
          <GoalOverview />
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
          <ScansList />
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;
