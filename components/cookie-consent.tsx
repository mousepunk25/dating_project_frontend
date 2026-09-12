'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setIsVisible(false)
  }

  // Prevent SSR/Hydration mismatches entirely
  if (!hasMounted || !isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 p-6 rounded-xl bg-white shadow-2xl border border-cahir-armor/20 backdrop-blur-md transition-all">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 font-serif">
            Cenimy Twoją prywatność 🍪
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Ta strona korzysta z plików cookie, aby usprawnić korzystanie z serwisu, zapamiętać Twoje preferencje oraz zapewnić optymalne działanie strony.
          </p>
        </div>

        <div className="flex items-center gap-3 justify-end sm:justify-start">
          <button
            onClick={handleAccept}
            className="rounded-full bg-cahir-armor px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-cahir-blood focus:ring-offset-2 cursor-pointer"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  )
}