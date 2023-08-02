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
      },
      {
        id: "event-categories",
        title: "Event Categories",
        icon: <Server size={20} />,
        navLink: "/apps/categories/event",
      },
      {
        id: "events",
        title: "Events",
        icon: <Calendar size={20} />,
        navLink: "/apps/events",
      },
      {
        id: "services",
        title: "Services",
        icon: <Box size={20} />,
        navLink: "/apps/services",
      },
      {
        id: "halls",
        title: "Halls",
        icon: <Home size={20} />,
        navLink: "/apps/halls",
      },
      {
        id: "lecturers",
        title: "Lecturer",
        icon: <Users size={20} />,
        navLink: "/apps/user/list/lecturer",
      },
      {
        id: "workshops",
        title: "Workshops",
        icon: <BookOpen size={20} />,
        navLink: "/apps/workshops",
      },
      {
        id: "seminars",
        title: "Seminars",
        icon: <BookOpen size={20} />,
        navLink: "/apps/seminars",
      },
    ],
  },
];
