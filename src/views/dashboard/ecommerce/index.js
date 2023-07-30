// ** React Imports
import { useContext, useEffect, useState } from "react";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors";

// ** Demo Components
import CompanyTable from "./CompanyTable";
import Earnings from "@src/views/ui-elements/cards/analytics/Earnings";
import CardMedal from "@src/views/ui-elements/cards/advance/CardMedal";
import CardMeetup from "@src/views/ui-elements/cards/advance/CardMeetup";
import StatsCard from "@src/views/ui-elements/cards/statistics/StatsCard";
import GoalOverview from "@src/views/ui-elements/cards/analytics/GoalOverview";
import RevenueReport from "@src/views/ui-elements/cards/analytics/RevenueReport";
import OrdersBarChart from "@src/views/ui-elements/cards/statistics/OrdersBarChart";
import CardTransactions from "@src/views/ui-elements/cards/advance/CardTransactions";
import ProfitLineChart from "@src/views/ui-elements/cards/statistics/ProfitLineChart";
import CardBrowserStates from "@src/views/ui-elements/cards/advance/CardBrowserState";

// ** Styles
import "@styles/react/libs/charts/apex-charts.scss";
import "@styles/base/pages/dashboard-ecommerce.scss";

// ** Custom Hooks
import { useGetUser } from "../../../utility/gqlHelpers/useGetUser";
import { useGetInvoices } from "../../../utility/gqlHelpers/useGetInvoices";
import { useGetCourses } from "../../../utility/gqlHelpers/useGetCourses";
import { useGetUsers } from "../../../utility/gqlHelpers/useGetUsers";
import { useGetProducts } from "../../../utility/gqlHelpers/useGetProducts";
import { useGetOrders } from "../../../utility/gqlHelpers/useGetOrders";
import { useGetPayments } from "../../../utility/gqlHelpers/useGetPayments";

const EcommerceDashboard = () => {
  // ** Context
  const { colors } = useContext(ThemeColors);

  const { user } = useGetUser();
  const { invoices, invoiceCount } = useGetInvoices();
  const { courseCount } = useGetCourses();
  const { usersCount } = useGetUsers();
  const { productsCount } = useGetProducts();
  const { orders, ordersCount } = useGetOrders();
  const { payments, paymentsCount } = useGetPayments();
  // ** vars
  const trackBgColor = "#e9ecef";

  return (
    <div id="dashboard-ecommerce">
      <Row className="match-height">
        <Col xl="4" md="6" xs="12">
          <CardMedal user={user} invoices={invoices} />
        </Col>
        <Col xl="8" md="6" xs="12">
          <StatsCard
            cols={{ xl: "3", sm: "6" }}
            invoiceCount={invoiceCount}
            courseCount={courseCount}
            usersCount={usersCount}
            productsCount={productsCount}
          />
        </Col>
      </Row>
      <Row className="match-height">
        <Col lg="4" md="12">
          <Row className="match-height">
            <Col lg="6" md="3" xs="6">
              <OrdersBarChart
                warning={colors.warning.main}
                orders={orders}
                ordersCount={ordersCount}
              />
            </Col>
            <Col lg="6" md="3" xs="6">
              <ProfitLineChart
                info={colors.info.main}
                payments={payments}
                paymentsCount={paymentsCount}
              />
            </Col>
            <Col lg="12" md="6" xs="12">
              <Earnings
                success={colors.success.main}
                payments={payments}
                paymentsCount={paymentsCount}
              />
            </Col>
          </Row>
        </Col>
        <Col lg="8" md="12">
          <CompanyTable />
        </Col>
      </Row>
    </div>
  );
};

export default EcommerceDashboard;
