import { 
  StockQuote, 
  IPOItem, 
  BrokerageIntegration, 
  NewsArticle, 
  SimulatedPortfolio, 
  PriceAlert, 
  AppNotification,
  Candle,
  TechnicalReport,
  TechnicalBias
} from '../types/market';

export const INITIAL_STOCKS: StockQuote[] = [
  {
    ticker: 'PETR4',
    name: 'Petróleo Brasileiro S.A. - Petrobras',
    sector: 'Petróleo, Gás e Biocombustíveis',
    exchange: 'B3',
    type: 'AÇÃO',
    price: 38.45,
    previousClose: 37.80,
    change: 0.65,
    changePercent: 1.72,
    high24h: 38.90,
    low24h: 37.65,
    volume: 1845200000,
    vwap: 38.32,
    marketCap: 498500, // R$ Milhões
    peRatio: 4.85,
    pvp: 1.28,
    dividendYield: 14.8,
    roe: 26.4,
    netMargin: 23.8,
    netDebtEbitda: 0.85,
    beta: 1.18,
    currency: 'BRL',
    sparkline: [37.2, 37.5, 37.4, 37.8, 38.1, 37.9, 38.45],
    lastUpdated: '16:54:12'
  },
  {
    ticker: 'VALE3',
    name: 'Vale S.A.',
    sector: 'Mineração e Metais',
    exchange: 'B3',
    type: 'AÇÃO',
    price: 61.20,
    previousClose: 62.10,
    change: -0.90,
    changePercent: -1.45,
    high24h: 62.45,
    low24h: 60.80,
    volume: 1420500000,
    vwap: 61.40,
    marketCap: 275000,
    peRatio: 6.20,
    pvp: 1.42,
    dividendYield: 9.2,
    roe: 22.8,
    netMargin: 21.5,
    netDebtEbitda: 0.42,
    beta: 0.95,
    currency: 'BRL',
    sparkline: [63.1, 62.8, 62.1, 61.9, 62.3, 61.6, 61.20],
    lastUpdated: '16:54:08'
  },
  {
    ticker: 'ITUB4',
    name: 'Itaú Unibanco Holding S.A.',
    sector: 'Serviços Financeiros / Bancos',
    exchange: 'B3',
    type: 'AÇÃO',
    price: 36.80,
    previousClose: 36.25,
    change: 0.55,
    changePercent: 1.52,
    high24h: 37.05,
    low24h: 36.15,
    volume: 890400000,
    vwap: 36.65,
    marketCap: 361200,
    peRatio: 9.15,
    pvp: 1.84,
    dividendYield: 7.4,
    roe: 21.2,
    netMargin: 19.4,
    netDebtEbitda: 0.0,
    beta: 0.72,
    currency: 'BRL',
    sparkline: [35.9, 36.1, 36.3, 36.0, 36.25, 36.5, 36.80],
    lastUpdated: '16:54:19'
  },
  {
    ticker: 'WEGE3',
    name: 'WEG S.A.',
    sector: 'Bens Industriais / Motores e Energia',
    exchange: 'B3',
    type: 'AÇÃO',
    price: 54.30,
    previousClose: 53.40,
    change: 0.90,
    changePercent: 1.69,
    high24h: 54.80,
    low24h: 53.20,
    volume: 480100000,
    vwap: 54.10,
    marketCap: 228000,
    peRatio: 34.2,
    pvp: 9.8,
    dividendYield: 2.1,
    roe: 31.5,
    netMargin: 16.8,
    netDebtEbitda: -0.15,
    beta: 0.88,
    currency: 'BRL',
    sparkline: [52.8, 53.1, 53.4, 53.7, 53.4, 53.9, 54.30],
    lastUpdated: '16:54:15'
  },
  {
    ticker: 'BBAS3',
    name: 'Banco do Brasil S.A.',
    sector: 'Serviços Financeiros / Bancos',
    exchange: 'B3',
    type: 'AÇÃO',
    price: 29.40,
    previousClose: 29.10,
    change: 0.30,
    changePercent: 1.03,
    high24h: 29.65,
    low24h: 28.95,
    volume: 530200000,
    vwap: 29.35,
    marketCap: 168400,
    peRatio: 4.45,
    pvp: 0.89,
    dividendYield: 10.4,
    roe: 21.8,
    netMargin: 20.1,
    netDebtEbitda: 0.0,
    beta: 0.82,
    currency: 'BRL',
    sparkline: [28.6, 28.9, 29.1, 29.0, 29.1, 29.25, 29.40],
    lastUpdated: '16:53:55'
  },
  {
    ticker: 'RENT3',
    name: 'Localiza Rent a Car S.A.',
    sector: 'Consumo / Aluguel de Carros',
    exchange: 'B3',
    type: 'AÇÃO',
    price: 43.15,
    previousClose: 44.50,
    change: -1.35,
    changePercent: -3.03,
    high24h: 44.80,
    low24h: 42.90,
    volume: 380400000,
    vwap: 43.40,
    marketCap: 45800,
    peRatio: 14.6,
    pvp: 1.65,
    dividendYield: 3.5,
    roe: 11.4,
    netMargin: 8.2,
    netDebtEbitda: 2.85,
    beta: 1.34,
    currency: 'BRL',
    sparkline: [45.8, 45.2, 44.9, 44.5, 43.8, 43.4, 43.15],
    lastUpdated: '16:54:10'
  },
  {
    ticker: 'PRIO3',
    name: 'PRIO S.A. (PetroRio)',
    sector: 'Petróleo & Gás / Exploração Independente',
    exchange: 'B3',
    type: 'AÇÃO',
    price: 45.60,
    previousClose: 44.70,
    change: 0.90,
    changePercent: 2.01,
    high24h: 46.10,
    low24h: 44.50,
    volume: 410000000,
    vwap: 45.40,
    marketCap: 40300,
    peRatio: 6.9,
    pvp: 2.1,
    dividendYield: 0.0,
    roe: 32.4,
    netMargin: 44.2,
    netDebtEbitda: 0.65,
    beta: 1.25,
    currency: 'BRL',
    sparkline: [43.9, 44.2, 44.5, 44.7, 45.1, 45.3, 45.60],
    lastUpdated: '16:54:02'
  },
  {
    ticker: 'B3SA3',
    name: 'B3 S.A. - Brasil, Bolsa, Balcão',
    sector: 'Serviços Financeiros / Infraestrutura de Mercado',
    exchange: 'B3',
    type: 'AÇÃO',
    price: 11.85,
    previousClose: 11.70,
    change: 0.15,
    changePercent: 1.28,
    high24h: 12.00,
    low24h: 11.65,
    volume: 320500000,
    vwap: 11.82,
    marketCap: 64900,
    peRatio: 14.1,
    pvp: 3.1,
    dividendYield: 6.2,
    roe: 22.0,
    netMargin: 46.8,
    netDebtEbitda: 1.1,
    beta: 1.05,
    currency: 'BRL',
    sparkline: [11.5, 11.6, 11.7, 11.65, 11.7, 11.8, 11.85],
    lastUpdated: '16:53:48'
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Tecnologia / Semicondutores e IA',
    exchange: 'NASDAQ',
    type: 'AÇÃO',
    price: 138.50,
    previousClose: 135.20,
    change: 3.30,
    changePercent: 2.44,
    high24h: 140.20,
    low24h: 134.80,
    volume: 3240000000,
    vwap: 138.10,
    marketCap: 3380000, // $ Milhões
    peRatio: 48.5,
    pvp: 38.2,
    dividendYield: 0.08,
    roe: 72.5,
    netMargin: 55.4,
    netDebtEbitda: -0.2,
    beta: 1.68,
    currency: 'USD',
    sparkline: [132.5, 134.1, 135.2, 136.0, 137.2, 138.5],
    lastUpdated: '16:54:22'
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Tecnologia / Hardware & Software',
    exchange: 'NASDAQ',
    type: 'AÇÃO',
    price: 232.40,
    previousClose: 230.80,
    change: 1.60,
    changePercent: 0.69,
    high24h: 233.50,
    low24h: 230.10,
    volume: 1850000000,
    vwap: 232.05,
    marketCap: 3520000,
    peRatio: 33.8,
    pvp: 45.1,
    dividendYield: 0.45,
    roe: 145.0,
    netMargin: 24.1,
    netDebtEbitda: 0.5,
    beta: 0.92,
    currency: 'USD',
    sparkline: [228.4, 229.5, 230.8, 231.2, 231.8, 232.4],
    lastUpdated: '16:54:18'
  },
  {
    ticker: 'NU',
    name: 'Nu Holdings Ltd. (Nubank)',
    sector: 'Tecnologia / Fintech Bancária',
    exchange: 'NYSE',
    type: 'AÇÃO',
    price: 15.40,
    previousClose: 14.95,
    change: 0.45,
    changePercent: 3.01,
    high24h: 15.65,
    low24h: 14.85,
    volume: 490000000,
    vwap: 15.35,
    marketCap: 73500,
    peRatio: 26.5,
    pvp: 8.4,
    dividendYield: 0.0,
    roe: 30.1,
    netMargin: 23.5,
    netDebtEbitda: 0.0,
    beta: 1.45,
    currency: 'USD',
    sparkline: [14.2, 14.5, 14.95, 15.1, 15.25, 15.4],
    lastUpdated: '16:54:25'
  }
];

export const INITIAL_IPOS: IPOItem[] = [
  {
    id: 'ipo-moove',
    ticker: 'MOOV',
    companyName: 'Moove Lubricants S.A. (Cosan Group)',
    sector: 'Petroquímica & Lubrificantes Industriais',
    exchange: 'B3',
    status: 'RESERVA_ABERTA',
    statusLabel: 'Reserva Aberta aos Investidores',
    priceRangeMin: 14.50,
    priceRangeMax: 17.50,
    reservationStart: '2026-10-20',
    reservationEnd: '2026-11-04',
    listingDate: '2026-11-08',
    lockupPeriodDays: 180,
    offeringSizeBRL: 2350, // R$ 2,35 bilhões
    leadCoordinator: 'Itaú BBA',
    coordinators: ['BTG Pactual', 'JPMorgan', 'Bank of America', 'Bradesco BBI'],
    allocationMinBRL: 1000,
    allocationMaxBRL: 1000000,
    prospectusSummary: 'A Moove é uma das maiores produtoras e distribuidoras de lubrificantes e óleos industriais da América Latina, Estados Unidos e Europa, operando com exclusividade na distribuição da marca Mobil.',
    useOfProceeds: [
      { purpose: 'Expansão industrial e fábricas na América do Norte', percentage: 45 },
      { purpose: 'Aquisições estratégicas (M&A) no mercado europeu', percentage: 30 },
      { purpose: 'Otimização da estrutura de capital e desalavancagem', percentage: 25 }
    ],
    investmentHighlights: [
      'Margem EBITDA resiliente de 13,8% com receita dolarizada em mais de 65%',
      'Parceria global de longo prazo com a ExxonMobil para distribuição de marcas premium',
      'Track record comprovado de consolidação de mercado e M&A integrados com sucesso',
      'Governança corporativa do Grupo Cosan com padrão internacional de listagem'
    ],
    keyRisks: [
      'Sensibilidade aos preços internacionais de óleo básico e variações cambiais',
      'Risco de concentração na parceria de fornecimento com a marca Mobil',
      'Desafios de integração de ativos fabris nos Estados Unidos'
    ]
  },
  {
    id: 'ipo-picpay',
    ticker: 'PICP',
    companyName: 'PicPay Instituição de Pagamento S.A.',
    sector: 'Serviços Financeiros & SuperApp',
    exchange: 'B3',
    status: 'RESERVA_ABERTA',
    statusLabel: 'Reserva Aberta aos Investidores',
    priceRangeMin: 21.00,
    priceRangeMax: 26.00,
    reservationStart: '2026-10-22',
    reservationEnd: '2026-11-06',
    listingDate: '2026-11-12',
    lockupPeriodDays: 180,
    offeringSizeBRL: 3800,
    leadCoordinator: 'BTG Pactual',
    coordinators: ['Morgan Stanley', 'Santander', 'UBS BB', 'Citi'],
    allocationMinBRL: 1500,
    allocationMaxBRL: 2500000,
    prospectusSummary: 'Ecossistema completo com mais de 38 milhões de clientes ativos no Brasil, abrangendo carteira digital, cartões de crédito, marketplace de serviços financeiros, crédito consignado e soluções para empresas.',
    useOfProceeds: [
      { purpose: 'Expansão da carteira de crédito colateralizado e consignado', percentage: 50 },
      { purpose: 'Investimentos em infraestrutura de Inteligência Artificial e prevenção a fraudes', percentage: 30 },
      { purpose: 'Marketing e expansão da base corporativa (PicPay Empresas)', percentage: 20 }
    ],
    investmentHighlights: [
      'Transição comprovada para rentabilidade líquida positiva nos últimos 6 trimestres',
      'Custo de aquisição de cliente (CAC) 40% menor que bancos tradicionais',
      'Engajamento recorde em produtos de seguros, investimentos e open finance',
      'Capacidade de alavancar o ecossistema J&F com sólidas garantias'
    ],
    keyRisks: [
      'Inadimplência no segmento de pessoas físicas em ambiente de juros elevados',
      'Competição acirrada de fintechs como Nubank, Mercado Pago e Inter',
      'Pressão regulatória do Banco Central sobre tarifas de interchange'
    ]
  },
  {
    id: 'ipo-aegea',
    ticker: 'AEGE3',
    companyName: 'Aegea Saneamento e Participações S.A.',
    sector: 'Utilidade Pública / Saneamento Básico',
    exchange: 'B3',
    status: 'EM_ANALISE',
    statusLabel: 'Em Análise na CVM',
    priceRangeMin: 28.00,
    priceRangeMax: 33.00,
    reservationStart: '2026-11-10',
    reservationEnd: '2026-11-25',
    listingDate: '2026-12-02',
    lockupPeriodDays: 180,
    offeringSizeBRL: 4500,
    leadCoordinator: 'Itaú BBA',
    coordinators: ['Bradesco BBI', 'BTG Pactual', 'Santander'],
    allocationMinBRL: 2000,
    allocationMaxBRL: 5000000,
    prospectusSummary: 'Líder privada no saneamento básico do Brasil, atendendo mais de 31 milhões de pessoas em centenas de municípios, impulsionada pelo Marco Legal do Saneamento.',
    useOfProceeds: [
      { purpose: 'Capex contratado de universalização de água e esgoto', percentage: 60 },
      { purpose: 'Participação em novos leilões estaduais e municipais de concessão', percentage: 25 },
      { purpose: 'Refinanciamento de dívidas e redução do custo médio de captação', percentage: 15 }
    ],
    investmentHighlights: [
      'Contratos regulados de longo prazo (25 a 35 anos) indexados à inflação (IPCA)',
      'Geração de caixa previsível e defensiva frente à volatilidade macroeconômica',
      'Acionistas de referência globais: GIC (fundo soberano de Cingapura) e Itaúsa'
    ],
    keyRisks: [
      'Risco regulatório de agências estaduais em reajustes tarifários periódicos',
      'Elevada necessidade contínua de capital (Capex intensivo)'
    ]
  },
  {
    id: 'ipo-hospitalcare',
    ticker: 'HCIN3',
    companyName: 'Hospital Care Inteligência em Saúde S.A.',
    sector: 'Saúde / Hospitais & Centros Médicos',
    exchange: 'B3',
    status: 'PRECIFICADO',
    statusLabel: 'Precificado - Aguardando Estreia',
    priceRangeMin: 18.00,
    priceRangeMax: 22.00,
    finalPrice: 20.50,
    reservationStart: '2026-10-05',
    reservationEnd: '2026-10-18',
    listingDate: '2026-10-29',
    lockupPeriodDays: 180,
    offeringSizeBRL: 1200,
    leadCoordinator: 'XP Investimentos',
    coordinators: ['BTG Pactual', 'Credit Suisse'],
    allocationMinBRL: 1000,
    allocationMaxBRL: 800000,
    prospectusSummary: 'Holding hospitalar focada em criar centros de excelência médica integrados em polos regionais do interior de São Paulo, Paraná e Santa Catarina.',
    useOfProceeds: [
      { purpose: 'Expansão da capacidade de leitos e tecnologia cirúrgica robótica', percentage: 55 },
      { purpose: 'Aquisição de clínicas de diagnóstico especializadas', percentage: 30 },
      { purpose: 'Reforço de capital de giro', percentage: 15 }
    ],
    investmentHighlights: [
      'Modelo hub-and-spoke com redução de custos operacionais por paciente',
      'Ticket médio cirúrgico crescente com foco em alta complexidade',
      'Forte demanda reprimida em grandes polos do interior do Brasil'
    ],
    keyRisks: [
      'Prazos de glosa e sinistralidade das grandes operadoras de planos de saúde',
      'Escassez de médicos especialistas e pressão sobre custos com pessoal'
    ]
  },
  {
    id: 'ipo-ctg-brasil',
    ticker: 'CTGP3',
    companyName: 'CTG Brasil Energia S.A.',
    sector: 'Utilidade Pública / Energia Renovável',
    exchange: 'B3',
    status: 'EM_ANALISE',
    statusLabel: 'Em Análise na CVM',
    priceRangeMin: 32.00,
    priceRangeMax: 37.00,
    reservationStart: '2026-11-15',
    reservationEnd: '2026-11-30',
    listingDate: '2026-12-08',
    lockupPeriodDays: 180,
    offeringSizeBRL: 5000,
    leadCoordinator: 'Morgan Stanley',
    coordinators: ['Itaú BBA', 'Bradesco BBI', 'BTG Pactual'],
    allocationMinBRL: 3000,
    allocationMaxBRL: 10000000,
    prospectusSummary: 'Uma das maiores geradoras de energia limpa do Brasil, subsidiária da China Three Gorges Corporation, com vasta carteira hidrelétrica e eólica.',
    useOfProceeds: [
      { purpose: 'Desenvolvimento de novos complexos solares e eólicos', percentage: 65 },
      { purpose: 'Modernização de turbinas em usinas hidrelétricas existentes', percentage: 20 },
      { purpose: 'Distribuição extraordinária de dividendos aos novos acionistas', percentage: 15 }
    ],
    investmentHighlights: [
      '100% da matriz energética composta por fontes limpas e renováveis',
      'Receitas contratadas no Ambiente de Contratação Regulada (ACR) e Mercado Livre',
      'Políticas de dividend payout agressivo superior a 75% do lucro líquido'
    ],
    keyRisks: [
      'Risco hidrológico (GSF) e flutuações no Preço de Liquidação das Diferenças (PLD)',
      'Desafios geopolíticos nas relações bilaterais e regulação do setor elétrico'
    ]
  }
];

export const INITIAL_BROKERS: BrokerageIntegration[] = [
  {
    id: 'broker-xp',
    name: 'XP Investimentos',
    code: '102',
    status: 'CONNECTED',
    accountNumber: '782914-1',
    balanceAvailableBRL: 84520.50,
    brokerFee: 0.00, // Zero fee
    lastSync: 'Há 1 minuto',
    supportedFeatures: ['Ações B3', 'Opções', 'IPOs e Ofertas', 'Stop Loss Automático', 'Alavancagem Intraday']
  },
  {
    id: 'broker-btg',
    name: 'BTG Pactual',
    code: '085',
    status: 'DISCONNECTED',
    accountNumber: '449102-8',
    balanceAvailableBRL: 125000.00,
    brokerFee: 0.00,
    lastSync: 'Ontem às 18:30',
    supportedFeatures: ['Ações B3', 'IPOs Institucionais', 'Mercado Global / Dólar', 'Renda Fixa & Derivativos']
  },
  {
    id: 'broker-nuinvest',
    name: 'NuInvest (Nubank)',
    code: '260',
    status: 'DISCONNECTED',
    accountNumber: '992143-0',
    balanceAvailableBRL: 32400.00,
    brokerFee: 0.00,
    lastSync: 'Não conectado',
    supportedFeatures: ['Ações Fracionárias', 'BDRs', 'Fundos Imobiliários', 'Simplicidade Mobile']
  },
  {
    id: 'broker-clear',
    name: 'Clear Corretora',
    code: '003',
    status: 'DISCONNECTED',
    accountNumber: '112098-5',
    balanceAvailableBRL: 45000.00,
    brokerFee: 0.00,
    lastSync: 'Não conectado',
    supportedFeatures: ['Day Trade Especializado', 'Zero Corretagem', 'MetaTrader 5', 'Gráficos Pro']
  },
  {
    id: 'broker-interactive',
    name: 'Interactive Brokers (Global)',
    code: 'IBKR',
    status: 'DISCONNECTED',
    accountNumber: 'U8823194',
    balanceAvailableBRL: 98000.00,
    brokerFee: 1.00,
    lastSync: 'Não conectado',
    supportedFeatures: ['Ações NYSE & Nasdaq', 'Mais de 150 Bolsas Globais', 'Câmbio Spot Instantâneo']
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Moove e PicPay abrem período de reserva para IPOs bilionários na B3 e mercado global',
    summary: 'Investidores pessoa física já podem solicitar alocações mínimas a partir de R$ 1.000 através das corretoras integradas. Ofertas devem movimentar mais de R$ 6 bilhões combinadas.',
    fullContent: 'O mercado de capitais brasileiro vive momento de forte retomada com o início do período de reserva das ofertas públicas iniciais (IPOs) da Moove Lubrificantes e da carteira digital PicPay. Analistas destacam a resiliência operacional da Moove, que possui mais de 65% de suas receitas vinculadas ao mercado internacional, enquanto o PicPay consolida sua virada de rentabilidade com margens líquidas crescentes.',
    source: 'B3 News Wire & Valor Econômico',
    publishedAt: 'Há 12 minutos',
    category: 'IPOS',
    sentiment: 'BULLISH',
    relatedTickers: ['MOOV', 'PICP', 'B3SA3'],
    readTime: '3 min',
    author: 'Mariana Duarte, Analista de Mercado de Capitais'
  },
  {
    id: 'news-2',
    title: 'Copom sinaliza estabilidade na taxa Selic e impulsiona papéis cíclicos na Bolsa',
    summary: 'Ata do Banco Central reforça cautela com expectativas de inflação, mas descarta nova aceleração no ritmo de juros. Setor de varejo e construção reagem com alta.',
    fullContent: 'Na última reunião do Comitê de Política Monetária (Copom), a autoridade monetária enfatizou a necessidade de manter a taxa de juros em patamar restritivo pelo tempo necessário para ancorar as expectativas de longo prazo. Com isso, os ativos de renda variável encontraram suporte técnico importante, reduzindo a volatilidade dos contratos de juros futuros (DIs).',
    source: 'Bloomberg Línea Brasil',
    publishedAt: 'Há 35 minutos',
    category: 'MACRO & JUROS',
    sentiment: 'NEUTRAL',
    relatedTickers: ['ITUB4', 'BBAS3', 'RENT3'],
    readTime: '4 min',
    author: 'Lucas Fontoura, Macroeconomista'
  },
  {
    id: 'news-3',
    title: 'Petrobras (PETR4) rompe resistência técnica com alta do petróleo Brent e dividendos no radar',
    summary: 'Ações preferenciais da petroleira superam média móvel de 200 períodos com volume financeiro acima da média diária. Dividend yield projetado para 2026 segue atrativo acima de 13%.',
    fullContent: 'Os papéis da Petrobras (PETR4) operam em forte alta no pregão de hoje, acompanhando a valorização da commodity nos mercados de Londres e Nova York. A companhia reafirmou sua diretriz de investimentos sem comprometer a política de remuneração aos acionistas com foco no fluxo de caixa livre.',
    source: 'InfoMoney & Broadcast',
    publishedAt: 'Há 52 minutos',
    category: 'AÇÕES B3',
    sentiment: 'BULLISH',
    relatedTickers: ['PETR4', 'PRIO3'],
    readTime: '2 min',
    author: 'Rafael Mendes, CNPI'
  },
  {
    id: 'news-4',
    title: 'Nvidia e Big Techs impulsionam índices de Nova York com novos chips de IA',
    summary: 'Demanda de data centers corporativos continua batendo recordes de encomendas para os próximos trimestres, mantendo o setor em ciclo de crescimento exponencial.',
    fullContent: 'As ações da fabricante de semicondutores NVIDIA avançam mais de 2% nesta sessão em Wall Street após a apresentação de novos benchmarks de eficiência energética e poder computacional para treinamento de modelos de linguagem de larga escala.',
    source: 'Financial Times / Wall Street Journal',
    publishedAt: 'Há 1 hora',
    category: 'GLOBAL & WALL ST',
    sentiment: 'BULLISH',
    relatedTickers: ['NVDA', 'AAPL'],
    readTime: '3 min',
    author: 'Arthur Vance, Global Tech Reporter'
  },
  {
    id: 'news-5',
    title: 'Vale (VALE3) reporta dados de produção de minério de ferro e avança em transição para briquetes',
    summary: 'A mineradora divulgou relatório trimestral com estabilidade nos volumes embarcados para siderúrgicas chinesas e avanço no prêmio de qualidade por minério de alta concentração.',
    fullContent: 'A Vale informou que a produção de minério de ferro atingiu a meta estipulada para o período, com os custos caixa C1 mantendo-se controlados apesar das pressões inflacionárias globais na cadeia de suprimentos pesados.',
    source: 'Exame Invest',
    publishedAt: 'Há 2 horas',
    category: 'AÇÕES B3',
    sentiment: 'NEUTRAL',
    relatedTickers: ['VALE3'],
    readTime: '3 min',
    author: 'Camila Rocha, Especialista em Commodities'
  },
  {
    id: 'news-6',
    title: 'Calendário de Proventos: Bancos e WEG confirmam datas de corte para juros sobre capital próprio (JCP)',
    summary: 'Confira as datas com-direito e o valor líquido por ação a ser creditado aos investidores que mantiverem posições até o fechamento da próxima semana.',
    fullContent: 'Itaú Unibanco (ITUB4) e WEG (WEGE3) anunciaram a aprovação de distribuições de proventos aos seus acionistas sob a forma de JCP e dividendos complementares, reforçando a estratégia de investidores focados em renda passiva.',
    source: 'Status Invest & B3',
    publishedAt: 'Há 3 horas',
    category: 'DIVIDENDOS',
    sentiment: 'BULLISH',
    relatedTickers: ['ITUB4', 'WEGE3', 'BBAS3'],
    readTime: '4 min',
    author: 'Equipe de Análise Fundamentalista'
  }
];

export const INITIAL_PORTFOLIO: SimulatedPortfolio = {
  initialCapital: 100000.00,
  cashBalance: 42350.00,
  totalEquity: 114820.00,
  totalInvested: 64200.00,
  totalReturnBRL: 8270.00,
  totalReturnPercent: 8.27,
  dayChangeBRL: 1420.50,
  dayChangePercent: 1.25,
  positions: [
    {
      ticker: 'PETR4',
      assetName: 'Petrobras PN',
      quantity: 600,
      avgPrice: 35.20,
      currentPrice: 38.45,
      totalCost: 21120.00,
      currentValue: 23070.00,
      unrealizedPnL: 1950.00,
      unrealizedPnLPercent: 9.23,
      dayPnL: 390.00,
      dayPnLPercent: 1.72,
      allocationPercent: 31.8,
      strategyTag: 'Dividend Yield & Valor'
    },
    {
      ticker: 'WEGE3',
      assetName: 'WEG ON',
      quantity: 400,
      avgPrice: 48.90,
      currentPrice: 54.30,
      totalCost: 19560.00,
      currentValue: 21720.00,
      unrealizedPnL: 2160.00,
      unrealizedPnLPercent: 11.04,
      dayPnL: 360.00,
      dayPnLPercent: 1.69,
      allocationPercent: 30.0,
      strategyTag: 'Quality Growth'
    },
    {
      ticker: 'ITUB4',
      assetName: 'Itaú Unibanco PN',
      quantity: 400,
      avgPrice: 34.50,
      currentPrice: 36.80,
      totalCost: 13800.00,
      currentValue: 14720.00,
      unrealizedPnL: 920.00,
      unrealizedPnLPercent: 6.67,
      dayPnL: 220.00,
      dayPnLPercent: 1.52,
      allocationPercent: 20.3,
      strategyTag: 'Dividend Yield & Valor'
    },
    {
      ticker: 'PRIO3',
      assetName: 'PRIO ON',
      quantity: 280,
      avgPrice: 41.50,
      currentPrice: 45.60,
      totalCost: 11620.00,
      currentValue: 12768.00,
      unrealizedPnL: 1148.00,
      unrealizedPnLPercent: 9.88,
      dayPnL: 252.00,
      dayPnLPercent: 2.01,
      allocationPercent: 17.6,
      strategyTag: 'Swing Trade Médias'
    }
  ]
};

export const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: 'alert-1',
    ticker: 'PETR4',
    targetPrice: 39.00,
    condition: 'ABOVE',
    active: true,
    createdAt: '2026-10-25 10:15',
    initialPrice: 37.80,
    note: 'Rompimento da máxima semanal e resistência em R$ 39,00'
  },
  {
    id: 'alert-2',
    ticker: 'VALE3',
    targetPrice: 60.00,
    condition: 'BELOW',
    active: true,
    createdAt: '2026-10-26 14:20',
    initialPrice: 62.10,
    note: 'Ponto de suporte crítico e compra fracionada'
  },
  {
    id: 'alert-3',
    ticker: 'WEGE3',
    targetPrice: 55.00,
    condition: 'ABOVE',
    active: true,
    createdAt: '2026-10-24 09:30',
    initialPrice: 53.40,
    note: 'Máxima histórica e realização parcial de lucros'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'IPO_UPDATE',
    title: 'Reserva Aberta: IPO Moove (MOOV)',
    message: 'Período de reserva oficial iniciado para investidores de varejo. Faixa: R$ 14,50 - R$ 17,50.',
    timestamp: 'Há 15 minutos',
    read: false,
    ticker: 'MOOV'
  },
  {
    id: 'notif-2',
    type: 'MARKET_BREAKING',
    title: 'Ibovespa supera 133.000 pontos',
    message: 'Fluxo estrangeiro impulsiona ações de commodities e bancos após sinalização do Copom.',
    timestamp: 'Há 45 minutos',
    read: false
  },
  {
    id: 'notif-3',
    type: 'PRICE_ALERT',
    title: 'Alerta Disparado: PETR4',
    message: 'PETR4 atingiu R$ 38,45 (+1,72%), se aproximando da resistência de R$ 39,00.',
    timestamp: 'Há 1 hora',
    read: true,
    ticker: 'PETR4'
  }
];

// Helper to generate realistic candles for a ticker and timeframe
export function generateCandlesForTicker(ticker: string, timeframe: string = '1D'): Candle[] {
  const stock = INITIAL_STOCKS.find(s => s.ticker === ticker) || INITIAL_STOCKS[0];
  const basePrice = stock.price;
  
  let count = 40;
  if (timeframe === '1D') count = 38; // intraday 10-min candles
  if (timeframe === '5D') count = 45;
  if (timeframe === '1M') count = 30; // 30 days
  if (timeframe === '6M') count = 60;
  if (timeframe === '1Y') count = 80;

  const candles: Candle[] = [];
  let currentClose = basePrice * (timeframe === '1Y' ? 0.78 : (timeframe === '1M' ? 0.94 : 0.985));
  const now = Date.now();
  const stepMs = timeframe === '1D' ? 10 * 60 * 1000 : (timeframe === '5D' ? 30 * 60 * 1000 : 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - i - 1) * stepMs;
    const date = new Date(timestamp);
    const dateStr = timeframe === '1D' 
      ? date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    // Volatility factor
    const volatility = basePrice * 0.015;
    const open = currentClose;
    // Bias towards current price on final candles
    const trend = (basePrice - open) / (count - i + 1);
    const delta = (Math.random() - 0.48) * volatility + trend;
    const close = Math.max(1, +(open + delta).toFixed(2));
    const high = +(Math.max(open, close) + Math.random() * volatility * 0.7).toFixed(2);
    const low = +(Math.min(open, close) - Math.random() * volatility * 0.7).toFixed(2);
    const volume = Math.floor(stock.volume / count * (0.6 + Math.random() * 0.8));

    currentClose = close;

    candles.push({
      timestamp,
      dateStr,
      open,
      high,
      low,
      close,
      volume
    });
  }

  // Ensure last candle matches stock's current price exactly
  if (candles.length > 0) {
    const last = candles[candles.length - 1];
    last.close = stock.price;
    last.high = Math.max(last.high, stock.high24h, stock.price);
    last.low = Math.min(last.low, stock.low24h, stock.price);
  }

  // Compute Technical Indicators across candles
  for (let i = 0; i < candles.length; i++) {
    // EMA 9
    if (i >= 8) {
      let sum = 0;
      for (let j = i - 8; j <= i; j++) sum += candles[j].close;
      candles[i].ema9 = +(sum / 9).toFixed(2);
    }

    // SMA 20
    if (i >= 19) {
      let sum = 0;
      for (let j = i - 19; j <= i; j++) sum += candles[j].close;
      const sma = sum / 20;
      candles[i].sma20 = +sma.toFixed(2);

      // Bollinger Bands (2 std deviations on 20 period SMA)
      let varianceSum = 0;
      for (let j = i - 19; j <= i; j++) {
        varianceSum += Math.pow(candles[j].close - sma, 2);
      }
      const stdDev = Math.sqrt(varianceSum / 20);
      candles[i].bollingerMid = +sma.toFixed(2);
      candles[i].bollingerUpper = +(sma + 2 * stdDev).toFixed(2);
      candles[i].bollingerLower = +(sma - 2 * stdDev).toFixed(2);
    }

    // RSI 14
    if (i >= 14) {
      let gains = 0;
      let losses = 0;
      for (let j = i - 13; j <= i; j++) {
        const diff = candles[j].close - candles[j - 1].close;
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);
      }
      const avgGain = gains / 14;
      const avgLoss = losses / 14;
      if (avgLoss === 0) {
        candles[i].rsi = 100;
      } else {
        const rs = avgGain / avgLoss;
        candles[i].rsi = +(100 - (100 / (1 + rs))).toFixed(1);
      }
    }

    // MACD (12, 26, 9)
    if (i >= 25) {
      let sum12 = 0;
      for (let j = i - 11; j <= i; j++) sum12 += candles[j].close;
      let sum26 = 0;
      for (let j = i - 25; j <= i; j++) sum26 += candles[j].close;
      const macdLine = +(sum12 / 12 - sum26 / 26).toFixed(3);
      candles[i].macd = macdLine;
      candles[i].macdSignal = +(macdLine * 0.85).toFixed(3);
      candles[i].macdHist = +(macdLine - (candles[i].macdSignal || 0)).toFixed(3);
    }
  }

  return candles;
}

// Generate Detailed Technical Report for an asset
export function getTechnicalReportForStock(stock: StockQuote): TechnicalReport {
  const currentPrice = stock.price;
  const isUp = stock.change >= 0;
  
  // Pivot calculations based on high, low, close
  const pivot = +((stock.high24h + stock.low24h + currentPrice) / 3).toFixed(2);
  const r1 = +(2 * pivot - stock.low24h).toFixed(2);
  const r2 = +(pivot + (stock.high24h - stock.low24h)).toFixed(2);
  const s1 = +(2 * pivot - stock.high24h).toFixed(2);
  const s2 = +(pivot - (stock.high24h - stock.low24h)).toFixed(2);

  const rsi = isUp ? Math.min(78, +(52 + stock.changePercent * 5).toFixed(1)) : Math.max(26, +(48 + stock.changePercent * 5).toFixed(1));
  const rsiCondition = rsi > 70 ? 'SOBRECOMPRADO' : (rsi < 30 ? 'SOBREVENDIDO' : 'NEUTRO');
  
  const biasScore = isUp ? Math.min(92, Math.floor(62 + stock.changePercent * 8)) : Math.max(18, Math.floor(45 + stock.changePercent * 8));
  let bias: TechnicalBias = 'NEUTRO';
  if (biasScore >= 75) bias = 'FORTE_ALTA';
  else if (biasScore >= 58) bias = 'ALTA';
  else if (biasScore <= 30) bias = 'FORTE_BAIXA';
  else if (biasScore <= 45) bias = 'BAIXA';

  const entryPrice = currentPrice;
  const target1 = +(currentPrice * (isUp ? 1.055 : 1.04)).toFixed(2);
  const target2 = +(currentPrice * (isUp ? 1.115 : 1.085)).toFixed(2);
  const stopLoss = +(currentPrice * (isUp ? 0.965 : 0.955)).toFixed(2);

  const risk = +(currentPrice - stopLoss).toFixed(2);
  const reward = +(target1 - currentPrice).toFixed(2);
  const rr = (reward / (risk || 0.1)).toFixed(2);

  return {
    ticker: stock.ticker,
    timeframe: 'Diário (D1)',
    bias,
    biasScore,
    rsi14: rsi,
    rsiCondition,
    macdSignalStatus: isUp ? 'COMPRA' : 'VENDA',
    movingAveragesStatus: isUp ? 'ALINHADO_ALTA' : 'ALINHADO_BAIXA',
    bollingerBandWidth: 4.8,
    volatilityState: Math.abs(stock.changePercent) > 2 ? 'ALTA_EXPANSÃO' : 'NORMAL',
    pivots: {
      r2,
      r1,
      pivot,
      s1,
      s2
    },
    tradePlan: {
      entryPrice,
      target1,
      target2,
      stopLoss,
      riskRewardRatio: `1:${rr}`,
      timeHorizon: 'Curto a Médio Prazo (5 a 20 dias)'
    },
    aiAnalysisText: `O ativo ${stock.ticker} (${stock.name}) apresenta configuração técnica com viés predominante de ${bias.replace('_', ' ')}. A média móvel exponencial de 9 períodos atua como suporte dinâmico no gráfico diário. O IFR (RSI 14) em ${rsi} aponta equilíbrio operacional sem exaustão compradora imediata. O rompimento da resistência em R$ ${r1} pode destravar novo fluxo comprador em direção ao segundo objetivo técnico em R$ ${target2}.`,
    catalysts: [
      `Volume financeiro negociado de R$ ${(stock.volume / 1000000).toFixed(1)}M acima da média móvel de 20 pregões`,
      `Indicador MACD com cruzamento da linha de sinal e histograma em expansão`,
      `Fundamentos sólidos com P/L de ${stock.peRatio}x e Dividend Yield de ${stock.dividendYield}% ao ano`
    ],
    risks: [
      `Perda do suporte primário em R$ ${s1} anula a estrutura altista de curto prazo`,
      `Possível volatilidade decorrente de divulgação de indicadores macroeconômicos e decisões do Banco Central`,
      `Stop loss sugerido rigorosamente posicionado em R$ ${stopLoss}`
    ],
    generatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
}
