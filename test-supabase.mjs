import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://sdhxuatozqplovojqkds.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkaHh1YXRvenFwbG92b2pxa2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNTc3ODEsImV4cCI6MjA5MjgzMzc4MX0.Wcm4FMIBKTRSniA_KrpRJnTRUfbmQbuyrVROs2DwdEI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('artworks').select('*');
  console.log("Data:", data);
  console.log("Error:", error);
}

test();
