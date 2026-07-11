import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if user has completed profile onboarding
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("disability_type")
            .eq("id", user.id)
            .single();

          if (!profile || !profile.disability_type) {
            // Incomplete profile -> redirect to registration step 2
            return NextResponse.redirect(`${origin}/register?oauth=true`);
          }
        }
      } catch (e) {
        console.error("Error checking profile completion:", e);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Gagal melakukan autentikasi Google.`);
}
