import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // Statistics is noindex. Omit lastModified until real content dates are tracked;
  // a rebuild does not mean every page's content changed.
  return ['/', '/get-started', '/change-logs', '/posts', '/contact-us'].map(
    (path) => ({ url: absoluteUrl(path) })
  );
}
