process.loadEnvFile('.env');
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('artworks').insert({
    title: 'Test',
    short_description: 'Test',
    section: 'traditional',
    image_url: 'https://example.com/test.jpg'
  });
  console.log('Data:', data);
  console.log('Error:', error);
}

run();
