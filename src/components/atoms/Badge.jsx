import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ 
  variant = "default", 
  size = "md",
  className = "", 
  children,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full"
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-gradient-to-r from-success/20 to-success/10 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/20 to-warning/10 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/20 to-error/10 text-error border border-error/20",
    info: "bg-gradient-to-r from-info/20 to-info/10 text-info border border-info/20",
    primary: "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 border border-primary-200",
    accent: "bg-gradient-to-r from-accent/20 to-accent/10 text-accent-700 border border-accent/30"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  }
  
  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge