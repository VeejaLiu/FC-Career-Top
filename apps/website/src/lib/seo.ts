import type { Metadata } from 'next';

export const SITE_NAME = 'FC Career Top';
// Keep metadata, structured data, robots and the sitemap on the same origin.
export const SITE_URL = new URL(
  process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.fccareer.top'
).origin;
export const APP_URL = 'https://app.fccareer.top';
export const GITHUB_URL = 'https://github.com/VeejaLiu/FC-Career-Top';
export const SITE_DESCRIPTION =
  'Track player growth in EA FC 24, 25, 26 and 27 Career Mode. Automatically record overall ratings, potential and squad changes with Live Editor.';

export function absoluteUrl(path = '/') {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  index = true
): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const image = {
    url: absoluteUrl('/og-image.png'),
    width: 1200,
    height: 630,
    alt: 'FC Career Top — track player growth in EA FC 24, 25, 26 and 27 Career Mode',
  };

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: { index, follow: true },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
