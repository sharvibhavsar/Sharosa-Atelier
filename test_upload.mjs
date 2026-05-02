process.loadEnvFile('.env');
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log("Testing upload to 'artworks' bucket...");
  const fileContent = "test";
  const { data, error } = await supabase.storage.from('artworks').upload('test.txt', fileContent, { upsert: true });
  console.log('Upload Data:', data);
  console.log('Upload Error:', error);
}

run();
