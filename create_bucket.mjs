process.loadEnvFile('.env');
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log("Trying to create bucket 'artworks'...");
  const { data, error } = await supabase.storage.createBucket('artworks', { public: true });
  console.log('Data:', data);
  console.log('Error:', error);
}

run();
