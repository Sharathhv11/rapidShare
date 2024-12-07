import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPERBASE_URL
const supabaseKey = process.env.SUPERBASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

