import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class ClientService {
  constructor() {
    this.tableName = 'client_c';
    this.lookupFields = ['user_id_c'];
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "user_id_c"}},
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
      console.error("Error fetching clients:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "user_id_c"}}
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
      console.error(`Error fetching client ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(clientData) {
    try {
      const apperClient = getApperClient();
      
      // Prepare data with field mappings
      const record = {
        Name: clientData.Name || clientData.name,
        email_c: clientData.email_c || clientData.email,
        phone_c: clientData.phone_c || clientData.phone || "",
        notes_c: clientData.notes_c || clientData.notes || ""
      };

      // Handle billing address
      if (clientData.billing_address_c || clientData.billingAddress) {
        const address = clientData.billing_address_c || clientData.billingAddress;
        record.billing_address_c = typeof address === 'string' ? address : JSON.stringify(address);
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
          console.error(`Failed to create ${failed.length} clients: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating client:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, clientData) {
    try {
      const apperClient = getApperClient();
      
      // Prepare data with field mappings (only updateable fields)
      const record = {
        Id: parseInt(id)
      };

      // Add only fields that have values
      if (clientData.Name !== undefined || clientData.name !== undefined) {
        record.Name = clientData.Name || clientData.name;
      }
      if (clientData.email_c !== undefined || clientData.email !== undefined) {
        record.email_c = clientData.email_c || clientData.email;
      }
      if (clientData.phone_c !== undefined || clientData.phone !== undefined) {
        record.phone_c = clientData.phone_c || clientData.phone;
      }
      if (clientData.billing_address_c !== undefined || clientData.billingAddress !== undefined) {
        const address = clientData.billing_address_c || clientData.billingAddress;
        record.billing_address_c = typeof address === 'string' ? address : JSON.stringify(address);
      }
      if (clientData.notes_c !== undefined || clientData.notes !== undefined) {
        record.notes_c = clientData.notes_c || clientData.notes;
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
          console.error(`Failed to update ${failed.length} clients: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating client:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} clients: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting client:", error?.response?.data?.message || error);
      return false;
    }
  }
}

const clientService = new ClientService();
export default clientService;
export default new ClientService()