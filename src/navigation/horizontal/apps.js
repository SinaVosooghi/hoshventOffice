// ** Icons Import
import {
  Users,
  Server,
  PhoneCall,
  Globe,
  BookOpen,
  Calendar,
  Box,
  CheckCircle,
  Home,
  Shield,
  List,
} from "react-feather";

export default [
  {
    id: "site",
    title: "Site",
    icon: <Globe />,
    children: [
      {
        id: "roles-permissions",
        title: "Roles & Permissions",
        icon: <Shield size={20} />,
        navLink: "/apps/roles",
        action: "read",
        resource: "read-roles",
      },
      {
        id: "menus",
        title: "Menu",
        icon: <List size={20} />,
        navLink: "/apps/menus",
        action: "read",
        resource: "read-menus",
      },
      {
        id: "event-categories",
        title: "Event Categories",
        icon: <Server size={20} />,
        navLink: "/apps/categories/event",
        action: "read",
        resource: "read-categories",
      },
      {
        id: "services",
        title: "Services",
        icon: <Box size={20} />,
        navLink: "/apps/services",
        action: "read",
        resource: "read-services",
      },
      {
        id: "halls",
        title: "Halls",
        icon: <Home size={20} />,
        navLink: "/apps/halls",
        action: "read",
        resource: "read-halls",
      },
      {
        id: "workshops",
        title: "Workshops",
        icon: <BookOpen size={20} />,
        navLink: "/apps/workshops",
        action: "read",
        resource: "read-workshops",
      },
      {
        id: "seminars",
        title: "Seminars",
        icon: <BookOpen size={20} />,
        navLink: "/apps/seminars",
        action: "read",
        resource: "read-seminars",
      },
    ],
  },
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
        action: "read",
        resource: "read-roles",
      },
      {
        id: "users",
        title: "Users",
        icon: <Users size={20} />,
        navLink: "/apps/user/list/all",
        action: "read",
        resource: "read-users",
      },
    ],
  },
];
