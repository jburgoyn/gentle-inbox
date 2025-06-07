import { Mail, Shield, BarChart3, Download, Filter, Smartphone, Star, ArrowRight, Brain, Zap, User, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with updated styling */}
      <header className="bg-gradient-to-r from-rose-200 via-amber-200 to-orange-300 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <Heart className="h-6 w-6 text-white" />
              </div>
                              <span className="text-xl font-bold text-gray-800">gentle inbox</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/examples" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">
                  Examples
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup" className="bg-white/70 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition-colors border border-white/50">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section with Gradient Background */}
      <section className="py-24 bg-gradient-to-r from-rose-200 via-amber-200 to-orange-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-8 leading-tight">
              Turn Harsh Criticism into<br />
              <span className="text-amber-800">Constructive Feedback</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
              Our AI-powered tool transforms customer feedback, promoting<br />
              insights while easing the emotional impact.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/signup" className="bg-white/90 backdrop-blur-sm text-amber-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 inline-block">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Original Message</div>
                <p className="text-gray-900 text-lg leading-relaxed">Your service is terrible! I've been waiting for hours and nobody responds. This is completely unacceptable!</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm">
                <div className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-3">Gentle Version</div>
                <p className="text-gray-900 text-lg leading-relaxed">I've been experiencing longer wait times than expected and would appreciate an update on my request. Could you help me understand the timeline?</p>
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                See the Magic in Action
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Watch how our AI transforms harsh feedback into constructive insights while preserving the core message.
              </p>
              <Link to="/examples" className="bg-amber-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors inline-block">
                See Examples
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in three simple steps and protect your emotional well-being
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Sign Up</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Create your account and get your unique feedback email address</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Mail className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Share With Customers</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Use your custom email (e.g. contact@yourbusiness.gentleinbox.com) for customer feedback</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Receive Gentle Feedback</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Get transformed, emotionally-safe feedback in your dashboard automatically</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to protect your mental health while preserving valuable insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-rose-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Softened + Original Toggle</h3>
              <p className="text-gray-600">Switch between gentle and original versions to see the full context when needed</p>
            </div>
            
            <div className="bg-rose-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sentiment Scores & Trends</h3>
              <p className="text-gray-600">Track emotional patterns and customer satisfaction over time</p>
            </div>
            
            <div className="bg-rose-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg flex items-center justify-center mb-6">
                <Download className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Export to CSV/PDF</h3>
              <p className="text-gray-600">Download your feedback data for further analysis and reporting</p>
            </div>
            
            <div className="bg-rose-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg flex items-center justify-center mb-6">
                <Filter className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Inbox with Tags & Filters</h3>
              <p className="text-gray-600">Organize and filter feedback with intelligent tagging and search</p>
            </div>
            
            <div className="bg-rose-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg flex items-center justify-center mb-6">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Works Automatically via Email</h3>
              <p className="text-gray-600">No integrations needed - just share your email and we handle the rest</p>
            </div>
            
            <div className="bg-rose-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg flex items-center justify-center mb-6">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">WCAG Accessibility & Mobile Friendly</h3>
              <p className="text-gray-600">Accessible design that works perfectly on all devices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-r from-rose-50 to-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Users Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-900 text-lg mb-6 leading-relaxed">
                "I used to dread reading emails. Gentle Inbox changed everything. Now I can focus on improving my business instead of recovering from harsh feedback."
              </p>
              <div className="text-gray-600 font-medium">
                – Sarah J., Small Business Owner
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-900 text-lg mb-6 leading-relaxed">
                "It preserves customer insight but protects my emotional bandwidth. I'm more productive and less stressed since using Gentle Inbox."
              </p>
              <div className="text-gray-600 font-medium">
                – Lee T., Indie SaaS Founder
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-rose-200 via-amber-200 to-orange-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Ready to Transform Your Feedback Experience?
          </h2>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of business owners protecting their mental health while staying connected to customer insights
          </p>
          <Link to="/signup" className="bg-white text-amber-700 px-10 py-4 rounded-full text-lg font-semibold hover:bg-white/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 inline-block">
            Get Your Feedback Email
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-amber-600 rounded-lg p-2">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">gentle inbox</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Transform harsh feedback into constructive insights while protecting your emotional well-being.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 Gentle Inbox. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}