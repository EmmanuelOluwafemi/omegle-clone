import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://ekgmyewaezfslwvhwdhf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZ215ZXdhZXpmc2x3dmh3ZGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDcyNjA0MTYsImV4cCI6MTk2MjgzNjQxNn0.qpOz-qpMCH_ZiK00BW2bAuolrkmdcG626wfyBAu1dyo"
)