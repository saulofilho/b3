import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart3, 
  Bell,
  Filter,
  ArrowLeftRight
} from 'lucide-react';
import { StockQuote } from '../types/market';
import { StockComparator } from './StockComparator';

interface StockListProps {
  stocks: StockQuote[];
  selectedTicker: string;
  onSelectStock: (ticker: string) => void;
  onOpenOrderModal: (stock: StockQuote, side: 'BUY' | 'SELL') => void;
  onOpenAlertModal: (ticker: string, currentPrice: number) => void;
  onOpenTechnicalReport: (stock: StockQuote) => void;
}

export const StockList: React.FC<StockListProps> = ({
  stocks,
  selectedTicker,
  onSelectStock,
  onOpenOrderModal,
  onOpenAlertModal,
  onOpenTechnicalReport
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [showComparator, setShowComparator] = useState<boolean>(true);
  const [compareA, setCompareA] = useState<string>('PETR4');
  const [compareB, setCompareB] = useState<string>('VALE3');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'change' | 'volume' | 'dy' | 'price'>('volume');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // B3 & Global sector options for high-precision filtering
  const sectorOptions = useMemo(() => [
    { id: 'ALL', label: 'Todos os Setores B3 / Globais', match: '' },
    { id: 'Bancos', label: 'Bancos & Finanças (ITUB, BBAS, B3SA, NU)', match: 'Financeiro' },
    { id: 'Energia', label: 'Petróleo, Gás & Energia (PETR, PRIO)', match: 'Petróleo' },
    { id: 'Mineracao', label: 'Mineração & Commodities (VALE)', match: 'Mineração' },
    { id: 'Industrial', label: 'Bens Industriais & Motores (WEGE)', match: 'Industriais' },
    { id: 'Consumo', label: 'Consumo, Varejo & Locação (RENT)', match: 'Consumo' },
    { id: 'Tecnologia', label: 'Tecnologia & Inovação (NVDA, AAPL)', match: 'Tecnologia' },
  ], []);

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = 
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Sector Filter
    if (selectedSector !== 'ALL') {
      const option = sectorOptions.find(o => o.id === selectedSector);
      const matchKeyword = option ? option.match : selectedSector;
      if (!stock.sector.toLowerCase().includes(matchKeyword.toLowerCase())) {
        return false;
      }
    }

    if (filterType === 'B3') return stock.exchange === 'B3';
    if (filterType === 'GLOBAL') return stock.exchange === 'NYSE' || stock.exchange === 'NASDAQ';
    if (filterType === 'GAINS') return stock.changePercent > 0;
    if (filterType === 'LOSSES') return stock.changePercent < 0;
    if (filterType === 'DIVIDENDS') return stock.dividendYield >= 6.0;

    return true;
  }).sort((a, b) => {
    let diff = 0;
    if (sortField === 'change') diff = a.changePercent - b.changePercent;
    if (sortField === 'volume') diff = a.volume - b.volume;
    if (sortField === 'dy') diff = a.dividendYield - b.dividendYield;
    if (sortField === 'price') diff = a.price - b.price;
    return sortDirection === 'desc' ? -diff : diff;
  });

  return (
    <div className="space-y-6">
      
      {/* Title & Controls Bar */}
      <div className="border-b border-[#1a1a1a] pb-4 flex flex-col lg:flex-row lg:items-baseline justify-between gap-4">
        <div>
          <h2 className="font-serif italic text-3xl font-bold text-[#1a1a1a]">
            Mercado &amp; Ações
          </h2>
          <div className="label-mono mt-1">
            Painel Geral de Cotações B3 &amp; Wall Street ({filteredStocks.length} de {stocks.length} ativos)
          </div>
        </div>

        {/* Search & Sector Dropdown Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
          {/* Sector Selector Dropdown */}
          <div className="relative flex items-center">
            <Filter className="w-3.5 h-3.5 text-[#1a1a1a]/60 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full sm:w-auto bg-white border border-[#1a1a1a] pl-8 pr-7 py-1.5 text-xs font-mono font-medium text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] appearance-none cursor-pointer hover:bg-[#fcfbf9] transition-colors"
              title="Filtrar por Setor da B3"
            >
              {sectorOptions.map((opt) => {
                const count = opt.id === 'ALL'
                  ? stocks.length
                  : stocks.filter(s => s.sector.toLowerCase().includes(opt.match.toLowerCase())).length;
                return (
                  <option key={opt.id} value={opt.id}>
                    {opt.id === 'ALL' ? 'Todos os Setores' : opt.label.split('(')[0].trim()} ({count})
                  </option>
                );
              })}
            </select>
            <span className="absolute right-2.5 pointer-events-none text-[9px] text-[#1a1a1a]/60">▼</span>
          </div>

          {/* Comparator Toggle Button */}
          <button
            onClick={() => setShowComparator(!showComparator)}
            className={`px-3 py-1.5 border text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              showComparator
                ? 'bg-[#1a1a1a] text-[#f8f7f4] border-[#1a1a1a]'
                : 'bg-white hover:bg-[#f1f0ec] text-[#1a1a1a] border-[#1a1a1a]'
            }`}
            title="Comparador Lateral de Ativos"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>{showComparator ? 'Ocultar Comparador' : 'Comparar Ativos'}</span>
          </button>

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#1a1a1a]/50 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por código ou nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#dcdad5] pl-9 pr-3 py-1.5 text-xs font-mono text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-[#1a1a1a]"
            />
          </div>
        </div>
      </div>

      {/* Side-by-Side Asset Comparator Component */}
      {showComparator && (
        <StockComparator
          stocks={stocks}
          initialTickerA={compareA}
          initialTickerB={compareB}
          onSelectStock={onSelectStock}
          onOpenOrderModal={onOpenOrderModal}
        />
      )}

      {/* Filter Tabs & Active Sector Indicator */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono pb-1">
          {[
            { id: 'ALL', label: 'Todos os Ativos' },
            { id: 'B3', label: 'B3 Ações' },
            { id: 'GLOBAL', label: 'Globais' },
            { id: 'GAINS', label: 'Maiores Altas' },
            { id: 'LOSSES', label: 'Maiores Baixas' },
            { id: 'DIVIDENDS', label: 'Top Dividendos (DY ≥ 6%)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 transition-colors cursor-pointer border whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold'
                  : 'bg-white text-[#1a1a1a]/70 border-[#dcdad5] hover:border-[#1a1a1a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Sector Chip */}
        {selectedSector !== 'ALL' && (
          <div className="flex items-center gap-2 text-xs font-mono bg-emerald-50 border border-emerald-300 px-3 py-1 text-emerald-950">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <span>
              Setor selecionado: <strong>{sectorOptions.find(o => o.id === selectedSector)?.label}</strong>
            </span>
            <button
              onClick={() => setSelectedSector('ALL')}
              className="text-xs text-emerald-900 underline hover:opacity-70 ml-auto font-bold cursor-pointer"
            >
              Limpar filtro de setor
            </button>
          </div>
        )}
      </div>

      {/* Stock Quotes Table */}
      <div className="border border-[#1a1a1a] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1a1a1a] bg-[#f1f0ec] text-[#1a1a1a] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Ativo</th>
                <th 
                  className="py-3 px-3 text-right cursor-pointer hover:underline"
                  onClick={() => {
                    setSortField('price');
                    setSortDirection(d => d === 'desc' ? 'asc' : 'desc');
                  }}
                >
                  Cotação
                </th>
                <th 
                  className="py-3 px-3 text-right cursor-pointer hover:underline"
                  onClick={() => {
                    setSortField('change');
                    setSortDirection(d => d === 'desc' ? 'asc' : 'desc');
                  }}
                >
                  Variação Dia
                </th>
                <th className="py-3 px-3 text-right hidden md:table-cell">Máx / Mín</th>
                <th 
                  className="py-3 px-3 text-right hidden xl:table-cell cursor-pointer hover:underline"
                  onClick={() => {
                    setSortField('volume');
                    setSortDirection(d => d === 'desc' ? 'asc' : 'desc');
                  }}
                >
                  Volume B3
                </th>
                <th className="py-3 px-3 text-right hidden lg:table-cell">P/L</th>
                <th 
                  className="py-3 px-3 text-right cursor-pointer hover:underline select-none bg-emerald-50/50"
                  onClick={() => {
                    setSortField('dy');
                    setSortDirection(d => d === 'desc' ? 'asc' : 'desc');
                  }}
                  title="Dividend Yield Anualizado (Últimos 12 Meses)"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-bold text-emerald-950">DY Anualizado</span>
                    {sortField === 'dy' && (
                      <span className="text-[9px] font-bold text-emerald-800">{sortDirection === 'desc' ? '▼' : '▲'}</span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dcdad5]">
              {filteredStocks.map((stock) => {
                const isSelected = stock.ticker === selectedTicker;
                const isUp = stock.change >= 0;
                const isHighYield = stock.dividendYield >= 6.0;

                return (
                  <tr
                    key={stock.ticker}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#f8f7f4] font-semibold'
                        : 'hover:bg-[#fcfbf9]'
                    }`}
                    onClick={() => onSelectStock(stock.ticker)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#1a1a1a]">
                          {stock.ticker}
                        </span>
                        <span className="text-[10px] bg-[#f1f0ec] text-[#1a1a1a]/70 font-mono px-1 py-0.2">
                          {stock.exchange}
                        </span>
                        {isHighYield && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded-xs">
                            Top Yield
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#1a1a1a]/60 block truncate max-w-[200px]">
                        {stock.name}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-sm tabular-nums text-[#1a1a1a]">
                      {stock.currency === 'BRL' ? 'R$ ' : '$ '}{stock.price.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <span className={`font-bold block ${isUp ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                      <span className="text-[10px] text-[#1a1a1a]/60">
                        {isUp ? '+' : ''}R$ {stock.change.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[11px] text-[#1a1a1a]/70 hidden md:table-cell tabular-nums">
                      <div>R$ {stock.high24h.toFixed(2)}</div>
                      <div className="text-[#1a1a1a]/40">R$ {stock.low24h.toFixed(2)}</div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#1a1a1a] hidden xl:table-cell tabular-nums">
                      R$ {(stock.volume / 1000000).toFixed(1)}M
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#1a1a1a] hidden lg:table-cell tabular-nums">
                      {stock.peRatio.toFixed(1)}x
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums bg-emerald-50/30">
                      <div className="flex flex-col items-end">
                        <span className={`font-bold text-xs ${isHighYield ? 'text-emerald-800 font-extrabold' : 'text-[#1a1a1a]'}`}>
                          {stock.dividendYield.toFixed(1)}% a.a.
                        </span>
                        <span className="text-[9px] text-[#1a1a1a]/60">
                          ~R$ {(stock.price * stock.dividendYield / 100).toFixed(2)}/ação
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenOrderModal(stock, 'BUY')}
                          className="px-2 py-1 bg-[#1a1a1a] hover:bg-black text-[#f8f7f4] font-mono text-[10px] font-bold uppercase transition-colors"
                        >
                          Comprar
                        </button>
                        <button
                          onClick={() => onOpenOrderModal(stock, 'SELL')}
                          className="px-2 py-1 bg-white hover:bg-[#f1f0ec] text-[#1a1a1a] border border-[#1a1a1a] font-mono text-[10px] font-bold uppercase transition-colors"
                        >
                          Vender
                        </button>
                        <button
                          onClick={() => {
                            setCompareB(stock.ticker);
                            setShowComparator(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          title={`Comparar ${stock.ticker} no painel lateral`}
                          className="p-1 border border-[#dcdad5] hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f8f7f4] text-[#1a1a1a] transition-colors"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenTechnicalReport(stock)}
                          title="Análise Técnica"
                          className="p-1 border border-[#dcdad5] hover:border-[#1a1a1a] text-[#1a1a1a] transition-colors"
                        >
                          <BarChart3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenAlertModal(stock.ticker, stock.price)}
                          title="Alerta"
                          className="p-1 border border-[#dcdad5] hover:border-[#1a1a1a] text-[#1a1a1a] transition-colors"
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredStocks.length === 0 && (
            <div className="py-12 px-4 text-center bg-white border-t border-[#dcdad5]">
              <p className="font-serif italic text-lg text-[#1a1a1a] mb-1 font-bold">
                Nenhum ativo encontrado para os filtros selecionados
              </p>
              <p className="text-xs font-mono text-[#1a1a1a]/60 mb-4">
                Tente selecionar outro setor da B3 ou limpar os termos de busca.
              </p>
              <button
                onClick={() => {
                  setSelectedSector('ALL');
                  setFilterType('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-[#f8f7f4] font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
              >
                Limpar Filtros &amp; Ver Todos
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
