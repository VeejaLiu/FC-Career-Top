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
        Recent improvements to the FC Career Top player dashboard. For current
        requirements and instructions, read the{' '}
        <Link href="/get-started" className="underline">
          setup guide
        </Link>
        .
      </p>
      <article
        id="change-20261019"
        className="mb-10 rounded-lg border border-gray-300 p-5"
      >
        <time dateTime="2026-10-19">October 19, 2026</time>
        <h2 className="text-2xl font-semibold mt-2">
          A clearer view of your career
        </h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>
            Compact sync status and before-and-after ratings bring player growth
            into focus.
          </li>
          <li>
            Distinct chart legends, accurate date spacing and clearer
            comparisons on phones.
          </li>
          <li>
            Simpler navigation, a three-step connection guide and refreshed demo
            screenshots.
          </li>
        </ul>
      </article>
      <article
        id="change-20261017"
        className="mb-10 rounded-lg border border-gray-300 p-5"
      >
        <time dateTime="2026-10-17">October 17, 2026</time>
        <h2 className="text-2xl font-semibold mt-2">A home for every career</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>
            Create, rename, switch and archive separate careers, each with its
            own upload script.
          </li>
          <li>
            Confirm the first upload and see the last received game date, squad
            size and script version.
          </li>
          <li>
            Explore monthly and season growth leaders, watch players and compare
            up to three at a time.
          </li>
          <li>
            Review recorded attributes across dates and keep departed players in
            your career history. Detailed history starts with this update.
          </li>
          <li>
            Download a growth card or explore the fictional interactive demo
            without signing in.
          </li>
        </ul>
      </article>
      <article
        id="change-20261010"
        className="mb-10 rounded-lg border border-gray-300 p-5"
      >
        <p className="text-sm text-gray-500">
          <time dateTime="2026-10-10">October 10, 2026</time>
        </p>
        <h2 className="text-2xl font-semibold mt-2">
          An easier way to come back to your career
        </h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>
            Sign in with Google and see your connection status in Settings.
          </li>
          <li>
            A cleaner settings page brings account details, notification choices
            and your upload key together.
          </li>
          <li>
            Upload keys are clearly separate from account passwords, with a
            confirmation before regenerating a key.
          </li>
          <li>
            The login page is better aligned, with a smaller tutorial and
            simpler support links.
          </li>
          <li>
            The website now includes updated dashboard screenshots and a guide
            written for career-mode players.
          </li>
        </ul>
      </article>
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
