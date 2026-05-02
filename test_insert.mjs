import { createClient } from '@supabase/supabase-js'; 
const supabase = createClient('https://sdhxuatozqplovojqkds.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkaHh1YXRvenFwbG92b2pxa2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNTc3ODEsImV4cCI6MjA5MjgzMzc4MX0.Wcm4FMIBKTRSniA_KrpRJnTRUfbmQbuyrVROs2DwdEI'); 
async function test() { 
  const { data, error } = await supabase.from('artworks').insert({title: 'Test', short_description: 'Test', section: 'traditional', image_url: 'test'}); 
  console.log(error); 
} 
test();
