import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '../components/Breadcrumbs';
import { APP_URL, GITHUB_URL, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'Start Tracking Your EA FC Career Squad',
  'Connect your Windows career in three steps, then follow your squad on any device.',
  '/get-started'
);
const steps = [
  [
    'Open your career',
    'Launch FC with the matching Live Editor and load your Manager Career save. Select the same FC version and career in the dashboard.',
  ],
  [
    'Copy and run your script',
    'Open Get Started in the dashboard. Copy your personal script, then paste and run it in Live Editor → Lua engine.',
  ],
  [
    'View your squad',
    'Your first upload appears automatically. Open Players to explore the squad, or Career hub to see growth and comparisons.',
  ],
];
const help = [
  [
    'My squad is not showing up',
    'Check the selected FC version and career. Load the matching save, then copy and run its current script. Your PC needs an internet connection.',
  ],
  [
    'I want to follow more than one save',
    'Create a named career for each save in Career hub. Each script stays bound to that career, even when you switch the website view.',
  ],
  [
    'Can I see past attributes?',
    'Open a player’s Growth history to compare recorded attributes, positions and PlayStyles between dates. Detailed history starts with the October 17, 2026 update; missing older values are not estimated. Departed players remain in Career hub → History.',
  ],
  [
    'I changed my upload key',
    'Copy a fresh script from Get Started and run it again. Keep the script private: it contains your upload key.',
  ],
  [
    'A small window appears during upload',
    'Some older Live Editor versions use a Windows helper. Let it finish, then check the dashboard.',
  ],
];
export default function GetStartedPage() {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-8 leading-relaxed">
      <Breadcrumbs title="Setup guide" path="/get-started" />
      <h1 className="text-3xl sm:text-4xl font-bold">
        Your career, connected.
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Set up on a Windows PC. Check your squad on any device.
      </p>
      <div className="mt-6 rounded-xl bg-green-50 border border-green-100 p-5 text-gray-800">
        <strong>Before you start</strong>
        <p className="mt-2 text-sm">
          EA FC 24–27 · Windows · Matching Live Editor · Free account
        </p>
        <p className="mt-2 text-sm">
          Sign in with Google or email. Console saves cannot connect.
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          {[24, 25, 26, 27].map((version) => (
            <a
              key={version}
              className="underline underline-offset-4 text-green-800"
              href={`https://github.com/xAranaktu/FC-${version}-Live-Editor`}
            >
              FC {version} Live Editor ↗
            </a>
          ))}
        </div>
      </div>
      <ol className="mt-8 space-y-4">
        {steps.map(([title, text], index) => (
          <li
            className="flex gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
            key={title}
          >
            <span className="flex-none flex items-center justify-center rounded-full bg-green-100 text-green-800 w-8 h-8 text-sm font-semibold">
              {index + 1}
            </span>
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {text}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        Run the script again after reopening the game. Further snapshots arrive
        as in-game weeks pass.
      </p>
      <a
        className="inline-flex mt-6 rounded-lg bg-[#20824d] hover:bg-[#196a3e] text-white px-5 py-3 text-sm font-semibold"
        href={`${APP_URL}/get-started`}
      >
        Open connection guide →
      </a>
      <figure className="mt-8">
        <Image
          src="/screenshots/career-overview.jpg"
          alt="Current Career hub with compact upload confirmation and fictional growth leaders"
          width={1265}
          height={875}
          className="rounded-xl border border-gray-200 w-full h-auto"
        />
        <figcaption className="text-xs text-gray-500 mt-2">
          What to expect after connecting · Fictional demo data
        </figcaption>
      </figure>
      <section className="mt-10" aria-labelledby="explore-title">
        <h2 id="explore-title" className="text-2xl font-semibold">
          Find your way around
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-5">
          {[
            ['Career hub', 'Growth leaders, comparisons and share cards.'],
            [
              'Players',
              'Your squad, trends and each player’s abilities and history.',
            ],
            ['Get Started', 'Your career’s script and upload confirmation.'],
          ].map(([title, text]) => (
            <div key={title} className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section id="troubleshooting" className="mt-10 scroll-mt-20">
        <h2 className="text-2xl font-semibold mb-4">Need a hand?</h2>
        {help.map(([question, answer]) => (
          <details
            className="border-b border-gray-200 dark:border-gray-700 py-4"
            key={question}
          >
            <summary className="cursor-pointer font-medium">{question}</summary>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {answer}
            </p>
          </details>
        ))}
        <p className="mt-6 text-sm">
          <Link href="/contact-us" className="underline">
            Contact us
          </Link>{' '}
          or{' '}
          <a href={`${GITHUB_URL}/issues`} className="underline">
            open a GitHub issue
          </a>
          . Remove private keys from screenshots and logs.
        </p>
      </section>
    </article>
  );
}
