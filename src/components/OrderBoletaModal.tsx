import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { StockQuote, OrderType, OrderSide, BrokerageIntegration, IPOItem } from '../types/market';

interface OrderBoletaModalProps {
  initialStock?: StockQuote | null;
  initialIpo?: IPOItem | null;
  stocks: StockQuote[];
  initialSide?: OrderSide;
  initialPrice?: number;
  initialStopLoss?: number;
  connectedBroker: BrokerageIntegration | null;
  simulatedCashBalance: number;
  onExecuteOrder: (orderData: {
    ticker: string;
    assetName: string;
    side: OrderSide;
    orderType: OrderType;
    quantity: number;
    price: number;
    brokerId: string;
    brokerName: string;
    strategyTag: string;
    isIpoReservation?: boolean;
  }) => void;
  onClose: () => void;
}

export const OrderBoletaModal: React.FC<OrderBoletaModalProps> = ({
  initialStock,
  initialIpo,
  stocks,
  initialSide = 'BUY',
  initialPrice,
  connectedBroker,
  simulatedCashBalance,
  onExecuteOrder,
  onClose
}) => {
  const [selectedTicker, setSelectedTicker] = useState<string>(
    initialIpo ? initialIpo.ticker : (initialStock ? initialStock.ticker : stocks[0]?.ticker || 'PETR4')
  );
  const [side, setSide] = useState<OrderSide>(initialSide);
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [quantity, setQuantity] = useState<number>(100);
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [useConnectedBroker, setUseConnectedBroker] = useState<boolean>(!!connectedBroker);
  const [strategyTag, setStrategyTag] = useState<string>('Quality Growth');
  const [signaturePin, setSignaturePin] = useState<string>('1234');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionSuccess, setExecutionSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isIpo = !!initialIpo || selectedTicker === 'MOOV' || selectedTicker === 'PICP';
  const currentStock = stocks.find(s => s.ticker === selectedTicker) || stocks[0];
  const activePrice = isIpo 
    ? (initialIpo?.priceRangeMax || 17.50)
    : (orderType === 'LIMIT' && customPrice > 0 ? customPrice : currentStock?.price || 38.45);

  useEffect(() => {
    if (initialPrice && initialPrice > 0) {
      setCustomPrice(initialPrice);
    } else if (currentStock) {
      setCustomPrice(currentStock.price);
    }
  }, [selectedTicker, initialPrice]);

  const availableBalance = useConnectedBroker && connectedBroker
    ? connectedBroker.balanceAvailableBRL
    : simulatedCashBalance;

  const subtotal = +(quantity * activePrice).toFixed(2);
  const b3Fees = +(subtotal * 0.0003).toFixed(2);
  const brokerageFee = useConnectedBroker && connectedBroker ? connectedBroker.brokerFee : 0.0;
  const totalOrderValue = +(subtotal + (side === 'BUY' ? b3Fees + brokerageFee : -b3Fees - brokerageFee)).toFixed(2);

  const handlePercentageBalance = (pct: number) => {
    if (activePrice <= 0) return;
    const maxAffordable = Math.floor((availableBalance * pct) / activePrice);
    setQuantity(Math.max(1, maxAffordable));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      setErrorMsg('A quantidade deve ser maior que zero.');
      return;
    }
    if (side === 'BUY' && totalOrderValue > availableBalance) {
      setErrorMsg(`Saldo insuficiente! Disponível: R$ ${availableBalance.toFixed(2)}, Necessário: R$ ${totalOrderValue.toFixed(2)}`);
      return;
    }
    if (!signaturePin) {
      setErrorMsg('Informe a assinatura eletrônica.');
      return;
    }

    setErrorMsg(null);
    setIsExecuting(true);

    setTimeout(() => {
      setIsExecuting(false);
      setExecutionSuccess(true);

      onExecuteOrder({
        ticker: selectedTicker,
        assetName: isIpo ? (initialIpo?.companyName || selectedTicker) : currentStock.name,
        side,
        orderType,
        quantity,
        price: activePrice,
        brokerId: useConnectedBroker && connectedBroker ? connectedBroker.id : 'simulated-portfolio',
        brokerName: useConnectedBroker && connectedBroker ? connectedBroker.name : 'Portfólio Simulado',
        strategyTag,
        isIpoReservation: isIpo
      });

      setTimeout(() => {
        onClose();
      }, 1200);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#f8f7f4] border-2 border-[#1a1a1a] w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-[#1a1a1a] bg-white flex items-center justify-between">
          <div>
            <h2 className="font-serif italic text-2xl font-bold text-[#1a1a1a]">
              Boleta de Negociação
            </h2>
            <div className="label-mono mt-0.5">
              {isIpo ? 'Pedido de Reserva de IPO' : 'Envio de Ordem Direta B3'}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#1a1a1a] hover:bg-[#f1f0ec] border border-[#dcdad5] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {executionSuccess ? (
          <div className="p-8 text-center space-y-3 my-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif italic text-2xl font-bold text-[#1a1a1a]">
              {isIpo ? 'Reserva Confirmada!' : 'Ordem Executada!'}
            </h3>
            <p className="text-xs font-mono text-[#1a1a1a]/80">
              {side === 'BUY' ? 'Compra' : 'Venda'} de {quantity} ações de <strong className="font-bold">{selectedTicker}</strong> a R$ {activePrice.toFixed(2)}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
            
            {/* Side Switch */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSide('BUY')}
                className={`py-2.5 font-bold uppercase tracking-wider text-xs border cursor-pointer transition-colors ${
                  side === 'BUY'
                    ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                    : 'bg-white text-[#1a1a1a] border-[#dcdad5]'
                }`}
              >
                COMPRAR
              </button>

              <button
                type="button"
                onClick={() => setSide('SELL')}
                className={`py-2.5 font-bold uppercase tracking-wider text-xs border cursor-pointer transition-colors ${
                  side === 'SELL'
                    ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                    : 'bg-white text-[#1a1a1a] border-[#dcdad5]'
                }`}
              >
                VENDER
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Asset & Route */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label-mono block mb-1">Ativo B3:</label>
                <select
                  value={selectedTicker}
                  onChange={(e) => setSelectedTicker(e.target.value)}
                  className="w-full bg-white border border-[#dcdad5] px-2.5 py-1.5 text-xs font-bold font-mono focus:outline-none focus:border-[#1a1a1a]"
                >
                  <optgroup label="Ações">
                    {stocks.map(s => (
                      <option key={s.ticker} value={s.ticker}>
                        {s.ticker} (R$ {s.price.toFixed(2)})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="IPOs">
                    <option value="MOOV">MOOV (IPO Moove)</option>
                    <option value="PICP">PICP (IPO PicPay)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="label-mono block mb-1">Origem de Liquidação:</label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setUseConnectedBroker(false)}
                    className={`flex-1 py-1 px-2 border text-left cursor-pointer ${
                      !useConnectedBroker ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'bg-white border-[#dcdad5]'
                    }`}
                  >
                    <div className="text-[10px] font-bold">Simulado</div>
                    <div className="text-[9px] opacity-80">R$ {simulatedCashBalance.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                  </button>

                  <button
                    type="button"
                    disabled={!connectedBroker}
                    onClick={() => setUseConnectedBroker(true)}
                    className={`flex-1 py-1 px-2 border text-left cursor-pointer ${
                      useConnectedBroker ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'bg-white border-[#dcdad5] opacity-60'
                    }`}
                  >
                    <div className="text-[10px] font-bold">{connectedBroker ? connectedBroker.name : 'Corretora'}</div>
                    <div className="text-[9px] opacity-80">{connectedBroker ? `R$ ${connectedBroker.balanceAvailableBRL.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}` : 'Off'}</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Type & Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-mono block mb-1">Tipo de Ordem:</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as OrderType)}
                  className="w-full bg-white border border-[#dcdad5] px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-[#1a1a1a]"
                >
                  <option value="MARKET">A Mercado</option>
                  <option value="LIMIT">Limitada</option>
                  <option value="STOP_LOSS">Stop Loss</option>
                </select>
              </div>

              <div>
                <label className="label-mono block mb-1">Preço (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  disabled={orderType === 'MARKET'}
                  value={orderType === 'MARKET' ? activePrice : customPrice}
                  onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#dcdad5] px-2.5 py-1.5 text-xs font-mono font-bold tabular-nums focus:outline-none focus:border-[#1a1a1a]"
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="label-mono">Quantidade:</label>
                <div className="flex gap-1 text-[10px]">
                  <button type="button" onClick={() => handlePercentageBalance(0.25)} className="px-1.5 py-0.5 border border-[#dcdad5] bg-white hover:bg-[#f1f0ec]">25%</button>
                  <button type="button" onClick={() => handlePercentageBalance(0.50)} className="px-1.5 py-0.5 border border-[#dcdad5] bg-white hover:bg-[#f1f0ec]">50%</button>
                  <button type="button" onClick={() => handlePercentageBalance(1.00)} className="px-1.5 py-0.5 border border-[#dcdad5] bg-white hover:bg-[#f1f0ec]">100%</button>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="flex-1 bg-white border border-[#dcdad5] px-2.5 py-1.5 text-xs font-mono font-bold tabular-nums focus:outline-none focus:border-[#1a1a1a]"
                />
                <button type="button" onClick={() => setQuantity(q => q + 100)} className="px-3 py-1 bg-white border border-[#dcdad5] hover:border-[#1a1a1a] font-bold">+100</button>
                <button type="button" onClick={() => setQuantity(q => q + 500)} className="px-3 py-1 bg-white border border-[#dcdad5] hover:border-[#1a1a1a] font-bold">+500</button>
              </div>
            </div>

            {/* Calculation summary */}
            <div className="bg-white border border-[#dcdad5] p-3 space-y-1 text-[11px]">
              <div className="flex justify-between text-[#1a1a1a]/70">
                <span>Subtotal ({quantity} × R$ {activePrice.toFixed(2)}):</span>
                <span className="font-bold tabular-nums">R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#1a1a1a]/70">
                <span>Taxas B3 (0,03%):</span>
                <span className="tabular-nums">R$ {b3Fees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#dcdad5] font-bold text-xs text-[#1a1a1a]">
                <span>Total da Operação:</span>
                <span className="tabular-nums">R$ {totalOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Electronic PIN */}
            <div>
              <label className="label-mono block mb-1">Assinatura Eletrônica (Padrão: 1234):</label>
              <input
                type="password"
                maxLength={6}
                value={signaturePin}
                onChange={(e) => setSignaturePin(e.target.value)}
                className="w-32 bg-white border border-[#dcdad5] px-3 py-1.5 text-center font-mono tracking-widest text-xs focus:outline-none focus:border-[#1a1a1a]"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isExecuting}
                className="w-full py-3 bg-[#1a1a1a] hover:bg-black text-[#f8f7f4] font-mono font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {isExecuting ? 'Transmitindo Ordem...' : `Confirmar ${side === 'BUY' ? 'Compra' : 'Venda'} (${quantity} ações)`}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
