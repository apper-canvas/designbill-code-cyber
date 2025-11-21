import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'
import { loginStart, loginSuccess, loginFailure, clearError } from '@/store/authSlice'
import userService from '@/services/api/userService'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, isAuthenticated } = useSelector(state => state.auth)
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [formErrors, setFormErrors] = useState({})

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const validateForm = () => {
    const errors = {}
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!formData.email.includes('@')) {
      errors.email = 'Please enter a valid email'
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required'
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
    
    dispatch(loginStart())
    
    try {
      const user = await userService.authenticate(formData.email, formData.password)
      dispatch(loginSuccess(user))
      toast.success(`Welcome back, ${user.name}!`)
      
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (error) {
      dispatch(loginFailure(error.message))
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-premium p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4">
              <ApperIcon name="LogIn" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter your password"
              required
              autoComplete="current-password"
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
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Helper */}
        <div className="mt-6 p-4 bg-white/80 backdrop-blur rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-2">
            <ApperIcon name="Info" size={14} className="inline mr-1" />
            Demo Login
          </p>
          <p className="text-xs text-gray-500 text-center">
            Use any email from the users list with any password
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login