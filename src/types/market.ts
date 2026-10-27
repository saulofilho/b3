export type MarketExchange = 'B3' | 'NYSE' | 'NASDAQ';
export type AssetType = 'AÇÃO' | 'FII' | 'BDR' | 'ETF' | 'IPO';

export interface StockQuote {
  ticker: string;
  name: string;
  sector: string;
  exchange: MarketExchange;
  type: AssetType;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  vwap: number;
  marketCap: number; // in Millions/Billions
  peRatio: number; // P/L
  pvp: number; // P/VP
  dividendYield: number; // %
  roe: number; // %
  netMargin: number; // %
  netDebtEbitda: number;
  beta: number;
  sparkline: number[];
  currency: 'BRL' | 'USD';
  lastUpdated: string;
}

export type IPOStatus = 'RESERVA_ABERTA' | 'EM_ANALISE' | 'PRECIFICADO' | 'LISTADO_RECENTE';

export interface IPOItem {
  id: string;
  ticker: string;
  companyName: string;
  sector: string;
  exchange: MarketExchange;
  status: IPOStatus;
  statusLabel: string;
  priceRangeMin: number;
  priceRangeMax: number;
  finalPrice?: number;
  reservationStart: string;
  reservationEnd: string;
  listingDate: string;
  lockupPeriodDays: number;
  offeringSizeBRL: number; // in millions
  leadCoordinator: string;
  coordinators: string[];
  allocationMinBRL: number;
  allocationMaxBRL: number;
  prospectusSummary: string;
  useOfProceeds: {
    purpose: string;
    percentage: number;
  }[];
  investmentHighlights: string[];
  keyRisks: string[];
  reservedAmountBRL?: number;
}

export interface Candle {
  timestamp: number;
  dateStr: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema9?: number;
  sma20?: number;
  sma200?: number;
  rsi?: number;
  bollingerUpper?: number;
  bollingerLower?: number;
  bollingerMid?: number;
  macd?: number;
  macdSignal?: number;
  macdHist?: number;
}

export type TechnicalBias = 'FORTE_ALTA' | 'ALTA' | 'NEUTRO' | 'BAIXA' | 'FORTE_BAIXA';

export interface TechnicalReport {
  ticker: string;
  timeframe: string;
  bias: TechnicalBias;
  biasScore: number; // 0 to 100
  rsi14: number;
  rsiCondition: 'SOBRECOMPRADO' | 'SOBREVENDIDO' | 'NEUTRO';
  macdSignalStatus: 'COMPRA' | 'VENDA' | 'NEUTRO';
  movingAveragesStatus: 'GOLDEN_CROSS' | 'DEATH_CROSS' | 'ALINHADO_ALTA' | 'ALINHADO_BAIXA' | 'LATERAL';
  bollingerBandWidth: number;
  volatilityState: 'BAIXA_COMPRESSÃO' | 'NORMAL' | 'ALTA_EXPANSÃO';
  pivots: {
    r2: number;
    r1: number;
    pivot: number;
    s1: number;
    s2: number;
  };
  tradePlan: {
    entryPrice: number;
    target1: number;
    target2: number;
    stopLoss: number;
    riskRewardRatio: string;
    timeHorizon: string;
  };
  aiAnalysisText: string;
  catalysts: string[];
  risks: string[];
  generatedAt: string;
}

export interface PortfolioPosition {
  ticker: string;
  assetName: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalCost: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dayPnL: number;
  dayPnLPercent: number;
  allocationPercent: number;
  strategyTag: string; // e.g. "Dividendos", "Swing Trade", "IPO Growth", "Buy & Hold"
}

export interface SimulatedPortfolio {
  initialCapital: number;
  cashBalance: number;
  totalEquity: number;
  totalInvested: number;
  totalReturnBRL: number;
  totalReturnPercent: number;
  dayChangeBRL: number;
  dayChangePercent: number;
  positions: PortfolioPosition[];
}

export type OrderType = 'MARKET' | 'LIMIT' | 'STOP_LOSS';
export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'EXECUTED' | 'PENDING' | 'CANCELLED';

export interface TradeOrder {
  id: string;
  ticker: string;
  assetName: string;
  side: OrderSide;
  orderType: OrderType;
  quantity: number;
  requestedPrice: number;
  executedPrice?: number;
  status: OrderStatus;
  totalAmount: number;
  fees: number;
  timestamp: string;
  brokerId: string;
  brokerName: string;
  strategyTag?: string;
  isIpoReservation?: boolean;
}

export interface BrokerageIntegration {
  id: string;
  name: string;
  code: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'AUTHENTICATING';
  accountNumber?: string;
  balanceAvailableBRL: number;
  brokerFee: number;
  lastSync?: string;
  supportedFeatures: string[];
}

export interface PriceAlert {
  id: string;
  ticker: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW' | 'PERCENT_UP' | 'PERCENT_DOWN';
  active: boolean;
  createdAt: string;
  triggeredAt?: string;
  initialPrice: number;
  note?: string;
}

export interface AppNotification {
  id: string;
  type: 'PRICE_ALERT' | 'ORDER_EXECUTED' | 'IPO_UPDATE' | 'MARKET_BREAKING';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  ticker?: string;
  actionUrl?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  source: string;
  publishedAt: string;
  category: 'AÇÕES B3' | 'IPOS' | 'MACRO & JUROS' | 'GLOBAL & WALL ST' | 'DIVIDENDOS';
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  relatedTickers: string[];
  readTime: string;
  author: string;
}

export type DividendType = 'DIVIDENDO' | 'JCP' | 'RENDIMENTO';
export type DividendStatus = 'CONFIRMADO' | 'PREVISTO' | 'PAGO';

export interface DividendEvent {
  id: string;
  ticker: string;
  assetName: string;
  type: DividendType;
  valuePerShare: number;
  netValuePerShare: number;
  exDate: string;
  paymentDate: string;
  status: DividendStatus;
  approvedDate?: string;
  notes?: string;
}

