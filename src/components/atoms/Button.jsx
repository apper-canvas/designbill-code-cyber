import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = React.forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false, 
  loading = false, 
  icon,
  className = "", 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md hover:shadow-lg focus:ring-primary-500",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white shadow-md hover:shadow-lg focus:ring-secondary-500",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-md hover:shadow-lg focus:ring-accent-500",
    outline: "border-2 border-gray-300 hover:border-primary-500 text-gray-700 hover:text-primary-600 bg-white hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-gray-700 hover:text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    danger: "bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg focus:ring-red-500"
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm rounded-lg gap-2",
    md: "px-4 py-2.5 text-sm rounded-lg gap-2",
    lg: "px-6 py-3 text-base rounded-xl gap-2"
  }
  
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && "cursor-wait",
        className
      )}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" size={16} className="animate-spin" />
      )}
      {icon && !loading && (
        <ApperIcon name={icon} size={16} />
      )}
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button