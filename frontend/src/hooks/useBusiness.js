import { useState, useEffect } from 'react';
import { getUserBusinesses, createBusiness } from '../utils/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useBusiness = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchBusinesses();
    }
  }, [user]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const userBusinesses = await getUserBusinesses(user.uid);
      setBusinesses(userBusinesses);
      
      // Auto-select first business if none selected
      if (userBusinesses.length > 0 && !selectedBusiness) {
        setSelectedBusiness(userBusinesses[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBusiness = async (businessData) => {
    try {
      const newBusiness = await createBusiness(user.uid, businessData);
      setBusinesses(prev => [newBusiness, ...prev]);
      setSelectedBusiness(newBusiness);
      return newBusiness;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const selectBusiness = (business) => {
    setSelectedBusiness(business);
  };

  return {
    businesses,
    selectedBusiness,
    loading,
    error,
    addBusiness,
    selectBusiness,
    refetch: fetchBusinesses
  };
};