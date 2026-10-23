import { LinkButton } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Brand";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <Wordmark className="justify-center" />
        <h1 className="mt-10 text-4xl font-semibold tracking-tight">This page doesn&apos;t exist</h1>
        <p className="mt-2 text-slate">The link may be broken, or the page may have moved.</p>
        <LinkButton href="/" className="mt-8">Back to Fluently</LinkButton>
      </div>
    </main>
  );
}
