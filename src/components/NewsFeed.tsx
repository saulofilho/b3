import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  Tag, 
  ArrowUpRight, 
  X, 
  BookOpen
} from 'lucide-react';
import { NewsArticle } from '../types/market';

interface NewsFeedProps {
  news: NewsArticle[];
  onSelectTicker: (ticker: string) => void;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ news, onSelectTicker }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingArticle, setReadingArticle] = useState<NewsArticle | null>(null);

  const categories = [
    'ALL',
    'AÇÕES B3',
    'IPOS',
    'MACRO & JUROS',
    'GLOBAL & WALL ST',
    'DIVIDENDOS'
  ];

  const filteredNews = news.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.relatedTickers.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title & Search bar */}
      <div className="border-b border-[#1a1a1a] pb-4 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <h2 className="font-serif italic text-3xl font-bold text-[#1a1a1a]">
            Radar de Notícias
          </h2>
          <div className="label-mono mt-1">
            Cobertura Econômica, Fatos Relevantes e Comunicados de Mercado
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-[#1a1a1a]/50 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar notícia ou código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#dcdad5] pl-9 pr-3 py-1.5 text-xs font-mono text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-[#1a1a1a]"
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 border transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold'
                : 'bg-white text-[#1a1a1a]/70 border-[#dcdad5] hover:border-[#1a1a1a]'
            }`}
          >
            {cat === 'ALL' ? 'Todas as Notícias' : cat}
          </button>
        ))}
      </div>

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article) => (
          <div
            key={article.id}
            className="border border-[#1a1a1a] bg-white p-5 flex flex-col justify-between shadow-xs transition-shadow hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="label-mono">
                  {article.category}
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase ${
                  article.sentiment === 'BULLISH' ? 'text-emerald-700' :
                  article.sentiment === 'BEARISH' ? 'text-rose-700' :
                  'text-[#1a1a1a]/60'
                }`}>
                  {article.sentiment === 'BULLISH' ? '+ Positivo' : article.sentiment === 'BEARISH' ? '- Negativo' : '· Neutro'}
                </span>
              </div>

              <h3 
                onClick={() => setReadingArticle(article)}
                className="font-serif italic text-xl font-bold text-[#1a1a1a] mb-2 cursor-pointer hover:underline leading-snug"
              >
                {article.title}
              </h3>

              <p className="text-xs text-[#1a1a1a]/75 leading-relaxed line-clamp-3 mb-4">
                {article.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[#dcdad5] space-y-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag className="w-3 h-3 text-[#1a1a1a]/40" />
                {article.relatedTickers.map((t) => (
                  <button
                    key={t}
                    onClick={() => onSelectTicker(t)}
                    className="font-mono text-[10px] font-bold text-[#1a1a1a] bg-[#f8f7f4] hover:bg-[#1a1a1a] hover:text-white px-1.5 py-0.5 border border-[#dcdad5] transition-colors cursor-pointer"
                  >
                    ${t}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#1a1a1a]/50 font-mono">
                <span>{article.source}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {article.publishedAt}
                </span>
              </div>

              <button
                onClick={() => setReadingArticle(article)}
                className="w-full py-1.5 bg-[#f8f7f4] hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a] border border-[#dcdad5] text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3 h-3" />
                <span>Ler Artigo Completo</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#f8f7f4] border-2 border-[#1a1a1a] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            
            <div className="p-5 border-b border-[#1a1a1a] bg-white flex items-center justify-between">
              <span className="label-mono">
                {readingArticle.category} · {readingArticle.publishedAt}
              </span>
              <button
                onClick={() => setReadingArticle(null)}
                className="p-1.5 text-[#1a1a1a] hover:bg-[#f1f0ec] border border-[#dcdad5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <h2 className="font-serif italic text-3xl font-bold text-[#1a1a1a] leading-tight">
                {readingArticle.title}
              </h2>

              <div className="label-mono border-b border-[#dcdad5] pb-2">
                Por {readingArticle.author} · {readingArticle.source} · {readingArticle.readTime}
              </div>

              <div className="p-4 bg-white border border-[#dcdad5] text-sm italic text-[#1a1a1a]/90 font-serif leading-relaxed">
                "{readingArticle.summary}"
              </div>

              <div className="text-sm text-[#1a1a1a] leading-relaxed space-y-3">
                <p>{readingArticle.fullContent}</p>
                <p>
                  As movimentações podem ser acompanhadas diretamente pelo painel de cotações em tempo real da B3 com monitoramento contínuo de book de ofertas.
                </p>
              </div>

              <div className="pt-4 border-t border-[#dcdad5]">
                <div className="label-mono mb-2">Ativos Citados:</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {readingArticle.relatedTickers.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        const ticker = t;
                        setReadingArticle(null);
                        onSelectTicker(ticker);
                      }}
                      className="px-3 py-1 bg-white hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a] border border-[#1a1a1a] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Ver Gráfico ${t}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#1a1a1a] bg-white flex items-center justify-end">
              <button
                onClick={() => setReadingArticle(null)}
                className="px-4 py-2 bg-[#1a1a1a] text-white font-mono text-xs font-bold uppercase"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
