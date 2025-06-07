import { doc, setDoc, collection, getDocs, query, orderBy, where, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// User management
export const createUserDocument = async (user) => {
  const userRef = doc(db, 'users', user.uid);
  const userData = {
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    createdAt: serverTimestamp(),
    subscription: {
      plan: 'free',
      emailsUsed: 0,
      emailsLimit: 100,
      resetDate: serverTimestamp()
    },
    preferences: {
      showOriginal: false,
      emailNotifications: true,
      sentimentThreshold: 0
    }
  };

  try {
    await setDoc(userRef, userData);
    return userData;
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

// Business management
export const createBusiness = async (userId, businessData) => {
  const businessId = generateBusinessId();
  const businessDocRef = doc(db, 'users', userId, 'businesses', businessId);
  
  const newBusiness = {
    id: businessId,
    name: businessData.name,
    description: businessData.description,
    createdAt: serverTimestamp(),
    feedbackCount: 0,
    lastFeedbackAt: null,
    businessOwner: userId
  };

  try {
    await setDoc(businessDocRef, newBusiness);
    return newBusiness;
  } catch (error) {
    console.error('Error creating business:', error);
    throw error;
  }
};

export const getUserBusinesses = async (userId) => {
  const businessesRef = collection(db, 'users', userId, 'businesses');
  const q = query(businessesRef, orderBy('createdAt', 'desc'));

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      docId: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
};

// Generate unique business ID for email routing
export const generateBusinessId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Generate business email with ID
export const generateBusinessEmail = (businessId) => {
  return `feedback+${businessId}@gentleinbox.com`;
};

// Feedback management
export const getUserFeedback = async (userId, businessId = null) => {
  if (!businessId || !userId) {
    return [];
  }

  const feedbackRef = collection(db, 'users', userId, 'businesses', businessId, 'feedback');
  
  // Build query with optional business filter
  const constraints = [orderBy('receivedAt', 'desc')];
  if (businessId) {
    constraints.unshift(where('businessId', '==', businessId));
  }
  
  const q = query(feedbackRef, ...constraints);

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to Date objects
      receivedAt: doc.data().receivedAt?.toDate(),
      processedAt: doc.data().processedAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};

export const markFeedbackAsRead = async (userId, businessId, feedbackId) => {
  const feedbackRef = doc(db, 'users', userId, 'businesses', businessId, 'feedback', feedbackId);
  
  try {
    await updateDoc(feedbackRef, {
      status: 'read'
    });
  } catch (error) {
    console.error('Error marking feedback as read:', error);
    throw error;
  }
};

export const updateFeedbackStatus = async (userId, businessId, feedbackId, status) => {
  const feedbackRef = doc(db, 'users', userId, 'businesses', businessId, 'feedback', feedbackId);
  
  try {
    await updateDoc(feedbackRef, {
      status
    });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    throw error;
  }
};

// Get feedback statistics for a user or business
export const getFeedbackStats = async (userId, businessId = null) => {
  if (!businessId || !userId) {
    return {
      total: 0,
      unread: 0,
      thisWeek: 0,
      avgSentiment: 0
    };
  }

  const feedbackRef = collection(db, 'users', userId, 'businesses', businessId, 'feedback');
  
  const constraints = [];
  if (businessId) {
    constraints.push(where('businessId', '==', businessId));
  }
  
  const q = query(feedbackRef, ...constraints);

  try {
    const querySnapshot = await getDocs(q);
    const feedback = querySnapshot.docs.map(doc => doc.data());
    
    const total = feedback.length;
    const unread = feedback.filter(f => f.status === 'unread').length;
    const thisWeek = feedback.filter(f => {
      const receivedAt = f.receivedAt?.toDate();
      if (!receivedAt) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return receivedAt >= weekAgo;
    }).length;
    
    // Calculate average sentiment (only for processed feedback)
    const processedFeedback = feedback.filter(f => f.sentiment?.transformed?.score !== undefined);
    const avgSentiment = processedFeedback.length > 0 
      ? processedFeedback.reduce((sum, f) => sum + f.sentiment.transformed.score, 0) / processedFeedback.length
      : 0;

    return {
      total,
      unread,
      thisWeek,
      avgSentiment: Math.round(avgSentiment * 100) / 100 // Round to 2 decimal places
    };
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    throw error;
  }
};