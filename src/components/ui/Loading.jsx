import React from "react"

const Loading = ({ type = "skeleton", className = "" }) => {
  if (type === "spinner") {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-surface to-primary-50 rounded-xl p-6 shadow-card">
          <div className="shimmer h-4 w-24 rounded mb-2"></div>
          <div className="shimmer h-8 w-32 rounded"></div>
        </div>
        <div className="bg-gradient-to-br from-surface to-secondary-50 rounded-xl p-6 shadow-card">
          <div className="shimmer h-4 w-20 rounded mb-2"></div>
          <div className="shimmer h-8 w-28 rounded"></div>
        </div>
        <div className="bg-gradient-to-br from-surface to-accent-50 rounded-xl p-6 shadow-card">
          <div className="shimmer h-4 w-28 rounded mb-2"></div>
          <div className="shimmer h-8 w-36 rounded"></div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="shimmer h-6 w-48 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="shimmer h-4 w-4 rounded"></div>
              <div className="shimmer h-4 w-32 rounded"></div>
              <div className="shimmer h-4 w-24 rounded"></div>
              <div className="shimmer h-4 w-20 rounded"></div>
              <div className="shimmer h-4 w-16 rounded ml-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading