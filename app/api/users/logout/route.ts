import { getSessionCookieConfig } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
  const cookie = getSessionCookieConfig();
  const response = NextResponse.json({ message: "Logout realizado com sucesso" });

  response.cookies.set(cookie.name, "", {
    ...cookie.options,
    maxAge: 0,
  });

  return response;
}
