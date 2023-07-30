// ** Icons Import
import {
  Box,
  Menu,
  Circle,
  EyeOff,
  Folder,
  LifeBuoy,
  Shield,
  PhoneCall,
  Settings,
} from "react-feather";

export default [
  {
    id: "others",
    title: "More",
    icon: <Box />,
    children: [
      {
        id: "contact",
        title: "Contacts",
        icon: <PhoneCall size={20} />,
        navLink: "/apps/contacts",
      },
      {
        id: "setting",
        title: "Setting",
        icon: <Settings size={20} />,
        navLink: "/apps/setting",
      },
    ],
  },
];
