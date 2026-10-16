import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dlaczego swatanie wraca do łask? | Blog',
  description:
    'Analiza socjologiczna: dlaczego po latach dominacji aplikacji randkowych wracamy do swatania, rekomendacji i autentycznych relacji.',
};

export default function ArticlePage() {
  return (
    <main className="min-h-screen bg-gray-50/50 font-serif text-gray-900 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation / Back Button */}
        <div>
          <Link 
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 underline underline-offset-4 font-sans"
          >
            ← Powrót do listy artykułów
          </Link>
        </div>

        {/* Article Header Card */}
        <header className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 font-sans">
            <span className="bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-md">
              Relacje & Socjologia
            </span>
            <span>•</span>
            <span>12 Października 2026</span>
            <span>•</span>
            <span>10 min czytania</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Dlaczego swatanie wraca do łask?
          </h1>

          <p className="text-lg sm:text-xl italic text-gray-600 border-l-4 border-indigo-600 pl-4 py-1 leading-relaxed">
            Od kryzysu dopaminowego w aplikacjach randkowych po głód autentyczności. Dlaczego zmęczeni cyfrowym szumem Polacy wracają do świadomego pośrednictwa i osobistych rekomendacji?
          </p>
        </header>

        {/* Main Content Body */}
        <article className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-8 text-base sm:text-lg text-gray-800 leading-relaxed">
          
          {/* Chapter 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              1. Zmęczenie cyfrowym randkowaniem (Dating Fatigue)
            </h2>
            <p>
              Przez ostatnie dziesięć lat cyfrowa rewolucja w obszarze randkowania roztaczała wizję nieograniczonej dostępności. Niezależnie od wieku czy miejsca zamieszkania, smartfon w kieszeni dawał poczucie, że idealny partner znajduje się na wyciągnięcie ręki. Pierwsze lata zachwytu przysłoniły jednak fakt, że algorytmy mogą być zaprojektowane z myślą o przytrzymaniu uwagi użytkownika, a nie o szybkim doprowadzeniu go do trwałego związku.
            </p>
            <p>
              Mechanizm oparty na przesuwaniu profili może wykorzystywać te same ścieżki neurologiczne, co gry losowe — daje sporadyczne nagrody dopaminowe, które uzależniają od samego procesu poszukiwania, spychając cel na dalszy plan.
            </p>

            {/* Quote 1 */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border-l-4 border-indigo-600 border-gray-100 space-y-2 my-6 font-serif">
              <p className="italic text-gray-700">
                „Aplikacje randkowe wrzucają nas w kulturę opcji. Zaczynamy traktować relacje jak katalog produktów. Niewłaściwy profil wymieniamy tak łatwo jak ubranie z dostawą online — ale w prawdziwych relacjach to po prostu nie działa.”
              </p>
              <span className="block text-xs font-sans text-gray-500">
                — Joanna Godecka, psychoterapeutka, w wywiadzie dla{' '}
                <a
                  href="https://spidersweb.pl/plus/2026/02/epoka-singli-ksiazka-randki-kto-placi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                >
                  Spider’s Web
                </a>
              </span>
            </div>
          </section>

          {/* Chapter 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              2. Paradoks wyboru i paraliż analityczny
            </h2>
            <p>
              Słynny „Paradoks Wyboru” autorstwa Barry’ego Schwartza pokazuje, że im większy wybór posiadamy, tym mniej satysfakcji czerpiemy z ostatecznie podjętej decyzji. Dokładnie to zjawisko dotknęło rynek matrymonialny.
            </p>
            <p>
              Przekonanie, że po kolejnym przesunięciu palcem może czekać ktoś jeszcze bardziej dopasowany, sprawia, że przestajemy inwestować energię w pokonywanie pierwszych naturalnych nieporozumień. Pierwsza cicha godzina czy odmienne zdanie na temat spędzania wolnego czasu nie są już sygnałem do pracy nad komunikacją, lecz impulsem do szybkiej rezygnacji.
            </p>

            {/* Quote 2 */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border-l-4 border-indigo-600 border-gray-100 space-y-2 my-6 font-serif">
              <p className="italic text-gray-700">
                „W wielu przypadkach znalezienie partnera czy partnerki nie jest już celem. Staje się nim sam swipe, bo on daje nam szybki strzał dopaminy.”
              </p>
              <span className="block text-xs font-sans text-gray-500">
                — Filip Dokurno, socjolog i psycholog biznesu, na łamach{' '}
                <a
                  href="https://wydarzenia.interia.pl/kraj/news-mlodzi-polacy-nie-wiedza-gdzie-szukac-partnerow-osiagnelismy,nId,23518479"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                >
                  Interia Wydarzenia
                </a>
              </span>
            </div>
          </section>

          {/* Chapter 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              3. Depersonalizacja i sztuczność pierwszych spotkań
            </h2>
            <p>
              Wirtualne środowisko sprzyja powierzchowności. Zjawiska takie jak <em>ghosting</em> (nagłe urwanie kontaktu bez wyjaśnienia) stały się powszechne, a spotkania umawiane przez aplikacje coraz częściej przypominają sztywne rozmowy rekrutacyjne.
            </p>

            {/* Quote 3 */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border-l-4 border-indigo-600 border-gray-100 space-y-2 my-6 font-serif">
              <p className="italic text-gray-700">
                „Technologia nie stworzyła w nas lęku przed bliskością, ale bardzo ułatwiła jego realizowanie. Teraz czasem możemy zniknąć jednym kliknięciem. Nie musimy się tłumaczyć ani stawiać czoła emocjom.”
              </p>
              <span className="block text-xs font-sans text-gray-500">
                — Komentarz dotyczący budowania więzi na{' '}
                <a
                  href="https://porady.sympatia.onet.pl/sympatia-radzi/joanna-godecka-jesli-nie-masz-szacunku-do-siebie-pokazujesz-innym-ze-nie-oczekujesz/t25xc59"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                >
                  Sympatia Onet
                </a>
              </span>
            </div>

            {/* Quote 4 */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border-l-4 border-indigo-600 border-gray-100 space-y-2 my-6 font-serif">
              <p className="italic text-gray-700">
                „Ludzie tworzący profile w sieci stosują elementy marketingu. Prezentują tam najlepszą wersję siebie, co sprzyja zakochaniu się jedynie w projekcji własnego wyobrażenia.”
              </p>
              <span className="block text-xs font-sans text-gray-500">
                — dr n. med. Robert Kowalczyk, seksuolog kliniczny, dla{' '}
                <a
                  href="https://www.pap.pl/aktualnosci/seksuolog-dla-niektorych-szukanie-partnerki-lub-partnera-przez-internet-jest-prostsze"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                >
                  Polska Agencja Prasowa (PAP)
                </a>
              </span>
            </div>
          </section>

          {/* Chapter 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              4. Nowoczesne swatanie a tradycja
            </h2>
            <p>
              Słowo „swatanie” przeszło współcześnie całkowitą redefinicję. Nowoczesne pośrednictwo nie polega na narzucaniu czegokolwiek, lecz na pełnieniu roli dyskretnego filtra i doradcy.
            </p>
            <p>
              Zamiast oceniania wyłącznie powierzchownego wyglądu, analizuje się dojrzałość emocjonalną, system wartości, styl komunikacji oraz realne cele życiowe obu stron.
            </p>

            {/* Quote 5 */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border-l-4 border-indigo-600 border-gray-100 space-y-2 my-6 font-serif">
              <p className="italic text-gray-700">
                „Poznając kogoś poza internetem — w kręgach znajomych czy przez rekomendację — dokonujemy świadomej, bardziej weryfikowalnej selekcji. Możemy zaciągnąć opinii od osób, które daną osobę naprawdę znają.”
              </p>
              <span className="block text-xs font-sans text-gray-500">
                — Ekspertyza opublikowana w komunikacie{' '}
                <a
                  href="https://www.pap.pl/aktualnosci/seksuolog-dla-niektorych-szukanie-partnerki-lub-partnera-przez-internet-jest-prostsze"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                >
                  PAP
                </a>
              </span>
            </div>
          </section>

          {/* Chapter 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              5. Podsumowanie: Powrót do autentyczności
            </h2>
            <p>
              Renesans swatania to dojrzały mechanizm obronny społeczeństwa zmęczonego cyfrową powierzchownością. Poszukujemy bezpiecznej przestrzeni, uczciwości oraz pewności, że nasz czas i zaangażowanie nie zostaną zmarnowane.
            </p>

            {/* Quote 6 */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border-l-4 border-indigo-600 border-gray-100 space-y-2 my-6 font-serif">
              <p className="italic text-gray-700">
                „Ludzie są zmęczeni tym przewijaniem, pisaniem i udawaniem. Osiągnęliśmy apogeum — po prostu przestaliśmy wierzyć w cyfrowe obietnice i szukamy powrotu do spotkań twarzą w twarz.”
              </p>
              <span className="block text-xs font-sans text-gray-500">
                — Raport o trendach relacyjnych na portalach{' '}
                <a
                  href="https://wydarzenia.interia.pl/kraj/news-mlodzi-polacy-nie-wiedza-gdzie-szukac-partnerow-osiagnelismy,nId,23518479"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                >
                  Interia.pl
                </a>
              </span>
            </div>

            <p>
              W świecie pełnym informacyjnego szumu osobista rekomendacja, intencjonalność oraz zaufane pośrednictwo okazują się najbardziej niezawodną drogą do zbudowania trwałego związku.
            </p>
          </section>

        </article>

        {/* Bottom Back Button */}
        <div className="pt-2 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 underline underline-offset-4 font-sans"
          >
            ← Powrót do pozostałych artykułów
          </Link>
        </div>

      </div>
    </main>
  );
}