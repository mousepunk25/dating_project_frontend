'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link';
import { DisclosureButton } from '@headlessui/react';
import { useState, useEffect } from 'react';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
  ? process.env.NEXT_PUBLIC_DEV_API_URL 
  : process.env.NEXT_PUBLIC_PROD_API_URL;

const NAVIGATION_ITEMS = [
  { name: 'Strona główna', href: '/' },
  { name: 'Mój profil', href: '/myprofile' },
  { name: 'Logowanie', href: '/myprofile' },
  { name: 'Wyloguj się', href: `${url}/logout` },
  { name: 'Rejestracja', href: '/register'}
];

export default function NavigationButtons({ version }: { version: 'web' | 'mobile' }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check cookies safely strictly on the client after mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const loggedIn = document.cookie
        .split('; ')
        .some((row) => row.startsWith('profileId='));
      setIsLoggedIn(loggedIn);
    }
  }, [pathname]); // Re-check when route changes

  const isCurrent = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const renderItems = (isMobile: boolean) => {
    return NAVIGATION_ITEMS.map((item) => {
      const active = isCurrent(item.href);

      // Determine visibility rules
      const isProfileOrLogout = item.name === 'Mój profil' || item.name === 'Wyloguj się';
      const isLoginOrRegister = item.name === 'Logowanie' || item.name === 'Rejestracja';

      if (isProfileOrLogout && !isLoggedIn) return null;
      if (isLoginOrRegister && isLoggedIn) return null;

      const Component = isMobile ? DisclosureButton : Link;

      return (
        <Component
          key={item.name}
          {...(isMobile ? { as: Link } : {})}
          href={item.href}
          aria-current={active ? 'page' : undefined}
          className={classNames(
            active ? 'bg-white text-cahir-blood' : 'text-white hover:bg-grey/5 hover:text-white',
            isMobile
              ? 'block rounded-md px-3 py-2 text-base font-medium'
              : 'rounded-md px-3 py-2 font-semibold'
          )}
        >
          {item.name}
        </Component>
      );
    });
  };

  if (version === 'web') {
    return <div className="flex space-x-4">{renderItems(false)}</div>;
  }

  return <div className="space-y-1 px-2 pt-2 pb-3">{renderItems(true)}</div>;
}