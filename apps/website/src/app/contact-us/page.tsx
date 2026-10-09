import Link from 'next/link';
import Breadcrumbs from '../components/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'Contact & Player Tracking Support',
  'Get help with FC Career Top, report a player upload problem on GitHub, join the Discord community or contact the project by email.',
  '/contact-us'
);

function ContactUsPage() {
  return (
    <>
      <div className="container max-w-5xl mx-auto px-2 sm:px-4 py-8">
        <Breadcrumbs title="Contact and support" path="/contact-us" />
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Contact FC Career Top
        </h1>
        <p className="mb-6 leading-relaxed">
          Need help connecting Live Editor or uploading your squad? Start with
          the{' '}
          <Link href="/get-started#troubleshooting" className="underline">
            troubleshooting guide
          </Link>
          , or use one of the channels below. Include your game version and
          relevant logs when reporting a problem, with personal API keys
          removed.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-semibold dark:text-white">Github</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {/* <JoinGithub /> */}
              <a
                href="https://github.com/VeejaLiu/FC-Career-Top"
                title="Click to visit our Github"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 dark:text-blue-400"
              >
                VeejaLiu/FC-Career-Top
              </a>
            </p>
          </div>

          <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-semibold dark:text-white">Discord</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {/* <JoinDiscord /> */}
              <a
                href="https://discord.gg/aKfWAtbJ8F"
                title="Click to join our Discord"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 dark:text-blue-400"
              >
                https://discord.gg/aKfWAtbJ8F
              </a>
            </p>
          </div>

          <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-semibold dark:text-white">Email</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              <a
                href="mailto:support@fccareer.top"
                title="Click to email us"
                target="_blank"
                className="text-blue-500 dark:text-blue-400"
              >
                Mail: support@fccareer.top
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUsPage;
