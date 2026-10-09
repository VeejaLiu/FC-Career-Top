// src/app/layout.tsx
import './globals.css';
import './fonts.css';
import NavLink from '@/app/components/NavLink';
import Link from 'next/link';
import Footer from './components/Footer';
import Image from 'next/image';
import { GoogleAnalytics } from '@next/third-parties/google';
import { MenuIcon } from '@/constant/icons';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <head>
        <link rel="icon" href="/logo.svg" />
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          <nav className="h-16 bg-[#151616] flex items-center fixed top-0 w-full z-10">
            <ul className="flex h-full items-center space-x-4 w-full">
              <li>
                <Link href="/">
                  <div className="text-white mr-1 text-xl font-bold cursor-pointer flex items-center">
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
              </li>

              {/* Dropdown */}
              <div className="dropdown flex-grow md:hidden">
                <div
                  tabIndex={0}
                  className="btn bg-transparent border-0 p-0 m-0 text-inherit cursor-pointer focus:outline-none hover:bg-transparent"
                  role="button"
                >
                  <MenuIcon className="w-6 h-6" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content bg-[#151616] menu rounded-box z-[100] w-52 p-2 shadow"
                >
                  <li>
                    <NavLink href="/">Home</NavLink>
                  </li>
                  <li>
                    <NavLink href="/change-logs">Changes</NavLink>
                  </li>
                  <li>
                    <NavLink href="/posts">Posts</NavLink>
                  </li>
                  <li>
                    <NavLink href="/contact-us">Contact</NavLink>
                  </li>
                  <li>
                    <NavLink href="/user-statistics">User Statistics</NavLink>
                  </li>
                </ul>
              </div>

              <div className="hidden items-center space-x-1 flex-grow md:flex">
                <li>
                  <NavLink href="/">Home</NavLink>
                </li>
                <li>
                  <NavLink href="/change-logs">Changes</NavLink>
                </li>
                <li>
                  <NavLink href="/posts">Posts</NavLink>
                </li>
                <li>
                  <NavLink href="/contact-us">Contact</NavLink>
                </li>
                <li>
                  <NavLink href="/user-statistics">User Statistics</NavLink>
                </li>
              </div>
              <div className="mr-1 ml-auto">
                <a href={'https://app.fccareer.top'} target={'_blank'}>
                  <div className="go-to-app-button flex items-center bounce-animation">
                    Go to App
                  </div>
                </a>
              </div>
            </ul>
          </nav>
          <main className="flex-grow p-4 mt-16">{children}</main>
          <footer className="bg-gray-800 text-white p-4 text-center">
            <Footer />
          </footer>
        </div>
      </body>
      <GoogleAnalytics gaId="G-2SNN4F98MN" />
    </html>
  );
};

export default Layout;
