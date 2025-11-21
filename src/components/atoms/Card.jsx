import React from "react"
import { cn } from "@/utils/cn"

const Card = React.forwardRef(({ 
  className = "", 
  variant = "default",
  hover = false,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white shadow-card",
    gradient: "bg-gradient-to-br from-surface to-primary-50 shadow-card",
    premium: "bg-white shadow-premium border border-gray-100"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl p-6 transition-shadow duration-200",
        variants[variant],
        hover && "hover:shadow-card-hover",
        className
      )}
      {...props}
    />
  )
})

Card.displayName = "Card"

export default Card