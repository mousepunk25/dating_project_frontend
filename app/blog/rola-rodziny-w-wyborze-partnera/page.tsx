import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rola rodziny i bliskich w wyborze partnera | Blog',
  description:
    'Czy opinia bliskich ma znaczenie przy wyborze drugiej połówki? Analiza społeczna i psychologiczna wpływu akceptacji otoczenia na trwałość relacji w Polsce.',
};

export default function ArticlePage() {
  return (
    <main className="min-h-screen bg-gray-50/50 font-serif text-gray-900 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation / Back Button */}
        <div>
          <Link 
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-cahir-blood hover:text-cahir-blood-400 underline underline-offset-4 font-sans"
          >
            ← Powrót do listy artykułów
          </Link>
        </div>

        {/* Article Header Card */}
        <header className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 font-sans">
            <span className="bg-cahir-blood-50 text-cahir-blood font-semibold px-2.5 py-1 rounded-md">
              Tradycja & Psychologia
            </span>
            <span>•</span>
            <span>20 Października 2026</span>
            <span>•</span>
            <span>10 min czytania</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Rola rodziny i bliskich w wyborze partnera
          </h1>

          <p className="text-lg sm:text-xl italic text-gray-600 border-l-4 border-cahir-blood pl-4 py-1 leading-relaxed">
            Czy opinia najbliższych to przestarzały przeżytek, czy bezcenny filtr chroniący nas przed życiowym błędem? Analizujemy, jak bliscy wpływają na trwałość naszych związków.
          </p>
        </header>

        {/* Main Content Body */}
        <article className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-8 text-base sm:text-lg text-gray-800 leading-relaxed">
          
          {/* Chapter 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              1. Pomiędzy indywidualizmem a potrzebą wsparcia
            </h2>
            <p>
              Współczesna kultura stawia na absolutną niezależność. Uczono nas, że miłość to sprawa wyłącznie dwóch osób, a kierowanie się zdaniem rodziców czy przyjaciół przy wyborze partnera bywa postrzegane jako słabość. Jednak w dobie kryzysu trwałości związków i powszechnego zmęczenia aplikacjami randkowymi coraz więcej osób dostrzega wartość w spojrzeniu z zewnątrz.
            </p>
            <p>
              Kiedy zakochujemy się, nasz mózg przechodzi przez stan emocjonalnego zaangażowania, który potrafi osłabić krytyczne myślenie. Właśnie wtedy rodzina i przyjaciele stają się bezstronnym lustrem.
            </p>
            <p>
              Wbrew pozorom, tradycyjne wartości pozostają w Polsce niezwykle trwałe: badania społeczno-sondażowe regularnie wskazują, że szczęście rodzinne jest dla przeważającej większości Polaków najważniejszą wartością w życiu, a bliskość i akceptacja stanowią trzon naszego poczucia dobrostanu.
            </p>
          </section>

          {/* Chapter 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              2. Zrozumieć własne lęki i wzorce z domu
            </h2>
            <p>
              Opór wobec opinii rodziny często wynika z braku przepracowanych schematów wyniesionych z domu lub lęku przed odrzuceniem. Bliscy pomagają nam jednak zauważyć powtarzane nieświadomie błędy.
            </p>
            <p>
              Tym, co niezwykle często utrudnia wejście w dojrzały związek, jest nieświadomy lęk przed bliskością. Wynika on ze wzorców rodzinnych i wcześniejszych trudnych doświadczeń, które zamykają nas na prawdziwe relacje.
            </p>
            <p>
              Sama technologia nie stworzyła w nas lęku przed bliskością, ale znacząco ułatwiła jego realizowanie. Niezależność nie musi wykluczać budowania więzi z drugim człowiekiem — problem pojawia się wtedy, gdy zaczynamy traktować ją jak zbroję chroniącą nas przed ludźmi.
            </p>
          </section>

          {/* Chapter 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              3. Dlaczego opinia otoczenia buduje poczucie bezpieczeństwa?
            </h2>
            <p>
              Prawdziwe wsparcie ze strony otoczenia tworzy stabilne fundamenty związku. Kiedy partner zostaje dobrze przyjęty przez rodzinę i przyjaciół, łatwiej buduje się wspólne życie i pokonuje pierwsze trudności.
            </p>
            <p>
              Relacja tworzona w całkowitej izolacji lub wbrew otoczeniu szybko rodzi poczucie wyobcowania. Z kolei życzliwe wsparcie rodziny i znajomych działa jak naturalny bufor bezpieczeństwa w momentach kryzysowych.
            </p>
          </section>

          {/* Chapter 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              4. Wartość osobistej rekomendacji
            </h2>
            <p>
              Poznawanie kogoś poprzez rekomendację rodziny lub zaufanych znajomych to sprawdzona metoda, która powraca w obliczu anonimowości świata cyfrowego.
            </p>
            <p>
              Poznając kogoś poza internetem — w kręgach znajomych czy poprzez rekomendację — dokonujemy świadomej i bardziej weryfikowalnej selekcji. Mamy możliwość poznania opinii osób, które danego człowieka naprawdę znają w codziennym życiu.
            </p>
          </section>

          {/* Chapter 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              5. Podsumowanie: Mądrość wyboru w harmonii z bliskimi
            </h2>
            <p>
              Ostateczna decyzja o wejściu w związek zawsze należy do Ciebie. Jednak otwartość na perspektywę bliskich pozbawia relację niepotrzebnego napięcia i daje bezcenne wsparcie na przyszłość.
            </p>
            <p>
              Warto słuchać tych, którzy znają nas od lat. Ich obiektywne spojrzenie może stać się niezawodnym drogowskazem na drodze do stworzenia trwałego i dojrzałego związku.
            </p>
          </section>

        </article>

        {/* Bottom Back Button */}
        <div className="pt-2 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-cahir-blood hover:text-cahir-blood-800 underline underline-offset-4 font-sans"
          >
            ← Powrót do pozostałych artykułów
          </Link>
        </div>

      </div>
    </main>
  );
}