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
  'EA FC Career Mode Player Growth Tracker',
  SITE_DESCRIPTION,
  '/'
);
const features = [
  {
    image: 'squad',
    title: 'Your whole squad, at a glance',
    text: 'See age, position, overall rating and potential together. Sort your players to spot promising prospects, compare options for a position and plan your next season.',
    alt: 'Example FC Career Top squad showing player ages, positions, ratings and potential',
  },
  {
    image: 'growth',
    title: 'See progress across the season',
    text: 'A player’s current rating tells only part of the story. Follow overall and potential over career dates to see who is improving and how your squad develops over time.',
    alt: 'Growth charts for four fictional players across an example career season',
  },
  {
    image: 'player-detail',
    title: 'Get to know each player',
    text: 'Open a player to explore their latest abilities, skill moves, weak foot and available PlayStyles. Their growth chart is there too, so you can connect today’s player with the journey so far.',
    alt: 'Player details and current attributes for fictional striker Alex Reed',
  },
  {
    image: 'notifications',
    title: 'Catch the changes you might miss',
    text: 'Get updates when a player’s overall rating, potential, skill moves or weak foot changes. Choose the notifications you care about and jump back into the players behind them.',
    alt: 'Notifications showing changes in an example career squad',
  },
];
const faq = [
  [
    'What is FC Career Top?',
    'A free companion dashboard for EA FC Manager Career Mode. It keeps a record of your squad so you can follow player development without maintaining a spreadsheet.',
  ],
  [
    'What do I need to get started?',
    'A Windows PC, EA FC 24, 25, 26 or 27, a matching Live Editor, and an FC Career Top account. The setup guide walks you through connecting your career.',
  ],
  [
    'Does it work on PlayStation or Xbox?',
    'Collecting career data requires Live Editor on Windows, so console saves cannot connect through this workflow. Once your PC squad has been uploaded, you can view the dashboard in a browser on your phone or computer.',
  ],
  [
    'How does my squad stay up to date?',
    'Run your personal setup script in Live Editor while your Manager Career Mode save is loaded. It records an initial squad snapshot and then updates as in-game weeks pass while the script is running. Run it again when you reopen the game.',
  ],
  [
    'Can I sign in with Google?',
    'Yes. Choose Google on the login screen, or use an email and password. You can see your Google connection status in Settings.',
  ],
  [
    'Can I keep different careers separate?',
    'Create separate, named careers within each FC version. Each setup script stays bound to its selected career. Existing data remains in your default career.',
  ],
];

export default function HomePage() {
  return (
    <div className="marketing-page container mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': absoluteUrl('/#website'),
          url: absoluteUrl('/'),
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          inLanguage: 'en',
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          '@id': absoluteUrl('/#application'),
          mainEntityOfPage: absoluteUrl('/'),
          name: SITE_NAME,
          url: APP_URL,
          description: SITE_DESCRIPTION,
          applicationCategory: 'GameApplication',
          operatingSystem: 'Web browser; Windows PC for career data collection',
          softwareRequirements:
            'EA FC 24–27 and a compatible Live Editor on Windows',
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
          screenshot: absoluteUrl('/screenshots/growth.jpg'),
          featureList: features.map((f) => f.title),
          sameAs: GITHUB_URL,
        }}
      />
      <section className="marketing-hero">
        <div>
          <p className="marketing-eyebrow">FOR EA FC MANAGER CAREER MODE</p>
          <h1>
            Your squad has a story.
            <br />
            <span>See how it grows.</span>
          </h1>
          <p className="marketing-lead">
            Keep track of player ratings, potential and the small changes that
            shape a season. FC Career Top turns your career squad into a clear,
            easy-to-read dashboard.
          </p>
          <div className="marketing-actions">
            <a className="marketing-button marketing-primary" href={APP_URL}>
              Start tracking for free
            </a>
            <a className="marketing-button" href={`${APP_URL}/demo`}>
              Try the demo
            </a>
          </div>
          <p className="marketing-requirement">
            Connect your career on Windows with Live Editor. View your squad on
            desktop or mobile.
          </p>
        </div>
        <figure className="marketing-hero-image">
          <Image
            src="/screenshots/growth.jpg"
            width={1280}
            height={800}
            alt="Example player growth charts in the latest FC Career Top dashboard"
            priority
          />
          <figcaption>
            Latest dashboard · Illustrative squad and career data
          </figcaption>
        </figure>
      </section>
      <div className="marketing-highlights">
        <div>
          <strong>Free to use</strong>
          <span>Start with Google or email</span>
        </div>
        <div>
          <strong>Automatic snapshots</strong>
          <span>Less manual record keeping</span>
        </div>
        <div>
          <strong>Your own career</strong>
          <span>Track what happens in your save</span>
        </div>
      </div>
      <section
        className="marketing-features"
        aria-labelledby="features-heading"
      >
        <div className="marketing-section-title">
          <p className="marketing-eyebrow">KNOW YOUR SQUAD</p>
          <h2 id="features-heading">More than today’s overall rating.</h2>
        </div>
        {features.map((feature, index) => (
          <article
            className={`marketing-feature ${index % 2 ? 'marketing-feature-reverse' : ''}`}
            key={feature.image}
          >
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
            <figure>
              <Image
                src={`/screenshots/${feature.image}.jpg`}
                width={1280}
                height={800}
                alt={feature.alt}
                sizes="(max-width: 767px) 100vw, 700px"
              />
              <figcaption>Example squad · Updated interface</figcaption>
            </figure>
          </article>
        ))}
      </section>
      <section className="marketing-setup" id="how-it-works">
        <p className="marketing-eyebrow">A SIMPLE ROUTINE</p>
        <h2>Connect once. Keep playing.</h2>
        <p>
          Run the setup script each time you reopen your career. The dashboard
          takes care of recording your squad while it is active.
        </p>
        <ol>
          <li>
            <span>01</span>
            <strong>Create your account</strong>
            <p>Sign in with Google or register with your email.</p>
          </li>
          <li>
            <span>02</span>
            <strong>Connect your PC career</strong>
            <p>
              Select your FC version and follow the Live Editor setup guide.
            </p>
          </li>
          <li>
            <span>03</span>
            <strong>Watch your players develop</strong>
            <p>
              Check your squad, growth charts and notifications as the season
              progresses.
            </p>
          </li>
        </ol>
        <Link
          className="marketing-button marketing-primary"
          href="/get-started"
        >
          Walk through the setup
        </Link>
      </section>
      <section className="marketing-access">
        <div>
          <p className="marketing-eyebrow">MADE FOR YOUR ROUTINE</p>
          <h2>Your career, wherever you check it.</h2>
          <p>
            The dashboard fits your phone and desktop. Choose English,
            Simplified Chinese, French, German or Japanese. Your uploaded player
            history follows your account.
          </p>
          <p>
            Google sign-in makes it easy to come back. Settings keeps your login
            methods, notifications and upload key in one place.
          </p>
          <Image
            src="/screenshots/settings.jpg"
            width={1280}
            height={800}
            alt="Updated settings with Google connection status, notification preferences and a concealed upload key"
          />
        </div>
        <figure className="marketing-mobile">
          <Image
            src="/screenshots/mobile.jpg"
            width={390}
            height={844}
            alt="Example squad in the responsive mobile dashboard"
          />
          <figcaption>Illustrative mobile view</figcaption>
        </figure>
      </section>
      <section className="marketing-faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading">A few things to know</h2>
        {faq.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
      <section className="marketing-final">
        <h2>Start following your squad’s progress.</h2>
        <p>
          Free to use. Built for career-mode players. Source code available on
          GitHub.
        </p>
        <div className="marketing-actions">
          <a className="marketing-button marketing-primary" href={APP_URL}>
            Open FC Career Top
          </a>
          <a className="marketing-button" href={GITHUB_URL}>
            Explore on GitHub
          </a>
          <Link className="marketing-button" href="/contact-us">
            Get help
          </Link>
        </div>
      </section>
      <p className="marketing-disclaimer">
        FC Career Top is an independent community project and is not affiliated
        with Electronic Arts. Screenshots show fictional players and
        illustrative career data.
      </p>
    </div>
  );
}
