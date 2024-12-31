import { supabase } from '../supabase';
import type { User } from '../../types/user';

export class AuthService {
  async register(email: string, password: string, userData: Partial<User>) {
    try {
      console.log('Starting registration process for:', email);
      
      // 1. Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });

      if (error) {
        console.error('Supabase auth error:', error);
        if (error.message.includes('already registered')) {
          throw new Error('An account with this email already exists. Please try logging in instead.');
        }
        throw error;
      }

      if (!data.user) {
        console.error('No user data returned from signup');
        throw new Error('Registration failed - no user data returned');
      }

      console.log('User registered successfully:', data.user.id);

      // 2. Create profile based on role
      if (userData.role === 'agent') {
        const { error: profileError } = await supabase
          .from('agent_profiles')
          .insert({
            user_id: data.user.id,
            name: userData.name,
            subscription_tier: 'basic',
            subscription_status: 'trial'
          });

        if (profileError) {
          console.error('Agent profile creation error:', profileError);
          throw profileError;
        }
      } else if (userData.role === 'client') {
        const { error: profileError } = await supabase
          .from('client_profiles')
          .insert({
            user_id: data.user.id,
            name: userData.name,
            preferred_areas: [],
            preferred_contact: 'email'
          });

        if (profileError) {
          console.error('Client profile creation error:', profileError);
          throw profileError;
        }
      }

      console.log('Profile created successfully');
      return { session: data.session, user: data.user };
    } catch (err) {
      console.error('Registration process error:', err);
      throw err instanceof Error ? err : new Error('Registration failed');
    }
  }

  // ... rest of the class implementation stays the same
}

export const authService = new AuthService();