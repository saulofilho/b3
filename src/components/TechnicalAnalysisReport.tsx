import React from 'react';
import { 
  X, 
  Target, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Printer, 
  Compass
} from 'lucide-react';
import { StockQuote, TechnicalReport } from '../types/market';
import { getTechnicalReportForStock } from '../data/mockMarketData';

interface TechnicalAnalysisReportProps {
  stock: StockQuote;
  onClose: () => void;
  onExecuteTradePlan: (stock: StockQuote, price: number, stopLoss: number) => void;
  onSetAlert: (ticker: string, price: number) => void;
}

export const TechnicalAnalysisReport: React.FC<TechnicalAnalysisReportProps> = ({
  stock,
  onClose,
  onExecuteTradePlan,
  onSetAlert
}) => {
  const report: TechnicalReport = getTechnicalReportForStock(stock);

  const getBiasBadge = (bias: string) => {
    switch (bias) {
      case 'FORTE_ALTA':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-400 px-3 py-0.5 text-xs font-bold font-mono uppercase">FORTE ALTA (BULLISH)</span>;
      case 'ALTA':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-0.5 text-xs font-bold font-mono uppercase">ALTA MODERADA</span>;
      case 'FORTE_BAIXA':
        return <span className="bg-rose-100 text-rose-900 border border-rose-400 px-3 py-0.5 text-xs font-bold font-mono uppercase">FORTE BAIXA (BEARISH)</span>;
      case 'BAIXA':
        return <span className="bg-rose-50 text-rose-800 border border-rose-300 px-3 py-0.5 text-xs font-bold font-mono uppercase">BAIXA MODERADA</span>;
      default:
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-0.5 text-xs font-bold font-mono uppercase">NEUTRO / CONSOLIDAÇÃO</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#f8f7f4] border-2 border-[#1a1a1a] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto text-[#1a1a1a]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1a1a1a] bg-white flex items-center justify-between">
          <div>
            <div className="font-serif italic text-3xl font-bold text-[#1a1a1a]">
              {stock.ticker} · Relatório Técnico Quantitativo
            </div>
            <div className="label-mono mt-0.5">
              {stock.name} · Gerado em tempo real às {report.generatedAt}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Imprimir"
              className="p-1.5 text-[#1a1a1a] hover:bg-[#f1f0ec] border border-[#dcdad5] cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#1a1a1a] hover:bg-[#f1f0ec] border border-[#dcdad5] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Bias Scorecard Banner */}
          <div className="bg-white border border-[#1a1a1a] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="label-mono mb-1">Classificação do Viés Técnico</div>
              <div className="flex items-center gap-3">
                {getBiasBadge(report.bias)}
                <span className="text-xs font-mono text-[#1a1a1a]/70">
                  Índice de Força: <strong className="text-[#1a1a1a] font-bold">{report.biasScore}/100</strong>
                </span>
              </div>
            </div>

            <div className="w-full md:w-64">
              <div className="flex justify-between text-[10px] font-mono text-[#1a1a1a]/60 mb-1">
                <span>Venda</span>
                <span>Neutro</span>
                <span>Compra</span>
              </div>
              <div className="h-2 w-full bg-[#f1f0ec] border border-[#dcdad5]">
                <div 
                  className={`h-full ${
                    report.biasScore >= 55 ? 'bg-emerald-600' : report.biasScore <= 45 ? 'bg-rose-600' : 'bg-amber-500'
                  }`}
                  style={{ width: `${report.biasScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Indicators Matrix */}
          <div>
            <div className="label-mono mb-2">Matriz de Indicadores Técnicos</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <div className="bg-white border border-[#dcdad5] p-3">
                <span className="label-mono block mb-1">IFR / RSI (14)</span>
                <span className="text-xl font-bold font-mono text-[#1a1a1a] tabular-nums block">
                  {report.rsi14}
                </span>
                <span className={`text-[10px] font-mono font-bold ${
                  report.rsiCondition === 'SOBRECOMPRADO' ? 'text-rose-700' :
                  report.rsiCondition === 'SOBREVENDIDO' ? 'text-emerald-700' : 'text-[#1a1a1a]/60'
                }`}>
                  {report.rsiCondition}
                </span>
              </div>

              <div className="bg-white border border-[#dcdad5] p-3">
                <span className="label-mono block mb-1">MACD</span>
                <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums block">
                  {report.macdSignalStatus}
                </span>
                <span className="text-[10px] text-[#1a1a1a]/60 font-mono">
                  Cruzamento recente
                </span>
              </div>

              <div className="bg-white border border-[#dcdad5] p-3">
                <span className="label-mono block mb-1">Médias Móveis</span>
                <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums block">
                  {report.movingAveragesStatus.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-[#1a1a1a]/60 font-mono">
                  EMA9 &gt; SMA20
                </span>
              </div>

              <div className="bg-white border border-[#dcdad5] p-3">
                <span className="label-mono block mb-1">Bandas Bollinger</span>
                <span className="text-xl font-bold font-mono text-[#1a1a1a] tabular-nums block">
                  {report.volatilityState.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-[#1a1a1a]/60 font-mono">
                  Largura: {report.bollingerBandWidth}%
                </span>
              </div>

            </div>
          </div>

          {/* Pivot Points */}
          <div className="bg-white border border-[#1a1a1a] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="label-mono">Pontos Pivô, Suportes e Resistências</span>
              <span className="text-[10px] text-[#1a1a1a]/50 font-mono">Cálculo Intraday / D1</span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
              <div className="bg-rose-50 border border-rose-200 p-2">
                <span className="text-rose-700 text-[9px] block font-bold">R2</span>
                <span className="font-bold tabular-nums text-sm">R$ {report.pivots.r2.toFixed(2)}</span>
                <button 
                  onClick={() => onSetAlert(stock.ticker, report.pivots.r2)}
                  className="mt-1 text-[9px] text-rose-800 hover:underline block mx-auto cursor-pointer"
                >
                  Alerta
                </button>
              </div>

              <div className="bg-rose-50 border border-rose-200 p-2">
                <span className="text-rose-700 text-[9px] block font-bold">R1</span>
                <span className="font-bold tabular-nums text-sm">R$ {report.pivots.r1.toFixed(2)}</span>
                <button 
                  onClick={() => onSetAlert(stock.ticker, report.pivots.r1)}
                  className="mt-1 text-[9px] text-rose-800 hover:underline block mx-auto cursor-pointer"
                >
                  Alerta
                </button>
              </div>

              <div className="bg-[#f8f7f4] border border-[#dcdad5] p-2">
                <span className="text-[#1a1a1a]/60 text-[9px] block font-bold">PIVOT</span>
                <span className="font-bold text-[#1a1a1a] tabular-nums text-sm">R$ {report.pivots.pivot.toFixed(2)}</span>
                <span className="mt-1 text-[9px] text-[#1a1a1a]/40 block">Centro</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-2">
                <span className="text-emerald-700 text-[9px] block font-bold">S1</span>
                <span className="font-bold tabular-nums text-sm">R$ {report.pivots.s1.toFixed(2)}</span>
                <button 
                  onClick={() => onSetAlert(stock.ticker, report.pivots.s1)}
                  className="mt-1 text-[9px] text-emerald-800 hover:underline block mx-auto cursor-pointer"
                >
                  Alerta
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-2">
                <span className="text-emerald-700 text-[9px] block font-bold">S2</span>
                <span className="font-bold tabular-nums text-sm">R$ {report.pivots.s2.toFixed(2)}</span>
                <button 
                  onClick={() => onSetAlert(stock.ticker, report.pivots.s2)}
                  className="mt-1 text-[9px] text-emerald-800 hover:underline block mx-auto cursor-pointer"
                >
                  Alerta
                </button>
              </div>
            </div>
          </div>

          {/* Actionable Trade Plan */}
          <div className="bg-white border-2 border-[#1a1a1a] p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#1a1a1a]" />
                <h3 className="font-serif italic text-xl font-bold text-[#1a1a1a]">
                  Plano Operacional Sugerido (Trade Setup)
                </h3>
              </div>
              <span className="label-mono bg-[#f1f0ec] px-2 py-0.5 border border-[#dcdad5]">
                Risco/Retorno: {report.tradePlan.riskRewardRatio}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mb-4">
              <div className="bg-[#f8f7f4] p-3 border border-[#dcdad5]">
                <span className="text-[#1a1a1a]/60 block text-[10px]">Entrada:</span>
                <span className="text-base font-bold text-[#1a1a1a] tabular-nums">
                  R$ {report.tradePlan.entryPrice.toFixed(2)}
                </span>
              </div>

              <div className="bg-[#f8f7f4] p-3 border border-[#dcdad5]">
                <span className="text-[#1a1a1a]/60 block text-[10px]">Alvo 1:</span>
                <span className="text-base font-bold text-emerald-700 tabular-nums">
                  R$ {report.tradePlan.target1.toFixed(2)}
                </span>
              </div>

              <div className="bg-[#f8f7f4] p-3 border border-[#dcdad5]">
                <span className="text-[#1a1a1a]/60 block text-[10px]">Alvo 2:</span>
                <span className="text-base font-bold text-emerald-700 tabular-nums">
                  R$ {report.tradePlan.target2.toFixed(2)}
                </span>
              </div>

              <div className="bg-[#f8f7f4] p-3 border border-[#dcdad5]">
                <span className="text-[#1a1a1a]/60 block text-[10px]">Stop Loss:</span>
                <span className="text-base font-bold text-rose-700 tabular-nums">
                  R$ {report.tradePlan.stopLoss.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#dcdad5]">
              <span className="label-mono">
                Horizonte: {report.tradePlan.timeHorizon}
              </span>

              <button
                onClick={() => {
                  onExecuteTradePlan(stock, report.tradePlan.entryPrice, report.tradePlan.stopLoss);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#f8f7f4] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Preencher Boleta com este Setup</span>
              </button>
            </div>
          </div>

          {/* Thesis & Context */}
          <div className="bg-white p-4 border border-[#dcdad5]">
            <div className="label-mono mb-2">Tese Analítica &amp; Cenário</div>
            <p className="text-sm text-[#1a1a1a] leading-relaxed font-serif text-base italic">
              "{report.aiAnalysisText}"
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1a1a1a] bg-white flex items-center justify-between text-xs">
          <span className="label-mono">Terminal de Apoio Quantitativo B3</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-[#f1f0ec] text-[#1a1a1a] border border-[#1a1a1a] font-mono text-xs font-bold uppercase"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
