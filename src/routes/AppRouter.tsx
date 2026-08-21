import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { HomePage } from "@/pages/HomePage";
import { ServicesPage } from "@/pages/ServicesPage";
import { ServiceDetailPage } from "@/pages/ServiceDetailPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { FaqPage } from "@/pages/FaqPage";

import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// Lazy-load admin components to split code and minimize public bundle size
const AdminLayout = lazy(() => import("@/components/layout/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage })));
const ChangePasswordPage = lazy(() => import("@/pages/admin/ChangePasswordPage").then((m) => ({ default: m.ChangePasswordPage })));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage").then((m) => ({ default: m.AdminDashboardPage })));
const AdminCategoriesPage = lazy(() => import("@/pages/admin/AdminCategoriesPage").then((m) => ({ default: m.AdminCategoriesPage })));
const AdminServicesPage = lazy(() => import("@/pages/admin/AdminServicesPage").then((m) => ({ default: m.AdminServicesPage })));
const AdminProjectsPage = lazy(() => import("@/pages/admin/AdminProjectsPage").then((m) => ({ default: m.AdminProjectsPage })));
const AdminContentPage = lazy(() => import("@/pages/admin/AdminContentPage").then((m) => ({ default: m.AdminContentPage })));
const AdminMediaPage = lazy(() => import("@/pages/admin/AdminMediaPage").then((m) => ({ default: m.AdminMediaPage })));
const AdminEnquiriesPage = lazy(() => import("@/pages/admin/AdminEnquiriesPage").then((m) => ({ default: m.AdminEnquiriesPage })));
const AdminProfilePage = lazy(() => import("@/pages/admin/AdminProfilePage").then((m) => ({ default: m.AdminProfilePage })));

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
      { path: "faq", element: <FaqPage /> },
    ],
  },

  /* Admin Unprotected Auth Routes */
  {
    path: "/admin/login",
    element: (
      <Suspense fallback={<LoadingSpinner fullScreen label="Loading Admin Login..." />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },

  /* Admin Protected Routes */
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        path: "change-password",
        element: (
          <Suspense fallback={<div className="p-8 flex justify-center"><LoadingSpinner label="Loading..." /></div>}>
            <ChangePasswordPage />
          </Suspense>
        ),
      },
      {
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen label="Loading Admin Portal..." />}>
            <AdminLayout />
          </Suspense>
        ),
        children: [
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<LoadingSpinner label="Loading Dashboard..." />}>
                <AdminDashboardPage />
              </Suspense>
            ),
          },
          {
            path: "categories",
            element: (
              <Suspense fallback={<LoadingSpinner label="Loading Categories..." />}>
                <AdminCategoriesPage />
              </Suspense>
            ),
          },
          {
            path: "services",
            element: (
              <Suspense fallback={<LoadingSpinner label="Loading Services..." />}>
                <AdminServicesPage />
              </Suspense>
            ),
          },
          {
            path: "projects",
            element: (
              <Suspense fallback={<LoadingSpinner label="Loading Projects..." />}>
                <AdminProjectsPage />
              </Suspense>
            ),
          },
          {
            path: "content",
            element: (
              <Suspense fallback={<LoadingSpinner label="Loading Content..." />}>
                <AdminContentPage />
              </Suspense>
            ),
          },
          {
            path: "media",
            element: (
              <Suspense fallback={<LoadingSpinner label="Loading Media..." />}>
                <AdminMediaPage />
              </Suspense>
            ),
          },
          {
            path: "enquiries",
            element: (
              <Suspense fallback={<LoadingSpinner label="Loading Enquiries..." />}>
                <AdminEnquiriesPage />
              </Suspense>
            ),
          },
          {
            path: "profile",
            element: (
              <Suspense fallback={<LoadingSpinner label="Loading Profile..." />}>
                <AdminProfilePage />
              </Suspense>
            ),
          },
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
