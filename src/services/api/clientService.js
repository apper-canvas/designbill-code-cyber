import clientsData from "@/services/mockData/clients.json"

class ClientService {
  constructor() {
    this.clients = [...clientsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.clients]
  }

  async getById(id) {
    await this.delay(200)
    const client = this.clients.find(c => c.Id === parseInt(id))
    if (!client) {
      throw new Error("Client not found")
    }
    return { ...client }
  }

  async create(clientData) {
    await this.delay(400)
    const newId = Math.max(...this.clients.map(c => c.Id)) + 1
    const newClient = {
      ...clientData,
      Id: newId,
      userId: 1, // Current user ID
      createdAt: new Date().toISOString()
    }
    
    this.clients.push(newClient)
    return { ...newClient }
  }

  async update(id, clientData) {
    await this.delay(400)
    const index = this.clients.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Client not found")
    }
    
    this.clients[index] = { 
      ...this.clients[index], 
      ...clientData, 
      Id: parseInt(id) 
    }
    return { ...this.clients[index] }
  }

  async delete(id) {
    await this.delay(300)
    const index = this.clients.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Client not found")
    }
    
    const deletedClient = { ...this.clients[index] }
    this.clients.splice(index, 1)
    return deletedClient
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new ClientService()