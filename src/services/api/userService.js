import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class UserService {
  constructor() {
    this.tableName = 'user_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "brand_colors_c"}},
          {"field": {"Name": "payment_terms_c"}},
          {"field": {"Name": "tax_rate_c"}},
          {"field": {"Name": "invoice_prefix_c"}},
          {"field": {"Name": "invoice_numbering_c"}},
          {"field": {"Name": "logo_c"}},
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
      console.error("Error fetching users:", error?.response?.data?.message || error);
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
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "brand_colors_c"}},
          {"field": {"Name": "payment_terms_c"}},
          {"field": {"Name": "tax_rate_c"}},
          {"field": {"Name": "invoice_prefix_c"}},
          {"field": {"Name": "invoice_numbering_c"}},
          {"field": {"Name": "logo_c"}}
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
      console.error(`Error fetching user ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getCurrentUser() {
    try {
      // Get current user from Redux state if available
      // For now, return first user as fallback
      const users = await this.getAll();
      if (users.length > 0) {
        return users[0];
      }
      throw new Error("No user found");
    } catch (error) {
      console.error("Error fetching current user:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, userData) {
    try {
      const apperClient = getApperClient();
      
      // Prepare data with field mappings (only updateable fields)
      const record = {
        Id: parseInt(id)
      };

      // Add only fields that have values
      if (userData.Name !== undefined || userData.name !== undefined) {
        record.Name = userData.Name || userData.name;
      }
      if (userData.email_c !== undefined || userData.email !== undefined) {
        record.email_c = userData.email_c || userData.email;
      }
      if (userData.phone_c !== undefined || userData.phone !== undefined) {
        record.phone_c = userData.phone_c || userData.phone;
      }
      if (userData.company_name_c !== undefined || userData.companyName !== undefined) {
        record.company_name_c = userData.company_name_c || userData.companyName;
      }
      if (userData.website_c !== undefined || userData.website !== undefined) {
        record.website_c = userData.website_c || userData.website;
      }
      if (userData.address_c !== undefined || userData.address !== undefined) {
        record.address_c = typeof userData.address === 'string' ? userData.address : JSON.stringify(userData.address || {});
      }
      if (userData.brand_colors_c !== undefined || userData.brandColors !== undefined) {
        record.brand_colors_c = JSON.stringify(userData.brand_colors_c || userData.brandColors || {});
      }
      if (userData.payment_terms_c !== undefined || userData.paymentTerms !== undefined) {
        record.payment_terms_c = parseInt(userData.payment_terms_c || userData.paymentTerms);
      }
      if (userData.tax_rate_c !== undefined || userData.taxRate !== undefined) {
        record.tax_rate_c = parseFloat(userData.tax_rate_c || userData.taxRate);
      }
      if (userData.invoice_prefix_c !== undefined || userData.invoicePrefix !== undefined) {
        record.invoice_prefix_c = userData.invoice_prefix_c || userData.invoicePrefix;
      }
      if (userData.invoice_numbering_c !== undefined || userData.invoiceNumbering !== undefined) {
        record.invoice_numbering_c = userData.invoice_numbering_c || userData.invoiceNumbering;
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
          console.error(`Failed to update ${failed.length} users: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating user:", error?.response?.data?.message || error);
      return null;
    }
  }

  async updateBranding(id, brandingData) {
    const updateData = {
      brand_colors_c: brandingData.brandColors
    };

    // Handle logo files if provided
    if (brandingData.logo) {
      // The ApperFileFieldComponent will handle file uploads
      // We just need to update the reference
      updateData.logo_c = brandingData.logo;
    }

    return await this.update(id, updateData);
  }

  // Authentication methods will be handled by ApperUI
  async authenticate(email, password) {
    // This method is no longer used with ApperUI
    // Authentication is handled automatically by the SDK
    throw new Error("Authentication is handled by ApperUI");
  }

  async register(userData) {
    // This method is no longer used with ApperUI  
    // Registration is handled automatically by the SDK
    throw new Error("Registration is handled by ApperUI");
  }

  async logout() {
    // This method is no longer used with ApperUI
    // Logout is handled by the Root component
    return { success: true };
  }

  // File upload methods for logo
  async uploadLogo(file) {
    try {
      // This will be handled by ApperFileFieldComponent
      // Return a placeholder response
      return { success: true, fileId: 'placeholder' };
    } catch (error) {
      console.error("Error uploading logo:", error);
      return { success: false, error: error.message };
    }
  }
}

const userService = new UserService();
export default userService;

export default new UserService()