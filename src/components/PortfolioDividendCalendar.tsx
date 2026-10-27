import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Coins, 
  Info, 
  ArrowUpRight, 
  Filter,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { SimulatedPortfolio, StockQuote, DividendEvent, DividendType } from '../types/market';
import { INITIAL_DIVIDENDS } from '../data/mockMarketData';

interface PortfolioDividendCalendarProps {
  portfolio: SimulatedPortfolio;
  stocks: StockQuote[];
  onSelectStock: (ticker: string) => void;
  onOpenOrderModal: (stock: StockQuote, side: 'BUY' | 'SELL') => void;
}

export const PortfolioDividendCalendar: React.FC<PortfolioDividendCalendarProps> = ({
  portfolio,
  stocks,
  onSelectStock,
  onOpenOrderModal
}) => {
  const [filterScope, setFilterScope] = useState<'PORTFOLIO' | 'ALL'>('PORTFOLIO');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterMonth, setFilterMonth] = useState<string>('ALL');

  // Map user's current positions for instant lookup
  const userPositionsMap = useMemo(() => {
    const map = new Map<string, number>();
    portfolio.positions.forEach(pos => {
      map.set(pos.ticker, pos.quantity);
    });
    return map;
  }, [portfolio.positions]);

  // Enriched dividend events with portfolio calculations
  const enrichedDividends = useMemo(() => {
    return INITIAL_DIVIDENDS.map(div => {
      const userQty = userPositionsMap.get(div.ticker) || 0;
      const isInPortfolio = userQty > 0;
      const totalGrossAmount = userQty * div.valuePerShare;
      const totalNetAmount = userQty * div.netValuePerShare;

      // Extract month-year
      const parts = div.paymentDate.split('/');
      const monthYear = parts.length === 3 ? `${parts[1]}/${parts[2]}` : 'Outros';

      return {
        ...div,
        userQty,
        isInPortfolio,
        totalGrossAmount,
        totalNetAmount,
        monthYear
      };
    });
  }, [userPositionsMap]);

  // Available months from dataset
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    enrichedDividends.forEach(d => months.add(d.monthYear));
    return Array.from(months);
  }, [enrichedDividends]);

  // Filtered dividends list
  const filteredDividends = useMemo(() => {
    return enrichedDividends.filter(div => {
      // Scope filter
      if (filterScope === 'PORTFOLIO' && !div.isInPortfolio) {
        return false;
      }

      // Type filter
      if (filterType !== 'ALL' && div.type !== filterType) {
        return false;
      }

      // Month filter
      if (filterMonth !== 'ALL' && div.monthYear !== filterMonth) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by ex-date
      const parseDate = (dStr: string) => {
        const [day, month, year] = dStr.split('/').map(Number);
        return new Date(year, month - 1, day).getTime();
      };
      return parseDate(a.exDate) - parseDate(b.exDate);
    });
  }, [enrichedDividends, filterScope, filterType, filterMonth]);

  // Overall statistics for portfolio dividends
  const portfolioStats = useMemo(() => {
    const portfolioOnly = enrichedDividends.filter(d => d.isInPortfolio);
    const totalExpectedNet = portfolioOnly.reduce((acc, d) => acc + d.totalNetAmount, 0);
    const totalExpectedGross = portfolioOnly.reduce((acc, d) => acc + d.totalGrossAmount, 0);
    const confirmedCount = portfolioOnly.filter(d => d.status === 'CONFIRMADO').length;
    const upcomingPayments = [...portfolioOnly].sort((a, b) => {
      const parseDate = (dStr: string) => {
        const [day, month, year] = dStr.split('/').map(Number);
        return new Date(year, month - 1, day).getTime();
      };
      return parseDate(a.paymentDate) - parseDate(b.paymentDate);
    });

    const nextPayment = upcomingPayments[0] || null;
    const nextExDate = [...portfolioOnly].sort((a, b) => {
      const parseDate = (dStr: string) => {
        const [day, month, year] = dStr.split('/').map(Number);
        return new Date(year, month - 1, day).getTime();
      };
      return parseDate(a.exDate) - parseDate(b.exDate);
    })[0] || null;

    // Monthly breakdown
    const monthlyTotals: Record<string, number> = {};
    portfolioOnly.forEach(d => {
      monthlyTotals[d.monthYear] = (monthlyTotals[d.monthYear] || 0) + d.totalNetAmount;
    });

    return {
      totalExpectedNet,
      totalExpectedGross,
      confirmedCount,
      totalEvents: portfolioOnly.length,
      nextPayment,
      nextExDate,
      monthlyTotals
    };
  }, [enrichedDividends]);

  return (
    <div className="border border-[#1a1a1a] bg-white p-5 shadow-2xs space-y-6">
      
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#dcdad5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-700"></span>
            <h3 className="font-serif italic text-2xl font-bold text-[#1a1a1a]">
              Calendário de Dividendos &amp; JCP
            </h3>
            <span className="bg-[#1a1a1a] text-white text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider font-bold">
              Renda Passiva B3
            </span>
          </div>
          <p className="text-xs text-[#1a1a1a]/60 font-mono mt-1">
            Acompanhe datas 'ex' de corte, calendários de pagamento previstos e créditos projetados na sua carteira.
          </p>
        </div>

        {/* Scope Selector: Minha Carteira vs Todos */}
        <div className="flex items-center gap-1.5 bg-[#f8f7f4] border border-[#1a1a1a] p-1">
          <button
            onClick={() => setFilterScope('PORTFOLIO')}
            className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterScope === 'PORTFOLIO'
                ? 'bg-[#1a1a1a] text-white shadow-2xs'
                : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Minha Carteira ({portfolio.positions.length} ativos)</span>
          </button>

          <button
            onClick={() => setFilterScope('ALL')}
            className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterScope === 'ALL'
                ? 'bg-[#1a1a1a] text-white shadow-2xs'
                : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Radar Geral B3</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Dividend Projections Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-[#f8f7f4] border border-[#1a1a1a] p-4">
        
        {/* Total Líquido a Receber */}
        <div className="space-y-1">
          <div className="label-mono flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-[#1a1a1a]" />
            Total Previsto na Carteira
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-700 tabular-nums">
            R$ {portfolioStats.totalExpectedNet.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] font-mono text-[#1a1a1a]/60">
            Líquido já descontado 15% IR nos JCPs
          </div>
        </div>

        {/* Próximo Pagamento */}
        <div className="space-y-1">
          <div className="label-mono flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#1a1a1a]" />
            Próximo Pagamento Previsto
          </div>
          {portfolioStats.nextPayment ? (
            <div>
              <div className="font-mono text-xl font-bold text-[#1a1a1a]">
                {portfolioStats.nextPayment.paymentDate}
              </div>
              <div className="text-[11px] font-mono text-emerald-700 font-bold mt-0.5">
                {portfolioStats.nextPayment.ticker}: +R$ {portfolioStats.nextPayment.totalNetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#1a1a1a]/60 font-mono">Nenhum agendado</div>
          )}
        </div>

        {/* Próxima Data-Com / Data-Ex */}
        <div className="space-y-1">
          <div className="label-mono flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#1a1a1a]" />
            Próxima Data-Ex de Corte
          </div>
          {portfolioStats.nextExDate ? (
            <div>
              <div className="font-mono text-xl font-bold text-rose-700">
                {portfolioStats.nextExDate.exDate}
              </div>
              <div className="text-[11px] font-mono text-[#1a1a1a]/80 mt-0.5">
                {portfolioStats.nextExDate.ticker} ({portfolioStats.nextExDate.type})
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#1a1a1a]/60 font-mono">Sem datas pendentes</div>
          )}
        </div>

        {/* Proventos Confirmados vs Previstos */}
        <div className="space-y-1">
          <div className="label-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#1a1a1a]" />
            Status das Distribuições
          </div>
          <div className="font-mono text-2xl font-bold text-[#1a1a1a] tabular-nums">
            {portfolioStats.confirmedCount} <span className="text-xs font-normal text-[#1a1a1a]/60">de {portfolioStats.totalEvents} confirmados</span>
          </div>
          <div className="text-[10px] font-mono text-[#1a1a1a]/60">
            Aprovados em Conselhos e AGOs
          </div>
        </div>

      </div>

      {/* Monthly Projections Strip */}
      {Object.keys(portfolioStats.monthlyTotals).length > 0 && (
        <div className="border border-[#1a1a1a] p-3.5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="label-mono flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-700" />
              Previsão de Renda Mensal da Carteira (Fluxo de Caixa):
            </span>
            <span className="text-[10px] font-mono text-[#1a1a1a]/60">
              Proventos creditados diretamente em saldo
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(portfolioStats.monthlyTotals).map(([monthYear, totalAmount]) => (
              <div key={monthYear} className="border border-[#dcdad5] bg-[#fcfbf9] p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#1a1a1a]/60 uppercase block">Mês de Crédito</span>
                  <span className="font-mono font-bold text-sm text-[#1a1a1a]">{monthYear}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase block">Renda Estimada</span>
                  <span className="font-mono font-bold text-sm text-emerald-700">
                    R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dcdad5] pb-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-mono flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Tipo:
          </span>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-2.5 py-1 border transition-colors cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold'
                : 'bg-white text-[#1a1a1a]/70 border-[#dcdad5] hover:border-[#1a1a1a]'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('DIVIDENDO')}
            className={`px-2.5 py-1 border transition-colors cursor-pointer ${
              filterType === 'DIVIDENDO'
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold'
                : 'bg-white text-[#1a1a1a]/70 border-[#dcdad5] hover:border-[#1a1a1a]'
            }`}
          >
            Apenas Dividendos
          </button>
          <button
            onClick={() => setFilterType('JCP')}
            className={`px-2.5 py-1 border transition-colors cursor-pointer ${
              filterType === 'JCP'
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold'
                : 'bg-white text-[#1a1a1a]/70 border-[#dcdad5] hover:border-[#1a1a1a]'
            }`}
          >
            Apenas JCP (Líq.)
          </button>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-1.5">
          <span className="label-mono">Mês Pagamento:</span>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-2 py-1 bg-white border border-[#1a1a1a] text-xs font-mono text-[#1a1a1a] cursor-pointer focus:outline-none"
          >
            <option value="ALL">Todos os Meses</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table: Dividend Calendar Events */}
      <div className="border border-[#1a1a1a] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1a1a1a] bg-[#f1f0ec] text-[#1a1a1a] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Ativo</th>
                <th className="py-3 px-3">Tipo</th>
                <th className="py-3 px-3 text-center">Data-Ex (Corte)</th>
                <th className="py-3 px-3 text-center">Data Pagamento</th>
                <th className="py-3 px-3 text-right">Valor / Ação</th>
                <th className="py-3 px-3 text-right">Qtd em Carteira</th>
                <th className="py-3 px-4 text-right">Total a Receber</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dcdad5]">
              {filteredDividends.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#1a1a1a]/60 font-mono">
                    Nenhum provento agendado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredDividends.map((div) => {
                  const stockRef = stocks.find(s => s.ticker === div.ticker);
                  const isDividend = div.type === 'DIVIDENDO';

                  return (
                    <tr 
                      key={div.id} 
                      className={`hover:bg-[#fcfbf9] transition-colors ${
                        div.isInPortfolio ? 'bg-white' : 'bg-[#faf9f6]/60'
                      }`}
                    >
                      {/* Ativo */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onSelectStock(div.ticker)}
                          className="text-left cursor-pointer group block"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-sm text-[#1a1a1a] group-hover:underline">
                              {div.ticker}
                            </span>
                            {div.isInPortfolio && (
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[9px] font-mono px-1 py-0.2">
                                Em Carteira
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#1a1a1a]/60 font-sans block truncate max-w-[160px]">
                            {div.assetName}
                          </span>
                        </button>
                      </td>

                      {/* Tipo de Provento */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase inline-block ${
                          isDividend 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {div.type}
                        </span>
                        <span className="block text-[9px] text-[#1a1a1a]/50 font-mono mt-0.5">
                          {isDividend ? 'Isento de IR' : '15% IR Fonte'}
                        </span>
                      </td>

                      {/* Data-Ex (Corte) */}
                      <td className="py-3 px-3 text-center font-mono">
                        <span className="font-bold text-[#1a1a1a] block">
                          {div.exDate}
                        </span>
                        <span className="text-[10px] text-rose-700 font-bold block">
                          Data-Com véspera
                        </span>
                      </td>

                      {/* Data de Pagamento */}
                      <td className="py-3 px-3 text-center font-mono">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                          {div.paymentDate}
                        </span>
                      </td>

                      {/* Valor / Ação */}
                      <td className="py-3 px-3 text-right font-mono tabular-nums">
                        <span className="font-bold text-[#1a1a1a] block">
                          R$ {div.valuePerShare.toFixed(3)}
                        </span>
                        {!isDividend && (
                          <span className="text-[10px] text-[#1a1a1a]/60 block">
                            Líq: R$ {div.netValuePerShare.toFixed(3)}
                          </span>
                        )}
                      </td>

                      {/* Quantidade na Carteira */}
                      <td className="py-3 px-3 text-right font-mono tabular-nums">
                        {div.isInPortfolio ? (
                          <span className="font-bold text-[#1a1a1a] text-sm">
                            {div.userQty.toLocaleString('pt-BR')} <span className="text-[10px] font-normal text-[#1a1a1a]/60">ações</span>
                          </span>
                        ) : (
                          <span className="text-[#1a1a1a]/40 text-xs">—</span>
                        )}
                      </td>

                      {/* Total a Receber */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        {div.isInPortfolio ? (
                          <div>
                            <span className="font-bold text-base text-emerald-700 block">
                              R$ {div.totalNetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            {!isDividend && (
                              <span className="text-[9px] text-[#1a1a1a]/50 block">
                                Bruto: R$ {div.totalGrossAmount.toFixed(2)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-[#1a1a1a]/50 italic">
                            Fora da carteira
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 font-bold uppercase ${
                          div.status === 'CONFIRMADO'
                            ? 'bg-[#1a1a1a] text-white'
                            : 'bg-[#f1f0ec] text-[#1a1a1a]/70 border border-[#dcdad5]'
                        }`}>
                          {div.status === 'CONFIRMADO' && <CheckCircle2 className="w-2.5 h-2.5" />}
                          {div.status}
                        </span>
                      </td>

                      {/* Operação / Aporte */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            if (stockRef) onOpenOrderModal(stockRef, 'BUY');
                          }}
                          title={`Comprar mais ${div.ticker} antes da Data-Ex`}
                          className="px-2.5 py-1 bg-[#1a1a1a] hover:bg-black text-[#f8f7f4] text-[10px] font-mono font-bold uppercase transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>+ Comprar</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Explanatory Box on Dividend Regimes */}
      <div className="bg-[#f8f7f4] border-l-4 border-emerald-700 p-3.5 text-xs">
        <div className="font-mono font-bold uppercase text-[10px] text-[#1a1a1a] tracking-wider mb-1 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-700" />
          Regras de Custódia e Tributação de Proventos na B3:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[#1a1a1a]/80 font-sans mt-2">
          <div className="border border-[#dcdad5] bg-white p-2.5">
            <span className="font-mono font-bold text-xs text-[#1a1a1a] block mb-1">
              • Regra de "Data-Com" e "Data-Ex":
            </span>
            <p className="text-[11px] leading-relaxed">
              O investidor deve ter as ações em carteira até o fechamento do pregão da <strong>Data-Com</strong>. No dia da <strong>Data-Ex</strong>, o valor do provento é subtraído da cotação de abertura e novas compras não darão mais direito àquele pagamento específico.
            </p>
          </div>
          <div className="border border-[#dcdad5] bg-white p-2.5">
            <span className="font-mono font-bold text-xs text-[#1a1a1a] block mb-1">
              • Dividendos vs. Juros sobre Capital Próprio (JCP):
            </span>
            <p className="text-[11px] leading-relaxed">
              <strong>Dividendos</strong> são 100% isentos de Imposto de Renda para pessoa física. Já o <strong>JCP</strong> sofre incidência automática de 15% de IR retido na fonte pela instituição financeira, sendo creditado líquido na sua conta de liquidação.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
