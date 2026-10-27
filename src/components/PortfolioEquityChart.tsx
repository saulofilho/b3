import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingUp, ShieldCheck, Calendar, Activity } from 'lucide-react';
import { SimulatedPortfolio } from '../types/market';

interface PortfolioEquityChartProps {
  portfolio: SimulatedPortfolio;
}

type TimeframeOption = '1M' | '3M' | '6M' | '1A' | 'TUDO';

export const PortfolioEquityChart: React.FC<PortfolioEquityChartProps> = ({ portfolio }) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('3M');
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);

  // Generate historical equity curve points anchored to portfolio initialCapital and current totalEquity
  const chartData = useMemo(() => {
    const pointsCount = timeframe === '1M' ? 30 : timeframe === '3M' ? 60 : timeframe === '6M' ? 90 : 120;
    const data: {
      date: string;
      patrimonio: number;
      ibovespa: number;
      cdi: number;
      caixa: number;
    }[] = [];

    const now = new Date();
    const startVal = portfolio.initialCapital;
    const targetVal = portfolio.totalEquity;
    const totalGrowthRatio = targetVal / startVal;

    // Synthetic historical walk with realistic market volatility
    let currentEquity = startVal;
    let currentIbov = startVal;
    let currentCdi = startVal;

    const baseDates: Date[] = [];
    for (let i = pointsCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      baseDates.push(d);
    }

    baseDates.forEach((date, idx) => {
      const progress = idx / (pointsCount - 1 || 1);
      
      // Interpolate towards target totalEquity with gentle random noise
      const trend = startVal + (targetVal - startVal) * Math.pow(progress, 0.95);
      const noise = (Math.sin(idx * 0.4) * 0.012 + Math.cos(idx * 0.25) * 0.008) * startVal;
      currentEquity = idx === pointsCount - 1 ? targetVal : +(trend + (idx > 0 && idx < pointsCount - 1 ? noise : 0)).toFixed(2);

      // Benchmarks: CDI compound ~ 11.25% p.a. and Ibov index walk
      const cdiReturn = 1 + (0.1125 / 252) * (pointsCount - (pointsCount - idx));
      currentCdi = +(startVal * cdiReturn).toFixed(2);

      const ibovReturn = 1 + (0.07 / 252) * idx + (Math.cos(idx * 0.3) * 0.02);
      currentIbov = +(startVal * ibovReturn).toFixed(2);

      const dateLabel = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

      data.push({
        date: dateLabel,
        patrimonio: Math.max(startVal * 0.8, currentEquity),
        ibovespa: Math.round(currentIbov),
        cdi: Math.round(currentCdi),
        caixa: Math.round(portfolio.cashBalance)
      });
    });

    return data;
  }, [timeframe, portfolio.initialCapital, portfolio.totalEquity, portfolio.cashBalance]);

  // Quantitative Stats
  const minEquity = useMemo(() => Math.min(...chartData.map(d => d.patrimonio)), [chartData]);
  const maxEquity = useMemo(() => Math.max(...chartData.map(d => d.patrimonio)), [chartData]);
  const totalReturnPct = ((portfolio.totalEquity - portfolio.initialCapital) / portfolio.initialCapital) * 100;
  const isPositive = totalReturnPct >= 0;

  // Custom Recharts Tooltip styled in Variation 6 Broadsheet
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pVal = payload.find((p: any) => p.dataKey === 'patrimonio')?.value;
      const ibovVal = payload.find((p: any) => p.dataKey === 'ibovespa')?.value;
      const cdiVal = payload.find((p: any) => p.dataKey === 'cdi')?.value;

      return (
        <div className="bg-[#f8f7f4] border-2 border-[#1a1a1a] p-3 shadow-md font-mono text-xs text-[#1a1a1a]">
          <div className="text-[10px] text-[#1a1a1a]/60 uppercase tracking-wider border-b border-[#dcdad5] pb-1 mb-2">
            Data: {label}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#1a1a1a] inline-block" />
                Patrimônio:
              </span>
              <span className="text-emerald-800">
                R$ {Number(pVal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            {ibovVal && (
              <div className="flex items-center justify-between gap-4 text-[#1a1a1a]/70">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-blue-600 inline-block" />
                  IBOV Ref:
                </span>
                <span>R$ {Number(ibovVal).toLocaleString('pt-BR')}</span>
              </div>
            )}
            {cdiVal && (
              <div className="flex items-center justify-between gap-4 text-[#1a1a1a]/70">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-amber-600 inline-block" />
                  CDI Ref:
                </span>
                <span>R$ {Number(cdiVal).toLocaleString('pt-BR')}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border border-[#1a1a1a] bg-white p-5 shadow-xs">
      
      {/* Top Header of Chart */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-4 border-b border-[#dcdad5] mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h3 className="font-serif italic font-bold text-2xl text-[#1a1a1a]">
              Evolução Histórica do Patrimônio Total
            </h3>
          </div>
          <p className="label-mono mt-1 text-[#1a1a1a]/60">
            Curva de Equity Simulado vs. Benchmarks (IBOVESPA &amp; Taxa CDI 11,25% a.a.)
          </p>
        </div>

        {/* Controls: Timeframe & Benchmark Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex border border-[#1a1a1a] bg-[#f8f7f4] text-xs font-mono">
            {(['1M', '3M', '6M', '1A', 'TUDO'] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#1a1a1a] text-white font-bold'
                    : 'text-[#1a1a1a]/70 hover:bg-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowBenchmark(!showBenchmark)}
            className={`px-3 py-1 text-xs font-mono border transition-colors cursor-pointer ${
              showBenchmark
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                : 'bg-white text-[#1a1a1a]/60 border-[#dcdad5] hover:border-[#1a1a1a]'
            }`}
          >
            {showBenchmark ? '✓ Benchmarks Ativos' : '+ Comparar Benchmarks'}
          </button>
        </div>
      </div>

      {/* Summary KPI Strip above chart */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 pb-4 border-b border-[#eeebe6] text-xs font-mono">
        <div>
          <span className="label-mono block text-[#1a1a1a]/60">Rentabilidade Total</span>
          <span className={`text-base font-bold tabular-nums ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isPositive ? '+' : ''}{totalReturnPct.toFixed(2)}%
          </span>
        </div>

        <div>
          <span className="label-mono block text-[#1a1a1a]/60">Pico Máximo (High)</span>
          <span className="text-base font-bold text-[#1a1a1a] tabular-nums">
            R$ {maxEquity.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div>
          <span className="label-mono block text-[#1a1a1a]/60">Mínimo no Período</span>
          <span className="text-base font-bold text-[#1a1a1a] tabular-nums">
            R$ {minEquity.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div>
          <span className="label-mono block text-[#1a1a1a]/60">Alpha vs CDI</span>
          <span className="text-base font-bold text-emerald-800 tabular-nums">
            {totalReturnPct >= 3 ? `+${(totalReturnPct - 2.8).toFixed(1)}% Alpha` : 'Em linha com CDI'}
          </span>
        </div>
      </div>

      {/* Recharts Area/Line Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e3dc" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: '#1a1a1a' }}
              tick={{ fill: '#1a1a1a', fontSize: 10, fontFamily: 'Space Mono' }}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickLine={false}
              axisLine={{ stroke: '#1a1a1a' }}
              tickFormatter={(val: number | string) => `R$ ${(Number(val) / 1000).toFixed(0)}k`}
              tick={{ fill: '#1a1a1a', fontSize: 10, fontFamily: 'Space Mono' }}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} />
            
            {showBenchmark && (
              <>
                <Line
                  type="monotone"
                  dataKey="cdi"
                  name="CDI (11,25% a.a.)"
                  stroke="#d97706"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="ibovespa"
                  name="IBOVESPA"
                  stroke="#2563eb"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  dot={false}
                />
              </>
            )}

            <Area
              type="monotone"
              dataKey="patrimonio"
              name="Patrimônio Total"
              stroke="#1a1a1a"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#equityGradient)"
              activeDot={{ r: 6, fill: '#1a1a1a', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Compliance Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 mt-2 border-t border-[#eeebe6] text-[11px] font-mono text-[#1a1a1a]/60">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#1a1a1a] inline-block" />
            <strong className="text-[#1a1a1a]">Patrimônio da Carteira</strong>
          </span>
          {showBenchmark && (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-blue-600 inline-block border-b border-dashed" />
                <span>IBOV Benchmark</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-amber-600 inline-block border-b border-dashed" />
                <span>CDI 11,25%</span>
              </span>
            </>
          )}
        </div>
        <div>
          <span>Simulador de Estratégias · Mark-to-Market diário</span>
        </div>
      </div>

    </div>
  );
};
