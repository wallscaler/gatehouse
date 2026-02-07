import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-soft-sage">
      <SignUp
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
