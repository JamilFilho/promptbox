import { getPrismaClient } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createSessionToken, getSessionCookieConfig } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { nome, email, password } = await request.json();

    if (!nome || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    const prisma = getPrismaClient();
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        paid: true,
        createdAt: true,
      },
    });

    const token = createSessionToken({ userId: user.id, email: user.email });
    const cookie = getSessionCookieConfig();

    const response = NextResponse.json(
      {
        message: "Usuário registrado com sucesso",
        user,
      },
      { status: 201 }
    );

    response.cookies.set(cookie.name, token, cookie.options);

    return response;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json({ error: "Erro ao registrar usuário" }, { status: 500 });
  }
}
