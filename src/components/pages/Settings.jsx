import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ApperIcon from "@/components/ApperIcon"
import ApperFileFieldComponent from "@/components/atoms/FileUploader/ApperFileFieldComponent"
import userService from "@/services/api/userService"

const Settings = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("profile")

  // Form data states
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
      
      if (userData) {
        setProfileData({
          companyName: userData.company_name_c || userData.companyName || "",
          email: userData.email_c || userData.email || "",
          phone: userData.phone_c || userData.phone || "",
          website: userData.website_c || userData.website || "",
          address: userData.address_c ? 
            (typeof userData.address_c === 'string' ? JSON.parse(userData.address_c) : userData.address_c) :
            (userData.address || {
              street: "",
              city: "",
              state: "",
              zip: "",
              country: "USA"
            })
        })

        setBrandingData({
          logo: userData.logo_c || userData.logo || "",
          brandColors: userData.brand_colors_c ? 
            (typeof userData.brand_colors_c === 'string' ? JSON.parse(userData.brand_colors_c) : userData.brand_colors_c) :
            (userData.brandColors || {
              primary: "#2C5F63",
              secondary: "#8B7355",
              accent: "#D4A574"
            })
        })

        setTaxData({
          taxRate: userData.tax_rate_c || userData.taxRate || 8.5,
          paymentTerms: userData.payment_terms_c || userData.paymentTerms || 30,
          invoicePrefix: userData.invoice_prefix_c || userData.invoicePrefix || "INV",
          invoiceNumbering: userData.invoice_numbering_c || userData.invoiceNumbering || "sequential"
        })
      }
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
        company_name_c: profileData.companyName,
        email_c: profileData.email,
        phone_c: profileData.phone,
        website_c: profileData.website,
        address_c: profileData.address,
        tax_rate_c: taxData.taxRate,
        payment_terms_c: taxData.paymentTerms,
        invoice_prefix_c: taxData.invoicePrefix,
        invoice_numbering_c: taxData.invoiceNumbering
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

  const updateProfileData = (key, value) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [key]: value
      }))
    }
  }

  const updateBrandingData = (key, value) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      setBrandingData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setBrandingData(prev => ({
        ...prev,
        [key]: value
      }))
    }
  }

  const updateTaxData = (key, value) => {
    setTaxData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (loading) return <Loading type="page" />
  if (error) return <ErrorView error={error} onRetry={loadUserData} />

  const tabs = [
    { id: "profile", label: "Company Profile", icon: "Building" },
    { id: "branding", label: "Branding", icon: "Palette" },
    { id: "billing", label: "Billing & Tax", icon: "Calculator" }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name={tab.icon} size={16} />
                {tab.label}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Company Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    label="Company Name"
                    value={profileData.companyName}
                    onChange={(e) => updateProfileData("companyName", e.target.value)}
                    placeholder="Your company name"
                  />
                  <FormField
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => updateProfileData("email", e.target.value)}
                    placeholder="company@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    placeholder="https://yourcompany.com"
                  />
                </div>

                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Business Address</h4>
                  <div className="space-y-4">
                    <FormField
                      label="Street Address"
                      value={profileData.address.street}
                      onChange={(e) => updateProfileData("address.street", e.target.value)}
                      placeholder="123 Main Street"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        label="City"
                        value={profileData.address.city}
                        onChange={(e) => updateProfileData("address.city", e.target.value)}
                      />
                      <FormField
                        label="State"
                        value={profileData.address.state}
                        onChange={(e) => updateProfileData("address.state", e.target.value)}
                      />
                      <FormField
                        label="ZIP Code"
                        value={profileData.address.zip}
                        onChange={(e) => updateProfileData("address.zip", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    loading={saving}
                    disabled={saving}
                    icon="Save"
                  >
                    Save Profile
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Branding Tab */}
          {activeTab === "branding" && (
            <Card className="p-6">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Company Logo</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="mb-4">
                      <p className="text-gray-600 mb-4">Upload your company logo to appear on invoices</p>
                      <ApperFileFieldComponent
                        elementId="logo-upload"
                        config={{
                          fieldName: 'logo_c',
                          fieldKey: 'logo_c',
                          tableName: 'user_c',
                          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
                          existingFiles: brandingData.logo ? [brandingData.logo] : [],
                          fileCount: brandingData.logo ? 1 : 0,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Brand Colors</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={brandingData.brandColors.primary}
                          onChange={(e) => updateBrandingData("brandColors.primary", e.target.value)}
                          className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={brandingData.brandColors.secondary}
                          onChange={(e) => updateBrandingData("brandColors.secondary", e.target.value)}
                          className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={brandingData.brandColors.accent}
                          onChange={(e) => updateBrandingData("brandColors.accent", e.target.value)}
                          className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brandingData.brandColors.accent}
                          onChange={(e) => updateBrandingData("brandColors.accent", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Color Preview</label>
                      <div className="flex gap-4">
                        <div 
                          className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
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

                  <div className="pt-6">
                    <Button
                      onClick={handleSaveBranding}
                      loading={saving}
                      disabled={saving}
                      icon="Save"
                    >
                      Save Branding
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Billing & Tax Settings</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    label="Default Tax Rate (%)"
                    type="number"
                    step="0.01"
                    value={taxData.taxRate}
                    onChange={(e) => updateTaxData("taxRate", parseFloat(e.target.value) || 0)}
                    placeholder="8.5"
                  />
                  <FormField
                    label="Payment Terms (Days)"
                    type="number"
                    value={taxData.paymentTerms}
                    onChange={(e) => updateTaxData("paymentTerms", parseInt(e.target.value) || 30)}
                    placeholder="30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    label="Invoice Prefix"
                    value={taxData.invoicePrefix}
                    onChange={(e) => updateTaxData("invoicePrefix", e.target.value)}
                    placeholder="INV"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Numbering</label>
                    <select
                      value={taxData.invoiceNumbering}
                      onChange={(e) => updateTaxData("invoiceNumbering", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="sequential">Sequential (001, 002, 003...)</option>
                      <option value="yearly">Yearly Reset (2024-001, 2024-002...)</option>
                      <option value="monthly">Monthly Reset (202401-001, 202401-002...)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                  <div className="text-sm text-gray-600">
                    <p>
                      With your current settings, your next invoice will be numbered: <strong>{taxData.invoicePrefix}-2024-007</strong>
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    loading={saving}
                    disabled={saving}
                    icon="Save"
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Profile Completion</span>
                <span className="font-semibold text-primary-600">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-500">2 days ago</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Support</h3>
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start" icon="HelpCircle">
                View Documentation
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" icon="Mail">
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings