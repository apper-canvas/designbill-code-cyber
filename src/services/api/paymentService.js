import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class PaymentService {
  constructor() {
    this.tableName = 'payment_c';
    this.lookupFields = ['invoice_id_c'];
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "stripe_payment_id_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "paid_at_c"}},
          {"field": {"Name": "invoice_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching payments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByInvoiceId(invoiceId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "stripe_payment_id_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "paid_at_c"}},
          {"field": {"Name": "invoice_id_c"}}
        ],
        where: [{
          "FieldName": "invoice_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(invoiceId)]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching payments by invoice:", error?.response?.data?.message || error);
      return [];
    }
  }

  async processPayment(invoiceId, paymentData) {
    try {
      const apperClient = getApperClient();
      
      // Generate Stripe payment ID
      const stripePaymentId = `pi_${Math.random().toString(36).substring(2, 18)}`;
      
      // Prepare payment record
      const record = {
        Name: `Payment for Invoice ${invoiceId}`,
        stripe_payment_id_c: stripePaymentId,
        amount_c: parseFloat(paymentData.amount),
        status_c: "Completed",
        paid_at_c: new Date().toISOString(),
        invoice_id_c: parseInt(invoiceId)
      };

      const params = {
        records: [record]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} payments: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error processing payment:", error?.response?.data?.message || error);
      return null;
    }
  }

  async createPaymentLink(invoiceId, amount) {
    try {
      // Simulate creating Stripe payment link with realistic delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const paymentLink = `https://pay.stripe.com/invoice/acct_${Math.random().toString(36).substring(7)}`;
      return { 
        paymentLink, 
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
      };
    } catch (error) {
      console.error("Error creating payment link:", error);
      return null;
    }
  }
}

const paymentService = new PaymentService();
export default paymentService;

export default new PaymentService()