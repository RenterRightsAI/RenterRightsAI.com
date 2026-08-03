import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function planFromStatus(status: Stripe.Subscription.Status): "pro" | "free" {
  return status === "active" || status === "trialing" ? "pro" : "free";
}

async function syncSubscription(
  subscription: Stripe.Subscription,
  userIdHint?: string | null
) {
  const admin = createAdminClient();
  const userId =
    userIdHint ||
    subscription.metadata?.supabase_user_id ||
    null;

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const plan = planFromStatus(subscription.status);
  const payload = {
    plan,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_subscription_status: subscription.status,
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    const { error } = await admin
      .from("profiles")
      .upsert({ id: userId, ...payload });
    if (error) throw error;
    return;
  }

  const { error } = await admin
    .from("profiles")
    .update(payload)
    .eq("stripe_customer_id", customerId);
  if (error) throw error;
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!process.env.STRIPE_SECRET_KEY || !secret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("[stripe/webhook] signature", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;
        const userId =
          session.client_reference_id ||
          session.metadata?.supabase_user_id ||
          null;
        const subId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        if (!subId) break;
        const subscription = await stripe.subscriptions.retrieve(subId);
        if (userId && !subscription.metadata?.supabase_user_id) {
          await stripe.subscriptions.update(subId, {
            metadata: { supabase_user_id: userId },
          });
        }
        await syncSubscription(subscription, userId);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscription(subscription);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe/webhook] handler", event.type, err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
