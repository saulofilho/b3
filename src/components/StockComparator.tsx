import React, { useState } from 'react';
import { ArrowLeftRight, Check, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';
import { StockQuote } from '../types/market';

interface StockComparatorProps {
  stocks: StockQuote[];
  initialTickerA?: string;
  initialTickerB?: string;
  onSelectStock: (ticker: string) => void;
  onOpenOrderModal: (stock: StockQuote, side: 'BUY' | 'SELL') => void;
}

export const StockComparator: React.FC<StockComparatorProps> = ({
  stocks,
  initialTickerA = 'PETR4',
  initialTickerB = 'VALE3',
  onSelectStock,
  onOpenOrderModal
}) => {
  const [tickerA, setTickerA] = useState<string>(initialTickerA);
  const [tickerB, setTickerB] = useState<string>(initialTickerB);

  const stockA = stocks.find(s => s.ticker === tickerA) || stocks[0];
  const stockB = stocks.find(s => s.ticker === tickerB) || stocks[1] || stocks[0];

  const handleSwap = () => {
    setTickerA(stockB.ticker);
    setTickerB(stockA.ticker);
  };

  const presets = [
    { label: 'PETR4 vs PRIO3 (Óleo & Gás)', a: 'PETR4', b: 'PRIO3' },
    { label: 'ITUB4 vs BBAS3 (Bancos & Dividendos)', a: 'ITUB4', b: 'BBAS3' },
    { label: 'VALE3 vs WEGE3 (Commodity vs Indústria)', a: 'VALE3', b: 'WEGE3' },
    { label: 'NVDA vs AAPL (Tech Global)', a: 'NVDA', b: 'AAPL' }
  ];

  // Helper to determine winner for each metric
  const getWinner = (valA: number, valB: number, higherIsBetter: boolean = true) => {
    if (valA === valB) return 'TIE';
    if (higherIsBetter) {
      return valA > valB ? 'A' : 'B';
    } else {
      return valA < valB ? 'A' : 'B';
    }
  };

  const dyWinner = getWinner(stockA.dividendYield, stockB.dividendYield, true);
  const peWinner = getWinner(stockA.peRatio, stockB.peRatio, false); // Lower P/E is cheaper
  const pvpWinner = getWinner(stockA.pvp, stockB.pvp, false); // Lower P/VP is cheaper
  const roeWinner = getWinner(stockA.roe, stockB.roe, true); // Higher ROE is better
  const marginWinner = getWinner(stockA.netMargin, stockB.netMargin, true); // Higher Margin is better
  const debtWinner = getWinner(stockA.netDebtEbitda, stockB.netDebtEbitda, false); // Lower Debt is healthier
  const volumeWinner = getWinner(stockA.volume, stockB.volume, true); // Higher Volume is more liquid

  return (
    <div className="border border-[#1a1a1a] bg-white p-5 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#1a1a1a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full inline-block" />
            <h3 className="font-serif italic font-bold text-2xl text-[#1a1a1a]">
              Comparador Lateral de Ativos
            </h3>
          </div>
          <p className="label-mono mt-1 text-[#1a1a1a]/60">
            Análise consolidada de múltiplos, dividendos, rentabilidade e liquidez
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="label-mono text-[#1a1a1a]/60 mr-1">Duelos Sugeridos:</span>
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => {
                setTickerA(p.a);
                setTickerB(p.b);
              }}
              className="px-2 py-1 bg-[#f8f7f4] hover:bg-[#1a1a1a] hover:text-[#f8f7f4] border border-[#dcdad5] hover:border-[#1a1a1a] text-[10px] font-mono transition-colors cursor-pointer"
            >
              {p.a} x {p.b}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 bg-[#f8f7f4] border border-[#dcdad5] p-3">
        {/* Ativo A Selector */}
        <div>
          <label className="label-mono block mb-1 text-[#1a1a1a] font-bold">Ativo A (Referência)</label>
          <select
            value={tickerA}
            onChange={(e) => setTickerA(e.target.value)}
            className="w-full bg-white border border-[#1a1a1a] px-3 py-2 text-xs font-mono font-bold text-[#1a1a1a] focus:outline-none cursor-pointer"
          >
            {stocks.map(s => (
              <option key={`a-${s.ticker}`} value={s.ticker} disabled={s.ticker === tickerB}>
                {s.ticker} — {s.name} ({s.currency === 'BRL' ? 'R$' : '$'} {s.price.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center pt-2 md:pt-4">
          <button
            onClick={handleSwap}
            className="p-2 bg-white hover:bg-[#1a1a1a] hover:text-white border border-[#1a1a1a] text-[#1a1a1a] transition-colors cursor-pointer"
            title="Inverter Ativos"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Ativo B Selector */}
        <div>
          <label className="label-mono block mb-1 text-[#1a1a1a] font-bold">Ativo B (Comparado)</label>
          <select
            value={tickerB}
            onChange={(e) => setTickerB(e.target.value)}
            className="w-full bg-white border border-[#1a1a1a] px-3 py-2 text-xs font-mono font-bold text-[#1a1a1a] focus:outline-none cursor-pointer"
          >
            {stocks.map(s => (
              <option key={`b-${s.ticker}`} value={s.ticker} disabled={s.ticker === tickerA}>
                {s.ticker} — {s.name} ({s.currency === 'BRL' ? 'R$' : '$'} {s.price.toFixed(2)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Consolidated Comparison Table */}
      <div className="overflow-x-auto border border-[#1a1a1a]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#1a1a1a] bg-[#1a1a1a] text-[#f8f7f4] font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 w-1/3">Métrica Financeira</th>
              <th className="py-3 px-4 w-1/3 text-center bg-[#242424] border-r border-[#333]">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-bold text-sm text-white">{stockA.ticker}</span>
                  <span className="text-[10px] text-white/60">({stockA.exchange})</span>
                </div>
                <div className="text-[10px] text-white/70 font-sans truncate max-w-[200px] mx-auto">
                  {stockA.name}
                </div>
              </th>
              <th className="py-3 px-4 w-1/3 text-center bg-[#2a2a2a]">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-bold text-sm text-white">{stockB.ticker}</span>
                  <span className="text-[10px] text-white/60">({stockB.exchange})</span>
                </div>
                <div className="text-[10px] text-white/70 font-sans truncate max-w-[200px] mx-auto">
                  {stockB.name}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dcdad5] font-mono text-xs">
            
            {/* Cotação Atual */}
            <tr className="hover:bg-[#fcfbf9]">
              <td className="py-3 px-4 font-bold text-[#1a1a1a]">Cotação Atual</td>
              <td className="py-3 px-4 text-center border-r border-[#dcdad5]">
                <span className="text-sm font-bold tabular-nums">
                  {stockA.currency === 'BRL' ? 'R$ ' : '$ '}{stockA.price.toFixed(2)}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className="text-sm font-bold tabular-nums">
                  {stockB.currency === 'BRL' ? 'R$ ' : '$ '}{stockB.price.toFixed(2)}
                </span>
              </td>
            </tr>

            {/* Variação Dia */}
            <tr className="hover:bg-[#fcfbf9]">
              <td className="py-3 px-4 font-bold text-[#1a1a1a]">Variação do Dia</td>
              <td className="py-3 px-4 text-center border-r border-[#dcdad5]">
                <span className={`font-bold px-2 py-0.5 rounded-full text-white text-[10px] ${stockA.change >= 0 ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                  {stockA.change >= 0 ? '+' : ''}{stockA.changePercent.toFixed(2)}%
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`font-bold px-2 py-0.5 rounded-full text-white text-[10px] ${stockB.change >= 0 ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                  {stockB.change >= 0 ? '+' : ''}{stockB.changePercent.toFixed(2)}%
                </span>
              </td>
            </tr>

            {/* Dividend Yield (12M) */}
            <tr className="bg-emerald-50/40 hover:bg-emerald-50/60 font-semibold">
              <td className="py-3 px-4 text-emerald-950 flex items-center justify-between">
                <span>Dividend Yield (12M Anual)</span>
                <span className="label-mono text-emerald-800 text-[9px]">Proventos</span>
              </td>
              <td className={`py-3 px-4 text-center border-r border-[#dcdad5] tabular-nums ${dyWinner === 'A' ? 'bg-emerald-100/60 text-emerald-900 font-extrabold' : ''}`}>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-sm">{stockA.dividendYield.toFixed(1)}% a.a.</span>
                  {dyWinner === 'A' && <span className="text-[9px] bg-emerald-700 text-white px-1 py-0.2 rounded-xs">Vantagem</span>}
                </div>
                <span className="text-[10px] text-[#1a1a1a]/60 block font-normal">
                  ~R$ {(stockA.price * stockA.dividendYield / 100).toFixed(2)}/ação
                </span>
              </td>
              <td className={`py-3 px-4 text-center tabular-nums ${dyWinner === 'B' ? 'bg-emerald-100/60 text-emerald-900 font-extrabold' : ''}`}>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-sm">{stockB.dividendYield.toFixed(1)}% a.a.</span>
                  {dyWinner === 'B' && <span className="text-[9px] bg-emerald-700 text-white px-1 py-0.2 rounded-xs">Vantagem</span>}
                </div>
                <span className="text-[10px] text-[#1a1a1a]/60 block font-normal">
                  ~R$ {(stockB.price * stockB.dividendYield / 100).toFixed(2)}/ação
                </span>
              </td>
            </tr>

            {/* Múltiplo P/L */}
            <tr className="hover:bg-[#fcfbf9]">
              <td className="py-3 px-4 font-bold text-[#1a1a1a]">Preço / Lucro (P/L)</td>
              <td className={`py-3 px-4 text-center border-r border-[#dcdad5] tabular-nums ${peWinner === 'A' ? 'bg-emerald-50 text-emerald-900 font-bold' : ''}`}>
                <span>{stockA.peRatio.toFixed(1)}x</span>
                {peWinner === 'A' && <span className="text-[9px] text-emerald-700 ml-1.5 font-bold">Mais Barata</span>}
              </td>
              <td className={`py-3 px-4 text-center tabular-nums ${peWinner === 'B' ? 'bg-emerald-50 text-emerald-900 font-bold' : ''}`}>
                <span>{stockB.peRatio.toFixed(1)}x</span>
                {peWinner === 'B' && <span className="text-[9px] text-emerald-700 ml-1.5 font-bold">Mais Barata</span>}
              </td>
            </tr>

            {/* Múltiplo P/VP */}
            <tr className="hover:bg-[#fcfbf9]">
              <td className="py-3 px-4 font-bold text-[#1a1a1a]">Preço / Valor Patrimonial (P/VP)</td>
              <td className={`py-3 px-4 text-center border-r border-[#dcdad5] tabular-nums ${pvpWinner === 'A' ? 'bg-emerald-50 text-emerald-900 font-bold' : ''}`}>
                <span>{stockA.pvp.toFixed(1)}x</span>
                {pvpWinner === 'A' && <span className="text-[9px] text-emerald-700 ml-1.5 font-bold">Mais Descontada</span>}
              </td>
              <td className={`py-3 px-4 text-center tabular-nums ${pvpWinner === 'B' ? 'bg-emerald-50 text-emerald-900 font-bold' : ''}`}>
                <span>{stockB.pvp.toFixed(1)}x</span>
                {pvpWinner === 'B' && <span className="text-[9px] text-emerald-700 ml-1.5 font-bold">Mais Descontada</span>}
              </td>
            </tr>

            {/* ROE */}
            <tr className="hover:bg-[#fcfbf9]">
              <td className="py-3 px-4 font-bold text-[#1a1a1a]">Retorno s/ Patrimônio (ROE)</td>
              <td className={`py-3 px-4 text-center border-r border-[#dcdad5] tabular-nums ${roeWinner === 'A' ? 'bg-emerald-50 text-emerald-900 font-bold' : ''}`}>
                <span>{stockA.roe.toFixed(1)}%</span>
                {roeWinner === 'A' && <span className="text-[9px] text-emerald-700 ml-1.5 font-bold">Maior Eficiência</span>}
              </td>
              <td className={`py-3 px-4 text-center tabular-nums ${roeWinner === 'B' ? 'bg-emerald-50 text-emerald-900 font-bold' : ''}`}>
                <span>{stockB.roe.toFixed(1)}%</span>
                {roeWinner === 'B' && <span className="text-[9px] text-emerald-700 ml-1.5 font-bold">Maior Eficiência</span>}
              </td>
            </tr>

            {/* Margem Líquida */}
            <tr className="hover:bg-[#fcfbf9]">
              <td className="py-3 px-4 font-bold text-[#1a1a1a]">Margem Líquida</td>
              <td className={`py-3 px-4 text-center border-r border-[#dcdad5] tabular-nums ${marginWinner === 'A' ? 'bg-emerald-50 text-emerald-900 font-bold' : ''}`}>
                <span>{stockA.netMargin.toFixed(1)}%</span>
                {marginWinner === 'A' && <span className="text-[9px] text-emerald-700 ml-1.5 font-bold">Mais Rentável</span>}
              </td>
              <td className={`py-3 px-4 text-center tabular-nums ${marginWinner === 'B' ? 'bg-emerald-50 text-emerald-900 font-bold' : ''}`}>
                <span>{stockB.netMargin.toFixed(1)}%</span>
                {marginWinner === 'B' && <span className="text-[9px] text-emerald-700 ml-1.5 font-bold">Mais Rentável</span>}
              </td>
            </tr>

            {/* Dívida Líq / EBITDA */}
            <tr className="hover:bg-[#fcfbf9]">
              <td className="py-3 px-4 font-bold text-[#1a1a1a]">Alavancagem (Dív. Líq. / EBITDA)</td>
              <td className={`py-3 px-4 text-center border-r border-[#dcdad5] tabular-nums ${debtWinner === 'A' ? 'bg-emerald-50 text-emerald-900 font-bold' : ''}`}>
                <span>{stockA.netDebtEbitda.toFixed(2)}x</span>
                {debtWinner === 'A' && <span className="text-[9px] text-emerald-700 ml-1.5 font-bold">Menor Risco</span>}
              </td>
              <td className={`py-3 px-4 text-center tabular-nums ${debtWinner === 'B' ? 'bg-emerald-50 text-emerald-900 font-bold' : ''}`}>
                <span>{stockB.netDebtEbitda.toFixed(2)}x</span>
                {debtWinner === 'B' && <span className="text-[9px] text-emerald-700 ml-1.5 font-bold">Menor Risco</span>}
              </td>
            </tr>

            {/* Beta */}
            <tr className="hover:bg-[#fcfbf9]">
              <td className="py-3 px-4 font-bold text-[#1a1a1a]">Beta (Sensibilidade vs IBOV)</td>
              <td className="py-3 px-4 text-center border-r border-[#dcdad5] tabular-nums">
                <span>{stockA.beta.toFixed(2)}</span>
                <span className="text-[10px] text-[#1a1a1a]/50 block">
                  {stockA.beta > 1 ? 'Mais Volátil' : 'Menos Volátil'}
                </span>
              </td>
              <td className="py-3 px-4 text-center tabular-nums">
                <span>{stockB.beta.toFixed(2)}</span>
                <span className="text-[10px] text-[#1a1a1a]/50 block">
                  {stockB.beta > 1 ? 'Mais Volátil' : 'Menos Volátil'}
                </span>
              </td>
            </tr>

            {/* Volume Diário */}
            <tr className="hover:bg-[#fcfbf9]">
              <td className="py-3 px-4 font-bold text-[#1a1a1a]">Volume Financeiro Diário</td>
              <td className={`py-3 px-4 text-center border-r border-[#dcdad5] tabular-nums ${volumeWinner === 'A' ? 'font-bold text-[#1a1a1a]' : ''}`}>
                R$ {(stockA.volume / 1000000).toFixed(1)}M
              </td>
              <td className={`py-3 px-4 text-center tabular-nums ${volumeWinner === 'B' ? 'font-bold text-[#1a1a1a]' : ''}`}>
                R$ {(stockB.volume / 1000000).toFixed(1)}M
              </td>
            </tr>

            {/* Setor */}
            <tr className="bg-[#f8f7f4]">
              <td className="py-3 px-4 font-bold text-[#1a1a1a]">Setor de Atuação</td>
              <td className="py-3 px-4 text-center border-r border-[#dcdad5] text-[11px] font-sans">
                {stockA.sector}
              </td>
              <td className="py-3 px-4 text-center text-[11px] font-sans">
                {stockB.sector}
              </td>
            </tr>

            {/* Ações / Ordens */}
            <tr className="bg-white">
              <td className="py-4 px-4 font-bold text-[#1a1a1a]">Operações Diretas</td>
              <td className="py-4 px-4 text-center border-r border-[#dcdad5]">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onSelectStock(stockA.ticker)}
                    className="px-2.5 py-1.5 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f8f7f4] text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                  >
                    Ver Gráfico
                  </button>
                  <button
                    onClick={() => onOpenOrderModal(stockA, 'BUY')}
                    className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-[#f8f7f4] text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                  >
                    Comprar {stockA.ticker}
                  </button>
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onSelectStock(stockB.ticker)}
                    className="px-2.5 py-1.5 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f8f7f4] text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                  >
                    Ver Gráfico
                  </button>
                  <button
                    onClick={() => onOpenOrderModal(stockB, 'BUY')}
                    className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-[#f8f7f4] text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                  >
                    Comprar {stockB.ticker}
                  </button>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
};
