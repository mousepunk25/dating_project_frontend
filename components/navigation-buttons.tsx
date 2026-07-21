'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link';
import { DisclosureButton } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL;

// 1. Keep this strictly as static, read-only configuration data
const NAVIGATION_ITEMS = [
  { name: 'Home page', href: '/' },
  { name: 'My profile', href: '/myprofile' },
  { name: 'Login', href: '/myprofile' },
  { name: 'Logout', href: `${url}/logout` }
];

export default function NavigationButtons({ version }: { version: 'web' | 'mobile' }) {
  const pathname = usePathname();
  const isCurrent = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  if (version === 'web') {
    return (
      <div className="flex space-x-4">
        {NAVIGATION_ITEMS.map((item) => {
          const active = isCurrent(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={classNames(
                active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                'rounded-md px-3 py-2 font-semibold',
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    )
  }

  return (
    <div className="space-y-1 px-2 pt-2 pb-3">
      {NAVIGATION_ITEMS.map((item) => {
        const active = isCurrent(item.href);
        return (
          <DisclosureButton
            key={item.name}
            as={Link}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={classNames(
              active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
              'block rounded-md px-3 py-2 text-base font-medium',
            )}
          >
            {item.name}
          </DisclosureButton>
        );
      })}
    </div>
  )
}