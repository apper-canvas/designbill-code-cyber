import { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"
import Layout from "@/components/organisms/Layout"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

const Home = lazy(() => import("@/components/pages/Home"))
const Dashboard = lazy(() => import("@/components/pages/Dashboard"))
const Invoices = lazy(() => import("@/components/pages/Invoices"))
const InvoiceDetail = lazy(() => import("@/components/pages/InvoiceDetail"))
const InvoiceCreate = lazy(() => import("@/components/pages/InvoiceCreate"))
const Clients = lazy(() => import("@/components/pages/Clients"))
const Projects = lazy(() => import("@/components/pages/Projects"))
const Settings = lazy(() => import("@/components/pages/Settings"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))
const Login = lazy(() => import("@/components/pages/Login"))
const Signup = lazy(() => import("@/components/pages/Signup"))

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
    path: "login",
    element: <Suspense fallback={<LoadingFallback />}><Login /></Suspense>
  },
  {
    path: "signup",
    element: <Suspense fallback={<LoadingFallback />}><Signup /></Suspense>
  },
  {
    path: "dashboard",
    element: <ProtectedRoute><Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense></ProtectedRoute>
  },
  {
    path: "invoices",
    element: <ProtectedRoute><Suspense fallback={<LoadingFallback />}><Invoices /></Suspense></ProtectedRoute>
  },
  {
    path: "invoices/new",
    element: <ProtectedRoute><Suspense fallback={<LoadingFallback />}><InvoiceCreate /></Suspense></ProtectedRoute>
  },
  {
    path: "invoices/:id",
    element: <ProtectedRoute><Suspense fallback={<LoadingFallback />}><InvoiceDetail /></Suspense></ProtectedRoute>
  },
  {
    path: "invoices/:id/edit",
    element: <ProtectedRoute><Suspense fallback={<LoadingFallback />}><InvoiceCreate /></Suspense></ProtectedRoute>
  },
  {
    path: "clients",
    element: <ProtectedRoute><Suspense fallback={<LoadingFallback />}><Clients /></Suspense></ProtectedRoute>
  },
  {
    path: "projects",
    element: <ProtectedRoute><Suspense fallback={<LoadingFallback />}><Projects /></Suspense></ProtectedRoute>
  },
  {
    path: "settings",
    element: <ProtectedRoute><Suspense fallback={<LoadingFallback />}><Settings /></Suspense></ProtectedRoute>
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