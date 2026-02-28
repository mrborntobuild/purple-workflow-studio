import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../services/supabaseClient';

interface CreditTransaction {
  id: string;
  amount: number;
  balance_after: number;
  type: string;
  description: string;
  created_at: string;
}

interface CreditContextType {
  credits: number;
  totalCredits: number;
  loading: boolean;
  recentTransactions: CreditTransaction[];
  refreshCredits: () => Promise<void>;
}

const CreditContext = createContext<CreditContextType>({
  credits: 0,
  totalCredits: 0,
  loading: true,
  recentTransactions: [],
  refreshCredits: async () => {},
});

export const CreditProvider = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const [credits, setCredits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<CreditTransaction[]>([]);

  const refreshCredits = useCallback(async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/stripe/status', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
        setTotalCredits(data.totalCredits);
        setRecentTransactions(data.recentTransactions || []);
      }
    } catch (err) {
      console.error('[CreditContext] Failed to fetch credits:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);

  return (
    <CreditContext.Provider value={{ credits, totalCredits, loading, recentTransactions, refreshCredits }}>
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = () => useContext(CreditContext);
