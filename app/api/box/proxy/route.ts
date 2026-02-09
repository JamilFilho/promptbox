import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.paid) {
      return NextResponse.json({ paid: true });
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
    const stripe = new Stripe(stripeSecret, { apiVersion: "2023-08-16" });

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
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ paid: !!user.paid });
  } catch (error) {
    console.error("/api/box/proxy GET error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
