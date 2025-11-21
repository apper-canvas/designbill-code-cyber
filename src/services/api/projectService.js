import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class ProjectService {
  constructor() {
    this.tableName = 'project_c';
    this.lookupFields = ['client_id_c', 'user_id_c'];
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "client_id_c"}},
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
      console.error("Error fetching projects:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "client_id_c"}},
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
      console.error(`Error fetching project ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByClientId(clientId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
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
      console.error("Error fetching projects by client:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(projectData) {
    try {
      const apperClient = getApperClient();
      
      // Prepare data with field mappings
      const record = {
        Name: projectData.Name || projectData.name,
        description_c: projectData.description_c || projectData.description || "",
        status_c: projectData.status_c || projectData.status || "Planning",
        start_date_c: projectData.start_date_c || projectData.startDate,
        total_amount_c: parseFloat(projectData.total_amount_c || projectData.totalAmount || 0)
      };

      // Handle optional end date
      if (projectData.end_date_c || projectData.endDate) {
        record.end_date_c = projectData.end_date_c || projectData.endDate;
      }

      // Handle lookup fields
      if (projectData.client_id_c || projectData.clientId) {
        const clientValue = projectData.client_id_c || projectData.clientId;
        record.client_id_c = clientValue?.Id || parseInt(clientValue);
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
          console.error(`Failed to create ${failed.length} projects: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating project:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, projectData) {
    try {
      const apperClient = getApperClient();
      
      // Prepare data with field mappings (only updateable fields)
      const record = {
        Id: parseInt(id)
      };

      // Add only fields that have values
      if (projectData.Name !== undefined || projectData.name !== undefined) {
        record.Name = projectData.Name || projectData.name;
      }
      if (projectData.description_c !== undefined || projectData.description !== undefined) {
        record.description_c = projectData.description_c || projectData.description;
      }
      if (projectData.status_c !== undefined || projectData.status !== undefined) {
        record.status_c = projectData.status_c || projectData.status;
      }
      if (projectData.start_date_c !== undefined || projectData.startDate !== undefined) {
        record.start_date_c = projectData.start_date_c || projectData.startDate;
      }
      if (projectData.end_date_c !== undefined || projectData.endDate !== undefined) {
        record.end_date_c = projectData.end_date_c || projectData.endDate;
      }
      if (projectData.total_amount_c !== undefined || projectData.totalAmount !== undefined) {
        record.total_amount_c = parseFloat(projectData.total_amount_c || projectData.totalAmount);
      }

      // Handle lookup fields
      if (projectData.client_id_c !== undefined || projectData.clientId !== undefined) {
        const clientValue = projectData.client_id_c || projectData.clientId;
        record.client_id_c = clientValue?.Id || parseInt(clientValue);
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
          console.error(`Failed to update ${failed.length} projects: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating project:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} projects: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting project:", error?.response?.data?.message || error);
      return false;
    }
  }
}

const projectService = new ProjectService();
export default projectService;

export default new ProjectService()