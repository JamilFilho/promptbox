import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import Stripe from "stripe";
import { getSessionCookieName, verifySessionToken } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(getSessionCookieName())?.value;
    const sessionData = verifySessionToken(token);

    if (!sessionData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({ where: { id: sessionData.userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.paid) {
      return NextResponse.json({ paid: true });
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
    const stripe = new Stripe(stripeSecret, { apiVersion: "2026-01-28.clover" });

    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Account creation - PromptBox" },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      metadata: { userId: user.id },
      success_url: `${base}/box?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/box?cancel=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("/api/box/proxy error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(getSessionCookieName())?.value;
    const sessionData = verifySessionToken(token);

    if (!sessionData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({ where: { id: sessionData.userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ paid: !!user.paid });
  } catch (error) {
    console.error("/api/box/proxy GET error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
