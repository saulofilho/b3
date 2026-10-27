import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown
} from 'lucide-react';
import { PriceAlert, StockQuote } from '../types/market';

interface PriceAlertsModalProps {
  alerts: PriceAlert[];
  stocks: StockQuote[];
  initialTicker?: string;
  initialPrice?: number;
  onAddAlert: (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggeredAt'>) => void;
  onDeleteAlert: (id: string) => void;
  onToggleAlert: (id: string) => void;
  onClose: () => void;
}

export const PriceAlertsModal: React.FC<PriceAlertsModalProps> = ({
  alerts,
  stocks,
  initialTicker,
  initialPrice,
  onAddAlert,
  onDeleteAlert,
  onToggleAlert,
  onClose
}) => {
  const [ticker, setTicker] = useState<string>(initialTicker || stocks[0]?.ticker || 'PETR4');
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW' | 'PERCENT_UP' | 'PERCENT_DOWN'>('ABOVE');
  const [targetPrice, setTargetPrice] = useState<number>(
    initialPrice ? +(initialPrice * 1.03).toFixed(2) : 40.00
  );
  const [note, setNote] = useState<string>('');

  const currentStock = stocks.find(s => s.ticker === ticker) || stocks[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPrice <= 0) return;

    onAddAlert({
      ticker,
      targetPrice,
      condition,
      active: true,
      initialPrice: currentStock?.price || targetPrice,
      note: note.trim() || undefined
    });

    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#f8f7f4] border-2 border-[#1a1a1a] w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto text-[#1a1a1a]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#1a1a1a] bg-white flex items-center justify-between">
          <div>
            <h2 className="font-serif italic text-2xl font-bold text-[#1a1a1a]">
              Alertas de Preço
            </h2>
            <div className="label-mono mt-0.5">
              Monitoramento Contínuo com Aviso Sonoro
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#1a1a1a] hover:bg-[#f1f0ec] border border-[#dcdad5] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs font-mono">
          
          {/* Create Alert Form */}
          <form onSubmit={handleCreate} className="p-4 bg-white border border-[#1a1a1a] space-y-3">
            <div className="label-mono">Novo Alerta de Preço</div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="label-mono block mb-1">Ativo:</label>
                <select
                  value={ticker}
                  onChange={(e) => {
                    setTicker(e.target.value);
                    const st = stocks.find(s => s.ticker === e.target.value);
                    if (st) setTargetPrice(+(st.price * 1.03).toFixed(2));
                  }}
                  className="w-full bg-[#f8f7f4] border border-[#dcdad5] px-2 py-1.5 font-bold focus:outline-none focus:border-[#1a1a1a]"
                >
                  {stocks.map(s => (
                    <option key={s.ticker} value={s.ticker}>
                      {s.ticker} (R$ {s.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-mono block mb-1">Condição:</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full bg-[#f8f7f4] border border-[#dcdad5] px-2 py-1.5 focus:outline-none focus:border-[#1a1a1a]"
                >
                  <option value="ABOVE">Acima de (≥)</option>
                  <option value="BELOW">Abaixo de (≤)</option>
                  <option value="PERCENT_UP">Alta (+3%)</option>
                  <option value="PERCENT_DOWN">Baixa (-3%)</option>
                </select>
              </div>

              <div>
                <label className="label-mono block mb-1">Alvo (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#f8f7f4] border border-[#dcdad5] px-2 py-1.5 font-bold tabular-nums focus:outline-none focus:border-[#1a1a1a]"
                />
              </div>
            </div>

            <div>
              <label className="label-mono block mb-1">Anotação / Justificativa:</label>
              <input
                type="text"
                placeholder="Ex: Rompimento de máxima semanal"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-[#f8f7f4] border border-[#dcdad5] px-3 py-1.5 placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-[#1a1a1a]"
              />
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-[#f8f7f4] font-bold uppercase tracking-wider cursor-pointer shadow-xs"
              >
                Salvar Alerta
              </button>
            </div>
          </form>

          {/* List */}
          <div>
            <div className="label-mono mb-2">Alertas Ativos ({alerts.length})</div>

            {alerts.length === 0 ? (
              <p className="text-[#1a1a1a]/50 text-center py-4">Nenhum alerta cadastrado.</p>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 border flex items-center justify-between gap-3 ${
                      alert.active ? 'bg-white border-[#1a1a1a]' : 'bg-[#f8f7f4] border-[#dcdad5] opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {alert.condition === 'ABOVE' || alert.condition === 'PERCENT_UP' ? (
                        <ArrowUp className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-rose-700" />
                      )}
                      <div>
                        <div className="font-bold text-sm">
                          {alert.ticker} {alert.condition === 'ABOVE' ? '≥' : '≤'} R$ {alert.targetPrice.toFixed(2)}
                        </div>
                        {alert.note && <div className="text-[10px] text-[#1a1a1a]/60">{alert.note}</div>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleAlert(alert.id)}
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                          alert.active ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'bg-white text-[#1a1a1a]/60 border-[#dcdad5]'
                        }`}
                      >
                        {alert.active ? 'Ativo' : 'Pausa'}
                      </button>
                      <button
                        onClick={() => onDeleteAlert(alert.id)}
                        className="p-1 text-[#1a1a1a]/50 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1a1a1a] bg-white flex items-center justify-end">
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
