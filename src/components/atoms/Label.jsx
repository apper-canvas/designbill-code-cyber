import React from "react"
import { cn } from "@/utils/cn"

const Label = React.forwardRef(({ 
  className = "", 
  required = false,
  ...props 
}, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  >
    {props.children}
    {required && <span className="text-error ml-1">*</span>}
  </label>
))

Label.displayName = "Label"

export default Label