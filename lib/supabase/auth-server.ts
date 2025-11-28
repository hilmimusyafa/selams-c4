/**
 * Server-Side Authentication Functions
 * Hanya untuk Server Components dan Server Actions
 */

// @ts-nocheck - Types will work after database setup
import { createClient } from './server';

/**
 * Get current user (server-side)
 */
export async function getCurrentUserServer() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * Get current user profile with role (server-side)
 */
export async function getCurrentProfileServer() {
  const supabase = await createClient();
  
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

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticated() {
  try {
    const user = await getCurrentUserServer();
    return !!user;
  } catch {
    return false;
  }
}
