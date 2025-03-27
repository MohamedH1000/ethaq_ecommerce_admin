import { type ShopSidebarNavItem, type SidebarNavItem } from "@/types";
import { ROUTES } from "./routes";

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[];
}
export interface ShopDashboardConfig {
  sidebarNav: ShopSidebarNavItem[];
}

export const dashboardConfig: ShopDashboardConfig = {
  sidebarNav: [
    {
      title: "لوحة التحكم",
      href: (shop: string) => `${ROUTES.DASHBOARD}${shop}`,
      icon: "dashboard",
      items: [],
    },
    {
      title: "Attributes",
      href: (shop: string) => `/${shop}${ROUTES.ATTRIBUTES}`,
      icon: "attribute",
      items: [],
    },
    {
      title: "Products",
      href: (shop: string) => `/${shop}${ROUTES.PRODUCTS}`,
      icon: "products",
      items: [],
    },

    {
      title: "Orders",
      href: (shop: string) => `/${shop}${ROUTES.ORDERS}`,
      icon: "order",
      items: [],
    },
    {
      title: "Reviews",
      href: (shop: string) => `/${shop}${ROUTES.REVIEWS}`,
      icon: "review",
      items: [],
    },
    {
      title: "Withdrawals",
      href: (shop: string) => `/${shop}${ROUTES.WITHDRAWS}`,
      icon: "gem",
      items: [],
    },
    {
      title: "Questions",
      href: (shop: string) => `/${shop}/questions`,
      icon: "question",
      items: [],
    },
  ],
};
export const sellerAccountConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Profile",
      href: "/seller/profile",
      icon: "user",
      items: [],
    },

    {
      title: "Chat Customer",
      href: "/seller/customer-chat",
      icon: "message",
      items: [],
    },
    {
      title: "Chat Support",
      href: "seller/support-chat",
      icon: "message",
      items: [],
    },
  ],
};
export const adminDashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "لوحة التحكم",
      href: "/admin/dashboard",
      icon: "dashboard",
      items: [],
    },
    // {
    //   title: "المتاجر",
    //   href: "/admin/shops",
    //   icon: "storehouse",
    //   items: [],
    // },
    // {
    //   title: "متاجري",
    //   href: "/admin/my-shops",
    //   icon: "order",
    //   items: [],
    // },
    {
      title: "المنتجات",
      href: "/admin/products",
      icon: "products",
      items: [],
    },
    {
      title: "الفئات",
      href: "/admin/categories",
      icon: "category",
      items: [],
    },
    // {
    //   title: "المجموعات",
    //   href: "/admin/groups",
    //   icon: "group",
    //   items: [],
    // },
    // {
    //   title: "السمات",
    //   href: "/admin/attributes",
    //   icon: "attribute",
    //   items: [],
    // },
    // {
    //   title: "العلامات التجارية",
    //   href: "/admin/tags",
    //   icon: "tag",
    //   items: [],
    // },
    // {
    //   title: "محادثات البائعين",
    //   href: "/admin/seller-chat",
    //   icon: "message",
    //   items: [],
    // },
    // {
    //   title: "البائعين",
    //   href: "/admin/sellers",
    //   icon: "user",
    //   items: [],
    // },
    {
      title: "المستخدمين",
      href: "/admin/users",
      icon: "user",
      items: [],
    },
    {
      title: "الطلبات",
      href: "/admin/requests",
      icon: "author",
      items: [],
    },
    {
      title: "انشاء طلب",
      href: "/admin/request-create",
      icon: "author",
      items: [],
    },
  ],
};
