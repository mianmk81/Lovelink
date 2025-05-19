import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://xmgspgfritlyndzmywxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZ3NwZ2ZyaXRseW5kem15d3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMjk5NjIsImV4cCI6MjA1OTkwNTk2Mn0.UTENoNwjPbYUP13uJCd14HuvBzdoI1cMO51irL9Tjr4';

// Configure client with proper session handling
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

// Export supabase client for other modules to use
export { supabase };

// Helper function to check if we're connected
export const checkConnection = async () => {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact' }).limit(1);
    if (error) throw error;
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log('Error getting current user:', error);
      return null;
    }
    return data.user;
  } catch (error) {
    console.log('Error getting current user:', error);
    return null;
  }
};

export default supabase;
