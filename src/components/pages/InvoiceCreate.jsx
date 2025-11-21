import React, { useState, useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import FormField from "@/components/molecules/FormField"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ApperIcon from "@/components/ApperIcon"
import invoiceService from "@/services/api/invoiceService"
import clientService from "@/services/api/clientService"
import projectService from "@/services/api/projectService"
import { format } from "date-fns"
import { toast } from "react-toastify"

const InvoiceCreate = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isEditing = Boolean(id)
  const isDuplicating = Boolean(searchParams.get("duplicate"))

  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    issueDate: format(new Date(), "yyyy-MM-dd"),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    taxRate: 8.5,
    discount: 0,
    notes: "Thank you for choosing Johnson Interior Design. Payment due within 30 days.",
    lineItems: [
      {
        id: Date.now(),
        type: "Design Service",
        description: "",
        quantity: 1,
        rate: 150.00,
        amount: 150.00
      }
    ]
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [clientsData, projectsData] = await Promise.all([
        clientService.getAll(),
        projectService.getAll()
      ])
      
      setClients(clientsData)
      setProjects(projectsData)

      // Load invoice data if editing or duplicating
      if (isEditing || isDuplicating) {
        const invoiceId = isEditing ? id : searchParams.get("duplicate")
        const invoiceData = await invoiceService.getById(invoiceId)
        
        const editData = {
          clientId: invoiceData.clientId,
          projectId: invoiceData.projectId || "",
          issueDate: isEditing ? invoiceData.issueDate : format(new Date(), "yyyy-MM-dd"),
          dueDate: isEditing ? invoiceData.dueDate : format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
          taxRate: invoiceData.taxRate,
          discount: invoiceData.discount,
          notes: invoiceData.notes,
          lineItems: invoiceData.lineItems.map(item => ({
            ...item,
            id: Date.now() + Math.random()
          }))
        }
        
        setFormData(editData)
      }
    } catch (err) {
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addLineItem = () => {
    const newItem = {
      id: Date.now(),
      type: "Design Service",
      description: "",
      quantity: 1,
      rate: 150.00,
      amount: 150.00
    }
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }))
  }

  const updateLineItem = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === itemId) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updated.amount = updated.quantity * updated.rate
          }
          return updated
        }
        return item
      })
    }))
  }

  const removeLineItem = (itemId) => {
    if (formData.lineItems.length === 1) {
      toast.error("Invoice must have at least one line item")
      return
    }
    
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== itemId)
    }))
  }

  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.amount, 0)
    const discountedSubtotal = subtotal - formData.discount
    const taxAmount = discountedSubtotal * (formData.taxRate / 100)
    const total = discountedSubtotal + taxAmount

    return { subtotal, taxAmount, total }
  }

  const handleSave = async (status = "Draft") => {
    if (!formData.clientId) {
      toast.error("Please select a client")
      return
    }

    if (!formData.lineItems.some(item => item.description.trim())) {
      toast.error("Please add at least one line item with description")
      return
    }

    try {
      setSaving(true)
      const { subtotal, taxAmount, total } = calculateTotals()

      const invoiceData = {
        ...formData,
        subtotal,
        taxAmount,
        total,
        clientId: parseInt(formData.clientId),
        projectId: formData.projectId ? parseInt(formData.projectId) : null
      }

      let result
      if (isEditing) {
        result = await invoiceService.update(id, invoiceData)
        toast.success("Invoice updated successfully")
      } else {
        result = await invoiceService.create(invoiceData)
        toast.success("Invoice created successfully")
      }

      navigate(`/invoices/${result.Id}`)
    } catch (err) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} invoice`)
    } finally {
      setSaving(false)
    }
  }

  const handleSend = async () => {
    await handleSave("Sent")
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount || 0)
  }

  const { subtotal, taxAmount, total } = calculateTotals()

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadData} />

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
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              {isEditing ? "Edit Invoice" : "Create New Invoice"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isDuplicating ? "Duplicating invoice with new details" : "Fill out the details below to create your invoice"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleSave("Draft")}
            loading={saving}
            icon="Save"
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            loading={saving}
            icon="Send"
          >
            {isEditing ? "Update & Send" : "Create & Send"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 font-display mb-6">Invoice Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Client"
                required
              >
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={formData.clientId}
                  onChange={(e) => updateFormData("clientId", e.target.value)}
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.Id} value={client.Id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Project"
              >
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={formData.projectId}
                  onChange={(e) => updateFormData("projectId", e.target.value)}
                >
                  <option value="">Select a project (optional)</option>
                  {projects
                    .filter(project => !formData.clientId || project.clientId === parseInt(formData.clientId))
                    .map(project => (
                      <option key={project.Id} value={project.Id}>
                        {project.name}
                      </option>
                    ))}
                </select>
              </FormField>

              <FormField
                label="Issue Date"
                type="date"
                value={formData.issueDate}
                onChange={(e) => updateFormData("issueDate", e.target.value)}
                required
              />

              <FormField
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => updateFormData("dueDate", e.target.value)}
                required
              />
            </div>
          </Card>

          {/* Line Items */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 font-display">Line Items</h2>
              <Button
                variant="outline"
                onClick={addLineItem}
                icon="Plus"
                size="sm"
              >
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {formData.lineItems.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={item.type}
                        onChange={(e) => updateLineItem(item.id, "type", e.target.value)}
                      >
                        <option value="Design Service">Design Service</option>
                        <option value="Material">Material</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Installation">Installation</option>
                      </select>
                    </div>

                    <div className="lg:col-span-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter description..."
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rate</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={item.rate}
                        onChange={(e) => updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="lg:col-span-2 flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(item.amount)}
                        </div>
                      </div>
                      {formData.lineItems.length > 1 && (
                        <Button
                          variant="ghost"
                          onClick={() => removeLineItem(item.id)}
                          className="text-error hover:text-error hover:bg-error/10 ml-2"
                          size="sm"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Invoice Settings */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 font-display mb-6">Settings & Notes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                label="Tax Rate (%)"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.taxRate}
                onChange={(e) => updateFormData("taxRate", parseFloat(e.target.value) || 0)}
              />

              <FormField
                label="Discount ($)"
                type="number"
                min="0"
                step="0.01"
                value={formData.discount}
                onChange={(e) => updateFormData("discount", parseFloat(e.target.value) || 0)}
              />
            </div>

            <FormField
              label="Notes"
            >
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                placeholder="Add any notes or terms..."
                value={formData.notes}
                onChange={(e) => updateFormData("notes", e.target.value)}
              />
            </FormField>
          </Card>
        </div>

        {/* Preview Sidebar */}
        <div>
          <Card className="sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 font-display mb-6">Invoice Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Items:</span>
                <span>{formData.lineItems.length}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {formData.discount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(formData.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Tax ({formData.taxRate}%):</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {formData.clientId && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Selected Client:</h4>
                  <p className="text-gray-600">
                    {clients.find(c => c.Id === parseInt(formData.clientId))?.name}
                  </p>
                </div>
              )}

              {formData.projectId && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Selected Project:</h4>
                  <p className="text-gray-600">
                    {projects.find(p => p.Id === parseInt(formData.projectId))?.name}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default InvoiceCreate