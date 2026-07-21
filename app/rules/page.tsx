import Link from 'next/link';

export default function RulesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <header className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Community Rules & Disclaimer
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            These standards exist to ensure a safe, respectful, and authentic environment for everyone.
          </p>
        </header>

        {/* Rules Content */}
        <div className="p-6 sm:p-8 space-y-8 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              1. Eligibility & Genuine Identity
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>You must be at least <strong>18 years old</strong> (or the legal age in your jurisdiction) to join.</li>
              <li>Only one active profile per individual is permitted.</li>
              <li>Profiles must represent your real identity using accurate personal details and recent photos of yourself.</li>
              <li>Impersonation, creating fake accounts, or using unauthorized AI-generated likenesses is strictly prohibited.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              2. Respectful Behavior & Safety
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Zero tolerance for harassment, hate speech, bullying, threats, or discrimination of any kind.</li>
              <li>Keep all communication respectful and consensual. Unsolicited sexually explicit messages or photos are strictly forbidden.</li>
              <li>Do not post or upload violent, pornographic, or illegal material.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              3. Commercial Activity & Anti-Scam Policy
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Never ask other members for money</strong>, gifts, loans, or financial assistance under any circumstances.</li>
              <li>Commercial promotion, selling goods/services, self-promotion, or spam messaging is strictly prohibited.</li>
              <li>Fraudulent activities, scams, or deceptive behavior will be reported to legal authorities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              4. Personal Responsibility & Offline Safety
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>User Interaction:</strong> You are solely responsible for your interactions with other users, whether online or offline.</li>
              <li><strong>Background Checks:</strong> The platform does not conduct criminal background checks or identity verifications on all members. Exercise caution at all times.</li>
              <li><strong>Off-Platform Meetings:</strong> Meeting in person or continuing conversations on external platforms is done entirely at your own risk. Always meet in public places and inform someone you trust of your plans.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              5. Limitation of Liability & Disclaimers
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Platform Provided "As Is":</strong> The app and its services are provided on an "as is" and "as available" basis without warranties of any kind. We do not guarantee match success, compatibility, or uninterrupted service.</li>
              <li><strong>Third-Party Actions:</strong> The app operator/owner assumes no liability for any conduct, statement, content, or harm caused by users or third parties on or off the platform.</li>
              <li><strong>Financial & Data Losses:</strong> The platform is not responsible for any monetary losses, personal injury, emotional distress, or unauthorized access to user accounts caused by third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              6. Enforcement & Account Termination
            </h2>
            <p className="pl-5 text-slate-600 dark:text-slate-400">
              We reserve the right, but are not obligated, to investigate reports and temporarily suspend or permanently ban any account that violates these community rules without prior notice or liability.
            </p>
          </section>

        </div>

        {/* Simple Footer Link back */}
        <footer className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </footer>

      </div>
    </main>
  );
}