import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MetricCard from "@/components/molecules/MetricCard"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ApperIcon from "@/components/ApperIcon"
import invoiceService from "@/services/api/invoiceService"
import clientService from "@/services/api/clientService"
import { format } from "date-fns"

const Dashboard = () => {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState(null)
  const [recentInvoices, setRecentInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      const metricsData = await invoiceService.getDashboardMetrics()
      setMetrics(metricsData)
      setRecentInvoices(metricsData.recentInvoices)
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "Paid": return "success"
      case "Sent": return "info"
      case "Overdue": return "error"
      case "Draft": return "default"
      default: return "default"
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount)
  }

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadDashboardData} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your design business.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate("/invoices/new")}
          icon="Plus"
          size="lg"
        >
          New Invoice
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          change="+12.5% from last month"
          changeType="positive"
          icon="DollarSign"
          gradient="primary"
        />
        <MetricCard
          title="Unpaid Amount"
          value={formatCurrency(metrics.unpaidAmount)}
          change={`${metrics.unpaidCount} invoices`}
          changeType="warning"
          icon="Clock"
          gradient="accent"
        />
        <MetricCard
          title="Total Invoices"
          value={metrics.totalInvoices.toString()}
          change={`${metrics.paidCount} paid`}
          changeType="positive"
          icon="FileText"
          gradient="secondary"
        />
        <MetricCard
          title="Average Invoice"
          value={formatCurrency(metrics.averageInvoice)}
          change="+8.2% vs last month"
          changeType="positive"
          icon="TrendingUp"
          gradient="success"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Invoices */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 font-display">Recent Invoices</h2>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/invoices")}
                size="sm"
              >
                View All
                <ApperIcon name="ArrowRight" size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div 
                  key={invoice.Id} 
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-surface to-primary-50 hover:from-primary-50 hover:to-primary-100 transition-all cursor-pointer"
                  onClick={() => navigate(`/invoices/${invoice.Id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <ApperIcon name="FileText" size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-gray-600">
                        {format(new Date(invoice.issueDate), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatCurrency(invoice.total)}</div>
                      <Badge variant={getStatusVariant(invoice.status)} size="sm">
                        {invoice.status}
                      </Badge>
                    </div>
                    <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 font-display mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Button 
                variant="primary" 
                className="w-full justify-start"
                onClick={() => navigate("/invoices/new")}
                icon="Plus"
              >
                Create Invoice
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/clients")}
                icon="UserPlus"
              >
                Add Client
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/projects")}
                icon="FolderPlus"
              >
                New Project
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate("/settings")}
                icon="Settings"
              >
                Settings
              </Button>
            </div>
          </Card>

          {/* Status Overview */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 font-display mb-6">Invoice Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-gray-700">Paid</span>
                </div>
                <span className="font-semibold text-gray-900">{metrics.paidCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-info rounded-full"></div>
                  <span className="text-gray-700">Sent</span>
                </div>
                <span className="font-semibold text-gray-900">{metrics.unpaidCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-700">Draft</span>
                </div>
                <span className="font-semibold text-gray-900">{metrics.draftCount}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tips Section */}
      <Card variant="gradient">
        <div className="flex items-start gap-4">
          <div className="bg-accent-500 p-3 rounded-xl flex-shrink-0">
            <ApperIcon name="Lightbulb" size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">Pro Tips for Design Business</h3>
            <p className="text-gray-600 mb-4">
              Improve your cash flow by setting up automatic payment reminders and offering early payment discounts to your interior design clients.
            </p>
            <div className="flex gap-3">
              <Button variant="accent" size="sm">
                Learn More
              </Button>
              <Button variant="ghost" size="sm">
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard