import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth/AuthService';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { session, profile } = await authService.login(email, password);

      if (!session?.user) {
        throw new Error('Login failed');
      }

      // For agents, check subscription status
      if (profile?.role === 'agent') {
        if (!profile.subscription_status || profile.subscription_status === 'inactive') {
          throw new Error('Your subscription is inactive. Please update your payment information.');
        }
      }

      setUser({
        id: session.user.id,
        email: session.user.email!,
        name: profile.name,
        role: profile.role,
        subscriptionStatus: profile.subscription_status
      });

      navigate(profile.role === 'agent' ? '/agent' : '/client');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error
  };
}