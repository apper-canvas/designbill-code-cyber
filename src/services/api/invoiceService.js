import invoicesData from "@/services/mockData/invoices.json"

class InvoiceService {
  constructor() {
    this.invoices = [...invoicesData]
  }

  async getAll() {
    await this.delay(400)
    return [...this.invoices]
  }

  async getById(id) {
    await this.delay(250)
    const invoice = this.invoices.find(i => i.Id === parseInt(id))
    if (!invoice) {
      throw new Error("Invoice not found")
    }
    return { ...invoice }
  }

  async getByClientId(clientId) {
    await this.delay(300)
    return this.invoices.filter(i => i.clientId === parseInt(clientId))
  }

  async getByProjectId(projectId) {
    await this.delay(300)
    return this.invoices.filter(i => i.projectId === parseInt(projectId))
  }

  async create(invoiceData) {
    await this.delay(500)
    const newId = Math.max(...this.invoices.map(i => i.Id)) + 1
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(newId).padStart(3, "0")}`
    
    const newInvoice = {
      ...invoiceData,
      Id: newId,
      userId: 1, // Current user ID
      invoiceNumber,
      status: "Draft",
      paidAt: null,
      createdAt: new Date().toISOString()
    }
    
    this.invoices.push(newInvoice)
    return { ...newInvoice }
  }

  async update(id, invoiceData) {
    await this.delay(450)
    const index = this.invoices.findIndex(i => i.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Invoice not found")
    }
    
    this.invoices[index] = { 
      ...this.invoices[index], 
      ...invoiceData, 
      Id: parseInt(id) 
    }
    return { ...this.invoices[index] }
  }

  async updateStatus(id, status) {
    await this.delay(300)
    const index = this.invoices.findIndex(i => i.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Invoice not found")
    }

    const updates = { status }
    if (status === "Paid") {
      updates.paidAt = new Date().toISOString()
    }

    this.invoices[index] = { 
      ...this.invoices[index], 
      ...updates
    }
    return { ...this.invoices[index] }
  }

  async sendInvoice(id, emailData) {
    await this.delay(800)
    const invoice = await this.updateStatus(id, "Sent")
    
    // Generate payment link
    const paymentLink = `https://pay.stripe.com/invoice/acct_${Math.random().toString(36).substring(7)}`
    invoice.paymentLink = paymentLink
    
    return invoice
  }

  async delete(id) {
    await this.delay(350)
    const index = this.invoices.findIndex(i => i.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Invoice not found")
    }
    
    const deletedInvoice = { ...this.invoices[index] }
    this.invoices.splice(index, 1)
    return deletedInvoice
  }

  async getDashboardMetrics() {
    await this.delay(350)
    const invoices = [...this.invoices]
    
    const totalInvoices = invoices.length
    const paidInvoices = invoices.filter(i => i.status === "Paid")
    const unpaidInvoices = invoices.filter(i => ["Sent", "Overdue"].includes(i.status))
    const draftInvoices = invoices.filter(i => i.status === "Draft")
    
    const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.total, 0)
    const unpaidAmount = unpaidInvoices.reduce((sum, i) => sum + i.total, 0)
    const averageInvoice = totalInvoices > 0 ? invoices.reduce((sum, i) => sum + i.total, 0) / totalInvoices : 0

    return {
      totalInvoices,
      totalRevenue,
      unpaidAmount,
      averageInvoice,
      paidCount: paidInvoices.length,
      unpaidCount: unpaidInvoices.length,
      draftCount: draftInvoices.length,
      recentInvoices: invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new InvoiceService()