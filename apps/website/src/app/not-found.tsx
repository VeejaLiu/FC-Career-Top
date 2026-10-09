import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Page Not Found | FC Career Top' },
  description:
    'This page could not be found. Explore FC Career Top or read the player tracking setup guide.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-4">This address does not match an FC Career Top page.</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/" className="underline">
          Return to the homepage
        </Link>
        <Link href="/get-started" className="underline">
          Read the setup guide
        </Link>
      </div>
    </div>
  );
}
