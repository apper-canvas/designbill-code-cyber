import React from "react"
import { Outlet } from "react-router-dom"
import Header from "@/components/organisms/Header"
import Sidebar from "@/components/organisms/Sidebar"

const Layout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 lg:pl-64">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout