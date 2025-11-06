import type { ISidebarItems } from "../components/layouts/Sidebar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

export const sidebarItems: ISidebarItems[] = [
  {
    icon: ChatBubbleOutlineIcon,
    title: "Policy Generator",
    href: "/",
  },
  {
    icon: PeopleOutlineIcon,
    title: "User Management",
    href: "/user-management",
  },
];
