import React from 'react';
import { ArrowUp, ArrowDown, Pause, Radio } from 'lucide-react';
import { StockQuote } from '../types/market';

interface MarketTickerBarProps {
  stocks: StockQuote[];
  onSelectStock: (ticker: string) => void;
  isLiveUpdating: boolean;
  onToggleLive: () => void;
  lastTickTime: string;
}

export const MarketTickerBar: React.FC<MarketTickerBarProps> = ({
  stocks,
  onSelectStock,
  isLiveUpdating,
  onToggleLive,
  lastTickTime
}) => {
  const macroIndices = [
    { label: 'IBOV', name: 'IBOVESPA', value: '133.480', change: '+1.18%', isPositive: true },
    { label: 'S&P500', name: 'S&P 500', value: '5.864', change: '+0.42%', isPositive: true },
    { label: 'DÓLAR', name: 'USD/BRL', value: '5,418', change: '-0.35%', isPositive: false },
    { label: 'SELIC', name: 'TAXA SELIC', value: '11,25%', change: '0.00%', isPositive: true },
    { label: 'BTC', name: 'BITCOIN', value: 'R$ 382.400', change: '+2.10%', isPositive: true }
  ];

  return (
    <div className="bg-[#1a1a1a] text-[#f8f7f4] py-2 px-4 sm:px-8 border-b border-[#1a1a1a] select-none text-xs font-mono">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6 overflow-hidden">
        
        {/* Live status badge & toggle */}
        <div className="flex items-center gap-2.5 shrink-0 border-r border-[#333] pr-4">
          <button
            onClick={onToggleLive}
            title={isLiveUpdating ? "Pausar cotações em tempo real" : "Ativar cotações em tempo real"}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#dcdad5] hover:text-white transition-colors cursor-pointer"
          >
            {isLiveUpdating ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>AO VIVO</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span className="text-amber-400">PAUSADO</span>
              </>
            )}
          </button>
          <span className="hidden sm:inline text-[10px] text-[#888] tabular-nums">
            {lastTickTime}
          </span>
        </div>

        {/* Ticker tape contents */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap py-0.5">
          {/* Macro Indices */}
          {macroIndices.map((idx, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] tracking-wider uppercase text-[#a09e98]">{idx.label}</span>
              <span className="text-[#f8f7f4] font-bold tabular-nums">{idx.value}</span>
              <span className={`tabular-nums font-bold ${idx.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {idx.change}
              </span>
            </div>
          ))}

          <span className="text-[#444]">|</span>

          {/* Active Stocks Tickers */}
          {stocks.slice(0, 8).map((stock) => {
            const isPos = stock.change >= 0;
            return (
              <button
                key={stock.ticker}
                onClick={() => onSelectStock(stock.ticker)}
                className="flex items-center gap-1.5 shrink-0 hover:text-emerald-300 transition-colors cursor-pointer text-left"
              >
                <span className="text-[10px] tracking-wider uppercase text-[#a09e98]">{stock.ticker}</span>
                <span className="text-[#f8f7f4] font-bold tabular-nums">
                  {stock.currency === 'BRL' ? 'R$ ' : '$ '}{stock.price.toFixed(2)}
                </span>
                <span className={`tabular-nums font-bold text-[11px] ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
