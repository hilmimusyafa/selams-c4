/**
 * Authentication Helper Functions
 * Fungsi-fungsi untuk login, signup, logout, dan manage user authentication
 */

// @ts-nocheck - Types will work after database setup
import { createClient } from './client';

// ============================================================================
// CLIENT-SIDE AUTH (Browser/Client Components)
// ============================================================================

/**
 * Sign up new user with email and password
 */
export async function signUp(email: string, password: string, displayName: string, role: 'teacher' | 'student' = 'student') {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        role: role,
      },
    },
  });

  if (error) throw error;

  // Update profile with role after signup
  if (data.user) {
    await supabase
      .from('profiles')
      .update({ role, display_name: displayName })
      .eq('id', data.user.id);
  }

  return data;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out current user
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current user (client-side)
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * Get current user profile with role
 */
export async function getCurrentProfile() {
  const supabase = createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) throw profileError;
  return profile;
}
