import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const message =
    body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) return NextResponse.json({ ok: true });

  const phone = message.from;
  const text = message.text?.body || "";

  // Find company (basic example)
  const companyId = process.env.DEFAULT_COMPANY_ID!;

  await supabase.from("leads").insert({
    company_id: companyId,
    name: "WhatsApp Lead",
    phone,
    message: text,
    status: "new",
  });

  return NextResponse.json({ success: true });
}
