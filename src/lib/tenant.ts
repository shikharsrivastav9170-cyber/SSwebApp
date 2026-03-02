import { supabase } from "./supabaseClient";

export async function getCurrentUserWithCompany() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}
