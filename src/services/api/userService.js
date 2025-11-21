import usersData from "@/services/mockData/users.json"

class UserService {
  constructor() {
    this.users = [...usersData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.users]
  }

  async getById(id) {
    await this.delay(200)
    const user = this.users.find(u => u.Id === parseInt(id))
    if (!user) {
      throw new Error("User not found")
    }
    return { ...user }
  }

  async getCurrentUser() {
    await this.delay(200)
    // Return the first user as the current user for demo
    if (this.users.length > 0) {
      return { ...this.users[0] }
    }
    throw new Error("No user found")
  }

  async update(id, userData) {
    await this.delay(400)
    const index = this.users.findIndex(u => u.Id === parseInt(id))
    if (index === -1) {
      throw new Error("User not found")
    }
    
    this.users[index] = { 
      ...this.users[index], 
      ...userData, 
      Id: parseInt(id) 
    }
    return { ...this.users[index] }
  }

  async updateBranding(id, brandingData) {
    await this.delay(300)
    const index = this.users.findIndex(u => u.Id === parseInt(id))
    if (index === -1) {
      throw new Error("User not found")
    }

    this.users[index] = {
      ...this.users[index],
      logo: brandingData.logo,
      brandColors: brandingData.brandColors
    }
    return { ...this.users[index] }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new UserService()