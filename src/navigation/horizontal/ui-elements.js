// ** Icons Import
import {
  Layers,
  Type,
  Eye,
  CreditCard,
  Circle,
  Briefcase,
  Box,
  Layout,
  Users,
  Server,
} from "react-feather";

export default [
  {
    id: "users",
    title: "Users",
    icon: <Users />,
    children: [
      {
        id: "user-categories",
        title: "User Categories",
        icon: <Server size={20} />,
        navLink: "/apps/categories/user",
      },
      {
        id: "users",
        title: "Users",
        icon: <Users size={20} />,
        navLink: "/apps/user/list/all",
      },
    ],
  },
];
