// src/app/layout.tsx
import './globals.css';
import './fonts.css';
import NavLink from '@/app/components/NavLink';
import Link from 'next/link';
import Footer from './components/Footer';
import Image from 'next/image';
import { GoogleAnalytics } from '@next/third-parties/google';
import { MenuIcon } from '@/constant/icons';
import type { Metadata } from 'next';
import { APP_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  icons: { icon: '/logo.svg' },
};

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/get-started', label: 'Get Started' },
  { href: '/change-logs', label: 'Changes' },
  { href: '/posts', label: 'Articles' },
  { href: '/contact-us', label: 'Contact' },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="flex flex-col min-h-screen">
          <nav
            aria-label="Main navigation"
            className="h-16 bg-[#151616] flex items-center fixed top-0 w-full z-10"
          >
            <div className="flex h-full items-center gap-2 w-full">
              <div>
                <Link href="/">
                  <div className="brand text-white mr-1 text-xl font-bold cursor-pointer flex items-center">
                    <Image
                      src="/logo.svg"
                      alt="Logo"
                      width={32}
                      height={32}
                      className="h-8 mr-2 bg-white rounded-full"
                    />
                    <span className="italic">FC</span>
                    <span className="italic">Career</span>
                    <span className="italic">.top</span>
                  </div>
                </Link>
              </div>

              {/* Dropdown */}
              <details className="mobile-navigation dropdown flex-grow lg:hidden">
                <summary
                  className="btn bg-transparent border-0 p-0 m-0 text-inherit cursor-pointer focus:outline-none hover:bg-transparent"
                  aria-label="Open navigation menu"
                >
                  <MenuIcon className="w-6 h-6" />
                </summary>
                <ul className="dropdown-content bg-[#151616] menu rounded-box z-[100] w-52 p-2 shadow">
                  {navigation.map(({ href, label }) => (
                    <li key={href}>
                      <NavLink href={href}>{label}</NavLink>
                    </li>
                  ))}
                </ul>
              </details>

              <ul className="hidden items-center flex-grow lg:flex">
                {navigation.map(({ href, label }) => (
                  <li key={href}>
                    <NavLink href={href}>{label}</NavLink>
                  </li>
                ))}
              </ul>
              <div className="mr-1 ml-auto">
                <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                  <div className="go-to-app-button flex items-center">
                    Go to App
                  </div>
                </a>
              </div>
            </div>
          </nav>
          <main id="main-content" className="flex-grow p-4 mt-16">
            {children}
          </main>
          <footer className="bg-gray-800 text-white p-4 text-center">
            <Footer />
          </footer>
        </div>
        <GoogleAnalytics gaId="G-2SNN4F98MN" />
      </body>
    </html>
  );
};

export default Layout;
