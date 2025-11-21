import React from "react"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon, 
  gradient = "primary",
  className = "" 
}) => {
  const gradients = {
    primary: "from-primary-50 to-primary-100",
    secondary: "from-secondary-50 to-secondary-100", 
    accent: "from-accent-50 to-accent-100",
    success: "from-green-50 to-green-100",
    warning: "from-orange-50 to-orange-100"
  }

  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-gray-600"
  }

  return (
    <Card className={cn(`bg-gradient-to-br ${gradients[gradient]} border border-gray-100`, className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 font-display mb-2">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              <ApperIcon 
                name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
                size={14} 
                className={changeColors[changeType]} 
              />
              <span className={cn("text-sm font-medium", changeColors[changeType])}>
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="bg-white/60 p-3 rounded-xl backdrop-blur-sm">
            <ApperIcon name={icon} size={24} className="text-gray-700" />
          </div>
        )}
      </div>
    </Card>
  )
}

export default MetricCard