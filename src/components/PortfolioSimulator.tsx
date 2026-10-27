import React, { useState } from 'react';
import { 
  Briefcase, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  RotateCcw,
  History,
  Layers,
  Calendar
} from 'lucide-react';
import { SimulatedPortfolio, StockQuote } from '../types/market';
import { PortfolioEquityChart } from './PortfolioEquityChart';
import { PortfolioSectorDoughnut } from './PortfolioSectorDoughnut';
import { PortfolioBacktest } from './PortfolioBacktest';
import { PortfolioDividendCalendar } from './PortfolioDividendCalendar';

interface PortfolioSimulatorProps {
  portfolio: SimulatedPortfolio;
  stocks: StockQuote[];
  onOpenOrderModal: (stock: StockQuote, side: 'BUY' | 'SELL') => void;
  onAddFunds: (amount: number) => void;
  onResetPortfolio: () => void;
  onSelectStock: (ticker: string) => void;
}

export const PortfolioSimulator: React.FC<PortfolioSimulatorProps> = ({
  portfolio,
  stocks,
  onOpenOrderModal,
  onAddFunds,
  onResetPortfolio,
  onSelectStock
}) => {
  const [activeSection, setActiveSection] = useState<'POSITIONS' | 'DIVIDENDS' | 'BACKTEST'>('POSITIONS');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('ALL');

  const strategies = [
    'ALL',
    'Dividend Yield & Valor',
    'Quality Growth',
    'Swing Trade Médias',
    'IPOs & Oportunidades'
  ];

  const filteredPositions = portfolio.positions.filter(pos => {
    if (selectedStrategy === 'ALL') return true;
    return pos.strategyTag === selectedStrategy;
  });

  const isTotalReturnPositive = portfolio.totalReturnBRL >= 0;
  const isDayChangePositive = portfolio.dayChangeBRL >= 0;

  return (
    <div className="space-y-6">
      
      {/* Title & Controls */}
      <div className="border-b border-[#1a1a1a] pb-4 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <h2 className="font-serif italic text-3xl font-bold text-[#1a1a1a]">
            Portfólio Simulado
          </h2>
          <div className="label-mono mt-1">
            Teste de Estratégias de Investimento e Paper Trading
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddFunds(10000)}
            className="px-3 py-1.5 bg-white hover:bg-[#f1f0ec] text-[#1a1a1a] border border-[#1a1a1a] text-xs font-mono font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+R$ 10.000 Caixa</span>
          </button>

          <button
            onClick={onResetPortfolio}
            className="px-3 py-1.5 bg-white hover:bg-[#f1f0ec] text-[#1a1a1a]/70 hover:text-rose-700 border border-[#dcdad5] text-xs font-mono font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Resetar Portfólio para R$ 100.000 inicial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar</span>
          </button>
        </div>
      </div>

      {/* Top Section: Recharts Historical Equity Growth Chart */}
      <PortfolioEquityChart portfolio={portfolio} />

      {/* 4 Financial Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-[#1a1a1a] bg-white p-4 shadow-2xs">
          <div className="label-mono mb-1">Patrimônio Total</div>
          <div className="font-mono text-2xl font-bold text-[#1a1a1a] tabular-nums">
            R$ {portfolio.totalEquity.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[#1a1a1a]/50 font-mono mt-1">
            Capital Inicial: R$ {portfolio.initialCapital.toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="border border-[#1a1a1a] bg-white p-4 shadow-2xs">
          <div className="label-mono mb-1">Saldo Disponível (Caixa)</div>
          <div className="font-mono text-2xl font-bold text-[#1a1a1a] tabular-nums">
            R$ {portfolio.cashBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[#1a1a1a]/50 font-mono mt-1">
            Poder de Compra Imediato
          </div>
        </div>

        <div className="border border-[#1a1a1a] bg-white p-4 shadow-2xs">
          <div className="label-mono mb-1">Retorno Total Acumulado</div>
          <div className={`font-mono text-2xl font-bold tabular-nums ${isTotalReturnPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isTotalReturnPositive ? '+' : ''}R$ {portfolio.totalReturnBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className={`text-[11px] font-mono font-bold mt-1 ${isTotalReturnPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
            ({isTotalReturnPositive ? '+' : ''}{portfolio.totalReturnPercent.toFixed(2)}%)
          </div>
        </div>

        <div className="border border-[#1a1a1a] bg-white p-4 shadow-2xs">
          <div className="label-mono mb-1">Resultado do Pregão (Dia)</div>
          <div className={`font-mono text-2xl font-bold tabular-nums ${isDayChangePositive ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isDayChangePositive ? '+' : ''}R$ {portfolio.dayChangeBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className={`text-[11px] font-mono font-bold mt-1 ${isDayChangePositive ? 'text-emerald-700' : 'text-rose-700'}`}>
            ({isDayChangePositive ? '+' : ''}{portfolio.dayChangePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Portfolio Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1a1a1a] pb-2 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSection('POSITIONS')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 border cursor-pointer ${
              activeSection === 'POSITIONS'
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-xs'
                : 'bg-white text-[#1a1a1a]/70 border-[#dcdad5] hover:border-[#1a1a1a]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Posições &amp; Alocação ({portfolio.positions.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('DIVIDENDS')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 border cursor-pointer ${
              activeSection === 'DIVIDENDS'
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-xs'
                : 'bg-white text-[#1a1a1a]/70 border-[#dcdad5] hover:border-[#1a1a1a]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Calendário de Dividendos</span>
            <span className="bg-emerald-700 text-white text-[9px] px-1.5 py-0.2 font-mono">
              Renda Passiva
            </span>
          </button>

          <button
            onClick={() => setActiveSection('BACKTEST')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 border cursor-pointer ${
              activeSection === 'BACKTEST'
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-xs'
                : 'bg-white text-[#1a1a1a]/70 border-[#dcdad5] hover:border-[#1a1a1a]'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-500" />
            <span>Backtesting vs IBOV</span>
            <span className="bg-amber-700 text-white text-[9px] px-1.5 py-0.2 font-mono">
              Alpha
            </span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-[#1a1a1a]/60 hidden sm:block">
          {activeSection === 'POSITIONS' && 'Monitore posições abertas, P&L e pesos setoriais'}
          {activeSection === 'DIVIDENDS' && 'Acompanhe datas "ex" e pagamentos previstos dos seus ativos'}
          {activeSection === 'BACKTEST' && 'Simule horizontes de 1M a 2A comparados ao Ibovespa e CDI'}
        </div>
      </div>

      {activeSection === 'BACKTEST' && (
        <PortfolioBacktest portfolio={portfolio} stocks={stocks} />
      )}

      {activeSection === 'DIVIDENDS' && (
        <PortfolioDividendCalendar
          portfolio={portfolio}
          stocks={stocks}
          onSelectStock={onSelectStock}
          onOpenOrderModal={onOpenOrderModal}
        />
      )}

      {activeSection === 'POSITIONS' && (
        <>
          {/* Sector Allocation Doughnut Chart */}
          <PortfolioSectorDoughnut portfolio={portfolio} stocks={stocks} />

          {/* Strategies Filter */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
            <span className="label-mono shrink-0 mr-1">Estratégias:</span>
            {strategies.map((strat) => (
              <button
                key={strat}
                onClick={() => setSelectedStrategy(strat)}
                className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                  selectedStrategy === strat
                    ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold'
                    : 'bg-white text-[#1a1a1a]/70 border-[#dcdad5] hover:border-[#1a1a1a]'
                }`}
              >
                {strat === 'ALL' ? 'Todas as Posições' : strat}
              </button>
            ))}
          </div>

          {/* Positions Table */}
          <div className="border border-[#1a1a1a] bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#1a1a1a] bg-[#f1f0ec] text-[#1a1a1a] font-mono text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4">Ativo</th>
                    <th className="py-3 px-3">Estratégia</th>
                    <th className="py-3 px-3 text-right">Qtd</th>
                    <th className="py-3 px-3 text-right">Preço Médio</th>
                    <th className="py-3 px-3 text-right">Cotação Atual</th>
                    <th className="py-3 px-3 text-right">Valor Total</th>
                    <th className="py-3 px-3 text-right">Lucro/Prejuízo</th>
                    <th className="py-3 px-3 text-right">Dia</th>
                    <th className="py-3 px-3 text-right">% Carteira</th>
                    <th className="py-3 px-4 text-center">Operar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dcdad5]">
                  {filteredPositions.map((pos) => {
                    const isPnLPositive = pos.unrealizedPnL >= 0;
                    const isDayPositive = pos.dayPnL >= 0;
                    const stockRef = stocks.find(s => s.ticker === pos.ticker);

                    return (
                      <tr key={pos.ticker} className="hover:bg-[#fcfbf9] transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onSelectStock(pos.ticker)}
                            className="text-left cursor-pointer group"
                          >
                            <span className="font-mono font-bold text-sm text-[#1a1a1a] group-hover:underline block">
                              {pos.ticker}
                            </span>
                            <span className="text-[11px] text-[#1a1a1a]/60">
                              {pos.assetName}
                            </span>
                          </button>
                        </td>

                        <td className="py-3 px-3">
                          <span className="bg-[#f1f0ec] text-[#1a1a1a]/80 px-2 py-0.5 text-[10px] font-mono">
                            {pos.strategyTag}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                          {pos.quantity}
                        </td>

                        <td className="py-3 px-3 text-right font-mono tabular-nums text-[#1a1a1a]/80">
                          R$ {pos.avgPrice.toFixed(2)}
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-bold text-[#1a1a1a] tabular-nums">
                          R$ {pos.currentPrice.toFixed(2)}
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-bold text-[#1a1a1a] tabular-nums">
                          R$ {pos.currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          <span className={`font-bold block ${isPnLPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isPnLPositive ? '+' : ''}R$ {pos.unrealizedPnL.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-[#1a1a1a]/60">
                            {isPnLPositive ? '+' : ''}{pos.unrealizedPnLPercent.toFixed(2)}%
                          </span>
                        </td>

                        <td className={`py-3 px-3 text-right font-mono tabular-nums ${isDayPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {isDayPositive ? '+' : ''}{pos.dayPnLPercent.toFixed(2)}%
                        </td>

                        <td className="py-3 px-3 text-right font-mono text-[#1a1a1a]/80 tabular-nums">
                          {pos.allocationPercent.toFixed(1)}%
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                if (stockRef) onOpenOrderModal(stockRef, 'BUY');
                              }}
                              title="Comprar mais"
                              className="p-1 bg-[#1a1a1a] hover:bg-black text-[#f8f7f4] transition-colors"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (stockRef) onOpenOrderModal(stockRef, 'SELL');
                              }}
                              title="Vender ações"
                              className="p-1 bg-white hover:bg-[#f1f0ec] text-[#1a1a1a] border border-[#1a1a1a] transition-colors"
                            >
                              <ArrowDownRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Prompt banner for dividend calendar */}
          <div className="bg-[#f8f7f4] border border-[#1a1a1a] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-mono font-bold text-xs text-[#1a1a1a] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                Proventos Previstos: PETR4, WEGE3 e ITUB4 com datas-ex confirmadas
              </div>
              <p className="text-xs text-[#1a1a1a]/70 font-sans mt-0.5">
                Consulte o cronograma de pagamentos, retenção de IR em JCPs e créditos de renda passiva projetados na carteira.
              </p>
            </div>
            <button
              onClick={() => setActiveSection('DIVIDENDS')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-mono font-bold uppercase transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>Ver Calendário de Dividendos</span>
              <span>→</span>
            </button>
          </div>

          {/* Prompt banner to test backtest */}
          <div className="bg-[#f8f7f4] border border-[#1a1a1a] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-mono font-bold text-xs text-[#1a1a1a] uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-4 h-4 text-amber-600" />
                Deseja testar essa alocação contra o Ibovespa nos últimos 6 meses?
              </div>
              <p className="text-xs text-[#1a1a1a]/70 font-sans mt-0.5">
                Acesse o motor de simulação retroativa com cálculo automático de Sharpe, Drawdown e geração de Alpha.
              </p>
            </div>
            <button
              onClick={() => setActiveSection('BACKTEST')}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-white text-xs font-mono font-bold uppercase transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>Abrir Backtesting vs IBOV</span>
              <span>→</span>
            </button>
          </div>
        </>
      )}

    </div>
  );
};
