export const dynamic = "force-dynamic";

import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-moss">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border border-border rounded-xl",
            formButtonPrimary: "bg-forest hover:bg-evergreen",
          },
        }}
      />
    </div>
  );
}
