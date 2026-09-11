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
            Zasady Społeczności i Wyłączenie Odpowiedzialności
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Te standardy istnieją, aby zapewnić bezpieczne, pełne szacunku i autentyczne środowisko dla każdego.
          </p>
        </header>

        {/* Rules Content */}
        <div className="p-6 sm:p-8 space-y-8 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              1. Wymagania dotyczące wieku i prawdziwa tożsamość
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Musisz mieć ukończone co najmniej <strong>18 lat</strong> (lub być pełnoletnim w swojej jurysdykcji), aby dołączyć.</li>
              <li>Dozwolony jest tylko jeden aktywny profil na osobę.</li>
              <li>Profile muszą reprezentować Twoją prawdziwą tożsamość przy użyciu dokładnych danych osobowych oraz Twoich aktualnych zdjęć.</li>
              <li>Podszywanie się pod innych, tworzenie fałszywych kont oraz używanie nieautoryzowanego wizerunku wygenerowanego przez AI jest surowo zabronione.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              2. Szacunek i Bezpieczeństwo
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Brak tolerancji dla nękania, mowy nienawiści, zastraszania, gróźb lub jakiejkolwiek formy dyskryminacji.</li>
              <li>Dbaj o to, aby cała komunikacja odbywała się z szacunkiem i za obopólną zgodą. Niezamówione wiadomości lub zdjęcia o jednoznacznym charakterze seksualnym są surowo zabronione.</li>
              <li>Nie publikuj ani nie przesyłaj treści zawierających przemoc, pornografię lub materiały nielegalne.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              3. Działalność Komercyjna i Polityka Przeciwko Oszustwom
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Nigdy nie proś innych użytkowników o pieniądze</strong>, prezenty, pożyczki ani pomoc finansową pod żadnym pozorem.</li>
              <li>Promocja komercyjna, sprzedaż towarów/usług, autopromocja oraz wysyłanie spamu są surowo zabronione.</li>
              <li>Działania przestępcze, oszustwa lub wprowadzanie w błąd będą zgłaszane odpowiednim organom ścigania.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              4. Odpowiedzialność Osobista i Bezpieczeństwo Offline
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Interakcje z użytkownikami:</strong> Ponosisz wyłączną odpowiedzialność za swoje relacje z innymi użytkownikami, zarówno w sieci, jak i poza nią.</li>
              <li><strong>Weryfikacja przeszłości:</strong> Platforma nie przeprowadza kontroli przeszłości karnej ani weryfikacji tożsamości wszystkich użytkowników. Zawsze zachowuj ostrożność.</li>
              <li><strong>Spotkania poza platformą:</strong> Spotkania osobiste lub kontynuowanie rozmów na zewnętrznych platformach odbywają się wyłącznie na Twoje własne ryzyko. Zawsze spotykaj się w miejscach publicznych i poinformuj kogoś zaufanego o swoich planach.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              5. Ograniczenie Odpowiedzialności i Wyłączenia
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Platforma dostarczana w stanie "Taki, jaki jest":</strong> Aplikacja i jej usługi są dostarczane w stanie "taki, jaki jest" i "w miarę dostępności" bez jakichkolwiek gwarancji. Nie gwarantujemy sukcesu w dopasowaniach, kompatybilności ani nieprzerwanego działania serwisu.</li>
              <li><strong>Działania osób trzecich:</strong> Operator/właściciel aplikacji nie ponosi żadnej odpowiedzialności za jakiekolwiek zachowania, wypowiedzi, treści lub szkody wyrządzone przez użytkowników bądź osoby trzecie na platformie lub poza nią.</li>
              <li><strong>Straty finansowe i dane:</strong> Platforma nie ponosi odpowiedzialności za jakiekolwiek straty materialne, uszczerbek na zdrowiu, straty emocjonalne ani nieautoryzowany dostęp do kont użytkowników spowodowany przez osoby trzecie.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              6. Egzekwowanie Zasad i Zamknięcie Konta
            </h2>
            <p className="pl-5 text-slate-600 dark:text-slate-400">
              Zastrzegamy sobie prawo, ale nie obowiązek, do badania zgłoszeń oraz tymczasowego zawieszenia lub trwałego zablokowania każdego konta, które narusza niniejsze zasady społeczności, bez wcześniejszego powiadomienia i bez ponoszenia odpowiedzialności.
            </p>
          </section>

        </div>

        {/* Simple Footer Link back */}
        <footer className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline"
          >
            ← Powrót do Strony Główniej
          </Link>
        </footer>

      </div>
    </main>
  );
}