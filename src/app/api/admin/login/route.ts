import { NextResponse } from "next/server";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { str } from "@/lib/validate";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný formát." }, { status: 400 });
  }
  const password = str(body.password, 200);
  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ error: "Nesprávne heslo." }, { status: 401 });
  }
  await setSessionCookie();
  return NextResponse.json({ ok: true });
}
