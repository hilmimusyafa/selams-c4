import { createBrowserClient } from '@supabase/ssr';
import { Database } from './types';

/**
 * Supabase client untuk Client Components (Browser)
 * Gunakan ini di Client Components
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
