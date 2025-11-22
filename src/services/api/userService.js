import usersData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...usersData]
  }

  async getAll() {
    await this.delay(200)
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

async authenticate(email, password) {
    await this.delay(500)
    
    // Find user by email
    const user = this.users.find(u => 
      u.email && u.email.toLowerCase() === email.toLowerCase()
    )
    
    if (!user) {
      throw new Error("Invalid email or password")
    }
    
    // In a real app, you'd verify the password hash
    // For demo, we'll accept any password for existing users
    return {
      Id: user.Id,
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    }
  }

  async register(userData) {
    await this.delay(600)
    
    const { name, email, password } = userData
    
    // Validation
    if (!name || name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters long")
    }
    
    if (!email || !email.includes('@')) {
      throw new Error("Please enter a valid email address")
    }
    
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long")
    }
    
    // Check if email already exists
    const existingUser = this.users.find(u => 
      u.email && u.email.toLowerCase() === email.toLowerCase()
    )
    
    if (existingUser) {
      throw new Error("An account with this email already exists")
    }
    
    // Create new user
    const newUser = {
      Id: this.users.length + 1,
      name: name.trim(),
      email: email.toLowerCase(),
      role: 'user',
      createdAt: new Date().toISOString()
    }
    
    this.users.push(newUser)
    
    return {
      Id: newUser.Id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  }

  async logout() {
    await this.delay(200)
    return { success: true }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new UserService()