import { eq } from "drizzle-orm";
import { db } from "./index";
import { users, subscriptions } from "./schema";
import type { NewUser, NewSubscription } from "./schema";

export async function getUserByClerkId(clerkId: string) {
  const result = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  return result[0] || null;
}

export async function createUser(data: NewUser) {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}

export async function updateUserPaystackCode(clerkId: string, paystackCustomerCode: string) {
  await db
    .update(users)
    .set({ paystackCustomerCode })
    .where(eq(users.clerkId, clerkId));
}

export async function deleteUserByClerkId(clerkId: string) {
  await db.delete(users).where(eq(users.clerkId, clerkId));
}

export async function getSubscriptionByUserId(userId: string) {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);
  return result[0] || null;
}

export async function getActiveSubscription(userId: string) {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);
  const sub = result[0];
  if (sub && sub.status === "active") return sub;
  return null;
}

export async function createSubscription(data: NewSubscription) {
  const result = await db.insert(subscriptions).values(data).returning();
  return result[0];
}

export async function updateSubscriptionStatus(
  paystackSubscriptionCode: string,
  status: "active" | "cancelled" | "past_due"
) {
  await db
    .update(subscriptions)
    .set({ status })
    .where(eq(subscriptions.paystackSubscriptionCode, paystackSubscriptionCode));
}

export async function getSubscriptionByPaystackCode(code: string) {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.paystackSubscriptionCode, code))
    .limit(1);
  return result[0] || null;
}
