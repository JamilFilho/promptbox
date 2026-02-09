import { getPrismaClient } from "@/lib/prisma";
import { getSessionCookieName, verifySessionToken } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const prisma = getPrismaClient();

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      nome: true,
      email: true,
      paid: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user });
}
