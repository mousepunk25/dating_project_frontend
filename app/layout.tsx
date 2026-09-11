import './globals.css';

import { Disclosure, DisclosureButton, DisclosurePanel, } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import NavigationButtons from '@/components/navigation-buttons';
import CookieConsent from '@/components/cookie-consent';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body className="tracking-wide font-serif min-h-screen flex flex-col">
        <Disclosure as="nav" className="relative bg-white font-serif text-base font-semibold">
          <div className="mx-auto">
            <div className="relative flex h-16 items-center justify-between border-b-1 border-cahir-armor/25 shadow-md px-2 sm:px-6 lg:px-8">
              <div className="absolute flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-cahir-armor hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-cahir-blood">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Otwórz menu główne</span>
                  <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center text-red-600 text-2xl tracking-wide">
                  <Link
                    key='title'
                    href='/'
                    className='rounded-md px-3 py-2 font-semibold'
                  >
                    Kawaliry
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block absolute right-0 bg-cahir-armor">
                  <NavigationButtons version='web' />
                </div>
              </div>
            </div>
          </div>
          <DisclosurePanel className="sm:hidden border-1 bg-cahir-armor">
            <NavigationButtons version='mobile'/>
          </DisclosurePanel>
        </Disclosure>

        {/* Added flex-1 and w-full to expand and take up remaining space */}
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 min-h-[500px] flex-1 w-full">
          {children}
        </div>
        <CookieConsent />

        <footer className="mt-8 border-t-1 border-cahir-armor/20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <small className='px-3 py-2'>
            Wszystkie prawa zastrzeżone.
          </small>
          <div>
            <Link
              key='rules'
              href='/rules'
              className='px-3 py-2 font-semibold text-cahir-blood'
            >
              Zasady korzystania z portalu.
            </Link>
          </div>
        </footer>
      </body>
    </html>
  )
}