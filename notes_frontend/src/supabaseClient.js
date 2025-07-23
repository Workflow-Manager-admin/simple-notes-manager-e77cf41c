import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * Returns a configured Supabase client for app-wide usage.
 * Uses env vars: REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY.
 */
export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);
