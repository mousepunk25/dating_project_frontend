import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Swatanie & Relacje',
  description: 'Artykuły, wskazówki i refleksje na temat nowoczesnego swatania i budowania relacji.',
};

// Interface for article items
interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readTime: string;
}

// Sample articles list — you can easily replace this with dynamic fetching later
const articles: Article[] = [
  {
    slug: 'rola-rodziny-w-wyborze-partnera',
    title: 'Rola rodziny i bliskich w wyborze partnera',
    description:
      'Czy warto słuchać rad najbliższych przy wyborze drugiej połówki? Analizujemy perspektywę tradycyjną i nowoczesną.',
    category: 'Tradycja',
    publishedAt: '20 Października 2026',
    readTime: '10 min czytania',
  },
  {
    slug: 'dlaczego-swatanie-wraca-do-lask',
    title: 'Dlaczego swatanie wraca do łask?',
    description:
      'W erze aplikacji randkowych coraz więcej osób szuka autentyczności i tradycyjnego podejścia do budowania trwałych relacji.',
    category: 'Relacje',
    publishedAt: '16 Października 2026',
    readTime: '10 min czytania',
  }
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 font-serif text-gray-900 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Blog Header */}
        <header className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Blog & Artykuły
          </h1>
          <p className="text-gray-600 text-base sm:text-lg italic leading-relaxed">
            Przemyślenia, poradniki oraz spojrzenie na nowo na sztukę łączenia serc.
          </p>
        </header>

        {/* Article Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
            Ostatnie publikacje
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-all space-y-4"
              >
                <div className="space-y-3">
                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-sans">
                    <span className="text-cahir-blood font-semibold px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    <span>•</span>
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  {/* Article Info */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 leading-snug">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="hover:text-cahir-blood transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center text-sm font-medium text-cahir-blood hover:text-cahir-blood-400 underline underline-offset-4"
                  >
                    Czytaj więcej →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}