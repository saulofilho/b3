import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Building2, 
  X, 
  AlertCircle,
  CheckCircle2,
  PieChart,
  FileText,
  ArrowUpRight
} from 'lucide-react';
import { IPOItem, IPOStatus } from '../types/market';

interface IPOCalendarProps {
  ipos: IPOItem[];
  onReserveIPO: (ipo: IPOItem) => void;
}

export const IPOCalendar: React.FC<IPOCalendarProps> = ({ ipos, onReserveIPO }) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | IPOStatus>('ALL');
  const [selectedIPO, setSelectedIPO] = useState<IPOItem | null>(null);

  const filteredIPOs = ipos.filter(ipo => {
    if (statusFilter === 'ALL') return true;
    return ipo.status === statusFilter;
  });

  const getStatusBadge = (status: IPOStatus, label: string) => {
    switch (status) {
      case 'RESERVA_ABERTA':
        return (
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            {label}
          </span>
        );
      case 'PRECIFICADO':
        return (
          <span className="bg-sky-100 text-sky-900 border border-sky-300 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
            {label}
          </span>
        );
      case 'EM_ANALISE':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
            {label}
          </span>
        );
      default:
        return (
          <span className="bg-[#f1f0ec] text-[#1a1a1a]/70 border border-[#dcdad5] px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
            {label}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Tabs */}
      <div className="border-b border-[#1a1a1a] pb-4 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <h2 className="font-serif italic text-3xl font-bold text-[#1a1a1a]">
            IPOs &amp; Ofertas Públicas
          </h2>
          <div className="label-mono mt-1">
            Cronograma de Ofertas, Reservas de Varejo e Prospectos CVM
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 border transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold'
                : 'bg-white text-[#1a1a1a]/70 border-[#dcdad5] hover:border-[#1a1a1a]'
            }`}
          >
            Todos ({ipos.length})
          </button>
          <button
            onClick={() => setStatusFilter('RESERVA_ABERTA')}
            className={`px-3 py-1.5 border transition-colors cursor-pointer ${
              statusFilter === 'RESERVA_ABERTA'
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold'
                : 'bg-white text-[#1a1a1a]/70 border-[#dcdad5] hover:border-[#1a1a1a]'
            }`}
          >
            Reserva Aberta
          </button>
          <button
            onClick={() => setStatusFilter('PRECIFICADO')}
            className={`px-3 py-1.5 border transition-colors cursor-pointer ${
              statusFilter === 'PRECIFICADO'
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold'
                : 'bg-white text-[#1a1a1a]/70 border-[#dcdad5] hover:border-[#1a1a1a]'
            }`}
          >
            Precificados
          </button>
          <button
            onClick={() => setStatusFilter('EM_ANALISE')}
            className={`px-3 py-1.5 border transition-colors cursor-pointer ${
              statusFilter === 'EM_ANALISE'
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold'
                : 'bg-white text-[#1a1a1a]/70 border-[#dcdad5] hover:border-[#1a1a1a]'
            }`}
          >
            Em Análise
          </button>
        </div>
      </div>

      {/* IPO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIPOs.map((ipo) => (
          <div
            key={ipo.id}
            className="border border-[#1a1a1a] bg-white p-5 flex flex-col justify-between shadow-xs transition-shadow hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="font-serif italic text-3xl font-bold text-[#1a1a1a] leading-tight">
                    {ipo.ticker}
                  </div>
                  <div className="text-sm font-semibold text-[#1a1a1a] mt-0.5">
                    {ipo.companyName}
                  </div>
                  <div className="label-mono mt-0.5">
                    {ipo.sector} · {ipo.exchange}
                  </div>
                </div>

                <div>
                  {getStatusBadge(ipo.status, ipo.statusLabel)}
                </div>
              </div>

              {/* Offering Details Box */}
              <div className="bg-[#f8f7f4] border border-[#dcdad5] p-3 space-y-2 mb-4 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#1a1a1a]/60">Faixa Indicativa:</span>
                  <span className="font-bold text-[#1a1a1a] tabular-nums">
                    {ipo.finalPrice 
                      ? `R$ ${ipo.finalPrice.toFixed(2)} (Fixado)` 
                      : `R$ ${ipo.priceRangeMin.toFixed(2)} - R$ ${ipo.priceRangeMax.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#1a1a1a]/60">Volume da Oferta:</span>
                  <span className="text-[#1a1a1a] font-bold tabular-nums">
                    R$ {(ipo.offeringSizeBRL / 1000).toFixed(2)}B
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#1a1a1a]/60">Coord. Líder:</span>
                  <span className="text-[#1a1a1a] font-medium">
                    {ipo.leadCoordinator}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-1.5 text-xs font-mono mb-4 text-[#1a1a1a]/80">
                <div className="flex items-center justify-between">
                  <span className="text-[#1a1a1a]/60 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Período Reserva:</span>
                  </span>
                  <span className="font-bold text-[#1a1a1a]">
                    {new Date(ipo.reservationStart).toLocaleDateString('pt-BR')} até {new Date(ipo.reservationEnd).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#1a1a1a]/60 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>Estreia B3:</span>
                  </span>
                  <span className="font-bold text-emerald-800">
                    {new Date(ipo.listingDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#dcdad5] flex items-center gap-2">
              <button
                onClick={() => setSelectedIPO(ipo)}
                className="flex-1 py-2 px-3 bg-white hover:bg-[#f1f0ec] text-[#1a1a1a] border border-[#1a1a1a] text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Prospecto</span>
              </button>

              <button
                onClick={() => onReserveIPO(ipo)}
                className="flex-1 py-2 px-3 bg-[#1a1a1a] hover:bg-black text-[#f8f7f4] text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Reservar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prospectus Modal */}
      {selectedIPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#f8f7f4] border-2 border-[#1a1a1a] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            
            {/* Header */}
            <div className="p-5 border-b border-[#1a1a1a] bg-white flex items-center justify-between">
              <div>
                <div className="font-serif italic text-3xl font-bold text-[#1a1a1a]">
                  {selectedIPO.ticker} · {selectedIPO.companyName}
                </div>
                <div className="label-mono mt-1">
                  Resumo do Prospecto Preliminar CVM
                </div>
              </div>

              <button
                onClick={() => setSelectedIPO(null)}
                className="p-1.5 text-[#1a1a1a] hover:bg-[#f1f0ec] border border-[#dcdad5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              <div>
                <h4 className="label-mono mb-2">Visão Geral do Negócio</h4>
                <p className="bg-white p-4 border border-[#dcdad5] leading-relaxed text-[#1a1a1a]">
                  {selectedIPO.prospectusSummary}
                </p>
              </div>

              <div>
                <h4 className="label-mono mb-2 flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5" />
                  <span>Destinação dos Recursos Captados</span>
                </h4>
                <div className="space-y-3 bg-white p-4 border border-[#dcdad5]">
                  {selectedIPO.useOfProceeds.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span>{item.purpose}</span>
                        <span className="font-bold">{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-[#f1f0ec] border border-[#dcdad5]">
                        <div className="h-full bg-[#1a1a1a]" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 border border-[#dcdad5]">
                  <h4 className="label-mono mb-2 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Destaques de Investimento</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {selectedIPO.investmentHighlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold">·</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 border border-[#dcdad5]">
                  <h4 className="label-mono mb-2 text-rose-800 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Principais Riscos</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {selectedIPO.keyRisks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold">!</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#1a1a1a] bg-white flex items-center justify-between">
              <span className="label-mono">Reserva autorizada pelo sindicato distribuidor</span>
              <button
                onClick={() => {
                  const ipo = selectedIPO;
                  setSelectedIPO(null);
                  onReserveIPO(ipo);
                }}
                className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#f8f7f4] font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Prosseguir para Reserva
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
