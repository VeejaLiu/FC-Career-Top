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
    image: 'career-overview',
    height: 875,
    title: 'See who is improving',
    text: 'Ratings before and after, clear growth leaders and separate timelines for every career save.',
    alt: 'Fictional career showing rating changes and growth leaders',
  },
  {
    image: 'career-compare',
    height: 1236,
    title: 'Find the right player',
    text: 'Compare up to three players. See their positions, current ratings and strongest attributes together.',
    alt: 'Three fictional players with their best attributes highlighted',
  },
  {
    image: 'career-history',
    height: 1399,
    title: 'Follow the whole journey',
    text: 'Distinct rating and potential lines, plus recorded attribute changes between the dates you choose.',
    alt: 'Fictional player history showing overall, potential and recorded attribute changes',
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
          screenshot: absoluteUrl('/screenshots/career-overview.jpg'),
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
            Track player growth, compare your squad and keep each career save in
            its own timeline. Free, automatic and easy to check.
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
            src="/screenshots/career-overview.jpg"
            width={1265}
            height={875}
            alt="Current Career hub with fictional player growth leaders"
            priority
          />
          <figcaption>Interactive demo · Fictional squad</figcaption>
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
                width={1265}
                height={feature.height}
                alt={feature.alt}
                sizes="(max-width: 767px) 100vw, 700px"
              />
              <figcaption>Fictional demo · Current interface</figcaption>
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
            Sign in with Google or email. Keep your careers, watched players and
            notifications together.
          </p>
          <a className="marketing-button" href={`${APP_URL}/demo`}>
            Explore the demo →
          </a>
        </div>
        <figure className="marketing-mobile">
          <Image
            src="/screenshots/career-mobile.jpg"
            width={390}
            height={1322}
            alt="Current Career hub on a narrow phone screen"
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
