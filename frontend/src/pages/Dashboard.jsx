import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../hooks/useBusiness';
import { useFeedback } from '../hooks/useFeedback';
import { generateBusinessEmail } from '../utils/firestore';
import CreateBusinessModal from '../components/business/CreateBusinessModal';
import { Mail, BarChart3, Settings, LogOut, Bell, Search, Filter, Copy, CheckCircle, Plus, Building } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { businesses, selectedBusiness, loading: businessLoading, addBusiness, selectBusiness } = useBusiness();
  const { feedback, stats, loading: feedbackLoading, markAsRead } = useFeedback(selectedBusiness?.id);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedbackEmailCopied, setFeedbackEmailCopied] = useState(false);

  const handleCreateBusiness = async (businessData) => {
    await addBusiness(businessData);
  };

  const handleCopyEmail = async () => {
    if (!selectedBusiness) return;
    
    const businessEmail = generateBusinessEmail(selectedBusiness.id);
    try {
      await navigator.clipboard.writeText(businessEmail);
      setFeedbackEmailCopied(true);
      setTimeout(() => setFeedbackEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const handleFeedbackClick = async (feedbackItem) => {
    if (feedbackItem.status === 'unread') {
      await markAsRead(feedbackItem.id, selectedBusiness.id);
    }
  };

  // Show loading state
  if (businessLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your businesses...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no businesses
  if (businesses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-600 rounded-lg p-2">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">gentle inbox</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <Building className="h-16 w-16 text-amber-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Gentle Inbox!</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              To get started receiving gentler feedback, you'll need to create your first business. 
              Each business gets its own unique email address for customer feedback.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
            >
              Create Your First Business
            </button>
          </div>
        </div>

        <CreateBusinessModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateBusiness={handleCreateBusiness}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-amber-600 rounded-lg p-2">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">gentle inbox</span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Business</span>
          </button>
        </div>

        {/* Business List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Your Businesses</h3>
            <div className="space-y-2">
              {businesses.map((business) => (
                <button
                  key={business.docId}
                  onClick={() => selectBusiness(business)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedBusiness?.docId === business.docId
                      ? 'bg-amber-50 border border-amber-200 text-amber-900'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{business.name}</div>
                      <div className="text-sm text-gray-500 truncate">{business.description || 'No description'}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 truncate">{user?.email}</span>
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedBusiness?.name}</h1>
                <p className="text-sm text-gray-600">{selectedBusiness?.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Mail className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Sentiment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.avgSentiment > 0 ? '+' : ''}{stats.avgSentiment}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Instructions */}
          {selectedBusiness && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 mb-8 border border-amber-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Feedback Email</h3>
              <p className="text-gray-700 mb-4">
                Share this email address with your customers for {selectedBusiness.name}:
              </p>
              <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border border-amber-200">
                <span className="font-mono text-lg text-gray-900 flex-1">
                  {generateBusinessEmail(selectedBusiness.id)}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {feedbackEmailCopied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Feedback List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Feedback</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search feedback..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {feedbackLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading feedback...</p>
                </div>
              ) : feedback.length === 0 ? (
                <div className="p-12 text-center">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
                  <p className="text-gray-600 mb-4">
                    Share your business email with customers to start receiving feedback.
                  </p>
                  {selectedBusiness && (
                    <div className="bg-gray-50 rounded-lg p-4 max-w-lg mx-auto">
                      <p className="text-sm text-gray-600 mb-2">Your business email:</p>
                      <code className="text-sm font-mono text-gray-900">
                        {generateBusinessEmail(selectedBusiness.id)}
                      </code>
                    </div>
                  )}
                </div>
              ) : (
                feedback.map((feedbackItem) => (
                  <div 
                    key={feedbackItem.id} 
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleFeedbackClick(feedbackItem)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">Subject: {feedbackItem.subject}</h3>
                          
                        </div>
                        <p className="text-sm text-gray-600">
                          From: {feedbackItem.senderName} ({feedbackItem.senderEmail})
                        </p>
                        <p className="text-sm text-gray-500">
                          {feedbackItem.receivedAt?.toLocaleDateString()} at {feedbackItem.receivedAt?.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    {feedbackItem.transformedText ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                        <div className="text-sm font-medium text-green-800 mb-2">Gentle Version</div>
                        <p className="text-gray-900">{feedbackItem.transformedText}</p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
                        <div className="text-sm font-medium text-yellow-800 mb-2">Processing...</div>
                        <p className="text-gray-700">This feedback is being processed by our AI. Please check back in a moment.</p>
                      </div>
                    )}
                    
                    <details className="group">
                      <summary className="cursor-pointer text-sm text-amber-600 hover:text-amber-700 font-medium">
                        View Original Message
                      </summary>
                      <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-600 mb-2">Original Message</div>
                        <p className="text-gray-900">{feedbackItem.originalText}</p>
                      </div>
                    </details>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Business Modal */}
      <CreateBusinessModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateBusiness={handleCreateBusiness}
      />
    </div>
  );
}