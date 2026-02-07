import { Spinner } from "@/components/ui/spinner";

export default function SignInLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-soft-sage">
      <Spinner size="lg" />
    </div>
  );
}
