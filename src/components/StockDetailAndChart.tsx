import React, { useState, useMemo, useRef } from 'react';
import { 
  CandlestickChart, 
  LineChart as LineChartIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Bell, 
  FileText
} from 'lucide-react';
import { StockQuote, Candle } from '../types/market';

interface StockDetailAndChartProps {
  stock: StockQuote;
  candles: Candle[];
  timeframe: string;
  setTimeframe: (tf: string) => void;
  onOpenOrderModal: (stock: StockQuote, side: 'BUY' | 'SELL') => void;
  onOpenAlertModal: (ticker: string, currentPrice: number) => void;
  onOpenTechnicalReport: (stock: StockQuote) => void;
  priceFlash?: 'green' | 'red' | null;
}

export const StockDetailAndChart: React.FC<StockDetailAndChartProps> = ({
  stock,
  candles,
  timeframe,
  setTimeframe,
  onOpenOrderModal,
  onOpenAlertModal,
  onOpenTechnicalReport,
  priceFlash
}) => {
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [showEMA9, setShowEMA9] = useState(true);
  const [showSMA20, setShowSMA20] = useState(true);
  const [showBollinger, setShowBollinger] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // SVG dimensions
  const svgWidth = 840;
  const mainChartHeight = 280;
  const volumeHeight = showVolume ? 60 : 0;
  const rsiHeight = showRSI ? 75 : 0;
  const totalSvgHeight = mainChartHeight + volumeHeight + rsiHeight + 35;

  const isPositive = stock.change >= 0;

  // Calculate scales for chart area
  const { minPrice, maxPrice, priceRange, maxVolume } = useMemo(() => {
    if (!candles || candles.length === 0) {
      return { minPrice: 10, maxPrice: 100, priceRange: 90, maxVolume: 1000000 };
    }
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;

    candles.forEach(c => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (showBollinger && c.bollingerLower && c.bollingerLower < min) min = c.bollingerLower;
      if (showBollinger && c.bollingerUpper && c.bollingerUpper > max) max = c.bollingerUpper;
      if (c.volume > maxVol) maxVol = c.volume;
    });

    const padding = (max - min) * 0.08 || 1;
    return {
      minPrice: Math.max(0.1, min - padding),
      maxPrice: max + padding,
      priceRange: (max + padding) - Math.max(0.1, min - padding),
      maxVolume: maxVol || 1
    };
  }, [candles, showBollinger]);

  const candleWidth = useMemo(() => {
    if (candles.length === 0) return 10;
    const available = svgWidth - 80;
    return Math.max(3, Math.min(20, available / candles.length * 0.72));
  }, [candles.length, svgWidth]);

  // Coordinate conversion
  const getX = (index: number) => {
    const startX = 30;
    const endX = svgWidth - 75;
    const step = (endX - startX) / (candles.length - 1 || 1);
    return startX + index * step;
  };

  const getY = (price: number) => {
    const topMargin = 20;
    const usableHeight = mainChartHeight - 35;
    const ratio = (price - minPrice) / (priceRange || 1);
    return topMargin + usableHeight * (1 - ratio);
  };

  // Paths
  const linePath = useMemo(() => {
    if (candles.length < 2) return '';
    return candles.map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(c.close)}`).join(' ');
  }, [candles, minPrice, priceRange]);

  const ema9Path = useMemo(() => {
    if (!showEMA9) return '';
    const valid = candles.map((c, i) => ({ val: c.ema9, i })).filter(d => d.val !== undefined);
    if (valid.length < 2) return '';
    return valid.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(d.i)} ${getY(d.val!)}`).join(' ');
  }, [candles, showEMA9, minPrice, priceRange]);

  const sma20Path = useMemo(() => {
    if (!showSMA20) return '';
    const valid = candles.map((c, i) => ({ val: c.sma20, i })).filter(d => d.val !== undefined);
    if (valid.length < 2) return '';
    return valid.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(d.i)} ${getY(d.val!)}`).join(' ');
  }, [candles, showSMA20, minPrice, priceRange]);

  const bollingerUpperPath = useMemo(() => {
    if (!showBollinger) return '';
    const valid = candles.map((c, i) => ({ val: c.bollingerUpper, i })).filter(d => d.val !== undefined);
    if (valid.length < 2) return '';
    return valid.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(d.i)} ${getY(d.val!)}`).join(' ');
  }, [candles, showBollinger, minPrice, priceRange]);

  const bollingerLowerPath = useMemo(() => {
    if (!showBollinger) return '';
    const valid = candles.map((c, i) => ({ val: c.bollingerLower, i })).filter(d => d.val !== undefined);
    if (valid.length < 2) return '';
    return valid.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(d.i)} ${getY(d.val!)}`).join(' ');
  }, [candles, showBollinger, minPrice, priceRange]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const startX = 30;
    const endX = svgWidth - 75;
    const step = (endX - startX) / (candles.length - 1 || 1);
    
    const index = Math.round((x - startX) / step);
    if (index >= 0 && index < candles.length) {
      setHoveredCandle(candles[index]);
      setMousePos({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCandle(null);
    setMousePos(null);
  };

  const displayCandle = hoveredCandle || (candles.length > 0 ? candles[candles.length - 1] : null);

  return (
    <div className="space-y-6">
      
      {/* Hero Stock Header (Variation 6 Signature) */}
      <div className="border-b border-[#dcdad5] pb-6">
        <div className="label-mono mb-2">
          {stock.name} · {stock.sector} · {stock.exchange}
        </div>

        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <div className="font-serif italic text-6xl sm:text-7xl font-bold tracking-tight text-[#1a1a1a] leading-none mb-3">
              {stock.ticker}.{stock.exchange}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className={`font-mono text-3xl sm:text-4xl font-bold tracking-tight tabular-nums transition-colors ${
                priceFlash === 'green' ? 'text-emerald-600 bg-emerald-50 px-1' :
                priceFlash === 'red' ? 'text-rose-600 bg-rose-50 px-1' :
                'text-[#1a1a1a]'
              }`}>
                {stock.currency === 'BRL' ? 'R$ ' : '$ '}{stock.price.toFixed(2)}
              </div>

              <div className={`px-3 py-1 font-mono font-bold text-xs rounded-full text-white tabular-nums ${
                isPositive ? 'bg-emerald-600' : 'bg-rose-600'
              }`}>
                {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </div>

              {/* Annualized Dividend Yield Hero Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded-sm">
                <span className="label-mono text-emerald-950 font-bold">DY Anual:</span>
                <span className="font-mono text-xs font-bold text-emerald-800">
                  {stock.dividendYield.toFixed(1)}% a.a.
                </span>
                <span className="text-[10px] text-emerald-700 font-mono hidden sm:inline">
                  (~R$ {(stock.price * stock.dividendYield / 100).toFixed(2)}/ação)
                </span>
              </div>

              <div className="label-mono">
                Variação: {isPositive ? '+' : ''}R$ {stock.change.toFixed(2)} · Fech. Ant: R$ {stock.previousClose.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenOrderModal(stock, 'BUY')}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-[#f8f7f4] font-mono text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              Comprar {stock.ticker}
            </button>
            <button
              onClick={() => onOpenOrderModal(stock, 'SELL')}
              className="px-4 py-2 bg-transparent hover:bg-white text-[#1a1a1a] border border-[#1a1a1a] font-mono text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              Vender
            </button>
            <button
              onClick={() => onOpenTechnicalReport(stock)}
              title="Relatório de Análise Técnica"
              className="p-2 bg-transparent hover:bg-white text-[#1a1a1a] border border-[#dcdad5] rounded-sm transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenAlertModal(stock.ticker, stock.price)}
              title="Configurar Alerta"
              className="p-2 bg-transparent hover:bg-white text-[#1a1a1a] border border-[#dcdad5] rounded-sm transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Visual Frame (Variation 6: clean white box with 1px solid ink border) */}
      <div className="border border-[#1a1a1a] bg-white p-4 sm:p-6 relative shadow-sm">
        
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#dcdad5] pb-3">
          
          {/* Timeframe Controls */}
          <div className="flex items-center gap-1">
            {['1D', '5D', '1M', '6M', '1Y'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-mono font-bold transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#1a1a1a] text-white'
                    : 'text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:bg-[#f8f7f4]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Mode */}
          <div className="flex items-center gap-1 border border-[#dcdad5] p-0.5 rounded-xs">
            <button
              onClick={() => setChartType('candles')}
              className={`p-1 text-xs cursor-pointer ${chartType === 'candles' ? 'bg-[#1a1a1a] text-white' : 'text-[#1a1a1a]/60'}`}
              title="Candlestick"
            >
              <CandlestickChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1 text-xs cursor-pointer ${chartType === 'line' ? 'bg-[#1a1a1a] text-white' : 'text-[#1a1a1a]/60'}`}
              title="Linha"
            >
              <LineChartIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicator Switches */}
          <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
            <button
              onClick={() => setShowEMA9(!showEMA9)}
              className={`px-2 py-0.5 border cursor-pointer ${showEMA9 ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'text-[#1a1a1a]/60 border-[#dcdad5]'}`}
            >
              EMA 9
            </button>
            <button
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-2 py-0.5 border cursor-pointer ${showSMA20 ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'text-[#1a1a1a]/60 border-[#dcdad5]'}`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowBollinger(!showBollinger)}
              className={`px-2 py-0.5 border cursor-pointer ${showBollinger ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'text-[#1a1a1a]/60 border-[#dcdad5]'}`}
            >
              Bollinger
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-0.5 border cursor-pointer ${showVolume ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'text-[#1a1a1a]/60 border-[#dcdad5]'}`}
            >
              Volume
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-0.5 border cursor-pointer ${showRSI ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'text-[#1a1a1a]/60 border-[#dcdad5]'}`}
            >
              IFR (14)
            </button>
          </div>

          <div className="label-mono">
            TEMPO REAL / {timeframe}
          </div>
        </div>

        {/* OHLC Bar */}
        {displayCandle && (
          <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-[#1a1a1a]/70 mb-3 overflow-x-auto pb-1">
            <span className="font-bold text-[#1a1a1a]">{displayCandle.dateStr}</span>
            <span>A: <strong className="text-[#1a1a1a]">R$ {displayCandle.open.toFixed(2)}</strong></span>
            <span>MÁX: <strong className="text-emerald-700">R$ {displayCandle.high.toFixed(2)}</strong></span>
            <span>MÍN: <strong className="text-rose-700">R$ {displayCandle.low.toFixed(2)}</strong></span>
            <span>F: <strong className={displayCandle.close >= displayCandle.open ? 'text-emerald-700' : 'text-rose-700'}>R$ {displayCandle.close.toFixed(2)}</strong></span>
            <span>VOL: <strong className="text-[#1a1a1a]">{(displayCandle.volume / 1000).toFixed(0)}k</strong></span>
            {displayCandle.rsi !== undefined && (
              <span>IFR: <strong>{displayCandle.rsi}</strong></span>
            )}
          </div>
        )}

        {/* SVG Canvas */}
        <div ref={containerRef} className="relative overflow-x-auto select-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`}
            className="w-full h-auto min-w-[650px] cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const price = minPrice + (maxPrice - minPrice) * (1 - pct);
              const y = 20 + (mainChartHeight - 35) * pct;
              return (
                <g key={i}>
                  <line
                    x1={30}
                    y1={y}
                    x2={svgWidth - 75}
                    y2={y}
                    stroke="#eae8e2"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                  <text
                    x={svgWidth - 70}
                    y={y + 4}
                    fill="#888"
                    fontSize="10"
                    fontFamily="Space Mono"
                  >
                    R$ {price.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Bollinger Bands */}
            {showBollinger && bollingerUpperPath && (
              <path d={bollingerUpperPath} fill="none" stroke="#777" strokeWidth="1" strokeDasharray="3 3" />
            )}
            {showBollinger && bollingerLowerPath && (
              <path d={bollingerLowerPath} fill="none" stroke="#777" strokeWidth="1" strokeDasharray="3 3" />
            )}

            {/* Moving Averages */}
            {showEMA9 && ema9Path && (
              <path d={ema9Path} fill="none" stroke="#d97706" strokeWidth="1.5" />
            )}
            {showSMA20 && sma20Path && (
              <path d={sma20Path} fill="none" stroke="#0284c7" strokeWidth="1.5" />
            )}

            {/* Main Chart */}
            {chartType === 'line' ? (
              <path d={linePath} fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
            ) : (
              candles.map((candle, i) => {
                const x = getX(i);
                const isUp = candle.close >= candle.open;
                const yHigh = getY(candle.high);
                const yLow = getY(candle.low);
                const yOpen = getY(candle.open);
                const yClose = getY(candle.close);
                const bodyTop = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
                const color = isUp ? '#10b981' : '#f43f5e';

                return (
                  <g key={i}>
                    <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.2" />
                    <rect
                      x={x - candleWidth / 2}
                      y={bodyTop}
                      width={candleWidth}
                      height={bodyHeight}
                      fill={color}
                    />
                  </g>
                );
              })
            )}

            {/* Volume */}
            {showVolume && (
              <g transform={`translate(0, ${mainChartHeight + 5})`}>
                <line x1={30} y1={0} x2={svgWidth - 75} y2={0} stroke="#dcdad5" strokeWidth="1" />
                <text x={35} y={14} fill="#888" fontSize="9" fontFamily="Space Mono">
                  VOLUME FINANCEIRO
                </text>
                {candles.map((candle, i) => {
                  const x = getX(i);
                  const height = (candle.volume / maxVolume) * (volumeHeight - 20);
                  const isUp = candle.close >= candle.open;
                  return (
                    <rect
                      key={i}
                      x={x - candleWidth / 2}
                      y={volumeHeight - height}
                      width={candleWidth}
                      height={Math.max(1, height)}
                      fill={isUp ? '#10b981' : '#f43f5e'}
                      opacity="0.6"
                    />
                  );
                })}
              </g>
            )}

            {/* RSI */}
            {showRSI && (
              <g transform={`translate(0, ${mainChartHeight + volumeHeight + 15})`}>
                <line x1={30} y1={0} x2={svgWidth - 75} y2={0} stroke="#dcdad5" strokeWidth="1" />
                <line x1={30} y1={rsiHeight * 0.3} x2={svgWidth - 75} y2={rsiHeight * 0.3} stroke="#f43f5e" strokeDasharray="2 2" strokeWidth="1" opacity="0.4" />
                <text x={svgWidth - 70} y={rsiHeight * 0.3 + 3} fill="#f43f5e" fontSize="9" fontFamily="Space Mono">70</text>
                <line x1={30} y1={rsiHeight * 0.7} x2={svgWidth - 75} y2={rsiHeight * 0.7} stroke="#10b981" strokeDasharray="2 2" strokeWidth="1" opacity="0.4" />
                <text x={svgWidth - 70} y={rsiHeight * 0.7 + 3} fill="#10b981" fontSize="9" fontFamily="Space Mono">30</text>
                <text x={35} y={14} fill="#555" fontSize="9" fontFamily="Space Mono">IFR / RSI (14)</text>

                {(() => {
                  const rsiPoints = candles.map((c, i) => ({ val: c.rsi, i })).filter(d => d.val !== undefined);
                  if (rsiPoints.length < 2) return null;
                  const pathStr = rsiPoints.map((d, idx) => {
                    const x = getX(d.i);
                    const y = rsiHeight * (1 - d.val! / 100);
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ');
                  return <path d={pathStr} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />;
                })()}
              </g>
            )}

            {/* Crosshair */}
            {mousePos && (
              <g pointerEvents="none">
                <line x1={mousePos.x} y1={10} x2={mousePos.x} y2={totalSvgHeight - 10} stroke="#1a1a1a" strokeWidth="1" strokeDasharray="2 2" />
                {mousePos.y <= mainChartHeight && (
                  <>
                    <line x1={30} y1={mousePos.y} x2={svgWidth - 75} y2={mousePos.y} stroke="#1a1a1a" strokeWidth="1" strokeDasharray="2 2" />
                    {(() => {
                      const usableHeight = mainChartHeight - 35;
                      const ratio = 1 - (mousePos.y - 20) / usableHeight;
                      const crossPrice = minPrice + ratio * priceRange;
                      return (
                        <g transform={`translate(${svgWidth - 75}, ${mousePos.y - 9})`}>
                          <rect width="65" height="18" fill="#1a1a1a" />
                          <text x="6" y="13" fill="#ffffff" fontSize="10" fontFamily="Space Mono">
                            R$ {crossPrice.toFixed(2)}
                          </text>
                        </g>
                      );
                    })()}
                  </>
                )}
              </g>
            )}

          </svg>
        </div>
      </div>

      {/* Info Grid (Variation 6: clean 4-column block) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
        <div className="border-t border-[#1a1a1a] pt-3">
          <div className="label-mono mb-1">Volume B3</div>
          <div className="font-mono text-lg font-bold text-[#1a1a1a] tabular-nums">
            R$ {(stock.volume / 1000000).toFixed(1)}M
          </div>
          <div className="text-[10px] font-mono text-[#1a1a1a]/50">Liquidez diária</div>
        </div>

        <div className="border-t-2 border-emerald-600 pt-3 bg-emerald-50/30 px-3 -mx-3 border-b border-emerald-200">
          <div className="flex items-center justify-between mb-1">
            <span className="label-mono text-emerald-950 font-bold">Dividend Yield (12M)</span>
            <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-xs">
              {stock.dividendYield >= 6.0 ? 'Top Yield' : 'Anualizado'}
            </span>
          </div>
          <div className="font-mono text-xl font-bold text-emerald-800 tabular-nums">
            {stock.dividendYield.toFixed(1)}% a.a.
          </div>
          <div className="text-[10px] font-mono text-emerald-900/80 font-semibold">
            ~R$ {(stock.price * stock.dividendYield / 100).toFixed(2)} por ação
          </div>
        </div>

        <div className="border-t border-[#1a1a1a] pt-3">
          <div className="label-mono mb-1">Preço Médio (VWAP)</div>
          <div className="font-mono text-lg font-bold text-[#1a1a1a] tabular-nums">
            R$ {stock.vwap.toFixed(2)}
          </div>
          <div className="text-[10px] font-mono text-[#1a1a1a]/50">Ponderado por volume</div>
        </div>

        <div className="border-t border-[#1a1a1a] pt-3">
          <div className="label-mono mb-1">Múltiplo P/L &amp; P/VP</div>
          <div className="font-mono text-lg font-bold text-[#1a1a1a] tabular-nums">
            {stock.peRatio.toFixed(1)}x <span className="text-xs text-[#1a1a1a]/60">({stock.pvp.toFixed(1)} P/VP)</span>
          </div>
          <div className="text-[10px] font-mono text-[#1a1a1a]/50">ROE: {stock.roe.toFixed(1)}%</div>
        </div>
      </div>

      {/* Dedicated Dividend Intelligence Panel for Dividend-Focused Investors */}
      <div className="bg-white border border-[#1a1a1a] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dcdad5] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <h4 className="font-serif italic font-bold text-lg text-[#1a1a1a]">
              Painel de Renda Passiva &amp; Dividend Yield — {stock.ticker}
            </h4>
          </div>
          <span className="label-mono text-emerald-900 font-bold">
            {stock.dividendYield >= 11.25 ? 'Supera a Taxa Selic (11,25%)' : 'Rendimento Anualizado de Proventos'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-[#f8f7f4] p-3 border border-[#dcdad5]">
            <span className="label-mono block text-[#1a1a1a]/60 mb-1">DY Anualizado (12M)</span>
            <span className="text-xl font-bold text-emerald-800 tabular-nums block">
              {stock.dividendYield.toFixed(2)}%
            </span>
            <span className="text-[10px] text-[#1a1a1a]/60 mt-1 block">Rendimento acumulado em 1 ano</span>
          </div>

          <div className="bg-[#f8f7f4] p-3 border border-[#dcdad5]">
            <span className="label-mono block text-[#1a1a1a]/60 mb-1">Provento Est. / Ação</span>
            <span className="text-xl font-bold text-[#1a1a1a] tabular-nums block">
              R$ {(stock.price * stock.dividendYield / 100).toFixed(2)}
            </span>
            <span className="text-[10px] text-[#1a1a1a]/60 mt-1 block">Dividendos + JCP pagos por papel</span>
          </div>

          <div className="bg-[#f8f7f4] p-3 border border-[#dcdad5]">
            <span className="label-mono block text-[#1a1a1a]/60 mb-1">Renda Est. / Lote Padrão</span>
            <span className="text-xl font-bold text-emerald-800 tabular-nums block">
              R$ {(stock.price * stock.dividendYield).toFixed(2)}
            </span>
            <span className="text-[10px] text-[#1a1a1a]/60 mt-1 block">Fluxo estimado p/ lote de 100 ações</span>
          </div>

          <div className="bg-[#f8f7f4] p-3 border border-[#dcdad5]">
            <span className="label-mono block text-[#1a1a1a]/60 mb-1">Comparativo vs Taxa Selic</span>
            <span className="text-xl font-bold text-[#1a1a1a] tabular-nums block">
              {((stock.dividendYield / 11.25) * 100).toFixed(0)}% da Selic
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
              {stock.dividendYield >= 11.25 ? 'Alpha positivo sobre juros reais' : 'Benchmark Selic Meta 11,25%'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
