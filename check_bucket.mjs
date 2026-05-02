process.loadEnvFile('.env');
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log("Checking bucket...");
  const { data, error } = await supabase.storage.getBucket('artworks');
  console.log('Get Bucket Data:', data);
  console.log('Get Bucket Error:', error);
}

run();
