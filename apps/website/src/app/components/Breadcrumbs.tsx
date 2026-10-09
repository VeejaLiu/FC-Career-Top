import Link from 'next/link';
import { absoluteUrl } from '@/lib/seo';
import JsonLd from './JsonLd';

export default function Breadcrumbs({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumb mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: absoluteUrl('/'),
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: title,
              item: absoluteUrl(path),
            },
          ],
        }}
      />
    </>
  );
}
