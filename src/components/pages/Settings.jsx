import React, { useState, useEffect } from "react"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ApperIcon from "@/components/ApperIcon"
import userService from "@/services/api/userService"
import { toast } from "react-toastify"

const Settings = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  
  const [profileData, setProfileData] = useState({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "USA"
    }
  })

  const [brandingData, setBrandingData] = useState({
    logo: "",
    brandColors: {
      primary: "#2C5F63",
      secondary: "#8B7355", 
      accent: "#D4A574"
    }
  })

  const [taxData, setTaxData] = useState({
    taxRate: 8.5,
    paymentTerms: 30,
    invoicePrefix: "INV",
    invoiceNumbering: "sequential"
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      setError("")
      const userData = await userService.getCurrentUser()
      
      setProfileData({
        companyName: userData.companyName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        website: userData.website || "",
        address: userData.address || {
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "USA"
        }
      })

      setBrandingData({
        logo: userData.logo || "",
        brandColors: userData.brandColors || {
          primary: "#2C5F63",
          secondary: "#8B7355",
          accent: "#D4A574"
        }
      })

      setTaxData({
        taxRate: userData.taxRate || 8.5,
        paymentTerms: userData.paymentTerms || 30,
        invoicePrefix: "INV",
        invoiceNumbering: "sequential"
      })
    } catch (err) {
      setError("Failed to load user settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      await userService.update(1, {
        ...profileData,
        ...taxData
      })
      toast.success("Profile settings saved successfully")
    } catch (err) {
      toast.error("Failed to save profile settings")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBranding = async () => {
    try {
      setSaving(true)
      await userService.updateBranding(1, brandingData)
      toast.success("Branding settings saved successfully")
    } catch (err) {
      toast.error("Failed to save branding settings")
    } finally {
      setSaving(false)
    }
  }

  const updateProfileData = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }))
    }
  }

  const updateBrandingData = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setBrandingData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setBrandingData(prev => ({ ...prev, [field]: value }))
    }
  }

  const updateTaxData = (field, value) => {
    setTaxData(prev => ({ ...prev, [field]: value }))
  }

  const tabs = [
    { id: "profile", name: "Profile", icon: "User" },
    { id: "branding", name: "Branding", icon: "Palette" },
    { id: "invoices", name: "Invoice Settings", icon: "FileText" },
    { id: "payments", name: "Payments", icon: "CreditCard" }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadUserData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and business preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ApperIcon name={tab.icon} size={20} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 font-display">Company Profile</h2>
                  <Button
                    variant="primary"
                    onClick={handleSaveProfile}
                    loading={saving}
                    icon="Save"
                  >
                    Save Changes
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Company Name"
                      value={profileData.companyName}
                      onChange={(e) => updateProfileData("companyName", e.target.value)}
                      placeholder="Johnson Interior Design"
                      required
                    />
                    <FormField
                      label="Email Address"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => updateProfileData("email", e.target.value)}
                      placeholder="sarah@johnsonstudio.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Phone Number"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => updateProfileData("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                    <FormField
                      label="Website"
                      type="url"
                      value={profileData.website}
                      onChange={(e) => updateProfileData("website", e.target.value)}
                      placeholder="https://johnsonstudio.com"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Business Address</h3>
                    
                    <FormField
                      label="Street Address"
                      value={profileData.address.street}
                      onChange={(e) => updateProfileData("address.street", e.target.value)}
                      placeholder="123 Design Avenue"
                    />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <FormField
                        label="City"
                        value={profileData.address.city}
                        onChange={(e) => updateProfileData("address.city", e.target.value)}
                        placeholder="San Francisco"
                      />
                      <FormField
                        label="State"
                        value={profileData.address.state}
                        onChange={(e) => updateProfileData("address.state", e.target.value)}
                        placeholder="CA"
                      />
                      <FormField
                        label="ZIP Code"
                        value={profileData.address.zip}
                        onChange={(e) => updateProfileData("address.zip", e.target.value)}
                        placeholder="94102"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Branding Tab */}
          {activeTab === "branding" && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 font-display">Brand Customization</h2>
                  <Button
                    variant="primary"
                    onClick={handleSaveBranding}
                    loading={saving}
                    icon="Save"
                  >
                    Save Changes
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Company Logo</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="bg-gradient-to-br from-primary-600 to-primary-700 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <ApperIcon name="PaintBucket" size={32} className="text-white" />
                      </div>
                      <p className="text-gray-600 mb-4">Upload your company logo to appear on invoices</p>
                      <Button variant="outline" icon="Upload">
                        Upload Logo
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Colors</h3>
                    <p className="text-gray-600 mb-6">Customize your invoice colors to match your brand identity</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={brandingData.brandColors.primary}
                            onChange={(e) => updateBrandingData("brandColors.primary", e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={brandingData.brandColors.primary}
                            onChange={(e) => updateBrandingData("brandColors.primary", e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={brandingData.brandColors.secondary}
                            onChange={(e) => updateBrandingData("brandColors.secondary", e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={brandingData.brandColors.secondary}
                            onChange={(e) => updateBrandingData("brandColors.secondary", e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Accent Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={brandingData.brandColors.accent}
                            onChange={(e) => updateBrandingData("brandColors.accent", e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={brandingData.brandColors.accent}
                            onChange={(e) => updateBrandingData("brandColors.accent", e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
                      <div className="flex gap-4">
                        <div 
                          className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: brandingData.brandColors.primary }}
                        >
                          Primary
                        </div>
                        <div 
                          className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                          style={{ backgroundColor: brandingData.brandColors.secondary }}
                        >
                          Secondary
                        </div>
                        <div 
                          className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: brandingData.brandColors.accent }}
                        >
                          Accent
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Invoice Settings Tab */}
          {activeTab === "invoices" && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 font-display">Invoice Settings</h2>
                  <Button
                    variant="primary"
                    onClick={handleSaveProfile}
                    loading={saving}
                    icon="Save"
                  >
                    Save Changes
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Default Tax Rate (%)"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={taxData.taxRate}
                      onChange={(e) => updateTaxData("taxRate", parseFloat(e.target.value) || 0)}
                    />
                    <FormField
                      label="Payment Terms (Days)"
                      type="number"
                      min="1"
                      max="365"
                      value={taxData.paymentTerms}
                      onChange={(e) => updateTaxData("paymentTerms", parseInt(e.target.value) || 30)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Invoice Prefix"
                      value={taxData.invoicePrefix}
                      onChange={(e) => updateTaxData("invoicePrefix", e.target.value)}
                      placeholder="INV"
                    />
                    <FormField
                      label="Numbering System"
                    >
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={taxData.invoiceNumbering}
                        onChange={(e) => updateTaxData("invoiceNumbering", e.target.value)}
                      >
                        <option value="sequential">Sequential (001, 002, 003...)</option>
                        <option value="yearly">Yearly Reset (2024-001, 2024-002...)</option>
                        <option value="monthly">Monthly Reset (01-001, 01-002...)</option>
                      </select>
                    </FormField>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-info/10 to-info/5 rounded-lg">
                    <div className="flex gap-3">
                      <ApperIcon name="Info" size={20} className="text-info flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Invoice Preview</h4>
                        <p className="text-sm text-gray-600">
                          With your current settings, your next invoice will be numbered: <strong>{taxData.invoicePrefix}-2024-007</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 font-display mb-6">Payment Settings</h2>

                <div className="space-y-6">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                          <ApperIcon name="CreditCard" size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Stripe Integration</h3>
                          <p className="text-sm text-gray-600">Accept online payments securely</p>
                        </div>
                      </div>
                      <Button variant="primary">
                        Configure Stripe
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card variant="premium">
                      <div className="text-center p-4">
                        <div className="bg-gradient-to-br from-success/20 to-success/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <ApperIcon name="CheckCircle" size={24} className="text-success" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Payment Links</h4>
                        <p className="text-sm text-gray-600">
                          Automatically generate secure payment links for your invoices
                        </p>
                      </div>
                    </Card>

                    <Card variant="premium">
                      <div className="text-center p-4">
                        <div className="bg-gradient-to-br from-info/20 to-info/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <ApperIcon name="Smartphone" size={24} className="text-info" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Mobile Payments</h4>
                        <p className="text-sm text-gray-600">
                          Accept payments on the go with mobile-optimized checkout
                        </p>
                      </div>
                    </Card>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg">
                    <div className="flex gap-3">
                      <ApperIcon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Setup Required</h4>
                        <p className="text-sm text-gray-600">
                          Connect your Stripe account to start accepting online payments. This typically takes 5-10 minutes to complete.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings