import { getPrismaClient } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createSessionToken, getSessionCookieConfig } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });
    }

    const token = createSessionToken({ userId: user.id, email: user.email });
    const cookie = getSessionCookieConfig();

    const response = NextResponse.json(
      {
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          paid: user.paid,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );

    response.cookies.set(cookie.name, token, cookie.options);

    return response;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}
