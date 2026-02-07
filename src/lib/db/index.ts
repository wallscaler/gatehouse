import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

let _db: BetterSQLite3Database<typeof schema> | null = null;

function getDbPath() {
  return (process.env.DATABASE_URL || "file:./polaris.db").replace("file:", "");
}

function initDb(): BetterSQLite3Database<typeof schema> {
  const sqlite = new Database(getDbPath());
  sqlite.pragma("journal_mode = WAL");

  // Create tables if they don't exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      clerk_id TEXT NOT NULL UNIQUE,
      paystack_customer_code TEXT,
      email TEXT NOT NULL,
      created_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      paystack_subscription_code TEXT NOT NULL,
      plan_code TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      current_period_end INTEGER,
      created_at INTEGER DEFAULT (unixepoch())
    );
  `);

  return drizzle(sqlite, { schema });
}

export function getDb(): BetterSQLite3Database<typeof schema> {
  if (!_db) {
    _db = initDb();
  }
  return _db;
}

// Re-export as db for convenience — lazy accessor via Proxy
export const db: BetterSQLite3Database<typeof schema> = new Proxy({} as BetterSQLite3Database<typeof schema>, {
  get(_target, prop) {
    const instance = getDb();
    const value = instance[prop as keyof typeof instance];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
