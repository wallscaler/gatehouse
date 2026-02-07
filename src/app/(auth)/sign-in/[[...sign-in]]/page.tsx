import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-soft-sage">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-forest hover:bg-evergreen",
            footerActionLink: "text-forest hover:text-evergreen",
          },
        }}
      />
    </div>
  );
}
