import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { SimulatedPortfolio, StockQuote } from '../types/market';

interface PortfolioSectorDoughnutProps {
  portfolio: SimulatedPortfolio;
  stocks: StockQuote[];
}

// Sophisticated terminal color palette matching Variation 6
const SECTOR_COLORS: Record<string, string> = {
  'Financeiro & Bancos': '#1a1a1a',
  'Petróleo, Gás & Energia': '#059669',
  'Mineração & Commodities': '#d97706',
  'Bens Industriais': '#2563eb',
  'Consumo & Varejo': '#e11d48',
  'Tecnologia & Inovação': '#7c3aed',
  'Infraestrutura & Mercado': '#0d9488',
  'Caixa Líquido (Renda Fixa)': '#64748b',
  'Outros Setores': '#94a3b8'
};

const FALLBACK_PALETTE = [
  '#1a1a1a', '#059669', '#2563eb', '#d97706', '#e11d48', 
  '#7c3aed', '#0d9488', '#64748b', '#475569'
];

export const PortfolioSectorDoughnut: React.FC<PortfolioSectorDoughnutProps> = ({
  portfolio,
  stocks
}) => {
  // Aggregate portfolio holdings by sector taxonomy
  const sectorData = useMemo(() => {
    const sectorMap: Record<string, { value: number; tickers: string[] }> = {};

    portfolio.positions.forEach(pos => {
      const stock = stocks.find(s => s.ticker === pos.ticker);
      const rawSector = stock?.sector || 'Outros Setores';

      let sectorName = 'Outros Setores';
      if (/financeiro|banco|fintech/i.test(rawSector)) {
        sectorName = 'Financeiro & Bancos';
      } else if (/petróleo|petroleo|gás|energia/i.test(rawSector)) {
        sectorName = 'Petróleo, Gás & Energia';
      } else if (/mineração|mineracao|materiais|siderurgia/i.test(rawSector)) {
        sectorName = 'Mineração & Commodities';
      } else if (/industrial|industriais|máquinas/i.test(rawSector)) {
        sectorName = 'Bens Industriais';
      } else if (/consumo|varejo|locação|aluguel/i.test(rawSector)) {
        sectorName = 'Consumo & Varejo';
      } else if (/tecnologia|semicondutores|hardware|software/i.test(rawSector)) {
        sectorName = 'Tecnologia & Inovação';
      } else if (/infraestrutura|mercado/i.test(rawSector)) {
        sectorName = 'Infraestrutura & Mercado';
      }

      if (!sectorMap[sectorName]) {
        sectorMap[sectorName] = { value: 0, tickers: [] };
      }
      sectorMap[sectorName].value += pos.currentValue;
      if (!sectorMap[sectorName].tickers.includes(pos.ticker)) {
        sectorMap[sectorName].tickers.push(pos.ticker);
      }
    });

    // Add Cash Balance as an asset class
    if (portfolio.cashBalance > 0) {
      sectorMap['Caixa Líquido (Renda Fixa)'] = {
        value: portfolio.cashBalance,
        tickers: ['SELIC / CDI']
      };
    }

    const total = portfolio.totalEquity || 1;

    return Object.entries(sectorMap)
      .map(([name, data], idx) => ({
        name,
        value: +data.value.toFixed(2),
        percentage: +((data.value / total) * 100).toFixed(1),
        tickers: data.tickers,
        color: SECTOR_COLORS[name] || FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [portfolio.positions, portfolio.cashBalance, portfolio.totalEquity, stocks]);

  // Custom Tooltip styled in Variation 6 Broadsheet
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#f8f7f4] border-2 border-[#1a1a1a] p-3 shadow-md font-mono text-xs text-[#1a1a1a]">
          <div className="flex items-center gap-1.5 mb-1 pb-1 border-b border-[#dcdad5]">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: data.color }} />
            <strong className="text-sm font-serif italic">{data.name}</strong>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-[#1a1a1a]/60">Alocação:</span>
              <span className="font-bold text-emerald-800">{data.percentage}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#1a1a1a]/60">Valor Atual:</span>
              <span className="font-bold">
                R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            {data.tickers && (
              <div className="text-[10px] text-[#1a1a1a]/60 pt-1 border-t border-[#eeebe6]">
                Ativos: {data.tickers.join(', ')}
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
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#dcdad5] pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <h3 className="font-serif italic font-bold text-xl text-[#1a1a1a]">
              Distribuição Setorial da Carteira
            </h3>
          </div>
          <p className="label-mono mt-1 text-[#1a1a1a]/60">
            Alocação por Setor B3 &amp; Renda Fixa / Caixa Líquido
          </p>
        </div>
        <span className="label-mono text-[#1a1a1a] font-bold">
          {sectorData.length} Setores Alocados
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] items-center gap-6">
        
        {/* Doughnut Chart with center label */}
        <div className="relative h-[220px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={2}
                stroke="#1a1a1a"
                strokeWidth={1}
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Central KPI Hole Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="label-mono text-[9px] text-[#1a1a1a]/50">Patrimônio</span>
            <span className="font-mono font-bold text-xs text-[#1a1a1a] tabular-nums">
              R$ {(portfolio.totalEquity / 1000).toFixed(0)}k
            </span>
            <span className="text-[8px] font-mono text-emerald-700 font-bold">100%</span>
          </div>
        </div>

        {/* Sector Legend Breakdown Grid */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {sectorData.map(sec => (
            <div
              key={sec.name}
              className="flex items-center justify-between text-xs font-mono p-2 border border-[#eeebe6] hover:border-[#1a1a1a] transition-colors bg-[#f8f7f4]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: sec.color }}
                />
                <div className="min-w-0">
                  <span className="font-bold text-[#1a1a1a] block truncate text-[11px]">
                    {sec.name}
                  </span>
                  <span className="text-[10px] text-[#1a1a1a]/60 truncate block font-sans">
                    {sec.tickers.join(', ')}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0 ml-3">
                <span className="font-bold text-[#1a1a1a] text-xs block tabular-nums">
                  {sec.percentage}%
                </span>
                <span className="text-[10px] text-[#1a1a1a]/60 block tabular-nums">
                  R$ {sec.value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
