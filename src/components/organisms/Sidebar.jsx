import React, { useState } from "react"
import { useLocation } from "react-router-dom"
import NavItem from "@/components/molecules/NavItem"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const Sidebar = ({ className = "" }) => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isHomePage = location.pathname === "/"

  // Don't show sidebar on home page
  if (isHomePage) return null

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "BarChart3" },
    { name: "Invoices", href: "/invoices", icon: "FileText" },
    { name: "Clients", href: "/clients", icon: "Users" },
    { name: "Projects", href: "/projects", icon: "FolderOpen" },
    { name: "Settings", href: "/settings", icon: "Settings" }
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200 lg:shadow-sm transition-all duration-300",
        isCollapsed ? "lg:w-16" : "lg:w-64",
        className
      )}>
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className={cn(
            "flex items-center px-4 py-6 border-b border-gray-200",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl">
                <ApperIcon name="PaintBucket" size={24} className="text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-gray-900 font-display">DesignBill</h1>
                  <p className="text-xs text-gray-500 font-medium">Pro</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(true)}
                className="p-1.5"
              >
                <ApperIcon name="ChevronLeft" size={16} />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavItem key={item.name} to={item.href} icon={item.icon}>
                {!isCollapsed && item.name}
              </NavItem>
            ))}
          </nav>

          {/* Expand button when collapsed */}
          {isCollapsed && (
            <div className="px-4 py-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(false)}
                className="w-full p-2"
              >
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            </div>
          )}

          {/* User info */}
          {!isCollapsed && (
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-surface to-primary-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Sarah Johnson</p>
                  <p className="text-xs text-gray-500 truncate">Interior Designer</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* Mobile sidebar would go here with overlay pattern */}
      </div>
    </>
  )
}

export default Sidebar