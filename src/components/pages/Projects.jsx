import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import SearchBar from "@/components/molecules/SearchBar"
import FormField from "@/components/molecules/FormField"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import projectService from "@/services/api/projectService"
import clientService from "@/services/api/clientService"
import invoiceService from "@/services/api/invoiceService"
import { format } from "date-fns"
import { toast } from "react-toastify"

const Projects = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [projectInvoices, setProjectInvoices] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientId: "",
    status: "Planning",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: ""
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm, statusFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [projectsData, clientsData, invoicesData] = await Promise.all([
        projectService.getAll(),
        clientService.getAll(),
        invoiceService.getAll()
      ])
      
      setProjects(projectsData)
      setClients(clientsData)
      
      // Group invoices by project
      const invoicesByProject = {}
      invoicesData.forEach(invoice => {
        if (invoice.projectId) {
          if (!invoicesByProject[invoice.projectId]) {
            invoicesByProject[invoice.projectId] = []
          }
          invoicesByProject[invoice.projectId].push(invoice)
        }
      })
      setProjectInvoices(invoicesByProject)
    } catch (err) {
      setError("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = () => {
    let filtered = [...projects]

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        getClientName(project.clientId).toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status.toLowerCase() === statusFilter)
    }

    setFilteredProjects(filtered)
  }

  const getClientName = (clientId) => {
    const client = clients.find(c => c.Id === clientId)
    return client ? client.name : "Unknown Client"
  }

  const getProjectStats = (projectId) => {
    const invoices = projectInvoices[projectId] || []
    const totalInvoices = invoices.length
    const totalRevenue = invoices
      .filter(inv => inv.status === "Paid")
      .reduce((sum, inv) => sum + inv.total, 0)
    const unpaidAmount = invoices
      .filter(inv => ["Sent", "Overdue"].includes(inv.status))
      .reduce((sum, inv) => sum + inv.total, 0)

    return { totalInvoices, totalRevenue, unpaidAmount }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "Completed": return "success"
      case "In Progress": return "info"
      case "Planning": return "warning"
      case "On Hold": return "error"
      default: return "default"
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount)
  }

  const handleOpenModal = (project = null) => {
    setEditingProject(project)
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        clientId: project.clientId.toString(),
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate || ""
      })
    } else {
      setFormData({
        name: "",
        description: "",
        clientId: "",
        status: "Planning",
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: ""
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProject(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.clientId) {
      toast.error("Project name and client are required")
      return
    }

    try {
      const projectData = {
        ...formData,
        clientId: parseInt(formData.clientId),
        endDate: formData.endDate || null
      }

      if (editingProject) {
        const updatedProject = await projectService.update(editingProject.Id, projectData)
        setProjects(projects.map(p => p.Id === editingProject.Id ? updatedProject : p))
        toast.success("Project updated successfully")
      } else {
        const newProject = await projectService.create(projectData)
        setProjects([...projects, newProject])
        toast.success("Project created successfully")
      }
      
      handleCloseModal()
    } catch (err) {
      toast.error(`Failed to ${editingProject ? "update" : "create"} project`)
    }
  }

  const handleDelete = async (projectId) => {
    const project = projects.find(p => p.Id === projectId)
    const stats = getProjectStats(projectId)
    
    if (stats.totalInvoices > 0) {
      toast.error("Cannot delete project with existing invoices")
      return
    }

    if (!window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await projectService.delete(projectId)
      setProjects(projects.filter(p => p.Id !== projectId))
      toast.success("Project deleted successfully")
    } catch (err) {
      toast.error("Failed to delete project")
    }
  }

  const statusOptions = [
    { value: "all", label: "All Projects" },
    { value: "planning", label: "Planning" },
    { value: "in progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "on hold", label: "On Hold" }
  ]

  const statusSelectOptions = [
    "Planning",
    "In Progress", 
    "Completed",
    "On Hold"
  ]

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Projects</h1>
          <p className="text-gray-600 mt-1">Organize your interior design projects and track financial progress</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => handleOpenModal()}
          icon="Plus"
          size="lg"
        >
          New Project
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search projects or clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
        </div>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Empty
          title={searchTerm || statusFilter !== "all" ? "No projects found" : "No projects yet"}
          description={searchTerm || statusFilter !== "all" ? "Try adjusting your search or filters" : "Create your first interior design project to get started"}
          actionLabel="Create Project"
          onAction={() => handleOpenModal()}
          icon="FolderOpen"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const stats = getProjectStats(project.Id)
            
            return (
              <Card key={project.Id} hover className="relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenModal(project)}
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(project.Id)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>

                <div className="pr-16">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-gradient-to-br from-accent-500 to-accent-600 w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      <ApperIcon name="FolderOpen" size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 font-display mb-1 truncate">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {getClientName(project.clientId)}
                      </p>
                      <Badge variant={getStatusVariant(project.status)} size="sm">
                        {project.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Project Dates */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <ApperIcon name="Calendar" size={16} />
                      <span>Started {format(new Date(project.startDate), "MMM d, yyyy")}</span>
                    </div>
                    {project.endDate && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <ApperIcon name="CalendarCheck" size={16} />
                        <span>End {format(new Date(project.endDate), "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>

                  {/* Financial Stats */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Invoices:</span>
                      <span className="font-medium text-gray-900">{stats.totalInvoices}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium text-success">{formatCurrency(stats.totalRevenue)}</span>
                    </div>
                    {stats.unpaidAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pending:</span>
                        <span className="font-medium text-warning">{formatCurrency(stats.unpaidAmount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/invoices/new?project=${project.Id}`)}
                      className="flex-1"
                      icon="Plus"
                    >
                      Invoice
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/invoices?project=${project.Id}`)}
                      icon="FileText"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-info/10 to-info/5">
          <div className="flex items-center gap-3">
            <div className="bg-info/20 p-2 rounded-lg">
              <ApperIcon name="Briefcase" size={20} className="text-info" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Planning</p>
              <p className="text-lg font-bold text-gray-900">
                {projects.filter(p => p.status === "Planning").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
          <div className="flex items-center gap-3">
            <div className="bg-warning/20 p-2 rounded-lg">
              <ApperIcon name="Activity" size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-lg font-bold text-gray-900">
                {projects.filter(p => p.status === "In Progress").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5">
          <div className="flex items-center gap-3">
            <div className="bg-success/20 p-2 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-lg font-bold text-gray-900">
                {projects.filter(p => p.status === "Completed").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-error/10 to-error/5">
          <div className="flex items-center gap-3">
            <div className="bg-error/20 p-2 rounded-lg">
              <ApperIcon name="PauseCircle" size={20} className="text-error" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">On Hold</p>
              <p className="text-lg font-bold text-gray-900">
                {projects.filter(p => p.status === "On Hold").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 font-display">
                    {editingProject ? "Edit Project" : "Create New Project"}
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
                <FormField
                  label="Project Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Living Room Renovation"
                  required
                />

                <FormField
                  label="Client"
                  required
                >
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={formData.clientId}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                    required
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
                  label="Description"
                >
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the project scope and objectives..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    label="Status"
                  >
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    >
                      {statusSelectOptions.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />

                  <FormField
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
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
                  {editingProject ? "Update Project" : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects