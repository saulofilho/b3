import React from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  CheckCheck, 
  ArrowUpRight, 
  Clock
} from 'lucide-react';
import { AppNotification } from '../types/market';

interface NotificationsDrawerProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onSelectTicker: (ticker: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onSelectTicker,
  soundEnabled,
  onToggleSound
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="bg-[#f8f7f4] border-l-2 border-[#1a1a1a] w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 text-[#1a1a1a]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#1a1a1a] flex items-center justify-between bg-white">
          <div>
            <h3 className="font-serif italic text-2xl font-bold text-[#1a1a1a]">
              Notificações
            </h3>
            <div className="label-mono mt-0.5">
              Movimentações e Disparos em Tempo Real
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleSound}
              title={soundEnabled ? "Desativar som" : "Ativar som"}
              className="p-1.5 border border-[#dcdad5] hover:border-[#1a1a1a] cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-800" /> : <VolumeX className="w-3.5 h-3.5 text-[#1a1a1a]/40" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 border border-[#dcdad5] hover:border-[#1a1a1a] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action strip */}
        <div className="px-5 py-2 border-b border-[#dcdad5] bg-[#f1f0ec] flex items-center justify-between text-xs font-mono">
          <span className="label-mono">{notifications.length} registros</span>
          <button
            onClick={onMarkAllAsRead}
            className="text-[#1a1a1a] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3 h-3" />
            <span>Marcar lidas</span>
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-[#1a1a1a]/50">
              Nenhuma notificação recente.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 border transition-all ${
                  n.read
                    ? 'bg-white border-[#dcdad5] opacity-70'
                    : 'bg-white border-[#1a1a1a] shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-xs text-[#1a1a1a]">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-[#1a1a1a]/50 flex items-center gap-1 shrink-0">
                    <Clock className="w-2.5 h-2.5" />
                    {n.timestamp}
                  </span>
                </div>

                <p className="text-[#1a1a1a]/80 text-[11px] leading-relaxed mb-2 font-sans">
                  {n.message}
                </p>

                {n.ticker && (
                  <button
                    onClick={() => {
                      onSelectTicker(n.ticker!);
                      onClose();
                    }}
                    className="text-[#1a1a1a] font-bold hover:underline text-[10px] flex items-center gap-1 cursor-pointer uppercase"
                  >
                    <span>Abrir ${n.ticker}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
