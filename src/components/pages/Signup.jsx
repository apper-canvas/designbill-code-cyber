import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'
import { signupStart, signupSuccess, signupFailure, clearError } from '@/store/authSlice'
import userService from '@/services/api/userService'

const Signup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector(state => state.auth)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [formErrors, setFormErrors] = useState({})

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!formData.email.includes('@')) {
      errors.email = 'Please enter a valid email'
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long'
    }
    
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    dispatch(signupStart())
    
    try {
      const user = await userService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      
      dispatch(signupSuccess(user))
      toast.success(`Welcome to DesignBill Pro, ${user.name}!`)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      dispatch(signupFailure(error.message))
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-premium p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl mb-4">
              <ApperIcon name="UserPlus" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Join DesignBill Pro and start managing your invoices
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Full Name"
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={formErrors.name}
              placeholder="Enter your full name"
              required
              autoComplete="name"
              disabled={loading}
            />

            <FormField
              label="Email Address"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={formErrors.email}
              placeholder="Enter your email"
              required
              autoComplete="email"
              disabled={loading}
            />

            <FormField
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={formErrors.password}
              placeholder="Create a password"
              required
              autoComplete="new-password"
              disabled={loading}
            />

            <FormField
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={formErrors.confirmPassword}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
              disabled={loading}
            />

            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <ApperIcon name="AlertCircle" size={16} className="text-error" />
                  <p className="text-sm text-error">{error}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Terms Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup