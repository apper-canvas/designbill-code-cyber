import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import invoiceService from "@/services/api/invoiceService"
import clientService from "@/services/api/clientService"
import { format } from "date-fns"
import { toast } from "react-toastify"

const Invoices = () => {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterAndSortInvoices()
  }, [invoices, searchTerm, statusFilter, sortBy])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [invoicesData, clientsData] = await Promise.all([
        invoiceService.getAll(),
        clientService.getAll()
      ])
      setInvoices(invoicesData)
      setClients(clientsData)
    } catch (err) {
      setError("Failed to load invoices")
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortInvoices = () => {
    let filtered = [...invoices]

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        getClientName(invoice.clientId).toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.status.toLowerCase() === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "amount-high":
          return b.total - a.total
        case "amount-low":
          return a.total - b.total
        case "due-date":
          return new Date(a.dueDate) - new Date(b.dueDate)
        default:
          return 0
      }
    })

    setFilteredInvoices(filtered)
  }

  const getClientName = (clientId) => {
    const client = clients.find(c => c.Id === clientId)
    return client ? client.name : "Unknown Client"
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

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) {
      return
    }

    try {
      await invoiceService.delete(invoiceId)
      setInvoices(invoices.filter(inv => inv.Id !== invoiceId))
      toast.success("Invoice deleted successfully")
    } catch (err) {
      toast.error("Failed to delete invoice")
    }
  }

  const handleSendInvoice = async (invoiceId) => {
    try {
      await invoiceService.sendInvoice(invoiceId, {
        subject: "Invoice from Johnson Interior Design",
        message: "Please find your invoice attached. Payment is due within 30 days."
      })
      
      // Update local state
      setInvoices(invoices.map(inv => 
        inv.Id === invoiceId ? { ...inv, status: "Sent" } : inv
      ))
      
      toast.success("Invoice sent successfully")
    } catch (err) {
      toast.error("Failed to send invoice")
    }
  }

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" }
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "amount-high", label: "Amount (High to Low)" },
    { value: "amount-low", label: "Amount (Low to High)" },
    { value: "due-date", label: "Due Date" }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage your design project invoices and get paid faster</p>
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

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search invoices or clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <Empty
          title="No invoices found"
          description={searchTerm || statusFilter !== "all" ? "Try adjusting your search or filters" : "Create your first invoice to get started"}
          actionLabel="Create Invoice"
          onAction={() => navigate("/invoices/new")}
          icon="FileText"
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Invoice</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Client</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Due Date</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.Id} className="hover:bg-gradient-to-r hover:from-surface hover:to-primary-50 transition-colors">
                    <td className="py-4 px-4">
                      <div 
                        className="font-semibold text-primary-600 cursor-pointer hover:text-primary-700"
                        onClick={() => navigate(`/invoices/${invoice.Id}`)}
                      >
                        {invoice.invoiceNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(invoice.createdAt), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">
                        {getClientName(invoice.clientId)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(invoice.total)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900">
                        {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/invoices/${invoice.Id}`)}
                        >
                          <ApperIcon name="Eye" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/invoices/${invoice.Id}/edit`)}
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        {invoice.status === "Draft" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendInvoice(invoice.Id)}
                          >
                            <ApperIcon name="Send" size={16} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInvoice(invoice.Id)}
                          className="text-error hover:text-error hover:bg-error/10"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-success/10 to-success/5">
          <div className="flex items-center gap-3">
            <div className="bg-success/20 p-2 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-lg font-bold text-gray-900">
                {invoices.filter(i => i.status === "Paid").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info/5">
          <div className="flex items-center gap-3">
            <div className="bg-info/20 p-2 rounded-lg">
              <ApperIcon name="Send" size={20} className="text-info" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sent</p>
              <p className="text-lg font-bold text-gray-900">
                {invoices.filter(i => i.status === "Sent").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
          <div className="flex items-center gap-3">
            <div className="bg-warning/20 p-2 rounded-lg">
              <ApperIcon name="Clock" size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-lg font-bold text-gray-900">
                {invoices.filter(i => i.status === "Overdue").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-gray-100 to-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 p-2 rounded-lg">
              <ApperIcon name="FileText" size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Draft</p>
              <p className="text-lg font-bold text-gray-900">
                {invoices.filter(i => i.status === "Draft").length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Invoices