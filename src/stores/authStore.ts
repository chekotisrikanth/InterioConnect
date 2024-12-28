import { create } from 'zustand';
import { UserProfile } from '../types/auth';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  setUser: (user: UserProfile | null) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  initialize: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Failed to fetch profile:', profileError);
          throw profileError;
        }

        set({ user: profile, error: null });
      } else {
        set({ user: null, error: null });
      }
    } catch (error: any) {
      console.error('Auth initialization error:', error);
      set({ 
        user: null, 
        error: error.message || 'Failed to initialize authentication'
      });
    } finally {
      set({ loading: false });
    }
  },
}));