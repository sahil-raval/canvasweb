import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="text-center px-6">
        <h1 className="text-8xl font-serif text-primary font-bold mb-4">404</h1>
        <h2 className="text-3xl font-serif text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>
        <Link href="/">
          <Button size="lg" className="px-8">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
