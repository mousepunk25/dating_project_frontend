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
  featured?: boolean;
}

// Sample articles list — you can easily replace this with dynamic fetching later
const articles: Article[] = [
  {
    slug: 'dlaczego-swatanie-wraca-do-lask',
    title: 'Dlaczego swatanie wraca do łask?',
    description:
      'W erze aplikacji randkowych coraz więcej osób szuka autentyczności i tradycyjnego podejścia do budowania trwałych relacji.',
    category: 'Relacje',
    publishedAt: '16 Października 2026',
    readTime: '10 min czytania',
    featured: true,
  }
];

export default function BlogPage() {
  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const regularArticles = articles.filter((a) => a.slug !== featuredArticle.slug);

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

        {/* Featured Article Section */}
        {featuredArticle && (
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 font-sans">
              <span className="bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-md">
                Wyróżniony artykuł
              </span>
              <span>•</span>
              <span className="font-medium text-gray-700">{featuredArticle.category}</span>
              <span>•</span>
              <span>{featuredArticle.publishedAt}</span>
              <span>•</span>
              <span>{featuredArticle.readTime}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-snug">
              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="hover:text-indigo-600 transition-colors"
              >
                {featuredArticle.title}
              </Link>
            </h2>

            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              {featuredArticle.description}
            </p>

            <div className="pt-2">
              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 underline underline-offset-4"
              >
                Przeczytaj cały artykuł →
              </Link>
            </div>
          </section>
        )}

        {/* Article Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
            Ostatnie publikacje
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-all space-y-4"
              >
                <div className="space-y-3">
                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-sans">
                    <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  {/* Article Info */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 leading-snug">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="hover:text-indigo-600 transition-colors"
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
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 underline underline-offset-4"
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