/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  INITIAL_STOCKS, 
  INITIAL_IPOS, 
  INITIAL_BROKERS, 
  INITIAL_NEWS, 
  INITIAL_PORTFOLIO, 
  INITIAL_ALERTS, 
  INITIAL_NOTIFICATIONS,
  generateCandlesForTicker,
  getTechnicalReportForStock
} from './data/mockMarketData';
import { 
  StockQuote, 
  IPOItem, 
  BrokerageIntegration, 
  NewsArticle, 
  SimulatedPortfolio, 
  PriceAlert, 
  AppNotification, 
  Candle, 
  OrderSide 
} from './types/market';
import { Header } from './components/Header';
import { MarketTickerBar } from './components/MarketTickerBar';
import { StockList } from './components/StockList';
import { StockDetailAndChart } from './components/StockDetailAndChart';
import { TechnicalAnalysisReport } from './components/TechnicalAnalysisReport';
import { IPOCalendar } from './components/IPOCalendar';
import { PortfolioSimulator } from './components/PortfolioSimulator';
import { BrokerageIntegrationModal } from './components/BrokerageIntegrationModal';
import { OrderBoletaModal } from './components/OrderBoletaModal';
import { PriceAlertsModal } from './components/PriceAlertsModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { NewsFeed } from './components/NewsFeed';
import { soundManager } from './utils/soundEffects';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'market' | 'ipos' | 'chart' | 'portfolio' | 'news'>('chart');
  
  // Market State
  const [stocks, setStocks] = useState<StockQuote[]>(INITIAL_STOCKS);
  const [ipos, setIpos] = useState<IPOItem[]>(INITIAL_IPOS);
  const [selectedTicker, setSelectedTicker] = useState<string>('PETR4');
  const [timeframe, setTimeframe] = useState<string>('1D');
  const [candles, setCandles] = useState<Candle[]>(() => generateCandlesForTicker('PETR4', '1D'));
  const [priceFlash, setPriceFlash] = useState<'green' | 'red' | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(true);
  const [lastTickTime, setLastTickTime] = useState<string>('Agora');

  // Portfolio & Broker State
  const [portfolio, setPortfolio] = useState<SimulatedPortfolio>(INITIAL_PORTFOLIO);
  const [brokers, setBrokers] = useState<BrokerageIntegration[]>(INITIAL_BROKERS);
  const [connectedBroker, setConnectedBroker] = useState<BrokerageIntegration | null>(
    INITIAL_BROKERS.find(b => b.status === 'CONNECTED') || null
  );

  // Alerts & Notifications State
  const [alerts, setAlerts] = useState<PriceAlert[]>(INITIAL_ALERTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals & Drawers State
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState<boolean>(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isTechnicalReportOpen, setIsTechnicalReportOpen] = useState<boolean>(false);
  
  // Pre-fill state for Order Boleta
  const [boletaInitialStock, setBoletaInitialStock] = useState<StockQuote | null>(null);
  const [boletaInitialIpo, setBoletaInitialIpo] = useState<IPOItem | null>(null);
  const [boletaInitialSide, setBoletaInitialSide] = useState<OrderSide>('BUY');
  const [boletaInitialPrice, setBoletaInitialPrice] = useState<number | undefined>(undefined);
  const [boletaInitialStop, setBoletaInitialStop] = useState<number | undefined>(undefined);

  // Pre-fill state for Alerts Modal
  const [alertInitialTicker, setAlertInitialTicker] = useState<string>('PETR4');
  const [alertInitialPrice, setAlertInitialPrice] = useState<number>(38.45);

  const selectedStock = stocks.find(s => s.ticker === selectedTicker) || stocks[0];
  const selectedStockReport = getTechnicalReportForStock(selectedStock);

  // Re-generate candles whenever ticker or timeframe changes
  useEffect(() => {
    setCandles(generateCandlesForTicker(selectedTicker, timeframe));
  }, [selectedTicker, timeframe]);

  // Real-Time Market Tick Simulation Engine
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      // Pick random stock to tick
      const randomIndex = Math.floor(Math.random() * stocks.length);
      const targetStock = stocks[randomIndex];

      // Subtle fluctuation (-0.35% to +0.4%)
      const deltaPercent = (Math.random() - 0.48) * 0.7;
      const priceDelta = +(targetStock.price * (deltaPercent / 100)).toFixed(2);
      if (priceDelta === 0) return;

      const newPrice = Math.max(0.5, +(targetStock.price + priceDelta).toFixed(2));
      const newChange = +(newPrice - targetStock.previousClose).toFixed(2);
      const newChangePercent = +((newChange / targetStock.previousClose) * 100).toFixed(2);
      const isUp = priceDelta > 0;

      // Update stocks array
      setStocks(prev => prev.map((s, idx) => {
        if (idx !== randomIndex) return s;
        return {
          ...s,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
          high24h: Math.max(s.high24h, newPrice),
          low24h: Math.min(s.low24h, newPrice),
          lastUpdated: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
      }));

      // Update active candle if this is the currently selected stock
      if (targetStock.ticker === selectedTicker) {
        setPriceFlash(isUp ? 'green' : 'red');
        setTimeout(() => setPriceFlash(null), 800);

        setCandles(prev => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const lastCandle = { ...updated[updated.length - 1] };
          lastCandle.close = newPrice;
          lastCandle.high = Math.max(lastCandle.high, newPrice);
          lastCandle.low = Math.min(lastCandle.low, newPrice);
          lastCandle.volume += Math.floor(Math.random() * 5000 + 1000);
          updated[updated.length - 1] = lastCandle;
          return updated;
        });
      }

      setLastTickTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      // Check if any price alert was triggered
      alerts.forEach(alert => {
        if (!alert.active || alert.ticker !== targetStock.ticker) return;

        let triggered = false;
        if (alert.condition === 'ABOVE' && newPrice >= alert.targetPrice) triggered = true;
        if (alert.condition === 'BELOW' && newPrice <= alert.targetPrice) triggered = true;
        if (alert.condition === 'PERCENT_UP' && newChangePercent >= 3.0) triggered = true;
        if (alert.condition === 'PERCENT_DOWN' && newChangePercent <= -3.0) triggered = true;

        if (triggered) {
          // Deactivate triggered alert
          setAlerts(curr => curr.map(a => a.id === alert.id ? { ...a, active: false, triggeredAt: new Date().toLocaleTimeString('pt-BR') } : a));
          
          // Add notification
          const newNotif: AppNotification = {
            id: `notif-${Date.now()}`,
            type: 'PRICE_ALERT',
            title: `Alerta Disparado: ${alert.ticker}`,
            message: `${alert.ticker} atingiu R$ ${newPrice.toFixed(2)} (${newChangePercent >= 0 ? '+' : ''}${newChangePercent.toFixed(2)}%). ${alert.note || ''}`,
            timestamp: 'Agora',
            read: false,
            ticker: alert.ticker
          };
          setNotifications(curr => [newNotif, ...curr]);

          if (soundEnabled) {
            soundManager.playPriceAlert();
          }
        }
      });

    }, 2200);

    return () => clearInterval(interval);
  }, [isLiveUpdating, stocks, selectedTicker, alerts, soundEnabled]);

  // Recalculate portfolio real-time valuation when stock prices change
  useEffect(() => {
    setPortfolio(prev => {
      let totalPositionValue = 0;
      let totalCost = 0;
      let dayPnL = 0;

      const updatedPositions = prev.positions.map(pos => {
        const matchingStock = stocks.find(s => s.ticker === pos.ticker);
        const currentPrice = matchingStock ? matchingStock.price : pos.currentPrice;
        const currentValue = +(pos.quantity * currentPrice).toFixed(2);
        const unrealizedPnL = +(currentValue - pos.totalCost).toFixed(2);
        const unrealizedPnLPercent = +((unrealizedPnL / (pos.totalCost || 1)) * 100).toFixed(2);
        
        const dayChangePerShare = matchingStock ? matchingStock.change : 0;
        const posDayPnL = +(pos.quantity * dayChangePerShare).toFixed(2);
        const posDayPnLPercent = matchingStock ? matchingStock.changePercent : 0;

        totalPositionValue += currentValue;
        totalCost += pos.totalCost;
        dayPnL += posDayPnL;

        return {
          ...pos,
          currentPrice,
          currentValue,
          unrealizedPnL,
          unrealizedPnLPercent,
          dayPnL: posDayPnL,
          dayPnLPercent: posDayPnLPercent,
          allocationPercent: 0 // calculated next
        };
      });

      const totalEquity = +(prev.cashBalance + totalPositionValue).toFixed(2);
      const totalReturnBRL = +(totalPositionValue - totalCost).toFixed(2);
      const totalReturnPercent = +((totalReturnBRL / (prev.initialCapital || 1)) * 100).toFixed(2);
      const dayChangePercent = +((dayPnL / (totalEquity || 1)) * 100).toFixed(2);

      // update allocation percentages
      const finalPositions = updatedPositions.map(p => ({
        ...p,
        allocationPercent: totalPositionValue > 0 ? +((p.currentValue / totalPositionValue) * 100).toFixed(1) : 0
      }));

      return {
        ...prev,
        totalEquity,
        totalInvested: totalCost,
        totalReturnBRL,
        totalReturnPercent,
        dayChangeBRL: dayPnL,
        dayChangePercent,
        positions: finalPositions
      };
    });
  }, [stocks]);

  // Handlers
  const handleSelectStock = (ticker: string) => {
    setSelectedTicker(ticker);
    setActiveTab('chart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOrderModal = (stock?: StockQuote, side: OrderSide = 'BUY') => {
    setBoletaInitialStock(stock || selectedStock);
    setBoletaInitialIpo(null);
    setBoletaInitialSide(side);
    setBoletaInitialPrice(stock?.price || selectedStock.price);
    setBoletaInitialStop(undefined);
    setIsOrderModalOpen(true);
  };

  const handleOpenReserveIpo = (ipo: IPOItem) => {
    setBoletaInitialIpo(ipo);
    setBoletaInitialStock(null);
    setBoletaInitialSide('BUY');
    setBoletaInitialPrice(ipo.priceRangeMax);
    setBoletaInitialStop(undefined);
    setIsOrderModalOpen(true);
  };

  const handleOpenAlertModal = (ticker: string, currentPrice: number) => {
    setAlertInitialTicker(ticker);
    setAlertInitialPrice(currentPrice);
    setIsAlertsModalOpen(true);
  };

  const handleOpenTechnicalReport = (stock: StockQuote) => {
    setSelectedTicker(stock.ticker);
    setIsTechnicalReportOpen(true);
  };

  const handleExecuteTradePlanFromReport = (stock: StockQuote, price: number, stopLoss: number) => {
    setBoletaInitialStock(stock);
    setBoletaInitialIpo(null);
    setBoletaInitialSide('BUY');
    setBoletaInitialPrice(price);
    setBoletaInitialStop(stopLoss);
    setIsOrderModalOpen(true);
  };

  const handleConnectBroker = (brokerId: string, accountNumber: string) => {
    setBrokers(prev => prev.map(b => {
      if (b.id === brokerId) {
        return {
          ...b,
          status: 'CONNECTED',
          accountNumber,
          lastSync: 'Agora'
        };
      }
      return b;
    }));

    const connected = brokers.find(b => b.id === brokerId);
    if (connected) {
      setConnectedBroker({
        ...connected,
        status: 'CONNECTED',
        accountNumber,
        lastSync: 'Agora'
      });
    }

    setNotifications(curr => [
      {
        id: `notif-${Date.now()}`,
        type: 'ORDER_EXECUTED',
        title: 'Corretora Vinculada com Sucesso',
        message: `Conta ${accountNumber} conectada com êxito. Saldo e liquidação integrados.`,
        timestamp: 'Agora',
        read: false
      },
      ...curr
    ]);

    if (soundEnabled) soundManager.playOrderSuccess();
    setIsBrokerModalOpen(false);
  };

  const handleDisconnectBroker = (brokerId: string) => {
    setBrokers(prev => prev.map(b => b.id === brokerId ? { ...b, status: 'DISCONNECTED' } : b));
    setConnectedBroker(null);
  };

  const handleExecuteOrder = (orderData: {
    ticker: string;
    assetName: string;
    side: OrderSide;
    orderType: any;
    quantity: number;
    price: number;
    brokerId: string;
    brokerName: string;
    strategyTag: string;
    isIpoReservation?: boolean;
  }) => {
    const totalValue = +(orderData.quantity * orderData.price).toFixed(2);
    
    // Play sound feedback
    if (soundEnabled) soundManager.playOrderSuccess();

    // If using connected broker, deduct from broker available balance
    if (orderData.brokerId !== 'simulated-portfolio' && connectedBroker) {
      setConnectedBroker(curr => curr ? {
        ...curr,
        balanceAvailableBRL: +(curr.balanceAvailableBRL - (orderData.side === 'BUY' ? totalValue : -totalValue)).toFixed(2)
      } : null);
    }

    // Always record/reflect in simulated portfolio for strategy tracking
    setPortfolio(prev => {
      const existingPosIndex = prev.positions.findIndex(p => p.ticker === orderData.ticker);
      let updatedPositions = [...prev.positions];
      let newCash = prev.cashBalance;

      if (orderData.side === 'BUY') {
        newCash = +(newCash - totalValue).toFixed(2);

        if (existingPosIndex >= 0) {
          const old = updatedPositions[existingPosIndex];
          const newQty = old.quantity + orderData.quantity;
          const newTotalCost = +(old.totalCost + totalValue).toFixed(2);
          const newAvg = +(newTotalCost / newQty).toFixed(2);
          const newCurrentVal = +(newQty * orderData.price).toFixed(2);

          updatedPositions[existingPosIndex] = {
            ...old,
            quantity: newQty,
            totalCost: newTotalCost,
            avgPrice: newAvg,
            currentValue: newCurrentVal,
            unrealizedPnL: +(newCurrentVal - newTotalCost).toFixed(2),
            unrealizedPnLPercent: +(((newCurrentVal - newTotalCost) / newTotalCost) * 100).toFixed(2)
          };
        } else {
          updatedPositions.push({
            ticker: orderData.ticker,
            assetName: orderData.assetName,
            quantity: orderData.quantity,
            avgPrice: orderData.price,
            currentPrice: orderData.price,
            totalCost: totalValue,
            currentValue: totalValue,
            unrealizedPnL: 0,
            unrealizedPnLPercent: 0,
            dayPnL: 0,
            dayPnLPercent: 0,
            allocationPercent: 0,
            strategyTag: orderData.strategyTag || 'Quality Growth'
          });
        }
      } else {
        // SELL
        newCash = +(newCash + totalValue).toFixed(2);

        if (existingPosIndex >= 0) {
          const old = updatedPositions[existingPosIndex];
          const remQty = Math.max(0, old.quantity - orderData.quantity);
          if (remQty === 0) {
            updatedPositions = updatedPositions.filter(p => p.ticker !== orderData.ticker);
          } else {
            const newTotalCost = +(old.avgPrice * remQty).toFixed(2);
            const newCurrentVal = +(remQty * orderData.price).toFixed(2);
            updatedPositions[existingPosIndex] = {
              ...old,
              quantity: remQty,
              totalCost: newTotalCost,
              currentValue: newCurrentVal,
              unrealizedPnL: +(newCurrentVal - newTotalCost).toFixed(2),
              unrealizedPnLPercent: +(((newCurrentVal - newTotalCost) / newTotalCost) * 100).toFixed(2)
            };
          }
        }
      }

      return {
        ...prev,
        cashBalance: newCash,
        positions: updatedPositions
      };
    });

    // Add executed order notification
    setNotifications(curr => [
      {
        id: `notif-${Date.now()}`,
        type: 'ORDER_EXECUTED',
        title: orderData.isIpoReservation ? `Reserva de IPO: ${orderData.ticker}` : `Ordem Executada: ${orderData.ticker}`,
        message: `${orderData.side === 'BUY' ? 'Compra' : 'Venda'} de ${orderData.quantity} ações a R$ ${orderData.price.toFixed(2)} via ${orderData.brokerName}.`,
        timestamp: 'Agora',
        read: false,
        ticker: orderData.ticker
      },
      ...curr
    ]);
  };

  const handleAddFunds = (amount: number) => {
    setPortfolio(prev => ({
      ...prev,
      cashBalance: +(prev.cashBalance + amount).toFixed(2),
      totalEquity: +(prev.totalEquity + amount).toFixed(2)
    }));
    if (soundEnabled) soundManager.playOrderSuccess();
  };

  const handleResetPortfolio = () => {
    setPortfolio(INITIAL_PORTFOLIO);
    if (soundEnabled) soundManager.playOrderSuccess();
  };

  const handleAddAlert = (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggeredAt'>) => {
    const alert: PriceAlert = {
      ...newAlert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toLocaleTimeString('pt-BR')
    };
    setAlerts(curr => [alert, ...curr]);
    setIsAlertsModalOpen(false);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(curr => curr.filter(a => a.id !== id));
  };

  const handleToggleAlert = (id: string) => {
    setAlerts(curr => curr.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#1a1a1a] flex flex-col font-sans selection:bg-[#1a1a1a] selection:text-[#f8f7f4]">
      
      {/* 3-Zone Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        connectedBroker={connectedBroker}
        onOpenBrokerModal={() => setIsBrokerModalOpen(true)}
        onOpenOrderModal={() => handleOpenOrderModal()}
        onOpenAlertsModal={() => setIsAlertsModalOpen(true)}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Live Market Marquee Strip (Black Ticker Tape) */}
      <MarketTickerBar
        stocks={stocks}
        onSelectStock={handleSelectStock}
        isLiveUpdating={isLiveUpdating}
        onToggleLive={() => setIsLiveUpdating(!isLiveUpdating)}
        lastTickTime={lastTickTime}
      />

      {/* 3-Pane Broadsheet Layout (Desktop: 260px Left Radar, 1fr Middle, 320px Right Execução) */}
      <main className="flex-1 w-full grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] divide-y lg:divide-y-0 lg:divide-x divide-[#dcdad5] min-h-0 bg-[#f8f7f4]">
        
        {/* PANE 1 (LEFT): Radar & Market Overview */}
        <aside className="p-4 lg:p-6 overflow-y-auto bg-[#f8f7f4]">
          <div className="mb-6 pb-2 border-b border-[#1a1a1a] flex items-baseline justify-between">
            <h2 className="text-xl font-serif italic font-bold text-[#1a1a1a]">Radar</h2>
            <span className="label-mono">B3 & Globais</span>
          </div>

          {/* Macro Indices Snapshot */}
          <div className="space-y-3 mb-6 pb-6 border-b border-[#dcdad5]">
            <div className="flex items-baseline justify-between">
              <span className="label-mono">IBOVESPA</span>
              <span className="font-mono text-xs font-bold text-[#1a1a1a]">
                133.480 <strong className="text-emerald-700 font-bold ml-1">+1.18%</strong>
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="label-mono">S&P 500</span>
              <span className="font-mono text-xs font-bold text-[#1a1a1a]">
                5.864 <strong className="text-emerald-700 font-bold ml-1">+0.42%</strong>
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="label-mono">DÓLAR PTAX</span>
              <span className="font-mono text-xs font-bold text-[#1a1a1a]">
                R$ 5,418 <strong className="text-rose-700 font-bold ml-1">-0.35%</strong>
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="label-mono">TAXA SELIC</span>
              <span className="font-mono text-xs font-bold text-[#1a1a1a]">11,25% a.a.</span>
            </div>
          </div>

          {/* Watchlist Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="label-mono">Ativos em Cobertura ({stocks.length})</span>
            <button 
              onClick={() => setActiveTab('market')}
              className="text-[10px] font-mono text-[#1a1a1a] underline hover:opacity-70 uppercase font-bold cursor-pointer"
            >
              Ver Tabela
            </button>
          </div>

          {/* Stock Radar List */}
          <ul className="divide-y divide-[#dcdad5]">
            {stocks.map(s => {
              const isCur = s.ticker === selectedTicker;
              const isUp = s.change >= 0;
              return (
                <li key={s.ticker}>
                  <button
                    onClick={() => handleSelectStock(s.ticker)}
                    className={`w-full py-2.5 px-2 text-left transition-colors flex items-center justify-between group cursor-pointer ${
                      isCur ? 'bg-white border-l-4 border-[#1a1a1a] shadow-xs' : 'hover:bg-white/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-[#1a1a1a] group-hover:underline">
                          {s.ticker}
                        </span>
                        <span className="text-[9px] uppercase font-mono px-1 py-0.2 bg-[#e8e6df] text-[#1a1a1a]/80 rounded-xs">
                          {s.sector.split(' ')[0]}
                        </span>
                        {s.dividendYield >= 6.0 && (
                          <span className="text-[8px] font-mono font-bold px-1 py-0.2 bg-emerald-100 text-emerald-800 rounded-xs" title="Dividend Yield Alto">
                            DY {s.dividendYield.toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#1a1a1a]/60 truncate max-w-[110px] font-sans">
                        {s.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-xs block text-[#1a1a1a]">
                        R$ {s.price.toFixed(2)}
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${isUp ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isUp ? '+' : ''}{s.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* PANE 2 (MIDDLE): Focus stock view or selected Tab content */}
        <section className="p-4 lg:p-6 overflow-y-auto min-w-0 bg-[#f8f7f4]">
          {/* TAB 1: Chart & In-depth Technical View */}
          {activeTab === 'chart' && (
            <div className="space-y-6">
              <StockDetailAndChart
                stock={selectedStock}
                candles={candles}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                onOpenOrderModal={handleOpenOrderModal}
                onOpenAlertModal={handleOpenAlertModal}
                onOpenTechnicalReport={handleOpenTechnicalReport}
                priceFlash={priceFlash}
              />

              {/* Quick Stock Selector Carousel below chart */}
              <div className="bg-white border border-[#1a1a1a] p-4 shadow-xs">
                <span className="label-mono block mb-3 text-[#1a1a1a]/70">
                  Alternar Ativo em Análise (B3 & Globais)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {stocks.map(s => {
                    const isCur = s.ticker === selectedTicker;
                    const isUp = s.change >= 0;
                    return (
                      <button
                        key={s.ticker}
                        onClick={() => handleSelectStock(s.ticker)}
                        className={`p-2 border text-left transition-all cursor-pointer ${
                          isCur
                            ? 'bg-[#1a1a1a] text-[#f8f7f4] border-[#1a1a1a] shadow-xs'
                            : 'bg-white border-[#dcdad5] hover:border-[#1a1a1a]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`font-mono font-bold text-xs ${isCur ? 'text-[#f8f7f4]' : 'text-[#1a1a1a]'}`}>{s.ticker}</span>
                          <span className={`text-[10px] font-mono font-bold tabular-nums ${isUp ? (isCur ? 'text-emerald-300' : 'text-emerald-700') : (isCur ? 'text-rose-300' : 'text-rose-700')}`}>
                            {isUp ? '+' : ''}{s.changePercent.toFixed(1)}%
                          </span>
                        </div>
                        <span className={`text-[11px] font-mono tabular-nums block ${isCur ? 'text-white/80' : 'text-[#1a1a1a]/80'}`}>
                          R$ {s.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Stocks & Market Table */}
          {activeTab === 'market' && (
            <div className="space-y-6">
              <StockList
                stocks={stocks}
                selectedTicker={selectedTicker}
                onSelectStock={handleSelectStock}
                onOpenOrderModal={handleOpenOrderModal}
                onOpenAlertModal={handleOpenAlertModal}
                onOpenTechnicalReport={handleOpenTechnicalReport}
              />
            </div>
          )}

          {/* TAB 3: IPOs & Offerings Calendar */}
          {activeTab === 'ipos' && (
            <IPOCalendar
              ipos={ipos}
              onReserveIPO={handleOpenReserveIpo}
            />
          )}

          {/* TAB 4: Simulated Portfolio & Strategy Testing */}
          {activeTab === 'portfolio' && (
            <PortfolioSimulator
              portfolio={portfolio}
              stocks={stocks}
              onOpenOrderModal={handleOpenOrderModal}
              onAddFunds={handleAddFunds}
              onResetPortfolio={handleResetPortfolio}
              onSelectStock={handleSelectStock}
            />
          )}

          {/* TAB 5: Real-Time Financial News Feed */}
          {activeTab === 'news' && (
            <NewsFeed
              news={INITIAL_NEWS}
              onSelectTicker={handleSelectStock}
            />
          )}
        </section>

        {/* PANE 3 (RIGHT): Actions & Orders & Broker Integrations */}
        <aside className="p-4 lg:p-6 overflow-y-auto bg-[#f4f2ee]">
          <div className="mb-6 pb-2 border-b border-[#1a1a1a] flex items-baseline justify-between">
            <h2 className="text-xl font-serif italic font-bold text-[#1a1a1a]">Execução</h2>
            <span className="label-mono">DMA2 / FIX</span>
          </div>

          {/* Order Box matching Variation 6 */}
          <div className="bg-white border border-[#1a1a1a] p-5 mb-5 shadow-xs">
            <div className="flex justify-between items-start mb-3 pb-3 border-b border-[#dcdad5]">
              <div>
                <span className="label-mono">Ativo em Foco</span>
                <h3 className="font-mono font-bold text-lg text-[#1a1a1a]">{selectedStock.ticker}</h3>
                <p className="text-xs text-[#1a1a1a]/60 truncate max-w-[150px]">{selectedStock.name}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-900 rounded-xs">
                    DY {selectedStock.dividendYield.toFixed(1)}% a.a.
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-xl block text-[#1a1a1a]">
                  R$ {selectedStock.price.toFixed(2)}
                </span>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full inline-block text-white ${selectedStock.change >= 0 ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                  {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Buttons: btn-p and btn-s */}
            <div className="space-y-2">
              <button 
                onClick={() => handleOpenOrderModal(selectedStock, 'BUY')}
                className="w-full py-3.5 bg-[#1a1a1a] text-[#f8f7f4] font-mono font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors cursor-pointer text-center block shadow-xs"
              >
                Comprar {selectedStock.ticker}
              </button>

              <button 
                onClick={() => handleOpenOrderModal(selectedStock, 'SELL')}
                className="w-full py-3.5 bg-transparent border border-[#1a1a1a] text-[#1a1a1a] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#1a1a1a]/5 transition-colors cursor-pointer text-center block"
              >
                Vender {selectedStock.ticker}
              </button>

              <button 
                onClick={() => handleOpenOrderModal(selectedStock, 'BUY')}
                className="w-full py-2.5 text-[11px] font-mono text-[#1a1a1a] border border-dashed border-[#1a1a1a]/50 hover:border-[#1a1a1a] hover:bg-white transition-colors uppercase tracking-wider cursor-pointer text-center block"
              >
                Boleta Avançada (Stop / Limite)
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-[#dcdad5] flex items-center justify-between text-[11px] font-mono text-[#1a1a1a]/70">
              <span>Disponível:</span>
              <span className="font-bold text-[#1a1a1a]">
                R$ {(connectedBroker ? connectedBroker.balanceAvailableBRL : portfolio.cashBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Quick Technical Scorecard */}
          <div className="bg-white border border-[#dcdad5] p-4 mb-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="label-mono">Análise Técnica</span>
              <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                {selectedStockReport.bias.replace('_', ' ')}
              </span>
            </div>
            <div className="space-y-1.5 text-xs font-mono mb-3">
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]/60">Score Técnico:</span>
                <span className="font-bold text-[#1a1a1a]">{selectedStockReport.biasScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]/60">RSI (14):</span>
                <span className="font-bold text-[#1a1a1a]">{selectedStockReport.rsi14.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]/60">Suporte S1:</span>
                <span className="font-bold text-[#1a1a1a]">R$ {selectedStockReport.pivots.s1.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]/60">Resistência R1:</span>
                <span className="font-bold text-[#1a1a1a]">R$ {selectedStockReport.pivots.r1.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => handleOpenTechnicalReport(selectedStock)}
              className="w-full py-2 bg-[#f8f7f4] border border-[#1a1a1a] text-[#1a1a1a] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1a1a1a] hover:text-[#f8f7f4] transition-colors cursor-pointer text-center"
            >
              Ver Relatório Completo
            </button>
          </div>

          {/* Connection Status Box matching Variation 6 */}
          <div className="bg-white border border-[#dcdad5] p-4 mb-5">
            <span className="label-mono">Roteamento FIX & Corretora</span>
            <div className="flex items-center gap-2 mt-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${connectedBroker ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-mono font-bold text-xs text-[#1a1a1a]">
                {connectedBroker ? `${connectedBroker.name} Conectado` : 'Modo Simulado (Sem Corretora)'}
              </span>
            </div>
            {connectedBroker ? (
              <p className="text-[11px] font-mono text-[#1a1a1a]/60 mb-3">
                Conta: {connectedBroker.accountNumber} · DMA2 ativo · Taxa Zero
              </p>
            ) : (
              <p className="text-[11px] font-mono text-[#1a1a1a]/60 mb-3">
                Conecte XP, BTG, NuInvest, Clear ou Interactive Brokers para envio direto.
              </p>
            )}
            <button
              onClick={() => setIsBrokerModalOpen(true)}
              className="w-full py-2 border border-[#1a1a1a] text-[#1a1a1a] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1a1a1a] hover:text-[#f8f7f4] transition-colors cursor-pointer text-center"
            >
              {connectedBroker ? 'Alternar Corretora' : 'Conectar Corretora'}
            </button>
          </div>

          {/* Quick Price Alert Box */}
          <div className="bg-white border border-[#dcdad5] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="label-mono">Alertas Ativos ({alerts.filter(a => a.active).length})</span>
              <button 
                onClick={() => handleOpenAlertModal(selectedStock.ticker, selectedStock.price)}
                className="text-[10px] font-mono text-[#1a1a1a] underline hover:opacity-70 uppercase font-bold cursor-pointer"
              >
                + Novo Alerta
              </button>
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {alerts.slice(0, 3).map(a => (
                <div key={a.id} className="text-xs font-mono flex items-center justify-between py-1 border-b border-[#eeebe6] last:border-none">
                  <div>
                    <span className="font-bold text-[#1a1a1a]">{a.ticker}</span>
                    <span className="text-[#1a1a1a]/60 text-[10px] ml-1">
                      {a.condition === 'ABOVE' ? '≥' : '≤'} R$ {a.targetPrice.toFixed(2)}
                    </span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${a.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                    {a.active ? 'Ativo' : 'Pausado'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </main>

      {/* Broadsheet Footer matching Variation 6 */}
      <footer className="bg-[#eeebe6] border-t border-[#dcdad5] py-4 px-6 lg:px-10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-[#1a1a1a]/70">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1a1a1a]">B3 AlphaTerminal</span>
          <span>·</span>
          <span>Terminal Profissional V1.4</span>
          <span>·</span>
          <span>B3 Ao Vivo: <strong className="text-[#1a1a1a]">{lastTickTime}</strong></span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>CVM & B3 Compliance</span>
          <span>·</span>
          <span>DMA2 FIX Protocol</span>
          <span>·</span>
          <span>Simulador & Apoio a Decisões</span>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Brokerage Integration Modal */}
      {isBrokerModalOpen && (
        <BrokerageIntegrationModal
          brokers={brokers}
          connectedBroker={connectedBroker}
          onConnectBroker={handleConnectBroker}
          onDisconnectBroker={handleDisconnectBroker}
          onClose={() => setIsBrokerModalOpen(false)}
        />
      )}

      {/* 2. Order Boleta (Buy/Sell/IPO Ticket) */}
      {isOrderModalOpen && (
        <OrderBoletaModal
          initialStock={boletaInitialStock}
          initialIpo={boletaInitialIpo}
          stocks={stocks}
          initialSide={boletaInitialSide}
          initialPrice={boletaInitialPrice}
          initialStopLoss={boletaInitialStop}
          connectedBroker={connectedBroker}
          simulatedCashBalance={portfolio.cashBalance}
          onExecuteOrder={handleExecuteOrder}
          onClose={() => setIsOrderModalOpen(false)}
        />
      )}

      {/* 3. Detailed Technical Analysis Report Modal */}
      {isTechnicalReportOpen && (
        <TechnicalAnalysisReport
          stock={selectedStock}
          onClose={() => setIsTechnicalReportOpen(false)}
          onExecuteTradePlan={handleExecuteTradePlanFromReport}
          onSetAlert={(t, p) => handleOpenAlertModal(t, p)}
        />
      )}

      {/* 4. Price Alerts Modal */}
      {isAlertsModalOpen && (
        <PriceAlertsModal
          alerts={alerts}
          stocks={stocks}
          initialTicker={alertInitialTicker}
          initialPrice={alertInitialPrice}
          onAddAlert={handleAddAlert}
          onDeleteAlert={handleDeleteAlert}
          onToggleAlert={handleToggleAlert}
          onClose={() => setIsAlertsModalOpen(false)}
        />
      )}

      {/* 5. Notifications Drawer */}
      <NotificationsDrawer
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllAsRead={() => setNotifications(curr => curr.map(n => ({ ...n, read: true })))}
        onSelectTicker={handleSelectStock}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

    </div>
  );
}
