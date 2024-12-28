import { supabase } from '../supabase';
import { validateCredentials } from './validation';
import { AUTH_ERRORS } from './constants';
import type { AuthResponse } from './types';

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    // Validate input
    validateCredentials(email, password);

    // Attempt authentication
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error(AUTH_ERRORS.USER_NOT_FOUND);
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      throw new Error(AUTH_ERRORS.PROFILE_NOT_FOUND);
    }

    if (!profile) {
      throw new Error(AUTH_ERRORS.PROFILE_NOT_FOUND);
    }

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        role: profile.role,
        name: profile.name,
        createdAt: profile.created_at
      },
      session: authData.session
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw {
      message: error.message || AUTH_ERRORS.AUTH_FAILED,
      status: error.status || 400
    };
  }
}