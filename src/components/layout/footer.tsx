export function Footer() {
  return (
    <footer className="border-t border-border bg-soft-sage py-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Built with Gatehouse — Clerk + Paystack for African SaaS
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-forest transition-colors">
              Docs
            </a>
            <a href="#" className="hover:text-forest transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-forest transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
