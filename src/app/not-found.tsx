import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="font-heading text-6xl font-bold text-primary-600">404</h1>
      <h2 className="mt-4 font-heading text-2xl font-bold text-neutral-800">Page Not Found</h2>
      <p className="mt-2 text-neutral-500 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
        <Link href="/products">
          <Button variant="outline">Shop Products</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline">Contact Us</Button>
        </Link>
      </div>
    </div>
  );
}