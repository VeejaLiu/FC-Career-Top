import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '../components/Breadcrumbs';
import { APP_URL, GITHUB_URL, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'FC 24–27 Player Tracking Setup Guide',
  'Set up FC Career Top with Live Editor on Windows. Connect your EA FC 24, 25, 26 or 27 career, run the Lua script and troubleshoot missing player uploads.',
  '/get-started'
);

export default function GetStartedPage() {
  return (
    <article className="container mx-auto max-w-4xl px-2 sm:px-4 py-8 leading-relaxed">
      <Breadcrumbs title="Setup guide" path="/get-started" />
      <h1 className="text-3xl sm:text-4xl font-bold">
        How to track players in EA FC 24, 25, 26 and 27 Career Mode
      </h1>
      <p className="mt-5 text-lg">
        Connect your Windows career to FC Career Top with Live Editor. The Lua
        script uploads your squad so you can follow overall ratings, potential
        and player changes in the browser.
      </p>

      <section className="mt-8" aria-labelledby="requirements">
        <h2 id="requirements" className="text-2xl font-bold">
          What you need
        </h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>EA FC 24, 25, 26 or 27 on a Windows PC.</li>
          <li>
            A compatible Live Editor:{' '}
            {[24, 25, 26, 27].map((version, index) => (
              <span key={version}>
                {index > 0 && ', '}
                <a
                  href={`https://github.com/xAranaktu/FC-${version}-Live-Editor`}
                  className="underline"
                >
                  FC {version}
                </a>
              </span>
            ))}
            . Follow that project’s installation and game-build compatibility
            instructions.
          </li>
          <li>
            An FC Career Top account and an internet connection to the dashboard
            and API.
          </li>
          <li>
            FC 24 and older editors without direct uploads require Windows curl
            and permission to write files in the Windows temporary directory.
          </li>
        </ul>
        <p className="mt-4">
          The upload workflow runs on Windows. A console career cannot execute
          this Live Editor script.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="connect-career">
        <h2 id="connect-career" className="text-2xl font-bold">
          Connect your career in seven steps
        </h2>
        <ol className="mt-4 list-decimal pl-6 space-y-3">
          <li>
            Open the{' '}
            <a href={APP_URL} className="underline">
              FC Career Top dashboard
            </a>
            .
          </li>
          <li>
            Register with an email and password, then sign in with those
            credentials.
          </li>
          <li>Select FC 24, 25, 26 or 27 in the game-version selector.</li>
          <li>
            Start the matching game through Live Editor and load your Manager
            Career Mode save.
          </li>
          <li>
            Open <strong>Get Started</strong> in the dashboard and copy the
            generated Lua script.
          </li>
          <li>
            Open Live Editor’s <strong>Lua engine</strong>, paste the script and
            execute it.
          </li>
          <li>
            Check the <strong>Players</strong> page for the first snapshot.
            Further uploads happen as in-game weeks pass while the script’s
            event handler is active.
          </li>
        </ol>
        <p className="mt-4">
          Your script includes your personal API key. Keep it private. After
          refreshing the key in Settings, copy and run the new script.
        </p>
        <Image
          src="/feature/get_started.webp"
          alt="FC Career Top Get Started page containing the generated Lua tracking script"
          width={1280}
          height={718}
          className="mt-6 rounded-lg w-full h-auto"
        />
      </section>

      <section className="mt-10" aria-labelledby="explore-squad">
        <h2 id="explore-squad" className="text-2xl font-bold">
          Read your squad’s development
        </h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>
            <strong>Players:</strong> search and sort the squad, compare ratings
            and potential, and find position-ranking badges.
          </li>
          <li>
            <strong>Player Trends:</strong> follow overall rating and potential
            across career dates.
          </li>
          <li>
            <strong>Player Detail:</strong> inspect current attributes,
            available PlayStyles and a player’s growth chart.
          </li>
          <li>
            <strong>Notifications:</strong> see changes to overall rating,
            potential, skill moves and weak foot.
          </li>
          <li>
            <strong>Settings:</strong> choose notification types and manage your
            account and API key.
          </li>
        </ul>
        <p className="mt-4">
          The dashboard supports English, Simplified Chinese, French, German and
          Japanese. FC 24–27 records are selected separately.
        </p>
      </section>

      <section
        id="troubleshooting"
        className="mt-10 scroll-mt-20"
        aria-labelledby="troubleshooting-heading"
      >
        <h2 id="troubleshooting-heading" className="text-2xl font-bold">
          Troubleshooting and current limitations
        </h2>
        <div className="mt-5 space-y-6">
          <div>
            <h3 className="text-xl font-semibold">
              Why are my players missing?
            </h3>
            <p className="mt-2">
              Check the selected game version, load your Manager Career Mode
              save, inspect Live Editor’s logs and confirm the script’s upload
              URL is reachable from your Windows PC.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              Why does a command window appear?
            </h3>
            <p className="mt-2">
              Compatible editors upload directly. Editors without that feature
              use Windows curl and temporary files. The command window can
              briefly take focus; let the upload finish.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              How do I fix “Permission denied”?
            </h3>
            <p className="mt-2">
              Allow the curl fallback to write in the Windows temporary directory.
              Direct uploads do not need temporary files.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              Can I track several saves or every historical attribute?
            </h3>
            <p className="mt-2">
              There is no multi-save selector. Use one career per account and
              game version. Historical charts track overall rating and
              potential; detailed attributes show the current snapshot.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              Can I combine this with other Lua scripts?
            </h3>
            <p className="mt-2">
              The tracking script replaces only its own listener when run again.
              Other scripts keep their listeners. When upgrading from the older
              tracking script, restart the game before running the new script.
            </p>
          </div>
        </div>
        <p className="mt-6">
          For self-hosted installations and networking between computers, see
          the{' '}
          <a
            href={`${GITHUB_URL}/blob/master/docs/DEVELOPMENT.md`}
            className="underline"
          >
            development guide
          </a>
          . For help,{' '}
          <Link href="/contact-us" className="underline">
            contact the project
          </Link>{' '}
          or open a{' '}
          <a href={`${GITHUB_URL}/issues`} className="underline">
            GitHub issue
          </a>{' '}
          with the game version and relevant logs, with API keys removed.
        </p>
      </section>
    </article>
  );
}
