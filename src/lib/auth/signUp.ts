import { supabase } from '../supabase';
import { UserRole } from '../../types/auth';

export async function signUp(email: string, password: string, role: UserRole, userData: any) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
    },
  });

  if (authError) throw new Error(authError.message);
  if (!authData.user) throw new Error('No user returned from signup');

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email,
      role,
      name: userData.name,
    });

  if (profileError) throw new Error(profileError.message);

  // If designer, create designer profile
  if (role === 'designer') {
    const { error: designerError } = await supabase
      .from('designer_profiles')
      .insert({
        id: authData.user.id,
        bio: userData.bio,
        certifications: userData.certifications.split(',').map((c: string) => c.trim()),
        services: userData.services,
        pricing: userData.pricing,
      });

    if (designerError) throw new Error(designerError.message);

    // Create approval request
    const { error: approvalError } = await supabase
      .from('designer_approvals')
      .insert({
        designer_id: authData.user.id,
        status: 'pending',
      });

    if (approvalError) throw new Error(approvalError.message);
  }

  return authData;
}