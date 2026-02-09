import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPrismaClient } from "@/lib/prisma";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = new Stripe(stripeSecret, { apiVersion: "2026-01-28.clover" });

  try {
    const buf = Buffer.from(await request.arrayBuffer());
    const sig = request.headers.get("stripe-signature") || "";

    let event: Stripe.Event;

    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } else {
      // If no webhook secret provided, parse the body (less secure)
      event = JSON.parse(buf.toString());
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId as string | undefined;

      if (userId) {
        const prisma = getPrismaClient();
        await prisma.user.update({
          where: { id: userId },
          data: {
            paid: true,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
