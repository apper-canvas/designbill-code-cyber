import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const ErrorView = ({ 
  error = "Something went wrong", 
  onRetry, 
  title = "Oops! Something went wrong",
  className = "" 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-error/10 to-error/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertTriangle" size={32} className="text-error" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {error}
        </p>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}

export default ErrorView