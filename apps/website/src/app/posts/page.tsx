import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '../components/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'EA FC Career Mode Guides & Articles',
  'Learn to track EA FC 24, 25, 26 and 27 player growth with Live Editor, and read a guide to importing legendary players into FC 24 Career Mode.',
  '/posts'
);

export default function PostsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-2 sm:px-4 py-8">
      <Breadcrumbs title="Guides and articles" path="/posts" />
      <h1 className="text-3xl sm:text-4xl font-bold">
        EA FC Career Mode guides and articles
      </h1>
      <p className="mt-4 mb-8 text-lg leading-relaxed">
        Setup instructions for FC Career Top and practical reading about Live
        Editor in Manager Career Mode.
      </p>
      <div className="space-y-6">
        <article className="rounded-lg border border-gray-400 p-5">
          <h2 className="text-2xl font-semibold">
            <Link href="/get-started" className="underline">
              Set up player growth tracking in FC 24 and FC 25
            </Link>
          </h2>
          <p className="mt-3 leading-relaxed">
            Check Windows and Live Editor requirements, connect your account,
            run the Lua script and troubleshoot missing squad uploads.
          </p>
          <Link href="/get-started" className="inline-block mt-4 underline">
            Read the FC Career Top setup guide
          </Link>
        </article>
        <article className="flex flex-col sm:flex-row gap-5 rounded-lg border border-gray-400 p-5">
          <Image
            src="/logo.png"
            width={150}
            height={150}
            alt="FC Career Top logo"
            className="w-24 h-24 sm:w-36 sm:h-36 object-contain shrink-0"
          />
          <div>
            <h2 className="text-2xl font-semibold">
              <a
                href="https://medium.com/@veejaliu/fc24-how-to-import-legendary-players-into-your-career-mode-67ebfa299fcc"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                How to import legendary players into FC 24 Career Mode
              </a>
            </h2>
            <p className="mt-3 leading-relaxed">
              A guide to importing legendary players using a Lua script, with
              step-by-step instructions and a discussion of the approach’s
              limitations.
            </p>
            <p className="mt-3 text-sm">
              By VeejaLiu · Published on Medium · Opens in a new tab
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
