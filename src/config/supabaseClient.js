import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://tahybtsblydibrytpsvn.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhaHlidHNibHlkaWJyeXRwc3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwNjA0MjAsImV4cCI6MjAxNDYzNjQyMH0.0qEZZxsgjnzU7HbD9uQdkj1pPBpg1yvRJj3jsIRbznY"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase