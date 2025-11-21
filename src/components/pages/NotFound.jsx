import React from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface to-primary-50 px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-primary-100 to-accent-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="FileQuestion" size={48} className="text-primary-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 font-display mb-2">404</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-semibold text-gray-900 font-display mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to managing your interior design business.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="primary"
            onClick={() => navigate("/dashboard")}
            icon="Home"
            size="lg"
          >
            Go to Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            icon="ArrowLeft"
            size="lg"
          >
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/invoices")}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ApperIcon name="FileText" size={16} />
              <span>Invoices</span>
            </button>
            <button
              onClick={() => navigate("/clients")}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ApperIcon name="Users" size={16} />
              <span>Clients</span>
            </button>
            <button
              onClick={() => navigate("/projects")}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ApperIcon name="FolderOpen" size={16} />
              <span>Projects</span>
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ApperIcon name="Settings" size={16} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound