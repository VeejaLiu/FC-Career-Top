import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '../components/Breadcrumbs';
import { APP_URL, GITHUB_URL, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'Start Tracking Your EA FC Career Squad',
  'Connect your PC career, follow your player growth and keep your squad history in FC Career Top.',
  '/get-started'
);
export default function GetStartedPage() {
  return (
    <article className="container mx-auto max-w-4xl px-2 sm:px-4 py-8 leading-relaxed">
      <Breadcrumbs title="Setup guide" path="/get-started" />
      <h1 className="text-3xl sm:text-4xl font-bold">
        Start tracking your career squad
      </h1>
      <p className="mt-5 text-lg">
        Connect your Windows career once, then check your squad’s progress
        whenever you want. You can view the dashboard on your computer or phone.
      </p>
      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Before you start</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>
            EA FC on a Windows PC, with a compatible Live Editor for your game
            version.
          </li>
          <li>A loaded offline Manager Career Mode save.</li>
          <li>A free FC Career Top account and an internet connection.</li>
        </ul>
        <p className="mt-4">
          The dashboard has separate views for FC 24, 25, 26 and 27. Collecting
          data requires the matching Live Editor; console careers cannot connect
          through this setup.
        </p>
        <p className="mt-4">
          Get the matching Live Editor and follow its installation instructions:{' '}
          {[24, 25, 26, 27].map((version, index) => (
            <span key={version}>
              {index > 0 ? ' · ' : ''}
              <a
                className="underline"
                href={`https://github.com/xAranaktu/FC-${version}-Live-Editor`}
              >
                FC {version}
              </a>
            </span>
          ))}
          .
        </p>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">
          Five steps to your first squad snapshot
        </h2>
        <ol className="mt-4 list-decimal pl-6 space-y-4">
          <li>
            <strong>Sign in.</strong> Open{' '}
            <a href={APP_URL} className="underline">
              FC Career Top
            </a>{' '}
            and choose Google, or create an account with your email.
          </li>
          <li>
            <strong>Choose your FC version.</strong> Use the game selector at
            the top of the dashboard so your squad goes into the right place.
          </li>
          <li>
            <strong>Open your career.</strong> Start your game with the matching
            Live Editor and load your Manager Career Mode save.
          </li>
          <li>
            <strong>Run your personal setup script.</strong> Open{' '}
            <strong>Get Started</strong> in the dashboard and copy the script.
            In Live Editor, open <strong>Lua engine</strong>, paste it and run
            it.
          </li>
          <li>
            <strong>Check your players.</strong> Your first squad snapshot
            should appear on the <strong>Players</strong> page. Further updates
            arrive as in-game weeks pass while the script is running.
          </li>
        </ol>
        <p className="mt-4">
          Run the script again each time you reopen the game. You do not need to
          enter player ratings by hand.
        </p>
        <figure className="mt-6">
          <Image
            src="/screenshots/setup.jpg"
            alt="Latest dashboard setup guide, showing the connection steps without any private upload key"
            width={1280}
            height={590}
            className="rounded-lg w-full h-auto border"
          />
          <figcaption className="text-xs mt-2 text-gray-500">
            Latest setup screen. Your personal script is available inside your
            account.
          </figcaption>
        </figure>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">What to look at next</h2>
        <div className="mt-4 space-y-3">
          <p>
            <strong>Players:</strong> compare your whole squad by age, position,
            overall rating and potential.
          </p>
          <p>
            <strong>Trends:</strong> see how each player’s overall rating and
            potential have changed during the career.
          </p>
          <p>
            <strong>Detail:</strong> explore current abilities, PlayStyles and
            growth history for a player.
          </p>
          <p>
            <strong>Notifications:</strong> catch improvements you might
            otherwise miss between matches.
          </p>
          <p>
            <strong>Settings:</strong> check your Google connection, choose
            notification types and manage your upload key.
          </p>
        </div>
        <figure className="mt-6">
          <Image
            src="/screenshots/game-versions.jpg"
            alt="Game version selector with separate FC 24–27 views"
            width={1280}
            height={800}
            className="rounded-lg w-full h-auto border"
          />
          <figcaption className="text-xs mt-2 text-gray-500">
            Game versions stay separate. Example account shown.
          </figcaption>
        </figure>
        <figure className="mt-6">
          <Image
            src="/screenshots/languages.jpg"
            alt="Dashboard language menu supporting English, Chinese, French, German and Japanese"
            width={1280}
            height={800}
            className="rounded-lg w-full h-auto border"
          />
          <figcaption className="text-xs mt-2 text-gray-500">
            Choose the language you prefer.
          </figcaption>
        </figure>
      </section>
      <section id="troubleshooting" className="mt-10 scroll-mt-20">
        <h2 className="text-2xl font-semibold">Need a hand?</h2>
        <div className="mt-5 space-y-6">
          <div>
            <h3 className="text-xl font-semibold">
              My squad is not showing up
            </h3>
            <p className="mt-2">
              Check that you are signed in to the right account and have
              selected the matching FC version. Load your Manager Career Mode
              save, then copy and run the latest script from Get Started. Make
              sure your PC is online.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">I changed my upload key</h3>
            <p className="mt-2">
              Copy a fresh setup script and run it again. Regenerating your key
              makes the old script stop uploading. Keep the key and personal
              script private.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              A window appears briefly during upload
            </h3>
            <p className="mt-2">
              Some older Live Editor versions use a small Windows helper to send
              the data. Let it finish; check your squad in the dashboard
              afterwards.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              I want to follow more than one save
            </h3>
            <p className="mt-2">
              Create a separate career for each save in the Career hub. Copy and run
              its own script after loading the matching game save. The script stays
              bound to that career even when you switch the website view.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              Will I see every past attribute?
            </h3>
            <p className="mt-2">
              The historical charts track overall rating and potential. The
              detailed abilities show the latest uploaded snapshot.
            </p>
          </div>
        </div>
        <p className="mt-6">
          Still stuck?{' '}
          <Link href="/contact-us" className="underline">
            Contact the project
          </Link>{' '}
          or{' '}
          <a href={`${GITHUB_URL}/issues`} className="underline">
            open a GitHub issue
          </a>
          . Include your FC version and what happened, and remove private keys
          from screenshots or logs.
        </p>
      </section>
    </article>
  );
}
