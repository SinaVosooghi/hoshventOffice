// ** Icons Import
import {
  Award,
  BarChart2,
  Circle,
  CreditCard,
  FileText,
  Image,
  Percent,
  Star,
} from "react-feather";

export default [
  {
    id: "features",
    title: "Features",
    icon: <Star />,
    children: [
      {
        id: "shop-slider",
        title: "Sliders",
        icon: <Image size={20} />,
        navLink: "/apps/sliders",
      },
      {
        id: "brands",
        title: "Brands",
        icon: <Award size={20} />,
        navLink: "/apps/brands",
      },
      {
        id: "coupons",
        title: "Coupons",
        icon: <Percent size={20} />,
        navLink: "/apps/coupons/course",
      },
      {
        id: "invoices",
        title: "Invoices",
        icon: <FileText size={20} />,
        navLink: "/apps/invoices",
      },
    ],
  },
];
