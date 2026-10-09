import Link from 'next/link';

const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="text-lg font-bold my-2">
        <span className="mx-2">Free</span>
        <span className="mx-2">Automatic</span>
        <span className="mx-2">Open-source</span>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-sm my-3">
        <Link href="/get-started">Setup guide</Link>
        <Link href="/posts">Articles</Link>
        <Link href="/contact-us">Contact</Link>
        <Link href="/user-statistics">User statistics</Link>
      </div>
      <div className="text-sm text-gray-400">
        © {new Date().getUTCFullYear()} FC Career Top. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
