import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Home = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: "FileText",
      title: "Professional Invoices",
      description: "Create stunning, branded invoices that reflect your design expertise and impress clients."
    },
    {
      icon: "FolderOpen",
      title: "Project Organization",
      description: "Keep all project financials organized with dedicated project folders and invoice tracking."
    },
    {
      icon: "CreditCard",
      title: "Easy Payments",
      description: "Get paid faster with integrated Stripe payments and automatic invoice status updates."
    },
    {
      icon: "Users",
      title: "Client Management",
      description: "Maintain professional client relationships with detailed profiles and payment history."
    },
    {
      icon: "Palette",
      title: "Custom Branding",
      description: "Apply your brand colors and logo to every invoice for consistent professional identity."
    },
    {
      icon: "BarChart3",
      title: "Financial Insights",
      description: "Track your design business performance with detailed analytics and reporting."
    }
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "29",
      period: "month",
      features: [
        "Up to 50 invoices/month",
        "5 client profiles", 
        "Basic branding",
        "Email support",
        "Payment processing"
      ],
      recommended: false
    },
    {
      name: "Professional",
      price: "59", 
      period: "month",
      features: [
        "Unlimited invoices",
        "Unlimited clients",
        "Advanced branding",
        "Project management",
        "Priority support",
        "Custom templates"
      ],
      recommended: true
    },
    {
      name: "Studio",
      price: "99",
      period: "month", 
      features: [
        "Everything in Professional",
        "Team collaboration",
        "Advanced analytics",
        "API access",
        "White-label options",
        "Dedicated account manager"
      ],
      recommended: false
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "Interior Designer",
      company: "Johnson Design Studio",
      content: "DesignBill Pro has transformed how I handle invoicing. My clients love the professional branded invoices, and I get paid 40% faster now.",
      avatar: "👩‍🎨"
    },
    {
      name: "Michael Chen", 
      title: "Principal Designer",
      company: "Modern Living Designs",
      content: "The project organization features are incredible. I can track every expense and invoice for each client project in one place.",
      avatar: "👨‍💼"
    },
    {
      name: "Emma Rodriguez",
      title: "Freelance Designer", 
      company: "Rodriguez Interiors",
      content: "As a freelancer, this tool is perfect. The branding customization makes my business look established and professional.",
      avatar: "👩‍💻"
    }
  ]

  const steps = [
    {
      step: "1",
      title: "Set Up Your Brand",
      description: "Upload your logo and choose your brand colors to create a consistent professional identity."
    },
    {
      step: "2", 
      title: "Add Clients & Projects",
      description: "Import your client information and organize work into projects for better financial tracking."
    },
    {
      step: "3",
      title: "Create & Send Invoices", 
      description: "Generate beautiful branded invoices with line items for design services and materials."
    },
    {
      step: "4",
      title: "Get Paid Faster",
      description: "Clients can pay instantly online via Stripe, with automatic invoice status updates."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
{/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface via-white to-primary-50 py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2523D4A574%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 font-display">
              Professional Invoicing for 
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"> Interior Designers</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Create stunning branded invoices, organize project finances, and get paid faster. 
              DesignBill Pro is built specifically for design professionals who value aesthetics and efficiency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="text-lg px-8 py-4"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4"
                onClick={() => document.getElementById("demo").scrollIntoView({ behavior: "smooth" })}
              >
                <ApperIcon name="Play" size={20} />
                Watch Demo
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              No credit card required • 14-day free trial • Cancel anytime
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-32 bottom-0"></div>
              <Card className="overflow-hidden shadow-2xl border border-gray-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="ml-4 text-sm text-gray-600">DesignBill Pro Dashboard</div>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-white to-surface">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl">
                      <div className="text-2xl font-bold text-primary-700 font-display">$47,892</div>
                      <div className="text-primary-600 text-sm font-medium">Total Revenue</div>
                    </div>
                    <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-xl">
                      <div className="text-2xl font-bold text-accent-700 font-display">18</div>
                      <div className="text-accent-600 text-sm font-medium">Active Projects</div>
                    </div>
                    <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-6 rounded-xl">
                      <div className="text-2xl font-bold text-secondary-700 font-display">$12,500</div>
                      <div className="text-secondary-600 text-sm font-medium">Pending Payments</div>
                    </div>
                  </div>
                  <div className="h-64 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <ApperIcon name="BarChart3" size={48} className="mx-auto mb-2" />
                      <div className="text-sm">Revenue Analytics Chart</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 font-display">
              Everything You Need to Run Your Design Business
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Purpose-built features for interior designers who want professional invoicing without the complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} variant="premium" hover className="text-center">
                <div className="bg-gradient-to-br from-primary-100 to-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ApperIcon name={feature.icon} size={32} className="text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-display">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-surface to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 font-display">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Get started in minutes with our simple 4-step process designed for busy designers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-accent-200 -translate-y-4 z-0"></div>
                )}
                <div className="bg-gradient-to-br from-accent-500 to-accent-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold font-display shadow-lg relative z-10">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-display">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 font-display">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Choose the perfect plan for your design business. All plans include our core invoicing features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                variant="premium"
                className={`text-center relative ${plan.recommended ? 'ring-2 ring-primary-500 shadow-2xl scale-105' : ''}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="pt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 font-display">${plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <ApperIcon name="Check" size={16} className="text-success mt-1 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.recommended ? "primary" : "outline"}
                    className="w-full"
                    size="lg"
                    onClick={() => navigate("/dashboard")}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">All plans include a 14-day free trial. No credit card required.</p>
            <p className="text-sm text-gray-500">Need a custom plan for your design team? <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Contact sales</a></p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-surface to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 font-display">
              Loved by Interior Designers
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              See how DesignBill Pro is helping design professionals streamline their business operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="premium" className="text-center">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <blockquote className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.title}</div>
                  <div className="text-sm text-primary-600 font-medium">{testimonial.company}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 font-display">
            Ready to Transform Your Design Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Join thousands of interior designers who've already streamlined their invoicing process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="accent"
              size="lg" 
              onClick={() => navigate("/dashboard")}
              className="text-lg px-8 py-4 bg-white text-primary-600 hover:bg-gray-50"
            >
              Start Your Free Trial
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600"
            >
              Schedule Demo
            </Button>
          </div>
          <div className="mt-6 text-primary-100 text-sm">
            14-day free trial • No credit card required • Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl">
                  <ApperIcon name="PaintBucket" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display">DesignBill Pro</h3>
                  <p className="text-gray-400 text-sm">Professional invoicing for interior designers</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Streamline your design business with professional invoicing, project management, 
                and payment processing built specifically for interior designers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 DesignBill Pro. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ApperIcon name="Twitter" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ApperIcon name="Linkedin" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ApperIcon name="Instagram" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home