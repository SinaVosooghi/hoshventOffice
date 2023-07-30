// ** Icons Import
import {
  Edit,
  Copy,
  Circle,
  Box,
  Package,
  AlertTriangle,
  RotateCw,
  Server,
  Grid,
  PenTool,
  MessageCircle,
} from "react-feather";

export default [
  {
    id: "content",
    title: "Content",
    icon: <PenTool />,
    children: [
      {
        id: "blog-categories",
        title: "Blog Categories",
        icon: <Server size={20} />,
        navLink: "/apps/categories/blog",
      },
      {
        id: "blog",
        title: "Blog",
        icon: <PenTool size={20} />,
        navLink: "/apps/blogs",
      },
      {
        id: "comments",
        title: "Comments",
        icon: <MessageCircle size={20} />,
        navLink: "/apps/comments",
      },
    ],
  },
];
