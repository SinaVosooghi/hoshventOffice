import { lazy } from "react";

const DashboardAnalytics = lazy(() =>
  import("../../views/dashboard/analytics")
);
const DashboardEcommerce = lazy(() =>
  import("../../views/dashboard/ecommerce")
);

const DashboardRoutes = [
  {
    path: "/dashboard",
    element: <DashboardAnalytics />,
    meta: {
      action: "read",
      resource: "HOME",
    },
  },
  {
    path: "/shop",
    element: <DashboardEcommerce />,
    meta: {
      action: "read",
      resource: "HOME",
    },
  },
];

export default DashboardRoutes;
