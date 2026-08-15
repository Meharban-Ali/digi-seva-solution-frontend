import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { HomePage } from "@/pages/HomePage";
import { ServicesPage } from "@/pages/ServicesPage";
import { ServiceDetailPage } from "@/pages/ServiceDetailPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";

import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { ChangePasswordPage } from "@/pages/admin/ChangePasswordPage";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminServicesPage } from "@/pages/admin/AdminServicesPage";
import { AdminContentPage } from "@/pages/admin/AdminContentPage";
import { AdminMediaPage } from "@/pages/admin/AdminMediaPage";
import { AdminEnquiriesPage } from "@/pages/admin/AdminEnquiriesPage";

const router = createBrowserRouter([
  /* Public Routes */
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "services/:id", element: <ServiceDetailPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },

  /* Admin Unprotected Auth Routes */
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },

  /* Admin Protected Routes */
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        path: "change-password",
        element: <ChangePasswordPage />,
      },
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboardPage /> },
          { path: "services", element: <AdminServicesPage /> },
          { path: "content", element: <AdminContentPage /> },
          { path: "media", element: <AdminMediaPage /> },
          { path: "enquiries", element: <AdminEnquiriesPage /> },
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
        ],
      },
    ],
  },

  /* Fallback Route */
  { path: "*", element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
