import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  RefreshCw, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';
import { BrokerageIntegration } from '../types/market';

interface BrokerageIntegrationModalProps {
  brokers: BrokerageIntegration[];
  connectedBroker: BrokerageIntegration | null;
  onConnectBroker: (brokerId: string, accountNumber: string) => void;
  onDisconnectBroker: (brokerId: string) => void;
  onClose: () => void;
}

export const BrokerageIntegrationModal: React.FC<BrokerageIntegrationModalProps> = ({
  brokers,
  connectedBroker,
  onConnectBroker,
  onDisconnectBroker,
  onClose
}) => {
  const [selectedBrokerId, setSelectedBrokerId] = useState<string>(
    connectedBroker ? connectedBroker.id : brokers[0].id
  );
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [apiToken, setApiToken] = useState<string>('');
  const [mfaCode, setMfaCode] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeBroker = brokers.find(b => b.id === selectedBrokerId) || brokers[0];

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber) {
      setErrorMsg('Por favor informe o número da conta na corretora.');
      return;
    }
    setErrorMsg(null);
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      onConnectBroker(selectedBrokerId, accountNumber);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#f8f7f4] border-2 border-[#1a1a1a] w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto text-[#1a1a1a]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#1a1a1a] bg-white flex items-center justify-between">
          <div>
            <h2 className="font-serif italic text-2xl font-bold text-[#1a1a1a]">
              Integração com Corretoras
            </h2>
            <div className="label-mono mt-0.5">
              Protocolo FIX B3 e API Criptografada
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
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Broker Selection Grid */}
          <div>
            <div className="label-mono mb-2">Selecione a Instituição Financeira:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {brokers.map((broker) => {
                const isConnected = connectedBroker?.id === broker.id;
                const isSelected = selectedBrokerId === broker.id;

                return (
                  <button
                    key={broker.id}
                    type="button"
                    onClick={() => {
                      setSelectedBrokerId(broker.id);
                      if (broker.accountNumber) setAccountNumber(broker.accountNumber);
                    }}
                    className={`p-3 text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-xs'
                        : 'bg-white text-[#1a1a1a] border-[#dcdad5] hover:border-[#1a1a1a]'
                    }`}
                  >
                    <div className="font-bold text-xs font-mono">{broker.name}</div>
                    <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-white/70' : 'text-[#1a1a1a]/50'}`}>
                      Cód: {broker.code} {isConnected && '· Ativa'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details or Form */}
          {connectedBroker?.id === selectedBrokerId ? (
            <div className="bg-white border border-[#1a1a1a] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="font-serif italic text-xl font-bold text-[#1a1a1a]">
                    {connectedBroker.name} Conectada
                  </span>
                </div>
                <span className="label-mono text-emerald-800">
                  Status: Conexão Criptografada
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#f8f7f4] p-3 border border-[#dcdad5]">
                  <span className="label-mono block mb-1">Conta Vinculada</span>
                  <span className="font-bold">{connectedBroker.accountNumber}</span>
                </div>
                <div className="bg-[#f8f7f4] p-3 border border-[#dcdad5]">
                  <span className="label-mono block mb-1">Saldo Disponível</span>
                  <span className="font-bold text-emerald-800">
                    R$ {connectedBroker.balanceAvailableBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#dcdad5]">
                <span className="label-mono">Última sincronização: {connectedBroker.lastSync}</span>
                <button
                  type="button"
                  onClick={() => onDisconnectBroker(connectedBroker.id)}
                  className="px-3 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-mono text-xs font-bold uppercase transition-colors"
                >
                  Desconectar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="bg-white border border-[#1a1a1a] p-5 space-y-4 text-xs font-mono">
              <div className="font-serif italic text-xl font-bold text-[#1a1a1a]">
                Autenticação com {activeBroker.name}
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-mono block mb-1">Número da Conta:</label>
                  <input
                    type="text"
                    placeholder="Ex: 782914-1"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-[#f8f7f4] border border-[#dcdad5] px-3 py-1.5 focus:outline-none focus:border-[#1a1a1a]"
                  />
                </div>

                <div>
                  <label className="label-mono block mb-1">Token de API / Assinatura:</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    className="w-full bg-[#f8f7f4] border border-[#dcdad5] px-3 py-1.5 focus:outline-none focus:border-[#1a1a1a]"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono block mb-1">Token 2FA (6 dígitos):</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="849201"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-36 bg-[#f8f7f4] border border-[#dcdad5] px-3 py-1.5 focus:outline-none focus:border-[#1a1a1a]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="label-mono">Criptografia ponta a ponta</span>
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#f8f7f4] font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  {isAuthenticating ? 'Conectando...' : `Conectar ${activeBroker.name}`}
                </button>
              </div>
            </form>
          )}

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
