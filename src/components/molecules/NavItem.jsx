import React from "react"
import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const NavItem = ({ to, icon, children, className = "" }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-all duration-150",
          "hover:bg-primary-50 hover:text-primary-700",
          isActive && "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 border-r-2 border-primary-500 font-medium shadow-sm",
          className
        )
      }
    >
      {icon && <ApperIcon name={icon} size={20} />}
      <span>{children}</span>
    </NavLink>
  )
}

export default NavItem