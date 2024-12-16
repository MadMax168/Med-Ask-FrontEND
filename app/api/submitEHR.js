import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase project credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// /pages/api/submitEHR.js
export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ message: "API is working!" });
  }
  return res.status(405).json({ message: "Method not allowed." });
}
