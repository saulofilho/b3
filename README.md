# B3 AlphaTerminal — Terminal Profissional de Ações, IPOs & Portfólio

Uma plataforma profissional inspirada no design broadsheet editorial financeiro (Variação 6), combinando cotações e gráficos em tempo real, pipeline de IPOs, relatórios quantitativos de análise técnica, roteamento simulado com corretoras (FIX Protocol) e gestão de carteiras com curva de patrimônio interativa via **Recharts**.

---

## ⚡ Principais Funcionalidades

### 1. Cotações e Gráficos em Tempo Real
* **Fita de Cotações (Ticker Tape):** Faixa contínua com índices globais (IBOVESPA, S&P 500, Dólar PTAX, Selic Meta, Bitcoin) e papéis ativos.
* **Gráfico Interativo de Alta Densidade:**
  * Modos Candles e Linha.
  * Indicadores técnicos comutáveis: Média Móvel Exponencial (EMA 9), Média Móvel Simples (SMA 20), Bandas de Bollinger, Volume Financeiro com ponderação e IFR (RSI 14).
  * Cursor Crosshair com cotação dinâmica no eixo Y e navegação temporal (1D, 5D, 1M, 6M, 1A, YTD).
* **Motor de Atualização Tick-by-Tick:** Flashes em verde e vermelho e síntese sonora de confirmação e alertas via Web Audio API.

### 2. Módulo de IPOs & Ofertas Públicas
* **Calendário de Ofertas:** Acompanhamento do pipeline oficial (Moove Lubrificantes, PicPay, Aegea, Hospital Care, CTG Brasil).
* **Período de Reserva:** Status de reserva aberta, dias restantes de lock-up e faixa indicativa de preço.
* **Boleta de Reserva de IPO:** Alocação de capital e visualização do prospecto de emissão diretamente na plataforma.

### 3. Relatórios Detalhados de Análise Técnica
* **Scorecard Quantitativo:** Pontuação de viés (Forte Alta, Alta, Neutro, Baixa, Forte Baixa) de 0 a 100.
* **Pontos de Pivô:** Cálculo automático de Resistência 2 (R2), Resistência 1 (R1), Pivot Point central, Suporte 1 (S1) e Suporte 2 (S2).
* **Trade Setup Automatizado:** Preço de entrada, Objetivo 1, Objetivo 2, Stop Loss e Relação Risco/Retorno (Risk/Reward).
* **Catalisadores & Riscos:** Diagnóstico de fluxo financeiro, médias móveis e múltiplos de valuation.

### 4. Portfólio Simulado (Paper Trading) & Gráfico Recharts
* **Gráfico de Evolução Patrimonial (Recharts):**
  * Curva de patrimônio total ao longo do tempo com preenchimento em gradiente.
  * Comparativo direto com benchmarks: **IBOVESPA** e **Taxa CDI (11,25% a.a.)**.
  * Filtros de tempo: `1M`, `3M`, `6M`, `1A`, `TUDO`.
  * Tooltips customizados no padrão visual do terminal com mark-to-market diário.
* **Gráfico de Rosca de Alocação por Setor (Recharts Doughnut):**
  * Distribuição percentual do patrimônio alocado por setor da B3 (Petróleo, Financeiro, Mineração, Tecnologia, etc.).
  * Total de capital posicionado, caixa líquido e valor monetário por setor.
* **Módulo de Backtesting & Simulação Histórica vs. IBOV:**
  * Simulação de retornos retroativos com seleção de períodos: **1M**, **3M**, **6M (Semestral)**, **1A** e **2A**.
  * Estratégias pré-definidas ou personalizadas (*Minha Carteira Atual*, *Top Dividendos B3*, *Barbell B3 + Tech Global*, *Quality & Alpha Growth*).
  * Confronto gráfico direto da curva de capital contra o **IBOVESPA (IBOV)** e **CDI Acumulado**.
  * Métricas quantitativas de risco: **Alpha Gerado (% e bps)**, **Índice Sharpe**, **Max Drawdown (Queda Máxima)**, **Volatilidade Anualizada** e **Taxa de Acerto (Win Rate)**.
  * Tabela de atribuição de retorno com retorno individual de cada ativo no período e contribuição ponderada.
  * Parecer quantitativo analítico automatizado do comportamento da estratégia.
* **Calendário de Dividendos & JCP da Carteira:**
  * Listagem completa de datas "ex" de corte e calendários de pagamento previstos para os ativos mantidos em carteira.
  * Projeção automática de renda passiva total em R$ (Líquido e Bruto) com base na custódia atual do investidor (`Qtd em Carteira × Provento por Ação`).
  * Discriminação tributária entre Dividendos (isentos de IR) e Juros sobre Capital Próprio - JCP (com alíquota de 15% na fonte calculada automaticamente).
  * Painel de fluxo de caixa mensal com créditos programados por mês/ano.
  * Filtros dinâmicos por tipo (Todos, Dividendos, JCP), por mês de crédito e modo radar (Minha Carteira vs. Radar Geral B3).
  * Acesso rápido para compra adicional de cotas antes da Data-Com.
* **Estatísticas da Carteira:** Rentabilidade acumulada (%), P&L do dia, Patrimônio total e Caixa líquido disponível.
* **Gestão de Estratégias:** Classificação de posições em *Dividend Yield & Valor*, *Quality Growth*, *Swing Trade Médias* e *IPOs*.
* **Aporte e Reset:** Ferramenta para injetar capital de teste (`+R$ 10.000`) ou restaurar o portfólio para o capital inicial (R$ 100.000).

### 5. Comparador de Ativos & Filtro Setorial
* **Filtro Setorial B3:** Dropdown no topo da lista de ações para filtrar papéis por setores específicos (Petróleo & Gás, Financeiro, Mineração & Siderurgia, Bens Industriais, etc.).
* **Comparador Lateral de Ativos:** Seleção de 2 ativos simultâneos com tabela de métricas consolidadas (Cotação, Variação Dia, Dividend Yield, P/L, ROE, Volume, Beta, Recomendação de Consenso).

### 6. Análise Especializada de Dividend Yield (DY)
* **DY Anualizado (12 Meses):** Coluna dedicada na tabela de ações com ordenação rápida e badge *Top Yield*.
* **Projeção de Renda Passiva:**
  * Estimativa monetária de provento por ação (`R$ / ação`).
  * Projeção de fluxo de caixa para lote padrão de 100 ações.
  * Comparativo percentual contra o rendimento da taxa básica Selic.

### 7. Roteamento & Integração com Corretoras (DMA2 / FIX)
* **Hub de Conexão:** Suporte a corretoras nacionais e globais (**XP Investimentos**, **BTG Pactual**, **NuInvest**, **Clear** e **Interactive Brokers**).
* **Boleta Completa:** Ordens a Mercado, Limite e Stop Loss com cálculo automático de emolumentos B3 (0,03%) e corretagem zero.

### 8. Feed de Notícias Financeiras & Alertas
* Notícias em tempo real com categorização macro, corporativa e IPOs.
* Sistema de alertas sonoros e visuais configuráveis por cotação (acima ou abaixo do preço-alvo).

---

## 🎨 Sistema de Design (Variação 6 — Terminal Broadsheet)

* **Paleta Editorial:**
  * Fundo: Creme editorial `#f8f7f4`
  * Tinta: Grafite escuro `#1a1a1a`
  * Superfícies: Branco `#ffffff` e Creme suave `#f1f0ec`
  * Linhas e Molduras: `#dcdad5` e bordas estruturadas `#1a1a1a`
* **Tipografia:**
  * **Cormorant Garamond:** Títulos editoriais, nomes de ativos e cabeçalhos principais em itálico com serifa.
  * **Space Mono:** Números, cotações, variações percentuais, telemetria e datas.
  * **Inter:** Legibilidade perfeita em textos explicativos e tabelas.
* **Layout 3-Pane no Desktop:**
  * **Painel Esquerdo (260px):** Radar de mercado com índices macro e lista completa de ativos.
  * **Painel Central (1fr):** Gráfico interativo e visualizações em abas.
  * **Painel Direito (320px):** Boleta de execução rápida, status FIX da corretora conectada e scorecard técnico.

---

## 🛠️ Tecnologias Utilizadas

* **React 19**
* **TypeScript**
* **Tailwind CSS v4**
* **Recharts** (Gráficos de evolução patrimonial e análise de dados)
* **Lucide React** (Ícones financeiros e de navegação)
* **Web Audio API** (Sintetizador de feedback sonoro para ordens e alertas)
* **Vite** (Build e desenvolvimento rápido)

---

## 🚀 Como Executar Localmente

1. Clone o repositório ou baixe os arquivos do projeto.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse a aplicação no seu navegador em `http://localhost:3000`.

---

## ⚖️ Aviso Legal / Disclaimer

Este software destina-se a fins educacionais, de simulação e de apoio a decisões de investimento. As cotações, indicadores e simulações de ordens não constituem recomendação oficial de investimento nos termos da regulamentação da Comissão de Valores Mobiliários (CVM).
