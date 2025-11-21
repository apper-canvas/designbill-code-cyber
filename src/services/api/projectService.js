import projectsData from "@/services/mockData/projects.json"

class ProjectService {
  constructor() {
    this.projects = [...projectsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.projects]
  }

  async getById(id) {
    await this.delay(200)
    const project = this.projects.find(p => p.Id === parseInt(id))
    if (!project) {
      throw new Error("Project not found")
    }
    return { ...project }
  }

  async getByClientId(clientId) {
    await this.delay(250)
    return this.projects.filter(p => p.clientId === parseInt(clientId))
  }

  async create(projectData) {
    await this.delay(400)
    const newId = Math.max(...this.projects.map(p => p.Id)) + 1
    const newProject = {
      ...projectData,
      Id: newId,
      userId: 1, // Current user ID
      invoiceIds: [],
      totalAmount: 0.00,
      createdAt: new Date().toISOString()
    }
    
    this.projects.push(newProject)
    return { ...newProject }
  }

  async update(id, projectData) {
    await this.delay(400)
    const index = this.projects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Project not found")
    }
    
    this.projects[index] = { 
      ...this.projects[index], 
      ...projectData, 
      Id: parseInt(id) 
    }
    return { ...this.projects[index] }
  }

  async delete(id) {
    await this.delay(300)
    const index = this.projects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Project not found")
    }
    
    const deletedProject = { ...this.projects[index] }
    this.projects.splice(index, 1)
    return deletedProject
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new ProjectService()