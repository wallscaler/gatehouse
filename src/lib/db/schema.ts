import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  clerkId: text("clerk_id").notNull().unique(),
  paystackCustomerCode: text("paystack_customer_code"),
  email: text("email").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  paystackSubscriptionCode: text("paystack_subscription_code").notNull(),
  planCode: text("plan_code").notNull(),
  status: text("status", { enum: ["active", "cancelled", "past_due"] })
    .notNull()
    .default("active"),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
