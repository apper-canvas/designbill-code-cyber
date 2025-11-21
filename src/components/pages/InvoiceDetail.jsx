import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ApperIcon from "@/components/ApperIcon"
import invoiceService from "@/services/api/invoiceService"
import clientService from "@/services/api/clientService"
import projectService from "@/services/api/projectService"
import { format } from "date-fns"
import { toast } from "react-toastify"

const InvoiceDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [client, setClient] = useState(null)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (id) {
      loadInvoiceData()
    }
  }, [id])

  const loadInvoiceData = async () => {
    try {
      setLoading(true)
      setError("")
      const invoiceData = await invoiceService.getById(id)
      setInvoice(invoiceData)

      if (invoiceData.clientId) {
        const clientData = await clientService.getById(invoiceData.clientId)
        setClient(clientData)
      }

      if (invoiceData.projectId) {
        const projectData = await projectService.getById(invoiceData.projectId)
        setProject(projectData)
      }
    } catch (err) {
      setError("Failed to load invoice details")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount)
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

  const handleSendInvoice = async () => {
    try {
      setActionLoading(true)
      await invoiceService.sendInvoice(id, {
        subject: "Invoice from Johnson Interior Design",
        message: "Please find your invoice attached. Payment is due within 30 days."
      })
      
      setInvoice({ ...invoice, status: "Sent" })
      toast.success("Invoice sent successfully")
    } catch (err) {
      toast.error("Failed to send invoice")
    } finally {
      setActionLoading(false)
    }
  }

  const handleMarkAsPaid = async () => {
    try {
      setActionLoading(true)
      const updatedInvoice = await invoiceService.updateStatus(id, "Paid")
      setInvoice(updatedInvoice)
      toast.success("Invoice marked as paid")
    } catch (err) {
      toast.error("Failed to update invoice status")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteInvoice = async () => {
    if (!window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) {
      return
    }

    try {
      await invoiceService.delete(id)
      toast.success("Invoice deleted successfully")
      navigate("/invoices")
    } catch (err) {
      toast.error("Failed to delete invoice")
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadInvoiceData} />
  if (!invoice) return <ErrorView error="Invoice not found" />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/invoices")}
            icon="ArrowLeft"
            size="sm"
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">{invoice.invoiceNumber}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant={getStatusVariant(invoice.status)}>
                {invoice.status}
              </Badge>
              <span className="text-gray-600">
                Created {format(new Date(invoice.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {invoice.status === "Draft" && (
            <Button
              variant="accent"
              onClick={handleSendInvoice}
              loading={actionLoading}
              icon="Send"
            >
              Send Invoice
            </Button>
          )}
          {(invoice.status === "Sent" || invoice.status === "Overdue") && (
            <Button
              variant="primary"
              onClick={handleMarkAsPaid}
              loading={actionLoading}
              icon="Check"
            >
              Mark as Paid
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate(`/invoices/${id}/edit`)}
            icon="Edit"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.print()}
            icon="Printer"
          >
            Print
          </Button>
          <Button
            variant="ghost"
            onClick={handleDeleteInvoice}
            className="text-error hover:text-error hover:bg-error/10"
            icon="Trash2"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Invoice */}
        <div className="lg:col-span-2">
          <Card className="p-8 print:shadow-none">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-3 rounded-xl">
                  <ApperIcon name="PaintBucket" size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-display">Johnson Interior Design</h2>
                  <p className="text-gray-600">123 Design Avenue, San Francisco, CA 94102</p>
                  <p className="text-gray-600">(555) 123-4567 • sarah@johnsonstudio.com</p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-3xl font-bold text-gray-900 font-display">INVOICE</h3>
                <p className="text-gray-600">{invoice.invoiceNumber}</p>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Bill To:</h4>
                {client && (
                  <div className="text-gray-600">
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p>{client.billingAddress?.street}</p>
                    <p>{client.billingAddress?.city}, {client.billingAddress?.state} {client.billingAddress?.zip}</p>
                    <p>{client.email}</p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-900">Invoice Date: </span>
                    <span className="text-gray-600">{format(new Date(invoice.issueDate), "MMM d, yyyy")}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Due Date: </span>
                    <span className="text-gray-600">{format(new Date(invoice.dueDate), "MMM d, yyyy")}</span>
                  </div>
                  {project && (
                    <div>
                      <span className="font-medium text-gray-900">Project: </span>
                      <span className="text-gray-600">{project.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-surface to-primary-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Description</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Qty</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900">Rate</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.lineItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{item.description}</div>
                        <div className="text-sm text-gray-500">{item.type}</div>
                      </td>
                      <td className="py-4 px-6 text-center text-gray-900">{item.quantity}</td>
                      <td className="py-4 px-6 text-right text-gray-900">{formatCurrency(item.rate)}</td>
                      <td className="py-4 px-6 text-right font-semibold text-gray-900">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(invoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span>{formatCurrency(invoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                <p className="text-gray-600">{invoice.notes}</p>
              </div>
            )}

            {/* Payment Information */}
            {invoice.paymentLink && (
              <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Payment Information</h4>
                <p className="text-gray-600 mb-3">
                  Pay securely online using the link below:
                </p>
                <Button
                  variant="primary"
                  onClick={() => window.open(invoice.paymentLink, "_blank")}
                  icon="CreditCard"
                >
                  Pay Online
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Status */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">Payment Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant={getStatusVariant(invoice.status)} size="lg">
                  {invoice.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(invoice.total)}</span>
              </div>
              {invoice.paidAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Paid On:</span>
                  <span className="text-gray-900">{format(new Date(invoice.paidAt), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Client Information */}
          {client && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">Client Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{client.name}</p>
                  <p className="text-gray-600">{client.email}</p>
                  <p className="text-gray-600">{client.phone}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/clients")}
                  className="w-full"
                >
                  View Client Details
                </Button>
              </div>
            </Card>
          )}

          {/* Project Information */}
          {project && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">Project Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{project.name}</p>
                  <p className="text-gray-600">{project.description}</p>
                  <Badge variant="info" size="sm" className="mt-2">
                    {project.status}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/projects")}
                  className="w-full"
                >
                  View Project Details
                </Button>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate(`/invoices/new?duplicate=${id}`)}
                icon="Copy"
              >
                Duplicate Invoice
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => window.print()}
                icon="Download"
              >
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                icon="Mail"
              >
                Email Client
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetail