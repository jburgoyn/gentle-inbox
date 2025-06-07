import { useState, useEffect } from 'react';
import { getUserFeedback, getFeedbackStats, markFeedbackAsRead, updateFeedbackStatus } from '../utils/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useFeedback = (businessId = null) => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    thisWeek: 0,
    avgSentiment: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchFeedback();
      fetchStats();
    }
  }, [user, businessId]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const feedbackData = await getUserFeedback(user.uid, businessId);
      setFeedback(feedbackData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await getFeedbackStats(user.uid, businessId);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const markAsRead = async (feedbackId, businessId) => {
    try {
      await markFeedbackAsRead(user.uid, businessId, feedbackId);
      
      // Update local state
      setFeedback(prev => 
        prev.map(item => 
          item.id === feedbackId 
            ? { ...item, status: 'read' }
            : item
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }));
    } catch (err) {
      setError(err.message);
      console.error('Error marking feedback as read:', err);
    }
  };

  const updateStatus = async (feedbackId, status, businessId) => {
    try {
      await updateFeedbackStatus(user.uid, businessId, feedbackId, status);
      
      // Update local state
      setFeedback(prev => 
        prev.map(item => 
          item.id === feedbackId 
            ? { ...item, status }
            : item
        )
      );
      
      // Refresh stats
      await fetchStats();
    } catch (err) {
      setError(err.message);
      console.error('Error updating feedback status:', err);
    }
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'negative') return 'text-red-600 bg-red-50';
    if (sentiment === 'neutral') return 'text-yellow-600 bg-yellow-50';
    if (sentiment === 'positive') return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50'; // pending
  };

  return {
    feedback,
    stats,
    loading,
    error,
    markAsRead,
    updateStatus,
    refetch: fetchFeedback,
    getSentimentColor
  };
};