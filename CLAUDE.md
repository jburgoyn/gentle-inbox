# Feedback Softener - System Architecture & Requirements

## Project Overview
A web application that receives customer feedback via email, uses AI to transform harsh criticism into constructive feedback, protecting business owners' emotional wellbeing while preserving valuable insights.

## Core User Journey
1. **Business Owner**: Signs up → Gets unique email → Shares with customers → Views softened feedback
2. **Customer**: Sends feedback to provided email → System processes automatically
3. **System**: Receives → Processes → Transforms → Stores → Displays

---

## Frontend Architecture (React + Vite)

### **Tech Stack**
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **State Management**: React Context + useState/useReducer
- **HTTP Client**: Fetch API with custom hooks
- **Icons**: Lucide React
- **Routing**: React Router v6

### **Core Components Structure**
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── SignupForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── dashboard/
│   │   ├── DashboardLayout.jsx
│   │   ├── FeedbackList.jsx
│   │   ├── FeedbackCard.jsx
│   │   ├── StatsOverview.jsx
│   │   └── EmailInstructions.jsx
│   ├── feedback/
│   │   ├── FeedbackModal.jsx
│   │   ├── OriginalToggle.jsx
│   │   └── SentimentBadge.jsx
│   └── shared/
│       ├── Header.jsx
│       ├── Loading.jsx
│       └── ErrorBoundary.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useFeedback.js
│   └── useFirebase.js
├── contexts/
│   └── AuthContext.jsx
├── utils/
│   ├── firebase.js
│   └── formatters.js
└── pages/
    ├── Login.jsx
    ├── Signup.jsx
    ├── Dashboard.jsx
    └── Landing.jsx
```

### **Key Features & Requirements**

#### **Authentication System**
- **Email/password registration and login**
- **Protected routes for dashboard**
- **User session persistence**
- **Password reset functionality**
- **Account deletion option**

#### **Dashboard Features**
- **Feedback inbox with transformed messages**
- **Toggle to view original vs. softened versions**
- **Feedback statistics and sentiment trends**
- **Unique email address display with copy functionality**
- **Search and filter feedback by date/sentiment**
- **Mark feedback as read/unread**
- **Export feedback data (CSV/PDF)**

#### **Accessibility Requirements**
- **WCAG 2.1 AA compliance**
- **Keyboard navigation support**
- **Screen reader compatibility**
- **High contrast mode**
- **Adjustable text sizes**
- **Focus indicators**
- **Alt text for all images**

#### **Responsive Design**
- **Mobile-first approach**
- **Tablet and desktop optimizations**
- **Touch-friendly interface elements**
- **Adaptive layouts**

---

## Backend Architecture (Firebase)

### **Tech Stack**
- **Platform**: Firebase (Google Cloud)
- **Database**: Cloud Firestore
- **Functions**: Cloud Functions for Firebase (Node.js)
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting
- **External APIs**: OpenAI GPT API, Postmark Webhooks

### **Database Schema (Firestore)**

#### **Collections Structure**
```javascript
// Users Collection
users/{userId} = {
  email: string,
  displayName: string,
  createdAt: timestamp,
  feedbackEmailId: string, // unique identifier for inbound email
  subscription: {
    plan: 'free' | 'pro',
    emailsUsed: number,
    emailsLimit: number,
    resetDate: timestamp
  },
  preferences: {
    showOriginal: boolean,
    emailNotifications: boolean,
    sentimentThreshold: number
  }
}

// Feedback Collection
feedback/{feedbackId} = {
  userId: string,
  originalText: string,
  transformedText: string,
  senderEmail: string,
  senderName: string,
  subject: string,
  receivedAt: timestamp,
  processedAt: timestamp,
  sentiment: {
    original: { score: number, label: string },
    transformed: { score: number, label: string }
  },
  metadata: {
    postmarkMessageId: string,
    transformationModel: string,
    processingTime: number,
    wasTransformed: boolean
  },
  status: 'unread' | 'read' | 'archived',
  tags: string[]
}

// Analytics Collection (optional)
analytics/{userId}/daily/{date} = {
  feedbackCount: number,
  averageSentiment: number,
  transformationRate: number
}
```

### **Cloud Functions**

#### **Core Functions**
```javascript
// 1. Postmark Webhook Handler
exports.handleInboundEmail = functions.https.onRequest(async (req, res) => {
  // Verify Postmark webhook signature
  // Parse email content and extract userId from email address
  // Store original feedback
  // Queue for AI processing
  // Return 200 OK to Postmark
});

// 2. AI Processing Function
exports.processFeedback = functions.firestore
  .document('feedback/{feedbackId}')
  .onCreate(async (snap, context) => {
    // Get feedback data
    // Call OpenAI API for sentiment analysis and transformation
    // Update feedback document with transformed text
    // Send notification to user (optional)
  });

// 3. User Management
exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
  // Generate unique feedback email ID
  // Create user document in Firestore
  // Set up default preferences
});

// 4. Analytics Function
exports.updateAnalytics = functions.firestore
  .document('feedback/{feedbackId}')
  .onUpdate(async (change, context) => {
    // Update daily analytics when feedback is processed
  });
```

#### **API Endpoints (Callable Functions)**
```javascript
// Get user's feedback list with pagination
exports.getFeedback = functions.https.onCall(async (data, context) => {
  // Verify authentication
  // Query feedback with filters and pagination
  // Return sanitized data
});

// Update feedback status
exports.updateFeedbackStatus = functions.https.onCall(async (data, context) => {
  // Mark as read/unread/archived
});

// Get user analytics
exports.getAnalytics = functions.https.onCall(async (data, context) => {
  // Return sentiment trends, feedback counts, etc.
});
```

### **External Integrations**

#### **Postmark Integration**
- **Inbound Email Setup**: Configure webhook URL pointing to Cloud Function
- **Email Parsing**: Extract text, sender info, subject from JSON payload
- **Verification**: Validate webhook signatures for security
- **Error Handling**: Bounce emails that can't be processed

#### **OpenAI Integration**
- **Sentiment Analysis**: Analyze original feedback tone
- **Text Transformation**: Rewrite harsh feedback constructively
- **Prompt Engineering**: Crafted prompts for consistent, helpful output
- **Rate Limiting**: Handle API limits and retries
- **Cost Management**: Track usage and optimize prompts

### **Security Requirements**
- **Authentication**: Firebase Auth tokens for all API calls
- **Authorization**: User can only access their own feedback
- **Data Validation**: Sanitize all inputs, validate email formats
- **Webhook Security**: Verify Postmark signatures
- **API Key Management**: Secure storage of OpenAI API keys
- **Rate Limiting**: Prevent abuse of functions
- **Data Privacy**: Encrypt sensitive feedback content

### **Performance Requirements**
- **Webhook Response**: < 200ms response to Postmark
- **AI Processing**: Complete within 30 seconds
- **Dashboard Load**: < 2 seconds initial load
- **Pagination**: 20 feedback items per page
- **Caching**: Cache user preferences and analytics

### **Monitoring & Error Handling**
- **Function Logging**: Comprehensive error and performance logs
- **Dead Letter Queues**: Handle failed AI processing
- **Alerting**: Monitor webhook failures and API errors
- **Retry Logic**: Exponential backoff for external API calls
- **Fallback Behavior**: Show original feedback if transformation fails

---

## Development Phases

### **Phase 1: MVP (Core Functionality)**
1. **Authentication system**
2. **Basic dashboard with feedback list**
3. **Postmark webhook integration**
4. **OpenAI text transformation**
5. **Simple feedback display**

### **Phase 2: Enhanced Features**
1. **Sentiment analysis and scoring**
2. **Original/transformed toggle**
3. **Basic analytics dashboard**
4. **Email notifications**
5. **Mobile responsiveness**

### **Phase 3: Polish & Optimization**
1. **Advanced filtering and search**
2. **Data export functionality**
3. **User preferences**
4. **Performance optimizations**
5. **Comprehensive error handling**

---

## Testing Strategy

### **Frontend Testing**
- **Unit Tests**: Component logic with React Testing Library
- **Integration Tests**: User flows and API interactions
- **E2E Tests**: Complete user journeys with Cypress
- **Accessibility Tests**: Automated a11y scanning

### **Backend Testing**
- **Function Tests**: Individual Cloud Function testing
- **Integration Tests**: Postmark and OpenAI API mocking
- **Load Tests**: Webhook performance under load
- **Security Tests**: Authentication and authorization

### **Manual Testing**
- **Email Flow**: Send actual emails through Postmark
- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Mobile Devices**: iOS and Android testing
- **Accessibility**: Screen reader testing

---

## Deployment & Infrastructure

### **Environment Setup**
- **Development**: Local Firebase emulators
- **Staging**: Firebase staging project
- **Production**: Firebase production project

### **CI/CD Pipeline**
- **GitHub Actions**: Automated testing and deployment
- **Code Quality**: ESLint, Prettier, type checking
- **Security Scanning**: Dependency vulnerability checks
- **Performance Monitoring**: Web Vitals tracking

### **Monitoring & Analytics**
- **Firebase Performance**: Function execution metrics
- **Google Analytics**: User behavior tracking
- **Error Reporting**: Firebase Crashlytics
- **Cost Monitoring**: Firebase usage alerts