import Link from 'next/link';
import Breadcrumbs from '../components/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';
import Change20240905 from './changes/change-20240905/Change20240905';
import Change20241203 from './changes/change-20241203/Change20241203';
import Change20241211 from './changes/change-20241211/Change20241211';

export const metadata = pageMetadata(
  'Product Updates & Changelog',
  'Read FC Career Top updates: Cloudflare hosting, email login, player-change notifications, position rankings and EA FC Career Mode growth tracking.',
  '/change-logs'
);

const ChangeLogsPage = () => {
  return (
    <div className="container max-w-4xl mx-auto px-2 sm:px-4 py-8 leading-relaxed">
      <Breadcrumbs title="Product updates" path="/change-logs" />
      <h1 className="text-3xl sm:text-4xl font-bold">
        FC Career Top product updates
      </h1>
      <p className="mt-4 mb-8">
        Feature and hosting updates for the EA FC 24 and FC 25 Career Mode
        player tracker. For current requirements and instructions, read the{' '}
        <Link href="/get-started" className="underline">
          setup guide
        </Link>
        .
      </p>
      <article id="change-20261009" className="mb-10 scroll-mt-20">
        <h2 className="text-2xl font-bold">
          Cloudflare hosting and email login
        </h2>
        <p className="mt-3">
          <time dateTime="2026-10-09">2026-10-09</time>
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>
            The website, dashboard and API run on Cloudflare, with D1 storing
            career records and realtime player-change notifications retained.
          </li>
          <li>
            Register and sign in with email and password. A username is
            generated automatically, and email verification is currently
            disabled.
          </li>
          <li>
            Local development and self-hosting instructions are consolidated in
            the project documentation.
          </li>
        </ul>
      </article>
      <div id="change-20241211">
        <Change20241211 />
      </div>
      <div id="change-20241203">
        <Change20241203 />
      </div>
      <div id="change-20240905">
        <Change20240905 />
      </div>
    </div>
  );
};

export default ChangeLogsPage;
