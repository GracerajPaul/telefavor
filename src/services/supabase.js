import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase env vars (NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY) not set");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

let client;

export const supabase = new Proxy(
  {},
  {
    get(_, prop) {
      if (!client) client = getClient();
      const value = client[prop];
      return typeof value === "function" ? value.bind(client) : value;
    },
  }
);

export default supabase;
