import React from 'react';
import { 
  Bell, 
  ShieldCheck, 
  SlidersHorizontal, 
  ArrowUpRight, 
  CheckCircle2
} from 'lucide-react';
import { BrokerageIntegration, AppNotification } from '../types/market';

interface HeaderProps {
  activeTab: 'market' | 'ipos' | 'chart' | 'portfolio' | 'news';
  setActiveTab: (tab: 'market' | 'ipos' | 'chart' | 'portfolio' | 'news') => void;
  connectedBroker: BrokerageIntegration | null;
  onOpenBrokerModal: () => void;
  onOpenOrderModal: () => void;
  onOpenAlertsModal: () => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  connectedBroker,
  onOpenBrokerModal,
  onOpenOrderModal,
  onOpenAlertsModal,
  notifications,
  onOpenNotifications
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-[#f8f7f4] border-b-2 border-[#1a1a1a] px-5 sm:px-8 lg:px-10 py-4 transition-colors">
      <div className="max-w-[1600px] mx-auto flex items-baseline justify-between gap-6 flex-wrap">
        
        {/* Zone 1: Wordmark in Cormorant Garamond Serif */}
        <div className="flex items-baseline gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('chart')}
            className="text-left group cursor-pointer"
          >
            <span className="font-serif italic text-2xl sm:text-3xl font-semibold tracking-tight text-[#1a1a1a] group-hover:opacity-75 transition-opacity">
              B3 AlphaTerminal
            </span>
          </button>
          <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider text-[#1a1a1a]/60">
            Professional Edition
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-6 sm:gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('chart')}
            className={`transition-all pb-1 whitespace-nowrap cursor-pointer text-xs uppercase font-mono tracking-wider ${
              activeTab === 'chart'
                ? 'font-bold text-[#1a1a1a] border-b-2 border-[#1a1a1a]'
                : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:underline'
            }`}
          >
            Gráfico
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`transition-all pb-1 whitespace-nowrap cursor-pointer text-xs uppercase font-mono tracking-wider ${
              activeTab === 'market'
                ? 'font-bold text-[#1a1a1a] border-b-2 border-[#1a1a1a]'
                : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:underline'
            }`}
          >
            Ações
          </button>

          <button
            onClick={() => setActiveTab('ipos')}
            className={`transition-all pb-1 whitespace-nowrap cursor-pointer text-xs uppercase font-mono tracking-wider flex items-center gap-1.5 ${
              activeTab === 'ipos'
                ? 'font-bold text-[#1a1a1a] border-b-2 border-[#1a1a1a]'
                : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:underline'
            }`}
          >
            <span>IPOs</span>
            <span className="font-mono text-[9px] bg-[#1a1a1a] text-[#f8f7f4] px-1 py-0.2 rounded-xs">
              Novo
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`transition-all pb-1 whitespace-nowrap cursor-pointer text-xs uppercase font-mono tracking-wider ${
              activeTab === 'portfolio'
                ? 'font-bold text-[#1a1a1a] border-b-2 border-[#1a1a1a]'
                : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:underline'
            }`}
          >
            Portfólio
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`transition-all pb-1 whitespace-nowrap cursor-pointer text-xs uppercase font-mono tracking-wider ${
              activeTab === 'news'
                ? 'font-bold text-[#1a1a1a] border-b-2 border-[#1a1a1a]'
                : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:underline'
            }`}
          >
            Notícias
          </button>
        </nav>

        {/* Zone 3: Actions & Broker Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Alerts Trigger */}
          <button
            onClick={onOpenAlertsModal}
            title="Configurar Alertas de Preço"
            className="p-1.5 text-[#1a1a1a] hover:bg-[#dcdad5]/40 rounded border border-[#dcdad5] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            title="Notificações e Movimentações"
            className="relative p-1.5 text-[#1a1a1a] hover:bg-[#dcdad5]/40 rounded border border-[#dcdad5] transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center font-mono">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Brokerage Status Button */}
          <button
            onClick={onOpenBrokerModal}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-colors flex items-center gap-1.5 border cursor-pointer ${
              connectedBroker
                ? 'bg-white border-[#1a1a1a] text-[#1a1a1a] font-bold shadow-2xs'
                : 'bg-transparent border-[#dcdad5] text-[#1a1a1a]/80 hover:border-[#1a1a1a]'
            }`}
          >
            {connectedBroker ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{connectedBroker.name}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Conectar Corretora</span>
              </>
            )}
          </button>

          {/* Fast Order Execution (Boleta) */}
          <button
            onClick={onOpenOrderModal}
            className="px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#f8f7f4] bg-[#1a1a1a] hover:bg-black rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Boleta</span>
          </button>
        </div>

      </div>
    </header>
  );
};
