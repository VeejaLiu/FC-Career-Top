// src/components/NavLink.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import styles from './NavLink.module.css';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  return (
    <Link href={href} legacyBehavior>
      <a className={styles.navLink}>
        {children}
      </a>
    </Link>
  );
};

export default NavLink;