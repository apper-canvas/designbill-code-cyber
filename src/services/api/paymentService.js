import paymentsData from "@/services/mockData/payments.json"

class PaymentService {
  constructor() {
    this.payments = [...paymentsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.payments]
  }

  async getByInvoiceId(invoiceId) {
    await this.delay(250)
    return this.payments.filter(p => p.invoiceId === parseInt(invoiceId))
  }

  async processPayment(invoiceId, paymentData) {
    await this.delay(1000) // Simulate Stripe processing time
    
    const newId = Math.max(...this.payments.map(p => p.Id)) + 1
    const newPayment = {
      Id: newId,
      invoiceId: parseInt(invoiceId),
      stripePaymentId: `pi_${Math.random().toString(36).substring(2, 18)}`,
      amount: paymentData.amount,
      status: "Completed",
      paidAt: new Date().toISOString()
    }
    
    this.payments.push(newPayment)
    return { ...newPayment }
  }

  async createPaymentLink(invoiceId, amount) {
    await this.delay(500)
    // Simulate creating Stripe payment link
    const paymentLink = `https://pay.stripe.com/invoice/acct_${Math.random().toString(36).substring(7)}`
    return { paymentLink, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new PaymentService()