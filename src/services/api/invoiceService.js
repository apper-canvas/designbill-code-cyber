import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class InvoiceService {
  constructor() {
    this.tableName = 'invoice_c';
    this.lookupFields = ['client_id_c', 'project_id_c', 'user_id_c'];
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "invoice_number_c"}},
          {"field": {"Name": "issue_date_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "discount_c"}},
          {"field": {"Name": "tax_rate_c"}},
          {"field": {"Name": "tax_amount_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "paid_at_c"}},
          {"field": {"Name": "payment_link_c"}},
          {"field": {"Name": "line_items_c"}},
          {"field": {"Name": "client_id_c"}},
          {"field": {"Name": "project_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching invoices:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "invoice_number_c"}},
          {"field": {"Name": "issue_date_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "discount_c"}},
          {"field": {"Name": "tax_rate_c"}},
          {"field": {"Name": "tax_amount_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "paid_at_c"}},
          {"field": {"Name": "payment_link_c"}},
          {"field": {"Name": "line_items_c"}},
          {"field": {"Name": "client_id_c"}},
          {"field": {"Name": "project_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByClientId(clientId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "invoice_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "client_id_c"}}
        ],
        where: [{
          "FieldName": "client_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(clientId)]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching invoices by client:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByProjectId(projectId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "invoice_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "project_id_c"}}
        ],
        where: [{
          "FieldName": "project_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(projectId)]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching invoices by project:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(invoiceData) {
    try {
      const apperClient = getApperClient();
      
      // Generate invoice number
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000) + 1).padStart(3, "0")}`;
      
      // Prepare data with field mappings
      const record = {
        Name: invoiceData.Name || invoiceNumber,
        invoice_number_c: invoiceNumber,
        issue_date_c: invoiceData.issue_date_c || invoiceData.issueDate,
        due_date_c: invoiceData.due_date_c || invoiceData.dueDate,
        status_c: "Draft",
        subtotal_c: parseFloat(invoiceData.subtotal_c || invoiceData.subtotal || 0),
        discount_c: parseFloat(invoiceData.discount_c || invoiceData.discount || 0),
        tax_rate_c: parseFloat(invoiceData.tax_rate_c || invoiceData.taxRate || 0),
        tax_amount_c: parseFloat(invoiceData.tax_amount_c || invoiceData.taxAmount || 0),
        total_c: parseFloat(invoiceData.total_c || invoiceData.total || 0),
        notes_c: invoiceData.notes_c || invoiceData.notes || "",
        line_items_c: JSON.stringify(invoiceData.line_items_c || invoiceData.lineItems || [])
      };

      // Handle lookup fields
      if (invoiceData.client_id_c || invoiceData.clientId) {
        record.client_id_c = parseInt(invoiceData.client_id_c || invoiceData.clientId);
      }
      if (invoiceData.project_id_c || invoiceData.projectId) {
        record.project_id_c = parseInt(invoiceData.project_id_c || invoiceData.projectId);
      }

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
          console.error(`Failed to create ${failed.length} invoices: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating invoice:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, invoiceData) {
    try {
      const apperClient = getApperClient();
      
      // Prepare data with field mappings (only updateable fields)
      const record = {
        Id: parseInt(id)
      };

      // Add only fields that have values
      if (invoiceData.Name !== undefined) record.Name = invoiceData.Name;
      if (invoiceData.issue_date_c !== undefined || invoiceData.issueDate !== undefined) {
        record.issue_date_c = invoiceData.issue_date_c || invoiceData.issueDate;
      }
      if (invoiceData.due_date_c !== undefined || invoiceData.dueDate !== undefined) {
        record.due_date_c = invoiceData.due_date_c || invoiceData.dueDate;
      }
      if (invoiceData.status_c !== undefined || invoiceData.status !== undefined) {
        record.status_c = invoiceData.status_c || invoiceData.status;
      }
      if (invoiceData.subtotal_c !== undefined || invoiceData.subtotal !== undefined) {
        record.subtotal_c = parseFloat(invoiceData.subtotal_c || invoiceData.subtotal);
      }
      if (invoiceData.discount_c !== undefined || invoiceData.discount !== undefined) {
        record.discount_c = parseFloat(invoiceData.discount_c || invoiceData.discount);
      }
      if (invoiceData.tax_rate_c !== undefined || invoiceData.taxRate !== undefined) {
        record.tax_rate_c = parseFloat(invoiceData.tax_rate_c || invoiceData.taxRate);
      }
      if (invoiceData.tax_amount_c !== undefined || invoiceData.taxAmount !== undefined) {
        record.tax_amount_c = parseFloat(invoiceData.tax_amount_c || invoiceData.taxAmount);
      }
      if (invoiceData.total_c !== undefined || invoiceData.total !== undefined) {
        record.total_c = parseFloat(invoiceData.total_c || invoiceData.total);
      }
      if (invoiceData.notes_c !== undefined || invoiceData.notes !== undefined) {
        record.notes_c = invoiceData.notes_c || invoiceData.notes;
      }
      if (invoiceData.line_items_c !== undefined || invoiceData.lineItems !== undefined) {
        record.line_items_c = JSON.stringify(invoiceData.line_items_c || invoiceData.lineItems);
      }

      // Handle lookup fields
      if (invoiceData.client_id_c !== undefined || invoiceData.clientId !== undefined) {
        const clientValue = invoiceData.client_id_c || invoiceData.clientId;
        record.client_id_c = clientValue?.Id || parseInt(clientValue);
      }
      if (invoiceData.project_id_c !== undefined || invoiceData.projectId !== undefined) {
        const projectValue = invoiceData.project_id_c || invoiceData.projectId;
        record.project_id_c = projectValue?.Id || parseInt(projectValue);
      }

      const params = {
        records: [record]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} invoices: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating invoice:", error?.response?.data?.message || error);
      return null;
    }
  }

  async updateStatus(id, status) {
    const updateData = { status_c: status };
    if (status === "Paid") {
      updateData.paid_at_c = new Date().toISOString();
    }
    return await this.update(id, updateData);
  }

  async sendInvoice(id, emailData) {
    try {
      const invoice = await this.updateStatus(id, "Sent");
      
      // Generate payment link
      const paymentLink = `https://pay.stripe.com/invoice/acct_${Math.random().toString(36).substring(7)}`;
      
      // Update with payment link
      const updatedInvoice = await this.update(id, { payment_link_c: paymentLink });
      
      return updatedInvoice;
    } catch (error) {
      console.error("Error sending invoice:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} invoices: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting invoice:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getDashboardMetrics() {
    try {
      const invoices = await this.getAll();
      
      const totalInvoices = invoices.length;
      const paidInvoices = invoices.filter(i => i.status_c === "Paid");
      const unpaidInvoices = invoices.filter(i => ["Sent", "Overdue"].includes(i.status_c));
      const draftInvoices = invoices.filter(i => i.status_c === "Draft");
      
      const totalRevenue = paidInvoices.reduce((sum, i) => sum + (i.total_c || 0), 0);
      const unpaidAmount = unpaidInvoices.reduce((sum, i) => sum + (i.total_c || 0), 0);
      const averageInvoice = totalInvoices > 0 ? invoices.reduce((sum, i) => sum + (i.total_c || 0), 0) / totalInvoices : 0;

      return {
        totalInvoices,
        totalRevenue,
        unpaidAmount,
        averageInvoice,
        paidCount: paidInvoices.length,
        unpaidCount: unpaidInvoices.length,
        draftCount: draftInvoices.length,
        recentInvoices: invoices
          .sort((a, b) => new Date(b.CreatedOn) - new Date(a.CreatedOn))
          .slice(0, 5)
      };
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error?.response?.data?.message || error);
      return {
        totalInvoices: 0,
        totalRevenue: 0,
        unpaidAmount: 0,
        averageInvoice: 0,
        paidCount: 0,
        unpaidCount: 0,
        draftCount: 0,
        recentInvoices: []
      };
    }
  }
}

export default new InvoiceService()