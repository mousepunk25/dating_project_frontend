'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link';
import { DisclosureButton } from '@headlessui/react';
import { useState } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

let navigationInitial = [
    { name: 'Home page', href: '/', current: false },
    { name: 'My profile', href: '/myprofile', current: false },
    { name: 'Logout', href: '#', current: false }
  ];

export default function NavigationButtons({ version }: { version: 'web' | 'mobile' }) {
  const pathname = usePathname();
  const segments = pathname.split('/');
  if (segments[0] === '' && segments[1] === '') {
    navigationInitial[0].current = true;
    navigationInitial[1].current = false;
  } else if (segments[1] === 'myprofile') {
    navigationInitial[1].current = true;
    navigationInitial[0].current = false;
  }
  const [navigation, setNavigation] = useState(navigationInitial);

function navigationClick(navigationButton: string) {
  const updatedNavigation = navigation.map(n => {
    if (n.name === navigationButton) {
      return {
        ...n,
        current: true
      }
    }
    return {
      ...n,
      current: false
    }
  })
  setNavigation(updatedNavigation);
}

  if (version === 'web') {
    console.log(segments);
    return (
      <div className="flex space-x-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            aria-current={item.current ? 'page' : undefined}
            className={classNames(
              item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
              'rounded-md px-3 py-2 font-semibold',
            )}
            onClick={() => navigationClick(item.name)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1 px-2 pt-2 pb-3">
      {navigation.map((item) => (
        <DisclosureButton
          key={item.name}
          as="a"
          href={item.href}
          aria-current={item.current ? 'page' : undefined}
          className={classNames(
            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
            'block rounded-md px-3 py-2 text-base font-medium',
          )}
          onClick={() => navigationClick(item.name)}
        >
          {item.name}
        </DisclosureButton>
      ))}
    </div>
  )
}