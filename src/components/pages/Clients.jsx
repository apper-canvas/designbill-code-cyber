import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import SearchBar from "@/components/molecules/SearchBar"
import FormField from "@/components/molecules/FormField"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import clientService from "@/services/api/clientService"
import invoiceService from "@/services/api/invoiceService"
import { toast } from "react-toastify"

const Clients = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [clientInvoices, setClientInvoices] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "USA"
    },
    notes: ""
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterClients()
  }, [clients, searchTerm])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [clientsData, invoicesData] = await Promise.all([
        clientService.getAll(),
        invoiceService.getAll()
      ])
      
      setClients(clientsData)
      
      // Group invoices by client
      const invoicesByClient = {}
      invoicesData.forEach(invoice => {
        if (!invoicesByClient[invoice.clientId]) {
          invoicesByClient[invoice.clientId] = []
        }
        invoicesByClient[invoice.clientId].push(invoice)
      })
      setClientInvoices(invoicesByClient)
    } catch (err) {
      setError("Failed to load clients")
    } finally {
      setLoading(false)
    }
  }

  const filterClients = () => {
    if (!searchTerm) {
      setFilteredClients(clients)
      return
    }

    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredClients(filtered)
  }

  const getClientStats = (clientId) => {
    const invoices = clientInvoices[clientId] || []
    const totalInvoices = invoices.length
    const totalRevenue = invoices
      .filter(inv => inv.status === "Paid")
      .reduce((sum, inv) => sum + inv.total, 0)
    const unpaidAmount = invoices
      .filter(inv => ["Sent", "Overdue"].includes(inv.status))
      .reduce((sum, inv) => sum + inv.total, 0)

    return { totalInvoices, totalRevenue, unpaidAmount }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount)
  }

  const handleOpenModal = (client = null) => {
    setEditingClient(client)
    if (client) {
      setFormData({ ...client })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        billingAddress: {
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "USA"
        },
        notes: ""
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingClient(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required")
      return
    }

    try {
      if (editingClient) {
        const updatedClient = await clientService.update(editingClient.Id, formData)
        setClients(clients.map(c => c.Id === editingClient.Id ? updatedClient : c))
        toast.success("Client updated successfully")
      } else {
        const newClient = await clientService.create(formData)
        setClients([...clients, newClient])
        toast.success("Client created successfully")
      }
      
      handleCloseModal()
    } catch (err) {
      toast.error(`Failed to ${editingClient ? "update" : "create"} client`)
    }
  }

  const handleDelete = async (clientId) => {
    const client = clients.find(c => c.Id === clientId)
    const stats = getClientStats(clientId)
    
    if (stats.totalInvoices > 0) {
      toast.error("Cannot delete client with existing invoices")
      return
    }

    if (!window.confirm(`Are you sure you want to delete ${client.name}? This action cannot be undone.`)) {
      return
    }

    try {
      await clientService.delete(clientId)
      setClients(clients.filter(c => c.Id !== clientId))
      toast.success("Client deleted successfully")
    } catch (err) {
      toast.error("Failed to delete client")
    }
  }

  const updateFormData = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Clients</h1>
          <p className="text-gray-600 mt-1">Manage your interior design clients and their project details</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => handleOpenModal()}
          icon="Plus"
          size="lg"
        >
          Add Client
        </Button>
      </div>

      {/* Search */}
      <Card>
        <SearchBar
          placeholder="Search clients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <Empty
          title={searchTerm ? "No clients found" : "No clients yet"}
          description={searchTerm ? "Try adjusting your search terms" : "Add your first client to start managing design projects"}
          actionLabel="Add Client"
          onAction={() => handleOpenModal()}
          icon="Users"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const stats = getClientStats(client.Id)
            
            return (
              <Card key={client.Id} hover className="relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenModal(client)}
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(client.Id)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>

                <div className="pr-16">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 font-display">
                        {client.name}
                      </h3>
                      <p className="text-sm text-gray-600">{client.email}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ApperIcon name="Phone" size={16} />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    
                    {client.billingAddress?.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ApperIcon name="MapPin" size={16} />
                        <span>{client.billingAddress.city}, {client.billingAddress.state}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Invoices:</span>
                      <span className="font-medium text-gray-900">{stats.totalInvoices}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="font-medium text-success">{formatCurrency(stats.totalRevenue)}</span>
                    </div>
                    {stats.unpaidAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Unpaid:</span>
                        <span className="font-medium text-warning">{formatCurrency(stats.unpaidAmount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/invoices/new?client=${client.Id}`)}
                      className="w-full"
                      icon="Plus"
                    >
                      Create Invoice
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 font-display">
                    {editingClient ? "Edit Client" : "Add New Client"}
                  </h2>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCloseModal}
                    size="sm"
                  >
                    <ApperIcon name="X" size={20} />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    required
                  />
                  <FormField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    required
                  />
                </div>

                <FormField
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
                  
                  <FormField
                    label="Street Address"
                    value={formData.billingAddress.street}
                    onChange={(e) => updateFormData("billingAddress.street", e.target.value)}
                  />

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                      label="City"
                      value={formData.billingAddress.city}
                      onChange={(e) => updateFormData("billingAddress.city", e.target.value)}
                    />
                    <FormField
                      label="State"
                      value={formData.billingAddress.state}
                      onChange={(e) => updateFormData("billingAddress.state", e.target.value)}
                    />
                    <FormField
                      label="ZIP Code"
                      value={formData.billingAddress.zip}
                      onChange={(e) => updateFormData("billingAddress.zip", e.target.value)}
                    />
                  </div>
                </div>

                <FormField
                  label="Notes"
                >
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add any notes about this client..."
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                  />
                </FormField>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {editingClient ? "Update Client" : "Add Client"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clients