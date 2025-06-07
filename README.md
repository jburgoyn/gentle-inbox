# Gentle Inbox

A web application that receives customer feedback via email, uses AI to transform harsh criticism into constructive feedback, protecting business owners' emotional wellbeing while preserving valuable insights.

## 🌟 Features

- **AI-Powered Feedback Transformation**: Automatically converts harsh customer feedback into gentle, constructive messages
- **Multi-Business Management**: Create and manage multiple businesses with unique feedback email addresses
- **Real-Time Dashboard**: View feedback statistics, sentiment analysis, and manage business communications
- **Email Integration**: Seamless integration with Postmark for inbound email processing
- **User Authentication**: Secure Firebase-based authentication system
- **Mobile-Friendly**: Responsive design that works on all devices
- **Examples Page**: Interactive demo showing feedback transformation examples

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite for fast development
- **Styling**: Tailwind CSS for utility-first styling
- **Authentication**: Firebase Auth
- **State Management**: React Context + hooks
- **Routing**: React Router v6
- **Icons**: Lucide React

### Backend (Firebase)
- **Database**: Cloud Firestore for real-time data
- **Functions**: Cloud Functions for Firebase (Node.js)
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting
- **External APIs**: OpenAI GPT API, Postmark Webhooks

## 📁 Project Structure

```
good-vibes-feedback/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── auth/         # Authentication components
│   │   │   └── business/     # Business management components
│   │   ├── contexts/         # React contexts (Auth)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Route components
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions (Firebase, Firestore)
│   ├── public/               # Static assets
│   └── package.json
├── backend/                  # Node.js backend (placeholder)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Postmark account (for email processing)
- OpenAI API key (for AI transformation)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd good-vibes-feedback/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase config and update `src/utils/firebase.js`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

### Firebase Setup

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase in the frontend directory**
   ```bash
   firebase init
   ```
   - Select Hosting, Firestore, and Functions
   - Choose your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app

3. **Deploy to Firebase**
   ```bash
   npm run build
   firebase deploy
   ```

## 🗄️ Database Schema

### Firestore Structure

```javascript
// Users Collection
users/{userId} = {
  email: string,
  displayName: string,
  createdAt: timestamp,
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

// Businesses Subcollection
users/{userId}/businesses/{businessId} = {
  id: string,
  name: string,
  description: string,
  createdAt: timestamp,
  feedbackCount: number,
  lastFeedbackAt: timestamp,
  businessOwner: string
}

// Feedback Subcollection
users/{userId}/businesses/{businessId}/feedback/{feedbackId} = {
  userId: string,
  businessId: string,
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
```

## 📧 Email Integration

### Postmark Setup

1. **Create Postmark Account**
   - Sign up at [Postmark](https://postmarkapp.com)
   - Create a server for inbound email processing

2. **Configure Inbound Email**
   - Set up inbound domain
   - Configure webhook URL pointing to your Cloud Function
   - Use the format: `feedback+{businessId}@yourdomain.com`

3. **Webhook Processing**
   - Emails are processed via Cloud Functions
   - Business ID extracted from email address
   - Feedback stored in appropriate business subcollection

## 🤖 AI Integration

### OpenAI Configuration

1. **API Setup**
   - Get OpenAI API key
   - Configure in Cloud Functions environment variables

2. **Prompt Engineering**
   - Custom prompts for feedback transformation
   - Business context integration for better results
   - Sentiment analysis and scoring

## 🎨 UI Components

### Key Pages

- **Landing Page** (`/`) - Marketing and onboarding
- **Examples Page** (`/examples`) - Interactive feedback transformation demos
- **Authentication** (`/login`, `/signup`) - User registration and login
- **Dashboard** (`/dashboard`) - Main application interface

### Component Structure

- **Auth Components**: Login forms, protected routes
- **Business Components**: Creation modal, management interface
- **Shared Components**: Header, loading states, error boundaries

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style

- ESLint configuration for React
- Prettier for code formatting
- Tailwind CSS for styling
- TypeScript interfaces for type safety

## 🚀 Deployment

### Firebase Hosting

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting
   ```

### Environment Variables

- Firebase configuration (in `firebase.js`)
- API keys managed through Firebase environment config
- Postmark webhook secrets for security

## 🔒 Security

- **Authentication**: Firebase Auth tokens for all API calls
- **Authorization**: Users can only access their own data
- **Data Validation**: Input sanitization and validation
- **Webhook Security**: Postmark signature verification
- **API Security**: Secure handling of external API keys

## 🧪 Testing

### Frontend Testing Strategy

- **Unit Tests**: Component logic testing
- **Integration Tests**: API interactions and user flows
- **E2E Tests**: Complete user journeys
- **Accessibility Tests**: WCAG compliance checking

### Manual Testing

- **Email Flow**: Test actual email processing
- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Mobile Testing**: iOS and Android devices
- **Accessibility**: Screen reader compatibility

## 📈 Performance

- **Vite**: Fast development and optimized builds
- **Code Splitting**: Lazy loading for better performance
- **Image Optimization**: Properly sized and compressed assets
- **Caching**: Efficient Firebase caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 📞 Support

For support and questions:
- Email: support@gentleinbox.com
- Documentation: [Project Wiki](link-to-wiki)
- Issues: [GitHub Issues](link-to-issues)

## 🎯 Development Status

### Phase 1: MVP ✅
- [x] User authentication system
- [x] Business management interface
- [x] Dashboard with real-time data
- [x] Firebase integration
- [x] Examples page with demos
- [x] Responsive design
- [x] Protected routing

### Phase 2: Enhanced Features
- [ ] Real-time AI processing
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Export functionality
- [ ] Advanced filtering

### Phase 3: Scale & Polish
- [ ] Multi-language support
- [ ] Advanced AI models
- [ ] Team collaboration features
- [ ] Enterprise features
- [ ] Mobile app

---

Built with ❤️ to protect business owners' mental health while maintaining valuable customer insights.