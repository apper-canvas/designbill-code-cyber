import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { logout } from "@/store/authSlice"
import { toast } from "react-toastify"

const Header = ({ className = "" }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isHomePage = location.pathname === "/"

  const handleLogout = () => {
    dispatch(logout())
    toast.success("Logged out successfully")
    navigate("/")
  }

  // Home page header
  if (isHomePage) {
    return (
      <header className={cn("bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl">
                <ApperIcon name="PaintBucket" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-display">DesignBill Pro</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Pricing
              </a>
{!isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    Welcome, {user?.name}
                  </span>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <ApperIcon name="LogOut" size={16} />
                  </Button>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="block text-gray-700 hover:text-primary-600 font-medium transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="block text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Pricing
              </a>
{!isAuthenticated ? (
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/login")}
                    className="w-full"
                  >
                    Login
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate("/signup")}
                    className="w-full"
                  >
                    Sign Up
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center">
                    <span className="text-sm font-medium text-gray-700">
                      Welcome, {user?.name}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/dashboard")}
                    className="w-full"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="w-full text-gray-600 hover:text-gray-800"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    )
  }

  // Dashboard header
  return (
    <header className={cn("bg-white shadow-sm border-b border-gray-200 lg:pl-64", className)}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Logo & Menu */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <ApperIcon name="Menu" size={24} />
            </Button>
            <div className="flex items-center gap-2 ml-3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-1.5 rounded-lg">
                <ApperIcon name="PaintBucket" size={16} className="text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg font-display">DesignBill</span>
            </div>
          </div>

          {/* Page Title */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold text-gray-900 font-display capitalize">
              {location.pathname.split("/")[1] || "Dashboard"}
            </h2>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="accent"
              size="sm"
              onClick={() => navigate("/invoices/new")}
              icon="Plus"
            >
              <span className="hidden sm:inline">New Invoice</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
            >
              <ApperIcon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent-500 rounded-full"></span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header