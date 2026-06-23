import './globals.css';

import { Disclosure, DisclosureButton, DisclosurePanel, } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import NavigationButtons from '@/components/navigation-buttons';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="tracking-wide font-serif">
        <Disclosure as="nav" className="relative bg-cahir-armor font-serif text-base font-semibold">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center text-red-600 text-2xl tracking-wide">
                    Title
                </div>
                <div className="hidden sm:ml-6 sm:block absolute right-0">
                  <NavigationButtons version='web' />
                </div>
              </div>
            </div>
          </div>
          <DisclosurePanel className="sm:hidden">
            <NavigationButtons version='mobile' />
          </DisclosurePanel>
        </Disclosure>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  )
}