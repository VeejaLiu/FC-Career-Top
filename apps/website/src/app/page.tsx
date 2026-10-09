import Image from 'next/image';
import Link from 'next/link';
import JsonLd from './components/JsonLd';
import {
  absoluteUrl,
  APP_URL,
  GITHUB_URL,
  pageMetadata,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@/lib/seo';
import './page.css';

export const metadata = pageMetadata(
  'EA FC 24 & FC 25 Career Mode Player Tracker',
  SITE_DESCRIPTION,
  '/'
);

const features = [
  {
    src: '/feature/multi_version.webp',
    width: 988,
    height: 540,
    title: 'Track EA FC 24 and FC 25 careers',
    alt: 'Game-version selector for separate FC 24 and FC 25 player data',
    paragraph:
      'Choose EA FC 24 or FC 25 in the dashboard. Player records are kept separately by account and game version, so you can follow your squad in the matching Manager Career Mode.',
  },
  {
    src: '/feature/automated_efficiency.webp',
    width: 1168,
    height: 726,
    title: 'Automatically record your squad',
    alt: 'Live Editor Lua engine running the FC Career Top player tracking script',
    paragraph:
      'Run your account’s Lua script in Live Editor to upload an initial squad snapshot. While the script is active, it records further snapshots as in-game weeks pass, without entering player ratings by hand.',
  },
  {
    src: '/feature/player_trends.webp',
    width: 1280,
    height: 718,
    title: 'Follow overall rating and potential growth',
    alt: 'Player growth charts showing overall ratings and potential over career dates',
    paragraph:
      'Compare overall rating and potential across career dates. Growth charts help you see which players are developing, plan squad rotation and decide who to keep for the next season.',
  },
  {
    src: '/feature/player_list.webp',
    width: 1280,
    height: 718,
    title: 'Compare your players at a glance',
    alt: 'Squad list with player age, position, overall rating, potential and ranking medals',
    paragraph:
      'Search and sort your squad by age, position, overall rating and potential. Gold, silver and bronze badges highlight the top three players for each position by overall rating or potential.',
  },
  {
    src: '/feature/player_detail.webp',
    width: 1280,
    height: 718,
    title: 'Inspect player attributes and PlayStyles',
    alt: 'Player detail page displaying current attributes, PlayStyles and a growth chart',
    paragraph:
      'View a player’s current attributes, skill moves, weak foot and available PlayStyles alongside their overall rating and potential history. Detailed attributes describe the latest snapshot.',
  },
  {
    src: '/feature/notifications.webp',
    width: 1280,
    height: 718,
    title: 'Get notified when players improve',
    alt: 'Notifications for player overall rating, potential, skill-move and weak-foot changes',
    paragraph:
      'Receive notifications when an uploaded snapshot changes a player’s overall rating, potential, skill moves or weak foot. Choose which notification types you want in Settings.',
  },
  {
    src: '/feature/settings.webp',
    width: 1280,
    height: 718,
    title: 'Manage your account and tracking settings',
    alt: 'Account settings with notification preferences and API key controls',
    paragraph:
      'Manage your email, password, API key and notification preferences. If you refresh your API key, copy the new script from Get Started and run it in Live Editor.',
  },
  {
    src: '/feature/get_started.webp',
    width: 1280,
    height: 718,
    title: 'Connect your career with Live Editor',
    alt: 'Get Started page with the account-specific Lua script and setup instructions',
    paragraph:
      'Create an account, select your game version and copy your personal Lua script from the dashboard. Our setup guide covers requirements, the first upload and common connection problems.',
  },
  {
    src: '/feature/multi_language.webp',
    width: 1280,
    height: 799,
    title: 'Use the dashboard in five languages',
    alt: 'Dashboard language selection for English, Chinese, French, German and Japanese',
    paragraph:
      'The player dashboard supports English, Simplified Chinese, French, German and Japanese. Choose your preferred interface language while tracking the same career data.',
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-2 sm:px-4 max-w-6xl py-8">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': absoluteUrl('/#website'),
              url: absoluteUrl('/'),
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              inLanguage: 'en',
            },
            {
              '@type': 'WebApplication',
              '@id': absoluteUrl('/#application'),
              name: SITE_NAME,
              url: APP_URL,
              description: SITE_DESCRIPTION,
              applicationCategory: 'GameApplication',
              operatingSystem:
                'Web browser; Windows PC for game data collection',
              softwareRequirements:
                'EA FC 24 or EA FC 25 and a compatible Live Editor on Windows',
              offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
              sameAs: GITHUB_URL,
              screenshot: absoluteUrl('/feature/player_trends.webp'),
              featureList: features.map((feature) => feature.title),
              mainEntityOfPage: absoluteUrl('/'),
            },
          ],
        }}
      />

      <section className="mb-8 p-6 sm:p-10 rounded-lg shadow-lg bg-gradient-to-r from-gray-700 to-gray-900 text-white">
        <p className="mb-3 text-sm font-semibold text-green-300">
          Free · Automatic · Open source
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight title">
          Track player growth in EA FC Career Mode
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed">
          FC Career Top automatically records your squad in EA FC 24 and FC 25
          Manager Career Mode. Follow overall ratings and potential across
          seasons, compare player attributes and see when your players improve.
        </p>
        <p className="mt-4 text-gray-200">
          Data collection requires a Windows PC and a compatible Live Editor.
          View your uploaded squad in the web dashboard.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href={APP_URL}
            className="rounded-lg bg-[#94f17a] px-5 py-3 font-semibold text-black"
          >
            Open player dashboard
          </a>
          <Link
            href="/get-started"
            className="rounded-lg border border-white px-5 py-3 font-semibold"
          >
            Read the setup guide
          </Link>
        </div>
      </section>

      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-3xl font-bold mb-6">
          Career Mode tracking features
        </h2>
        {features.map((feature, index) => (
          <section
            key={feature.src}
            className={`flex flex-col md:flex-row items-center gap-4 w-full mb-8 p-4 sm:p-6 rounded-lg shadow-lg ${index % 2 === 0 ? 'bg-gradient-to-r from-blue-800 to-purple-900' : 'md:flex-row-reverse bg-gradient-to-r from-green-900 to-teal-900'}`}
          >
            <div className="w-full md:w-1/2 shrink-0">
              <Image
                className="rounded-lg w-full h-auto"
                src={feature.src}
                alt={feature.alt}
                width={feature.width}
                height={feature.height}
                priority={index === 0}
              />
            </div>
            <div className="w-full md:w-1/2 p-2 text-white">
              <h3 className="text-2xl font-bold title">{feature.title}</h3>
              <p className="mt-3 leading-relaxed text">{feature.paragraph}</p>
              {feature.src === '/feature/get_started.webp' && (
                <Link
                  href="/get-started"
                  className="inline-block mt-4 font-semibold underline"
                >
                  How to set up FC Career Top
                </Link>
              )}
            </div>
          </section>
        ))}
      </section>

      <section className="my-10" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-bold mb-6">
          Frequently asked questions
        </h2>
        <div className="space-y-6 leading-relaxed">
          <div>
            <h3 className="text-xl font-semibold">Is FC Career Top free?</h3>
            <p className="mt-2">
              Yes. The hosted player tracker is free to use, and the source code
              is available on{' '}
              <a href={GITHUB_URL} className="underline">
                GitHub
              </a>
              .
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              Which EA FC versions and platforms are supported?
            </h3>
            <p className="mt-2">
              Game data collection supports EA FC 24 and FC 25 on Windows with
              Live Editor. Console careers cannot run this Windows Lua upload
              workflow. You can view uploaded records in a web browser.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              How often are player records updated?
            </h3>
            <p className="mt-2">
              The Lua script uploads once when it starts, then records new
              snapshots as in-game weeks pass while its event handler is active.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              Can I track several career saves?
            </h3>
            <p className="mt-2">
              There is no separate save selector. Use one career per account and
              game version to avoid mixing player history. The{' '}
              <Link href="/get-started#troubleshooting" className="underline">
                setup and troubleshooting guide
              </Link>{' '}
              explains other current limitations.
            </p>
          </div>
        </div>
      </section>

      <section className="my-10" aria-labelledby="resources-heading">
        <h2 id="resources-heading" className="text-2xl font-bold mb-4">
          Learn more about FC Career Top
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="/get-started" className="underline">
              Set up Live Editor and connect your first career
            </Link>
          </li>
          <li>
            <Link href="/change-logs" className="underline">
              Read product updates and feature history
            </Link>
          </li>
          <li>
            <Link href="/posts" className="underline">
              Browse EA FC Career Mode guides and articles
            </Link>
          </li>
          <li>
            <Link href="/contact-us" className="underline">
              Get help or report a problem
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
