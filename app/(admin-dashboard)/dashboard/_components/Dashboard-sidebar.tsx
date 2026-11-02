import { AcademicIcon, AdvertizementIcon, BasicUserIcon, CategoryIcon, FacilitesIcon, NeuroscienceIcon, PartnerIcon, PremiumUserIcon, ProUserIcon, ResendenceIcon, SubPlanIcon, SubscriptIcon, SubTranscIcon, UniversitiseIcon, UserManagementIcon } from "@/public/svgIcons/AdminIcon";
import {
  List,
  Brain,
  Shapes,
  Settings,
  Shield,
  Mail,
  ClipboardCheck,
  ClipboardList,
} from "lucide-react";
import { LuChartNoAxesColumn } from "react-icons/lu";
import { MdOutlineDashboardCustomize } from "react-icons/md";

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
    icon: MdOutlineDashboardCustomize,
  },

  {
    id: "users",
    name: "Users Management",
    icon: UserManagementIcon,
    children: [
      {
        id: "basic-users",
        name: "Basic Users",
        href: "/dashboard/user-management/basic-user",
        icon: BasicUserIcon,
      },
      {
        id: "premium-users",
        name: "Premium Users",
        href: "/dashboard/user-management/premium-users",
        icon: PremiumUserIcon,
      },
      {
        id: "pro-users",
        name: "Pro Industry Users",
        href: "/dashboard/user-management/pro-users",
        icon: ProUserIcon,
      },
      {
        id: "leave-management",
        name: "Leave Request",
        href: "/dashboard/user-management/leave-management",
        icon: ClipboardCheck,
      },
    ],
  },

  {
    id: "subscription",
    name: "Subscription",
    // href: "/dashboard/subscription",
    icon: SubscriptIcon,
    children: [
      {
        id: "subscription-overview",
        name: "Overview",
        href: "/dashboard/subscription/overview",
        icon: LuChartNoAxesColumn,
      },
      {
        id: "plan-pricing",
        name: "Plan and Pricing",
        href: "/dashboard/subscription/plan-pricing",
        icon: SubPlanIcon,
      },
      {
        id: "transactions",
        name: "Transactions",
        href: "/dashboard/subscription/transactions",
        icon: SubTranscIcon,
      },
    ]
  },

  // {
  //   id: "payments",
  //   name: "Payment Management",
  //   href: "/dashboard/payments",
  //   icon: PaymentManagementIcon,
  // },

  {
    id: "advertise",
    name: "Advertise Management",
    href: "/dashboard/advertisement",
    icon: AdvertizementIcon,
  },

  // {
  //   id: "platform-content",
  //   name: "Platform Content",
  //   icon: PlatFromIcon,
  //   children: [
  //     {
  //       id: "content",
  //       name: "Content Management",
  //       href: "/dashboard/platform-content",
  //       icon: List,
  //     },
  //     {
  //       id: "categories",
  //       name: "Categories",
  //       href: "/dashboard/categories",
  //       icon: Shapes,
  //     },
  //   ],
  // },

  {
    id: "academia",
    name: "Academia",
    icon: AcademicIcon,
    children: [
      {
        id: "universities",
        name: "Universities",
        href: "/dashboard/academia/universites",
        icon: UniversitiseIcon,
      },
      {
        id: "residencies",
        name: "Residencies",
        href: "/dashboard/academia/residencies",
        icon: ResendenceIcon,
      },
      {
        id: "facilities",
        name: "Facilities",
        href: "/dashboard/academia/facilities",
        icon: FacilitesIcon,
      },
    ],
  },

  {
    id: "categories",
    name: "Categories",
    icon: CategoryIcon,
    children: [
      {
        id: "psychology",
        name: "Psychology",
        href: "/dashboard/categories/psychology",
        icon: Brain,
      },

      {
        id: "neuroscience",
        name: "Neuroscience",
        href: "/dashboard/categories/neuroscience",
        icon: NeuroscienceIcon,
      },
    ],
  },

  {
    id: "psychology",
    name: "Psychology",
    icon: Brain,
    children: [
      {
        id: "biotechnology",
        name: "Biotechnology",
        href: "/dashboard/phychology/biotechnology",
        icon: Brain,
      },
    ],
  },

  {
    id: "partner-program",
    name: "Partners",
    href: "/dashboard/partners",
    icon: PartnerIcon,
  },
  {
    id: "publications",
    name: "Publications",
    href: "/dashboard/publications",
    icon: List,
  },
  {
    id: "institution-reports",
    name: "Institution Reports",
    href: "/dashboard/institution-reports",
    icon: ClipboardList,
  },
  {
    id: "contact-messages",
    name: "Contact Messages",
    href: "/dashboard/contact-messages",
    icon: Mail,
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    children: [
      {
        id: "integration-settings",
        name: "Integrations",
        href: "/dashboard/settings/integrations",
        icon: Shapes,
      },
      {
        id: "content-pages",
        name: "Content Pages",
        href: "/dashboard/settings/content-pages",
        icon: List,
      },
      {
        id: "security-settings",
        name: "Security Settings",
        href: "/dashboard/settings/security",
        icon: Shield,
      },
    ],
  },
];
