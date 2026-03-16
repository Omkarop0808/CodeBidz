import { AdminLayout } from "../layout/AdminLayout";
import { AdminDashboard } from "../pages/Admin/AdminDashboard";
import { UsersList } from "../pages/Admin/UsersList";
import { AuctionManagement } from "../pages/Admin/AuctionManagement";
import { CreditManagement } from "../pages/Admin/CreditManagement";
import { Analytics } from "../pages/Admin/Analytics";
import AdminLogin from "../pages/AdminLogin";

export const adminRouter = [
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <UsersList />,
      },
      {
        path: "auctions",
        element: <AuctionManagement />,
      },
      {
        path: "credits",
        element: <CreditManagement />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
    ],
  },
];