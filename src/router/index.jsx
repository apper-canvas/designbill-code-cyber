import { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"
import Layout from "@/components/organisms/Layout"

const Home = lazy(() => import("@/components/pages/Home"))
const Dashboard = lazy(() => import("@/components/pages/Dashboard"))
const Invoices = lazy(() => import("@/components/pages/Invoices"))
const InvoiceDetail = lazy(() => import("@/components/pages/InvoiceDetail"))
const InvoiceCreate = lazy(() => import("@/components/pages/InvoiceCreate"))
const Clients = lazy(() => import("@/components/pages/Clients"))
const Projects = lazy(() => import("@/components/pages/Projects"))
const Settings = lazy(() => import("@/components/pages/Settings"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface to-primary-50">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-primary-600 font-medium">Loading DesignBill Pro...</p>
    </div>
  </div>
)

const mainRoutes = [
  {
    path: "",
    index: true,
    element: <Suspense fallback={<LoadingFallback />}><Home /></Suspense>
  },
  {
    path: "dashboard",
    element: <Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>
  },
  {
    path: "invoices",
    element: <Suspense fallback={<LoadingFallback />}><Invoices /></Suspense>
  },
  {
    path: "invoices/new",
    element: <Suspense fallback={<LoadingFallback />}><InvoiceCreate /></Suspense>
  },
  {
    path: "invoices/:id",
    element: <Suspense fallback={<LoadingFallback />}><InvoiceDetail /></Suspense>
  },
  {
    path: "invoices/:id/edit",
    element: <Suspense fallback={<LoadingFallback />}><InvoiceCreate /></Suspense>
  },
  {
    path: "clients",
    element: <Suspense fallback={<LoadingFallback />}><Clients /></Suspense>
  },
  {
    path: "projects",
    element: <Suspense fallback={<LoadingFallback />}><Projects /></Suspense>
  },
  {
    path: "settings",
    element: <Suspense fallback={<LoadingFallback />}><Settings /></Suspense>
  },
  {
    path: "*",
    element: <Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>
  }
]

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
]

export const router = createBrowserRouter(routes)