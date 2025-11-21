import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by creating your first item", 
  actionLabel = "Get Started",
  onAction,
  icon = "Package",
  className = "" 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} size={40} className="text-accent-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
        
        {onAction && (
          <Button 
            onClick={onAction}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Empty