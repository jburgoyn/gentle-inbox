export interface SentimentScore {
    score: number; // Sentiment score between -1 and 1
    label: "negative" | "neutral" | "positive" | "pending";
  }
  
  export interface FeedbackSentiment {
    original: SentimentScore;
    transformed: SentimentScore;
  }
  
  export interface FeedbackMetadata {
    postmarkMessageId: string;
    transformationModel: string;
    processingTime: number;
    wasTransformed: boolean;
  }
  
  export type FeedbackStatus = "unread" | "read" | "archived";
  
  export interface Feedback {
    id: string; // Document ID
    userId: string; // User ID who owns this feedback
    businessId?: string; // Business ID this feedback belongs to (optional for backwards compatibility)
    originalText: string;
    transformedText: string;
    senderEmail: string;
    senderName: string;
    subject: string;
    receivedAt: Date;
    processedAt: Date | null;
    sentiment: FeedbackSentiment;
    metadata: FeedbackMetadata;
    status: FeedbackStatus;
    tags: string[];
  }
  
  export interface FeedbackStats {
    total: number;
    unread: number;
    thisWeek: number;
    avgSentiment: number;
  }