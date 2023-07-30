// ** Icons Import
import { HelpCircle, Grid, MessageSquare, LifeBuoy } from "react-feather";

export default [
  {
    id: "support",
    title: "Support",
    icon: <LifeBuoy />,
    children: [
      {
        id: "departments",
        title: "Departments",
        icon: <Grid size={20} />,
        navLink: "/apps/departments",
      },
      {
        id: "chats",
        title: "Chats",
        icon: <MessageSquare size={20} />,
        navLink: "/apps/ticket",
        badge: "light-danger",
        badgeText: "2",
      },
    ],
  },
];
