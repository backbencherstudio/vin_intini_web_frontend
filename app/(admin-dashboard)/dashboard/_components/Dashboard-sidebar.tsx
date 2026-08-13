import {
  LayoutDashboard,
  UsersRound,
  Tag,
  DollarSign,
  Megaphone,
  List,
  Brain,
  BrainCircuit,
  Shapes,
  Settings,
  BarChart3,
  LogOut,
  GraduationCap,
  UserRound,
  Crown,
  BriefcaseBusiness,
} from "lucide-react";

export interface SidebarChild {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
}

export interface SidebarItem {
  id: string;
  name: string;
  href?: string;
  icon: React.ElementType;
  children?: SidebarChild[];
}

export const SidebarData: SidebarItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    id: "users",
    name: "Users Management",
    icon: UsersRound,
    children: [
      {
        id: "basic-users",
        name: "Basic Users",
        href: "/dashboard/user-management/basic-user",
        icon: UserRound,
      },
      {
        id: "premium-users",
        name: "Premium Users",
        href: "/dashboard/users/premium",
        icon: Crown,
      },
      {
        id: "pro-users",
        name: "Pro Industry Users",
        href: "/dashboard/users/pro",
        icon: BriefcaseBusiness,
      },
    ],
  },

  {
    id: "subscription",
    name: "Subscription",
    href: "/dashboard/subscription",
    icon: Tag,
  },

  {
    id: "payments",
    name: "Payment Management",
    href: "/dashboard/payments",
    icon: DollarSign,
  },

  {
    id: "advertise",
    name: "Advertise Management",
    href: "/dashboard/advertisement",
    icon: Megaphone,
  },

  {
    id: "platform-content",
    name: "Platform Content",
    icon: List,
    children: [
      {
        id: "content",
        name: "Content Management",
        href: "/dashboard/platform-content",
        icon: List,
      },
      {
        id: "categories",
        name: "Categories",
        href: "/dashboard/categories",
        icon: Shapes,
      },
    ],
  },

  {
    id: "academia",
    name: "Academia",
    icon: GraduationCap,
    children: [
      {
        id: "courses",
        name: "Courses",
        href: "/dashboard/academia/courses",
        icon: GraduationCap,
      },
      {
        id: "students",
        name: "Students",
        href: "/dashboard/academia/students",
        icon: UserRound,
      },
    ],
  },

  {
    id: "categories",
    name: "Categories",
    icon: Shapes,
    children: [
      {
        id: "all-categories",
        name: "All Categories",
        href: "/dashboard/categories",
        icon: Shapes,
      },
    ],
  },

  {
    id: "psychology",
    name: "Psychology",
    icon: Brain,
    children: [
      {
        id: "psychology-content",
        name: "Psychology Content",
        href: "/dashboard/psychology",
        icon: Brain,
      },
    ],
  },

  {
    id: "neuroscience",
    name: "Neuroscience",
    icon: BrainCircuit,
    children: [
      {
        id: "neuroscience-content",
        name: "Neuroscience Content",
        href: "/dashboard/neuroscience",
        icon: BrainCircuit,
      },
    ],
  },
];