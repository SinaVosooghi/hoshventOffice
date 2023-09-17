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
        action: "read",
        resource: "read-sliders",
      },
      {
        id: "brands",
        title: "Brands",
        icon: <Award size={20} />,
        navLink: "/apps/brands",
        action: "read",
        resource: "read-brands",
      },
    ],
  },
];
