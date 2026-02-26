import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './' }))

// ─── API Routes ─────────────────────────────────────────────────
app.get('/api/price', (c) => {
  const price = (0.0028 + Math.random() * 0.0004).toFixed(6)
  const change = ((Math.random() - 0.45) * 8).toFixed(2)
  return c.json({
    symbol: 'BYB/USDT',
    price,
    change24h: change,
    high24h: (parseFloat(price) * 1.06).toFixed(6),
    low24h: (parseFloat(price) * 0.94).toFixed(6),
    volume24h: (Math.random() * 5000000 + 1000000).toFixed(0),
    marketCap: (parseFloat(price) * 1300000000).toFixed(0),
    totalSupply: '1,300,000,000',
    chain: 'BSC'
  })
})

app.get('/api/nfts', (c) => {
  const nfts = [
    { id: 1, name: '演唱會票房 NFT #001', category: '文娛', price: '0.5', currency: 'BNB', image: '🎵', rarity: 'Legendary', yield: '季度票房收益', holders: 128 },
    { id: 2, name: '電影票房 NFT #032', category: '文娛', price: '0.3', currency: 'BNB', image: '🎬', rarity: 'Epic', yield: '票房分潤', holders: 256 },
    { id: 3, name: '東江泉品牌 NFT #007', category: '文創', price: '0.8', currency: 'BNB', image: '💧', rarity: 'Legendary', yield: '品牌授權收益', holders: 64 },
    { id: 4, name: '康養小鎮房產 NFT #015', category: '文創', price: '2.5', currency: 'BNB', image: '🏡', rarity: 'Mythic', yield: '房產收益', holders: 32 },
    { id: 5, name: '演藝製作 NFT #088', category: '文娛', price: '0.4', currency: 'BNB', image: '🎭', rarity: 'Rare', yield: '演出收益', holders: 512 },
    { id: 6, name: '影視基地 NFT #003', category: '文創', price: '1.2', currency: 'BNB', image: '🎥', rarity: 'Epic', yield: '場地授權收益', holders: 96 },
    { id: 7, name: 'DAO 治理 NFT #021', category: '治理', price: '1.0', currency: 'BNB', image: '🏛️', rarity: 'Epic', yield: 'DAO 投票權', holders: 200 },
    { id: 8, name: 'GameFi 探險 NFT #044', category: 'GameFi', price: '0.2', currency: 'BNB', image: '⚔️', rarity: 'Common', yield: '鏈遊採礦', holders: 1024 },
  ]
  return c.json(nfts)
})

app.get('/api/proposals', (c) => {
  const proposals = [
    { id: 1, title: '第二季演唱會票房 NFT 增發提案', status: 'active', votes: { yes: 12800, no: 2100 }, endTime: '2025-03-15', category: '文娛' },
    { id: 2, title: 'BYB 回購銷毀計劃 Q1 2025', status: 'active', votes: { yes: 18500, no: 800 }, endTime: '2025-03-10', category: '代幣' },
    { id: 3, title: '東江泉 NFT 收益分配調整', status: 'passed', votes: { yes: 22000, no: 3000 }, endTime: '2025-02-28', category: '文創' },
    { id: 4, title: 'GameFi 新地圖開放提案', status: 'passed', votes: { yes: 9500, no: 4200 }, endTime: '2025-02-20', category: 'GameFi' },
    { id: 5, title: '新孵化項目：音樂競技平台', status: 'pending', votes: { yes: 0, no: 0 }, endTime: '2025-03-25', category: 'RWA' },
  ]
  return c.json(proposals)
})

app.get('/api/stats', (c) => {
  return c.json({
    totalUsers: 48621,
    totalVolume: '128,450,000',
    nftTraded: 15832,
    daoProposals: 47,
    bybBurned: '12,500,000',
    chainTxCount: 234891
  })
})

app.get('/api/orderbook', (c) => {
  const basePrice = 0.002850
  const asks = Array.from({ length: 8 }, (_, i) => ({
    price: (basePrice + (i + 1) * 0.000015).toFixed(6),
    amount: (Math.random() * 50000 + 10000).toFixed(0),
    total: ''
  })).map(o => ({ ...o, total: (parseFloat(o.price) * parseFloat(o.amount)).toFixed(2) }))

  const bids = Array.from({ length: 8 }, (_, i) => ({
    price: (basePrice - (i + 1) * 0.000015).toFixed(6),
    amount: (Math.random() * 50000 + 10000).toFixed(0),
    total: ''
  })).map(o => ({ ...o, total: (parseFloat(o.price) * parseFloat(o.amount)).toFixed(2) }))

  return c.json({ asks: asks.reverse(), bids, lastPrice: basePrice.toFixed(6) })
})

app.get('/api/trades', (c) => {
  const trades = Array.from({ length: 20 }, (_, i) => {
    const base = 0.002850
    const price = (base + (Math.random() - 0.5) * 0.0002).toFixed(6)
    const amount = (Math.random() * 100000 + 5000).toFixed(0)
    const now = new Date(Date.now() - i * 30000)
    return {
      time: now.toTimeString().slice(0, 8),
      price,
      amount,
      side: Math.random() > 0.5 ? 'buy' : 'sell'
    }
  })
  return c.json(trades)
})

// ─── Main App HTML ───────────────────────────────────────────────
app.get('*', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BYB Exchange | 幣友圈 Web3 交易平台</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+TC:wght@300;400;500;700&display=swap');
    * { font-family: 'Inter', 'Noto Sans TC', sans-serif; }
    :root {
      --gold: #F0B90B;
      --gold-dark: #C99807;
      --bg-primary: #0B0E11;
      --bg-secondary: #13161A;
      --bg-card: #1E2026;
      --bg-hover: #2B2F36;
      --border: #2B2F36;
      --text-primary: #EAECEF;
      --text-secondary: #848E9C;
      --green: #0ECB81;
      --red: #F6465D;
    }
    body { background: var(--bg-primary); color: var(--text-primary); }
    .gold { color: var(--gold); }
    .gold-bg { background: var(--gold); }
    .card { background: var(--bg-card); border: 1px solid var(--border); }
    .card-hover:hover { background: var(--bg-hover); }
    .text-green { color: var(--green); }
    .text-red { color: var(--red); }
    .tab-active { border-bottom: 2px solid var(--gold); color: var(--gold); }
    .tab-inactive { color: var(--text-secondary); }
    .gradient-gold { background: linear-gradient(135deg, #F0B90B 0%, #C99807 100%); }
    .gradient-hero { background: linear-gradient(135deg, #0B0E11 0%, #1a1400 50%, #0B0E11 100%); }
    .glow { box-shadow: 0 0 20px rgba(240,185,11,0.3); }
    .nft-card { transition: transform 0.2s, box-shadow 0.2s; }
    .nft-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(240,185,11,0.2); }
    .particle {
      position: absolute; border-radius: 50%;
      background: rgba(240,185,11,0.1);
      animation: float 6s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    .price-up { animation: flashGreen 0.5s ease; }
    .price-down { animation: flashRed 0.5s ease; }
    @keyframes flashGreen { 0%,100%{color:inherit} 50%{color:#0ECB81} }
    @keyframes flashRed { 0%,100%{color:inherit} 50%{color:#F6465D} }
    .scrollbar-thin::-webkit-scrollbar { width: 4px; }
    .scrollbar-thin::-webkit-scrollbar-track { background: var(--bg-primary); }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
    .modal-overlay { background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); }
    .badge-legendary { background: linear-gradient(135deg,#FFD700,#FFA500); }
    .badge-epic { background: linear-gradient(135deg,#9B59B6,#6C3483); }
    .badge-mythic { background: linear-gradient(135deg,#E74C3C,#922B21); }
    .badge-rare { background: linear-gradient(135deg,#3498DB,#1A5276); }
    .badge-common { background: linear-gradient(135deg,#7F8C8D,#566573); }
    nav { background: rgba(11,14,17,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); }
    .btn-primary { background: var(--gold); color: #000; font-weight: 700; transition: all 0.2s; }
    .btn-primary:hover { background: var(--gold-dark); transform: translateY(-1px); }
    .btn-outline { border: 1px solid var(--gold); color: var(--gold); transition: all 0.2s; }
    .btn-outline:hover { background: rgba(240,185,11,0.1); }
    .input-field { background: var(--bg-secondary); border: 1px solid var(--border); color: var(--text-primary); }
    .input-field:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 2px rgba(240,185,11,0.2); }
    .vote-bar { height: 6px; border-radius: 3px; background: var(--border); overflow: hidden; }
    .vote-yes { background: var(--green); }
    .vote-no { background: var(--red); }
    .ticker-wrap { overflow: hidden; white-space: nowrap; }
    .ticker-inner { display: inline-block; animation: ticker 30s linear infinite; }
    @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @media (max-width:768px) { .hide-mobile { display: none; } }
  </style>
</head>
<body>

<!-- ══════════════════ TICKER BAR ══════════════════ -->
<div style="background:#13161A;border-bottom:1px solid #2B2F36;padding:6px 0;font-size:12px;">
  <div class="ticker-wrap">
    <div class="ticker-inner" id="tickerBar">
      <span class="gold mx-4">BYB/USDT</span><span class="text-green mx-2">▲ 5.32%</span>
      <span class="mx-4 text-gray-400">•</span>
      <span class="gold mx-4">BYB/BNB</span><span class="text-green mx-2">▲ 3.18%</span>
      <span class="mx-4 text-gray-400">•</span>
      <span class="mx-4" style="color:#848E9C">BSC 網絡</span><span class="text-green mx-2">正常運行</span>
      <span class="mx-4 text-gray-400">•</span>
      <span class="mx-4" style="color:#848E9C">Gas Price</span><span class="gold mx-2">3 Gwei</span>
      <span class="mx-4 text-gray-400">•</span>
      <span class="mx-4" style="color:#848E9C">總供應量</span><span class="gold mx-2">13億 BYB</span>
      <span class="mx-4 text-gray-400">•</span>
      <span class="gold mx-4">BYB/USDT</span><span class="text-green mx-2">▲ 5.32%</span>
      <span class="mx-4 text-gray-400">•</span>
      <span class="gold mx-4">BYB/BNB</span><span class="text-green mx-2">▲ 3.18%</span>
      <span class="mx-4 text-gray-400">•</span>
      <span class="mx-4" style="color:#848E9C">BSC 網絡</span><span class="text-green mx-2">正常運行</span>
      <span class="mx-4 text-gray-400">•</span>
      <span class="mx-4" style="color:#848E9C">Gas Price</span><span class="gold mx-2">3 Gwei</span>
    </div>
  </div>
</div>

<!-- ══════════════════ NAVBAR ══════════════════ -->
<nav class="sticky top-0 z-50 px-4 py-3">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-2 cursor-pointer" onclick="showPage('home')">
        <div class="w-8 h-8 rounded-full gradient-gold flex items-center justify-center font-black text-black text-sm">BYB</div>
        <span class="font-bold text-lg">Bybanx <span class="gold">幣友圈</span></span>
      </div>
      <div class="hide-mobile flex items-center gap-1">
        <button onclick="showPage('trade')" class="nav-btn px-3 py-2 rounded text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-gray-800 transition-all" data-page="trade">
          <i class="fas fa-chart-line mr-1"></i>交易
        </button>
        <button onclick="showPage('nft')" class="nav-btn px-3 py-2 rounded text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-gray-800 transition-all" data-page="nft">
          <i class="fas fa-layer-group mr-1"></i>NFT市場
        </button>
        <button onclick="showPage('dao')" class="nav-btn px-3 py-2 rounded text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-gray-800 transition-all" data-page="dao">
          <i class="fas fa-vote-yea mr-1"></i>DAO治理
        </button>
        <button onclick="showPage('staking')" class="nav-btn px-3 py-2 rounded text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-gray-800 transition-all" data-page="staking">
          <i class="fas fa-coins mr-1"></i>質押
        </button>
        <button onclick="showPage('portfolio')" class="nav-btn px-3 py-2 rounded text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-gray-800 transition-all" data-page="portfolio">
          <i class="fas fa-wallet mr-1"></i>資產
        </button>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <div class="hide-mobile flex items-center gap-2 card rounded-lg px-3 py-1.5">
        <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <span class="text-xs text-gray-400">BSC主網</span>
      </div>
      <button id="connectBtn" onclick="connectWallet()" class="btn-primary px-4 py-2 rounded-lg text-sm">
        <i class="fas fa-wallet mr-2"></i>連接錢包
      </button>
      <button class="hide-mobile card p-2 rounded-lg hover:bg-gray-700 transition-all" onclick="showNotification()">
        <i class="fas fa-bell text-gray-400 text-sm"></i>
      </button>
    </div>
  </div>
</nav>

<!-- ══════════════════ HOME PAGE ══════════════════ -->
<div id="page-home" class="page-section">
  <!-- Hero -->
  <div class="gradient-hero relative overflow-hidden" style="min-height:90vh">
    <div class="particle w-64 h-64 top-10 left-10" style="animation-delay:0s"></div>
    <div class="particle w-96 h-96 top-20 right-20" style="animation-delay:2s"></div>
    <div class="particle w-48 h-48 bottom-10 left-1/2" style="animation-delay:4s"></div>
    
    <div class="max-w-7xl mx-auto px-4 py-20 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div class="inline-flex items-center gap-2 card rounded-full px-4 py-2 mb-6">
            <div class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <span class="text-sm text-gray-300">基於幣安智能鏈 (BSC)</span>
          </div>
          <h1 class="text-5xl font-black leading-tight mb-4">
            文化創意產業<br>
            <span class="gold">Web3 交易平台</span>
          </h1>
          <p class="text-gray-400 text-lg mb-8 leading-relaxed">
            Bybanx 幣友圈 — 透過 BYB 代幣連結真實世界資產(RWA)、NFT、DAO治理、GameFi，讓每位用戶成為文化產業的<strong class="text-white">消費者+投資者+治理者</strong>。
          </p>
          <div class="flex flex-wrap gap-4 mb-10">
            <button onclick="showPage('trade')" class="btn-primary px-8 py-3 rounded-xl text-base font-bold flex items-center gap-2">
              <i class="fas fa-chart-line"></i>立即交易
            </button>
            <button onclick="showPage('nft')" class="btn-outline px-8 py-3 rounded-xl text-base font-bold flex items-center gap-2">
              <i class="fas fa-layer-group"></i>探索 NFT
            </button>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold gold" id="heroPrice">--</div>
              <div class="text-xs text-gray-500 mt-1">BYB 價格</div>
            </div>
            <div class="text-center border-x border-gray-700">
              <div class="text-2xl font-bold text-white" id="heroUsers">48,621</div>
              <div class="text-xs text-gray-500 mt-1">活躍用戶</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white" id="heroNFT">15,832</div>
              <div class="text-xs text-gray-500 mt-1">NFT 交易</div>
            </div>
          </div>
        </div>
        
        <div class="relative">
          <div class="card rounded-2xl p-6 glow">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 gradient-gold rounded-full flex items-center justify-center font-black text-black text-xs">BYB</div>
                <span class="font-semibold">BYB / USDT</span>
              </div>
              <span class="text-green text-sm font-medium" id="heroChange">+0.00%</span>
            </div>
            <div class="text-3xl font-black gold mb-2" id="heroPriceCard">$0.002850</div>
            <canvas id="miniChart" height="80"></canvas>
            <div class="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div>
                <div class="text-gray-500">24H 高</div>
                <div class="text-green font-medium" id="heroHigh">--</div>
              </div>
              <div>
                <div class="text-gray-500">24H 低</div>
                <div class="text-red font-medium" id="heroLow">--</div>
              </div>
              <div>
                <div class="text-gray-500">成交量</div>
                <div class="font-medium" id="heroVol">--</div>
              </div>
            </div>
            <button onclick="showPage('trade')" class="btn-primary w-full mt-4 py-3 rounded-xl font-bold">
              <i class="fas fa-exchange-alt mr-2"></i>立即交易
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Stats Bar -->
  <div style="background:#13161A;border-top:1px solid #2B2F36;border-bottom:1px solid #2B2F36;">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
        <div>
          <div class="text-xl font-bold gold" id="statPrice">$0.0028</div>
          <div class="text-xs text-gray-500">BYB 價格</div>
        </div>
        <div>
          <div class="text-xl font-bold text-white">$3.64M</div>
          <div class="text-xs text-gray-500">市值</div>
        </div>
        <div>
          <div class="text-xl font-bold text-white" id="statVol">$128.4M</div>
          <div class="text-xs text-gray-500">24H 總成交</div>
        </div>
        <div>
          <div class="text-xl font-bold text-white">1,300M</div>
          <div class="text-xs text-gray-500">總供應量</div>
        </div>
        <div>
          <div class="text-xl font-bold text-white" id="statBurned">12.5M</div>
          <div class="text-xs text-gray-500">已銷毀 BYB</div>
        </div>
        <div>
          <div class="text-xl font-bold text-white" id="statDAO">47</div>
          <div class="text-xs text-gray-500">DAO 提案</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Features -->
  <div class="max-w-7xl mx-auto px-4 py-16">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-black mb-3">平台核心功能</h2>
      <p class="text-gray-400">多元化 Web3 生態，一站式管理您的數字資產</p>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card rounded-xl p-6 cursor-pointer card-hover transition-all" onclick="showPage('trade')">
        <div class="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center mb-4">
          <i class="fas fa-chart-line text-black text-xl"></i>
        </div>
        <h3 class="font-bold text-lg mb-2">現貨交易</h3>
        <p class="text-gray-400 text-sm">BSC 鏈上 BYB/USDT、BYB/BNB 即時交易，低手續費，深度流動性</p>
        <div class="mt-4 flex items-center gap-1 text-yellow-400 text-sm font-medium">進入交易 <i class="fas fa-arrow-right text-xs"></i></div>
      </div>
      <div class="card rounded-xl p-6 cursor-pointer card-hover transition-all" onclick="showPage('nft')">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style="background:linear-gradient(135deg,#9B59B6,#6C3483)">
          <i class="fas fa-layer-group text-white text-xl"></i>
        </div>
        <h3 class="font-bold text-lg mb-2">NFT 市場</h3>
        <p class="text-gray-400 text-sm">文娛票房 NFT、文創資產 NFT、DAO 治理 NFT，真實收益支撐</p>
        <div class="mt-4 flex items-center gap-1 text-purple-400 text-sm font-medium">探索市場 <i class="fas fa-arrow-right text-xs"></i></div>
      </div>
      <div class="card rounded-xl p-6 cursor-pointer card-hover transition-all" onclick="showPage('dao')">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style="background:linear-gradient(135deg,#27AE60,#1A5C38)">
          <i class="fas fa-vote-yea text-white text-xl"></i>
        </div>
        <h3 class="font-bold text-lg mb-2">DAO 治理</h3>
        <p class="text-gray-400 text-sm">持有 BYB NFT 即可參與鏈上投票，共同決策平台發展方向</p>
        <div class="mt-4 flex items-center gap-1 text-green-400 text-sm font-medium">參與治理 <i class="fas fa-arrow-right text-xs"></i></div>
      </div>
      <div class="card rounded-xl p-6 cursor-pointer card-hover transition-all" onclick="showPage('staking')">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style="background:linear-gradient(135deg,#E67E22,#A04000)">
          <i class="fas fa-coins text-white text-xl"></i>
        </div>
        <h3 class="font-bold text-lg mb-2">BYB 質押</h3>
        <p class="text-gray-400 text-sm">質押 BYB 獲得季度真實收益分潤，鎖定期越長收益倍率越高</p>
        <div class="mt-4 flex items-center gap-1 text-orange-400 text-sm font-medium">開始質押 <i class="fas fa-arrow-right text-xs"></i></div>
      </div>
    </div>
  </div>

  <!-- RWA Assets -->
  <div style="background:#13161A;padding:60px 0">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-black mb-3">真實資產支撐 <span class="gold">(RWA)</span></h2>
        <p class="text-gray-400">Bybanx 生態系統由以下真實世界資產提供價值支撐</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card rounded-xl p-5">
          <div class="text-3xl mb-3">🎵</div>
          <div class="font-bold mb-1">演唱會 & 音樂</div>
          <div class="text-sm text-gray-400 mb-3">合作頭部演唱會、音樂競技，票房收益鏈上化</div>
          <div class="text-xs gold">數百場大型演出資源</div>
        </div>
        <div class="card rounded-xl p-5">
          <div class="text-3xl mb-3">🎬</div>
          <div class="font-bold mb-1">影視 & 短劇</div>
          <div class="text-sm text-gray-400 mb-3">院線電影票房 NFT，影視基地授權收益數字化</div>
          <div class="text-xs gold">多部院線電影出品</div>
        </div>
        <div class="card rounded-xl p-5">
          <div class="text-3xl mb-3">💧</div>
          <div class="font-bold mb-1">東江泉品牌</div>
          <div class="text-sm text-gray-400 mb-3">礦泉水品牌授權 NFT，消費與投資雙重屬性</div>
          <div class="text-xs gold">品牌授權收益分潤</div>
        </div>
        <div class="card rounded-xl p-5">
          <div class="text-3xl mb-3">🏡</div>
          <div class="font-bold mb-1">康養小鎮</div>
          <div class="text-sm text-gray-400 mb-3">朱坊文旅康養小鎮房產 NFT，不動產數字化</div>
          <div class="text-xs gold">實體資產鏈上確權</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Roadmap -->
  <div class="max-w-7xl mx-auto px-4 py-16">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-black mb-3">發展路線圖</h2>
      <p class="text-gray-400">清晰透明的五階段發展計劃</p>
    </div>
    <div class="relative">
      <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700 transform -translate-x-1/2 hide-mobile"></div>
      <div class="space-y-6">
        <div class="flex items-center gap-4 md:gap-8 md:flex-row">
          <div class="md:w-1/2 md:text-right w-full">
            <div class="card rounded-xl p-4 inline-block text-left">
              <div class="text-xs text-gray-500 mb-1">第 1 階段</div>
              <div class="font-bold">🎵 文娛板塊：演唱會 &amp; 電影票房 NFT</div>
            </div>
          </div>
          <div class="hidden md:flex w-8 h-8 rounded-full flex-shrink-0 items-center justify-center font-bold text-black text-sm z-10" style="background:#0ECB81">1</div>
          <div class="hidden md:block md:w-1/2"></div>
        </div>
        <div class="flex items-center gap-4 md:gap-8 md:flex-row-reverse">
          <div class="md:w-1/2 w-full">
            <div class="card rounded-xl p-4 inline-block text-left">
              <div class="text-xs text-gray-500 mb-1">第 2 階段</div>
              <div class="font-bold">💧 文創板塊：東江泉礦泉水 &amp; 康養小鎮 NFT</div>
            </div>
          </div>
          <div class="hidden md:flex w-8 h-8 rounded-full flex-shrink-0 items-center justify-center font-bold text-black text-sm z-10" style="background:#F0B90B">2</div>
          <div class="hidden md:block md:w-1/2"></div>
        </div>
        <div class="flex items-center gap-4 md:gap-8 md:flex-row">
          <div class="md:w-1/2 md:text-right w-full">
            <div class="card rounded-xl p-4 inline-block text-left">
              <div class="text-xs text-gray-500 mb-1">第 3 階段</div>
              <div class="font-bold">🌐 SocialFi：Web3 社交積分系統上線</div>
            </div>
          </div>
          <div class="hidden md:flex w-8 h-8 rounded-full flex-shrink-0 items-center justify-center font-bold text-black text-sm z-10" style="background:#3498DB">3</div>
          <div class="hidden md:block md:w-1/2"></div>
        </div>
        <div class="flex items-center gap-4 md:gap-8 md:flex-row-reverse">
          <div class="md:w-1/2 w-full">
            <div class="card rounded-xl p-4 inline-block text-left">
              <div class="text-xs text-gray-500 mb-1">第 4 階段</div>
              <div class="font-bold">⚔️ GameFi：BYB NFT 鏈遊探索挖礦</div>
            </div>
          </div>
          <div class="hidden md:flex w-8 h-8 rounded-full flex-shrink-0 items-center justify-center font-bold text-black text-sm z-10" style="background:#9B59B6">4</div>
          <div class="hidden md:block md:w-1/2"></div>
        </div>
        <div class="flex items-center gap-4 md:gap-8 md:flex-row">
          <div class="md:w-1/2 md:text-right w-full">
            <div class="card rounded-xl p-4 inline-block text-left">
              <div class="text-xs text-gray-500 mb-1">第 5 階段</div>
              <div class="font-bold">🚀 RWA 孵化器：企業鏈上化標準輸出</div>
            </div>
          </div>
          <div class="hidden md:flex w-8 h-8 rounded-full flex-shrink-0 items-center justify-center font-bold text-black text-sm z-10" style="background:#E74C3C">5</div>
          <div class="hidden md:block md:w-1/2"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer style="background:#0B0E11;border-top:1px solid #2B2F36;" class="py-10">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 gradient-gold rounded-full flex items-center justify-center font-black text-black text-xs">BYB</div>
            <span class="font-bold">Bybanx 幣友圈</span>
          </div>
          <p class="text-sm text-gray-500">敦華集團旗下品牌，文化創意產業 Web3 應用平台，總部香港屯門</p>
          <div class="flex gap-3 mt-4">
            <a href="#" class="w-8 h-8 card rounded-full flex items-center justify-center hover:border-yellow-500 transition-all"><i class="fab fa-telegram text-gray-400 text-sm"></i></a>
            <a href="#" class="w-8 h-8 card rounded-full flex items-center justify-center hover:border-yellow-500 transition-all"><i class="fab fa-twitter text-gray-400 text-sm"></i></a>
            <a href="#" class="w-8 h-8 card rounded-full flex items-center justify-center hover:border-yellow-500 transition-all"><i class="fab fa-discord text-gray-400 text-sm"></i></a>
          </div>
        </div>
        <div>
          <div class="font-semibold mb-3">產品</div>
          <div class="space-y-2 text-sm text-gray-500">
            <div class="hover:text-yellow-400 cursor-pointer" onclick="showPage('trade')">現貨交易</div>
            <div class="hover:text-yellow-400 cursor-pointer" onclick="showPage('nft')">NFT 市場</div>
            <div class="hover:text-yellow-400 cursor-pointer" onclick="showPage('dao')">DAO 治理</div>
            <div class="hover:text-yellow-400 cursor-pointer" onclick="showPage('staking')">BYB 質押</div>
          </div>
        </div>
        <div>
          <div class="font-semibold mb-3">關於</div>
          <div class="space-y-2 text-sm text-gray-500">
            <div class="hover:text-yellow-400 cursor-pointer">白皮書</div>
            <div class="hover:text-yellow-400 cursor-pointer">技術文檔</div>
            <div class="hover:text-yellow-400 cursor-pointer">敦華集團</div>
            <div class="hover:text-yellow-400 cursor-pointer">媒體資料</div>
          </div>
        </div>
        <div>
          <div class="font-semibold mb-3">鏈上信息</div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2"><span class="text-gray-500">網絡：</span><span class="gold">BSC 主網</span></div>
            <div class="flex items-center gap-2"><span class="text-gray-500">代幣：</span><span class="text-white">BYB (BEP-20)</span></div>
            <div class="text-xs text-gray-600 mt-3">核心合約地址將在主網部署後通過官網公佈</div>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
        <p>BYB 為功能型數字資產，非證券、非股票、非理財產品。投資數字資產存在風險，請謹慎決策。</p>
        <p class="mt-1">© 2025 Bybanx 幣友圈 | 敦華集團 | Hong Kong</p>
      </div>
    </div>
  </footer>
</div>

<!-- ══════════════════ TRADE PAGE ══════════════════ -->
<div id="page-trade" class="page-section hidden">
  <div class="max-w-7xl mx-auto px-4 py-4">
    <!-- Pair Selector -->
    <div class="flex items-center gap-4 mb-4">
      <div class="flex gap-2">
        <button onclick="setPair('BYB/USDT')" class="pair-btn active px-4 py-2 rounded-lg text-sm font-semibold card" data-pair="BYB/USDT">
          <span class="gold">BYB</span>/USDT
        </button>
        <button onclick="setPair('BYB/BNB')" class="pair-btn px-4 py-2 rounded-lg text-sm font-semibold card text-gray-400" data-pair="BYB/BNB">
          <span class="gold">BYB</span>/BNB
        </button>
      </div>
      <div class="flex items-center gap-3 ml-2">
        <div class="text-2xl font-black gold" id="tradePrice">$0.002850</div>
        <div class="text-green text-sm font-medium" id="tradeChange">+5.32%</div>
      </div>
      <div class="hide-mobile flex items-center gap-4 ml-4 text-xs text-gray-500">
        <div><span class="text-gray-600">24H高</span> <span class="text-green font-medium" id="tradeHigh">--</span></div>
        <div><span class="text-gray-600">24H低</span> <span class="text-red font-medium" id="tradeLow">--</span></div>
        <div><span class="text-gray-600">成交量</span> <span class="font-medium" id="tradeVol">--</span></div>
      </div>
    </div>

    <div class="grid lg:grid-cols-4 gap-4">
      <!-- Chart -->
      <div class="lg:col-span-2 card rounded-xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex gap-1">
            <button onclick="setTimeframe('1m')" class="timeframe-btn text-xs px-2 py-1 rounded text-gray-500 hover:text-white">1m</button>
            <button onclick="setTimeframe('5m')" class="timeframe-btn text-xs px-2 py-1 rounded text-gray-500 hover:text-white">5m</button>
            <button onclick="setTimeframe('15m')" class="timeframe-btn text-xs px-2 py-1 rounded text-gray-500 hover:text-white">15m</button>
            <button onclick="setTimeframe('1H')" class="timeframe-btn text-xs px-2 py-1 rounded gold-bg text-black font-bold">1H</button>
            <button onclick="setTimeframe('4H')" class="timeframe-btn text-xs px-2 py-1 rounded text-gray-500 hover:text-white">4H</button>
            <button onclick="setTimeframe('1D')" class="timeframe-btn text-xs px-2 py-1 rounded text-gray-500 hover:text-white">1D</button>
            <button onclick="setTimeframe('1W')" class="timeframe-btn text-xs px-2 py-1 rounded text-gray-500 hover:text-white">1W</button>
          </div>
          <div class="flex gap-1">
            <button class="text-xs px-2 py-1 rounded text-gray-500 hover:text-white"><i class="fas fa-chart-line"></i></button>
            <button class="text-xs px-2 py-1 rounded text-gray-500 hover:text-white"><i class="fas fa-chart-bar"></i></button>
          </div>
        </div>
        <canvas id="priceChart" height="240"></canvas>
      </div>

      <!-- Order Book -->
      <div class="card rounded-xl p-4">
        <div class="font-semibold text-sm mb-3">訂單簿</div>
        <div class="grid grid-cols-3 text-xs text-gray-500 mb-2 px-1">
          <span>價格(USDT)</span><span class="text-center">數量(BYB)</span><span class="text-right">總額</span>
        </div>
        <div id="asksList" class="space-y-0.5 mb-2 scrollbar-thin overflow-y-auto" style="max-height:160px"></div>
        <div class="text-center py-2 font-bold gold text-sm border-y border-gray-700 my-1" id="obMidPrice">0.002850</div>
        <div id="bidsList" class="space-y-0.5 scrollbar-thin overflow-y-auto" style="max-height:160px"></div>
      </div>

      <!-- Trade Form -->
      <div class="card rounded-xl p-4">
        <div class="flex mb-4 rounded-lg overflow-hidden border border-gray-700">
          <button id="tabBuy" onclick="setTradeTab('buy')" class="flex-1 py-2 text-sm font-bold bg-green-500 bg-opacity-20 text-green-400 border-b-2 border-green-400">買入</button>
          <button id="tabSell" onclick="setTradeTab('sell')" class="flex-1 py-2 text-sm font-bold text-gray-500">賣出</button>
        </div>
        
        <div id="orderTypeRow" class="flex gap-2 mb-4">
          <button onclick="setOrderType('limit')" class="order-type-btn text-xs px-3 py-1.5 rounded card border border-yellow-500 text-yellow-400" data-type="limit">限價</button>
          <button onclick="setOrderType('market')" class="order-type-btn text-xs px-3 py-1.5 rounded card text-gray-500" data-type="market">市價</button>
          <button onclick="setOrderType('stop')" class="order-type-btn text-xs px-3 py-1.5 rounded card text-gray-500" data-type="stop">止損</button>
        </div>

        <div class="space-y-3">
          <div>
            <div class="text-xs text-gray-500 mb-1">可用餘額</div>
            <div class="text-sm text-gray-300 font-medium">-- USDT <button onclick="connectWallet()" class="text-xs text-yellow-400 ml-1">充值</button></div>
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1 block">價格 (USDT)</label>
            <input type="number" id="tradeInputPrice" class="input-field w-full rounded-lg px-3 py-2 text-sm" placeholder="0.002850" step="0.000001">
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1 block">數量 (BYB)</label>
            <input type="number" id="tradeInputAmount" class="input-field w-full rounded-lg px-3 py-2 text-sm" placeholder="0" step="100">
          </div>
          <div class="flex gap-2">
            <button onclick="setPercent('25%')" class="flex-1 text-xs py-1 card rounded text-gray-400 hover:text-yellow-400 hover:border-yellow-500 transition-all">25%</button>
            <button onclick="setPercent('50%')" class="flex-1 text-xs py-1 card rounded text-gray-400 hover:text-yellow-400 hover:border-yellow-500 transition-all">50%</button>
            <button onclick="setPercent('75%')" class="flex-1 text-xs py-1 card rounded text-gray-400 hover:text-yellow-400 hover:border-yellow-500 transition-all">75%</button>
            <button onclick="setPercent('100%')" class="flex-1 text-xs py-1 card rounded text-gray-400 hover:text-yellow-400 hover:border-yellow-500 transition-all">100%</button>
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1 block">總額 (USDT)</label>
            <input type="number" id="tradeInputTotal" class="input-field w-full rounded-lg px-3 py-2 text-sm" placeholder="0" readonly>
          </div>
          <div class="flex justify-between text-xs text-gray-500">
            <span>手續費</span><span>0.1%</span>
          </div>
          <button onclick="placeOrder()" id="tradeSubmitBtn" class="btn-primary w-full py-3 rounded-xl font-bold text-sm">
            <i class="fas fa-check mr-2"></i>買入 BYB
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Trades -->
    <div class="grid lg:grid-cols-2 gap-4 mt-4">
      <div class="card rounded-xl p-4">
        <div class="font-semibold text-sm mb-3">最新成交</div>
        <div class="grid grid-cols-3 text-xs text-gray-500 mb-2">
          <span>時間</span><span class="text-center">價格(USDT)</span><span class="text-right">數量(BYB)</span>
        </div>
        <div id="tradesList" class="space-y-1 scrollbar-thin overflow-y-auto" style="max-height:200px"></div>
      </div>
      <div class="card rounded-xl p-4">
        <div class="font-semibold text-sm mb-3">我的訂單 <span class="text-xs text-gray-500">(需連接錢包)</span></div>
        <div class="text-center py-10 text-gray-600">
          <i class="fas fa-wallet text-3xl mb-3 block"></i>
          <div class="text-sm">請連接 MetaMask 或 TrustWallet</div>
          <button onclick="connectWallet()" class="btn-primary px-4 py-2 rounded-lg text-sm mt-3">連接錢包</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ══════════════════ NFT PAGE ══════════════════ -->
<div id="page-nft" class="page-section hidden">
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-black">NFT 市場</h2>
        <p class="text-gray-400 text-sm">文娛 · 文創 · 治理 · GameFi — 真實收益支撐的數字資產</p>
      </div>
      <div class="flex gap-3">
        <select id="nftFilter" onchange="filterNFTs()" class="input-field px-3 py-2 rounded-lg text-sm">
          <option value="all">全部分類</option>
          <option value="文娛">文娛</option>
          <option value="文創">文創</option>
          <option value="治理">治理</option>
          <option value="GameFi">GameFi</option>
        </select>
        <select id="nftSort" onchange="filterNFTs()" class="input-field px-3 py-2 rounded-lg text-sm">
          <option value="price-asc">價格 ↑</option>
          <option value="price-desc">價格 ↓</option>
          <option value="holders">持有人數</option>
        </select>
      </div>
    </div>
    <!-- NFT Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="card rounded-xl p-4 text-center">
        <div class="text-xl font-bold gold">8</div>
        <div class="text-xs text-gray-500 mt-1">系列總數</div>
      </div>
      <div class="card rounded-xl p-4 text-center">
        <div class="text-xl font-bold text-white">15,832</div>
        <div class="text-xs text-gray-500 mt-1">已發行 NFT</div>
      </div>
      <div class="card rounded-xl p-4 text-center">
        <div class="text-xl font-bold text-white">2,312</div>
        <div class="text-xs text-gray-500 mt-1">持有者</div>
      </div>
      <div class="card rounded-xl p-4 text-center">
        <div class="text-xl font-bold text-white">456 BNB</div>
        <div class="text-xs text-gray-500 mt-1">累計交易額</div>
      </div>
    </div>
    <div id="nftGrid" class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"></div>
  </div>
</div>

<!-- ══════════════════ DAO PAGE ══════════════════ -->
<div id="page-dao" class="page-section hidden">
  <div class="max-w-5xl mx-auto px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-black">DAO 治理</h2>
        <p class="text-gray-400 text-sm">持有 BYB NFT 即可參與鏈上提案與投票</p>
      </div>
      <button onclick="showNewProposal()" class="btn-primary px-4 py-2 rounded-lg text-sm font-bold">
        <i class="fas fa-plus mr-2"></i>新增提案
      </button>
    </div>
    <!-- DAO Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="card rounded-xl p-4 text-center">
        <div class="text-xl font-bold gold">47</div>
        <div class="text-xs text-gray-500">歷史提案</div>
      </div>
      <div class="card rounded-xl p-4 text-center">
        <div class="text-xl font-bold text-green">2</div>
        <div class="text-xs text-gray-500">進行中</div>
      </div>
      <div class="card rounded-xl p-4 text-center">
        <div class="text-xl font-bold text-white">38,500</div>
        <div class="text-xs text-gray-500">投票 NFT 數</div>
      </div>
      <div class="card rounded-xl p-4 text-center">
        <div class="text-xl font-bold text-white">91.2%</div>
        <div class="text-xs text-gray-500">通過率</div>
      </div>
    </div>
    <!-- Proposals -->
    <div id="proposalList" class="space-y-4"></div>
    
    <!-- Info Box -->
    <div class="card rounded-xl p-5 mt-6 border-yellow-700" style="border-color:rgba(240,185,11,0.3)">
      <div class="flex items-start gap-3">
        <i class="fas fa-info-circle gold mt-0.5"></i>
        <div>
          <div class="font-semibold mb-1">DAO 治理規則</div>
          <ul class="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>持有 BYB NFT（治理 NFT）即可參與投票，每個 NFT 代表一票</li>
            <li>提案需在 7 天內達到 10,000 票門檻方可生效</li>
            <li>核心治理事項：回購銷毀、新 NFT 發行、合作項目准入</li>
            <li>所有投票記錄永久上鏈，透明可查</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ══════════════════ STAKING PAGE ══════════════════ -->
<div id="page-staking" class="page-section hidden">
  <div class="max-w-5xl mx-auto px-4 py-6">
    <div class="mb-6">
      <h2 class="text-2xl font-black">BYB 質押</h2>
      <p class="text-gray-400 text-sm">質押 BYB 獲得真實資產收益分潤，鎖倉期越長收益越高</p>
    </div>
    <!-- Staking Stats -->
    <div class="grid md:grid-cols-3 gap-5 mb-6">
      <div class="card rounded-xl p-5">
        <div class="text-sm text-gray-500 mb-1">總質押量</div>
        <div class="text-2xl font-black gold">320,000,000</div>
        <div class="text-xs text-gray-500">BYB (24.6% 供應量)</div>
      </div>
      <div class="card rounded-xl p-5">
        <div class="text-sm text-gray-500 mb-1">本季 RWA 分潤池</div>
        <div class="text-2xl font-black text-green">$148,500</div>
        <div class="text-xs text-gray-500">來自文娛+文創真實收益</div>
      </div>
      <div class="card rounded-xl p-5">
        <div class="text-sm text-gray-500 mb-1">最高年化收益率</div>
        <div class="text-2xl font-black gold">28.5% APY</div>
        <div class="text-xs text-gray-500">180天鎖倉 (真實資產分潤)</div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-5">
      <!-- Stake Form -->
      <div class="card rounded-xl p-5">
        <div class="font-bold mb-4">質押 BYB</div>
        <div class="space-y-4">
          <div>
            <label class="text-xs text-gray-500 mb-2 block">選擇鎖倉週期</label>
            <div class="grid grid-cols-2 gap-2">
              <button onclick="selectStakePeriod('30天')" class="stake-period-btn card p-3 rounded-lg text-center hover:border-yellow-500 transition-all" data-period="30天">
                <div class="font-bold text-sm">30天</div>
                <div class="text-green text-xs mt-1">8.5% APY</div>
              </button>
              <button onclick="selectStakePeriod('60天')" class="stake-period-btn card p-3 rounded-lg text-center hover:border-yellow-500 transition-all" data-period="60天">
                <div class="font-bold text-sm">60天</div>
                <div class="text-green text-xs mt-1">14.2% APY</div>
              </button>
              <button onclick="selectStakePeriod('90天')" class="stake-period-btn card p-3 rounded-lg text-center hover:border-yellow-500 transition-all" data-period="90天">
                <div class="font-bold text-sm">90天</div>
                <div class="text-green text-xs mt-1">19.8% APY</div>
              </button>
              <button onclick="selectStakePeriod('180天')" class="stake-period-btn card p-3 rounded-lg text-center hover:border-yellow-500 transition-all" data-period="180天">
                <div class="font-bold text-sm">180天</div>
                <div class="text-green text-xs mt-1">28.5% APY</div>
              </button>
            </div>
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1 block">質押數量 (BYB)</label>
            <input type="number" id="stakeAmount" class="input-field w-full rounded-lg px-3 py-2 text-sm" placeholder="最少 1,000 BYB">
          </div>
          <div class="card rounded-lg p-3 text-sm space-y-2" style="background:#0d0f12">
            <div class="flex justify-between"><span class="text-gray-500">預計季度收益</span><span class="text-green font-medium" id="estReward">-- USDT</span></div>
            <div class="flex justify-between"><span class="text-gray-500">解鎖日期</span><span id="unlockDate">--</span></div>
            <div class="flex justify-between"><span class="text-gray-500">收益來源</span><span class="gold text-xs">RWA 真實資產分潤</span></div>
          </div>
          <button onclick="stakeTokens()" class="btn-primary w-full py-3 rounded-xl font-bold">
            <i class="fas fa-lock mr-2"></i>確認質押
          </button>
        </div>
      </div>

      <!-- My Stakes -->
      <div class="card rounded-xl p-5">
        <div class="font-bold mb-4">我的質押記錄</div>
        <div class="text-center py-10 text-gray-600">
          <i class="fas fa-wallet text-3xl mb-3 block"></i>
          <div class="text-sm mb-3">連接錢包後查看質押記錄</div>
          <button onclick="connectWallet()" class="btn-primary px-4 py-2 rounded-lg text-sm">連接錢包</button>
        </div>
      </div>
    </div>

    <!-- Staking Tiers -->
    <div class="card rounded-xl p-5 mt-5">
      <div class="font-bold mb-4">收益分潤機制</div>
      <div class="grid md:grid-cols-4 gap-4 text-center text-sm">
        <div class="p-3 rounded-lg" style="background:#0d0f12">
          <div class="text-2xl mb-1">🥉</div>
          <div class="font-bold">青銅</div>
          <div class="text-xs text-gray-500 mt-1">1,000 ~ 10,000 BYB</div>
          <div class="text-green text-xs mt-2">基礎分潤</div>
        </div>
        <div class="p-3 rounded-lg" style="background:#0d0f12">
          <div class="text-2xl mb-1">🥈</div>
          <div class="font-bold">白銀</div>
          <div class="text-xs text-gray-500 mt-1">10,000 ~ 100,000 BYB</div>
          <div class="text-green text-xs mt-2">1.5x 分潤</div>
        </div>
        <div class="p-3 rounded-lg" style="background:#0d0f12">
          <div class="text-2xl mb-1">🥇</div>
          <div class="font-bold">黃金</div>
          <div class="text-xs text-gray-500 mt-1">100,000 ~ 1,000,000 BYB</div>
          <div class="text-green text-xs mt-2">2x 分潤 + DAO 加權</div>
        </div>
        <div class="p-3 rounded-lg border border-yellow-600" style="background:#1a1100">
          <div class="text-2xl mb-1">💎</div>
          <div class="font-bold gold">鑽石</div>
          <div class="text-xs text-gray-500 mt-1">1,000,000+ BYB</div>
          <div class="text-green text-xs mt-2">3x 分潤 + VIP 特權</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ══════════════════ PORTFOLIO PAGE ══════════════════ -->
<div id="page-portfolio" class="page-section hidden">
  <div class="max-w-5xl mx-auto px-4 py-6">
    <h2 class="text-2xl font-black mb-6">我的資產組合</h2>
    <div class="text-center py-20 card rounded-xl">
      <div class="text-6xl mb-4">🔐</div>
      <div class="text-xl font-bold mb-2">連接您的 Web3 錢包</div>
      <div class="text-gray-400 text-sm mb-6 max-w-md mx-auto">請連接 MetaMask、TrustWallet 或其他 BSC 相容錢包，以查看您的 BYB 資產、NFT 持倉及質押記錄</div>
      <div class="flex justify-center gap-4 flex-wrap">
        <button onclick="connectWallet('metamask')" class="card hover:border-yellow-500 rounded-xl p-4 flex items-center gap-3 transition-all cursor-pointer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" class="w-8 h-8" onerror="this.style.display='none'">
          <span class="font-semibold">MetaMask</span>
        </button>
        <button onclick="connectWallet('trustwallet')" class="card hover:border-yellow-500 rounded-xl p-4 flex items-center gap-3 transition-all cursor-pointer">
          <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">TW</div>
          <span class="font-semibold">TrustWallet</span>
        </button>
        <button onclick="connectWallet('walletconnect')" class="card hover:border-yellow-500 rounded-xl p-4 flex items-center gap-3 transition-all cursor-pointer">
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">WC</div>
          <span class="font-semibold">WalletConnect</span>
        </button>
      </div>
    </div>
  </div>
</div>

<!-- ══════════════════ WALLET MODAL ══════════════════ -->
<div id="walletModal" class="hidden fixed inset-0 z-50 flex items-center justify-center modal-overlay" onclick="closeModal(event,'walletModal')">
  <div class="card rounded-2xl p-6 w-full max-w-md mx-4" onclick="event.stopPropagation()">
    <div class="flex justify-between items-center mb-5">
      <div class="font-bold text-lg">連接 Web3 錢包</div>
      <button onclick="document.getElementById('walletModal').classList.add('hidden')" class="text-gray-500 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700">✕</button>
    </div>
    <p class="text-sm text-gray-400 mb-5">選擇您的錢包類型，確保已切換到 <strong class="gold">幣安智能鏈 (BSC)</strong> 網絡 (Chain ID: 56)</p>
    <div class="space-y-3">
      <button onclick="connectWalletType('MetaMask')" class="w-full card hover:border-yellow-500 rounded-xl p-4 flex items-center gap-4 transition-all text-left">
        <div class="w-10 h-10 rounded-xl bg-orange-500 bg-opacity-20 flex items-center justify-center text-2xl">🦊</div>
        <div><div class="font-semibold">MetaMask</div><div class="text-xs text-gray-500">最受歡迎的 Web3 錢包</div></div>
        <i class="fas fa-chevron-right ml-auto text-gray-600"></i>
      </button>
      <button onclick="connectWalletType('TrustWallet')" class="w-full card hover:border-yellow-500 rounded-xl p-4 flex items-center gap-4 transition-all text-left">
        <div class="w-10 h-10 rounded-xl bg-blue-500 bg-opacity-20 flex items-center justify-center text-2xl">🛡️</div>
        <div><div class="font-semibold">TrustWallet</div><div class="text-xs text-gray-500">手機用戶首選</div></div>
        <i class="fas fa-chevron-right ml-auto text-gray-600"></i>
      </button>
      <button onclick="connectWalletType('WalletConnect')" class="w-full card hover:border-yellow-500 rounded-xl p-4 flex items-center gap-4 transition-all text-left">
        <div class="w-10 h-10 rounded-xl bg-blue-600 bg-opacity-20 flex items-center justify-center text-2xl">🔗</div>
        <div><div class="font-semibold">WalletConnect</div><div class="text-xs text-gray-500">掃碼連接任意錢包</div></div>
        <i class="fas fa-chevron-right ml-auto text-gray-600"></i>
      </button>
      <button onclick="connectWalletType('OKX')" class="w-full card hover:border-yellow-500 rounded-xl p-4 flex items-center gap-4 transition-all text-left">
        <div class="w-10 h-10 rounded-xl bg-gray-500 bg-opacity-20 flex items-center justify-center font-black text-white">OKX</div>
        <div><div class="font-semibold">OKX Wallet</div><div class="text-xs text-gray-500">OKX 交易所內建錢包</div></div>
        <i class="fas fa-chevron-right ml-auto text-gray-600"></i>
      </button>
    </div>
    <div class="mt-4 p-3 rounded-lg text-xs text-gray-500" style="background:#0d0f12">
      <i class="fas fa-shield-alt gold mr-1"></i>
      連接錢包不會授權任何資金轉移，您的私鑰始終在本地保存
    </div>
  </div>
</div>

<!-- ══════════════════ NFT DETAIL MODAL ══════════════════ -->
<div id="nftModal" class="hidden fixed inset-0 z-50 flex items-center justify-center modal-overlay" onclick="closeModal(event,'nftModal')">
  <div class="card rounded-2xl p-6 w-full max-w-lg mx-4" onclick="event.stopPropagation()">
    <div class="flex justify-between items-center mb-4">
      <div class="font-bold text-lg" id="nftModalTitle">NFT 詳情</div>
      <button onclick="document.getElementById('nftModal').classList.add('hidden')" class="text-gray-500 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700">✕</button>
    </div>
    <div id="nftModalContent"></div>
  </div>
</div>

<!-- ══════════════════ TOAST ══════════════════ -->
<div id="toast" class="hidden fixed bottom-6 right-6 z-50 flex items-center gap-3 card rounded-xl px-4 py-3 shadow-2xl" style="min-width:260px">
  <span id="toastIcon" class="text-xl"></span>
  <span id="toastMsg" class="text-sm"></span>
</div>

<script>
// ═══════════════════ STATE ═══════════════════
let currentPage = 'home'
let currentPair = 'BYB/USDT'
let currentTab = 'buy'
let currentOrderType = 'limit'
let currentStakePeriod = '90天'
let priceData = []
let nftData = []
let walletConnected = false
let walletAddress = ''
let priceChart = null
let miniChartInst = null

// ═══════════════════ INIT ═══════════════════
document.addEventListener('DOMContentLoaded', () => {
  showPage('home')
  loadPrice()
  loadStats()
  setInterval(loadPrice, 8000)
  initMiniChart()
  initPriceChart()
  loadOrderBook()
  loadTrades()
  loadNFTs()
  loadProposals()
  setInterval(loadOrderBook, 5000)
  setInterval(loadTrades, 10000)
  setInterval(() => {
    loadPrice()
    if (priceChart) updatePriceChart()
  }, 8000)
})

// ═══════════════════ PAGE NAV ═══════════════════
function showPage(name) {
  document.querySelectorAll('.page-section').forEach(p => p.classList.add('hidden'))
  const el = document.getElementById('page-' + name)
  if (el) el.classList.remove('hidden')
  currentPage = name
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.remove('text-yellow-400', 'bg-gray-800')
    if (b.dataset.page === name) b.classList.add('text-yellow-400', 'bg-gray-800')
  })
  window.scrollTo(0, 0)
}

// ═══════════════════ PRICE & STATS ═══════════════════
async function loadPrice() {
  try {
    const r = await axios.get('/api/price')
    const d = r.data
    const p = parseFloat(d.price)
    const ch = parseFloat(d.change24h)
    const chCls = ch >= 0 ? 'text-green' : 'text-red'
    const chStr = (ch >= 0 ? '+' : '') + ch + '%'

    setEl('heroPrice', '$' + p.toFixed(6))
    setEl('heroPriceCard', '$' + p.toFixed(6))
    setEl('heroChange', chStr, chCls)
    setEl('heroHigh', '$' + d.high24h)
    setEl('heroLow', '$' + d.low24h)
    setEl('heroVol', shortenNum(d.volume24h))
    setEl('statPrice', '$' + p.toFixed(4))
    setEl('tradePrice', '$' + p.toFixed(6))
    setEl('tradeChange', chStr, chCls)
    setEl('tradeHigh', '$' + d.high24h)
    setEl('tradeLow', '$' + d.low24h)
    setEl('tradeVol', shortenNum(d.volume24h))
    if (document.getElementById('tradeInputPrice').value === '') {
      document.getElementById('tradeInputPrice').placeholder = p.toFixed(6)
    }
  } catch(e) {}
}

async function loadStats() {
  try {
    const r = await axios.get('/api/stats')
    const d = r.data
    setEl('heroUsers', parseInt(d.totalUsers).toLocaleString())
    setEl('heroNFT', parseInt(d.nftTraded).toLocaleString())
    setEl('statVol', '$' + parseFloat(d.totalVolume.replace(/,/g,'')).toLocaleString())
    setEl('statBurned', shortenNum(d.bybBurned.replace(/,/g,'')))
    setEl('statDAO', d.daoProposals)
  } catch(e) {}
}

// ═══════════════════ CHARTS ═══════════════════
function initMiniChart() {
  const ctx = document.getElementById('miniChart')
  if (!ctx) return
  const data = generateChartData(24, 0.002850, 0.0001)
  miniChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_,i) => i),
      datasets: [{
        data: data,
        borderColor: '#F0B90B',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        backgroundColor: (ctx2) => {
          const g = ctx2.chart.ctx.createLinearGradient(0, 0, 0, 80)
          g.addColorStop(0, 'rgba(240,185,11,0.3)')
          g.addColorStop(1, 'rgba(240,185,11,0)')
          return g
        },
        tension: 0.4
      }]
    },
    options: { responsive: true, animation: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
  })
}

function initPriceChart() {
  const ctx = document.getElementById('priceChart')
  if (!ctx) return
  priceData = generateChartData(60, 0.002850, 0.0002)
  const labels = priceData.map((_,i) => {
    const t = new Date(Date.now() - (60-i) * 3600000)
    return t.getHours() + ':00'
  })
  priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: priceData,
        borderColor: '#F0B90B',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        backgroundColor: (ctx2) => {
          const g = ctx2.chart.ctx.createLinearGradient(0, 0, 0, 300)
          g.addColorStop(0, 'rgba(240,185,11,0.15)')
          g.addColorStop(1, 'rgba(240,185,11,0)')
          return g
        },
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 300 },
      plugins: { legend: { display: false }, tooltip: {
        callbacks: {
          label: ctx3 => '$' + ctx3.raw.toFixed(6)
        }
      }},
      scales: {
        x: { grid: { color: 'rgba(43,47,54,0.8)' }, ticks: { color: '#848E9C', maxTicksLimit: 8, font: { size: 10 } } },
        y: { grid: { color: 'rgba(43,47,54,0.8)' }, ticks: { color: '#848E9C', font: { size: 10 }, callback: v => '$' + v.toFixed(5) } }
      }
    }
  })
}

function updatePriceChart() {
  if (!priceChart) return
  const lastPrice = priceData[priceData.length - 1]
  const newPrice = lastPrice * (1 + (Math.random() - 0.49) * 0.005)
  priceData.push(newPrice)
  if (priceData.length > 80) priceData.shift()
  priceChart.data.datasets[0].data = priceData
  priceChart.update('none')
}

function generateChartData(n, base, vol) {
  const data = [base]
  for (let i = 1; i < n; i++) {
    const prev = data[i-1]
    data.push(Math.max(prev * (1 + (Math.random() - 0.49) * vol / base), 0.001))
  }
  return data
}

// ═══════════════════ ORDER BOOK ═══════════════════
async function loadOrderBook() {
  try {
    const r = await axios.get('/api/orderbook')
    const { asks, bids, lastPrice } = r.data
    setEl('obMidPrice', lastPrice)
    
    const asksEl = document.getElementById('asksList')
    const bidsEl = document.getElementById('bidsList')
    if (!asksEl || !bidsEl) return

    const maxAsk = Math.max(...asks.map(a => parseFloat(a.amount)))
    const maxBid = Math.max(...bids.map(b => parseFloat(b.amount)))

    asksEl.innerHTML = asks.map(a => {
      const pct = (parseFloat(a.amount) / maxAsk * 100).toFixed(0)
      return \`<div class="grid grid-cols-3 text-xs px-1 py-0.5 rounded hover:bg-red-900 hover:bg-opacity-20 cursor-pointer relative">
        <div class="absolute inset-0 opacity-10 rounded" style="background:#F6465D;width:\${pct}%;right:0;left:auto;"></div>
        <span class="text-red relative">\${a.price}</span>
        <span class="text-center relative">\${parseInt(a.amount).toLocaleString()}</span>
        <span class="text-right text-gray-500 relative">\${parseFloat(a.total).toFixed(1)}</span>
      </div>\`
    }).join('')
    
    bidsEl.innerHTML = bids.map(b => {
      const pct = (parseFloat(b.amount) / maxBid * 100).toFixed(0)
      return \`<div class="grid grid-cols-3 text-xs px-1 py-0.5 rounded hover:bg-green-900 hover:bg-opacity-20 cursor-pointer relative">
        <div class="absolute inset-0 opacity-10 rounded" style="background:#0ECB81;width:\${pct}%;"></div>
        <span class="text-green relative">\${b.price}</span>
        <span class="text-center relative">\${parseInt(b.amount).toLocaleString()}</span>
        <span class="text-right text-gray-500 relative">\${parseFloat(b.total).toFixed(1)}</span>
      </div>\`
    }).join('')
  } catch(e) {}
}

// ═══════════════════ TRADES ═══════════════════
async function loadTrades() {
  try {
    const r = await axios.get('/api/trades')
    const el = document.getElementById('tradesList')
    if (!el) return
    el.innerHTML = r.data.map(t => \`<div class="grid grid-cols-3 text-xs py-0.5">
      <span class="text-gray-500">\${t.time}</span>
      <span class="text-center \${t.side==='buy'?'text-green':'text-red'}">\${t.price}</span>
      <span class="text-right text-gray-400">\${parseInt(t.amount).toLocaleString()}</span>
    </div>\`).join('')
  } catch(e) {}
}

// ═══════════════════ NFTS ═══════════════════
async function loadNFTs() {
  try {
    const r = await axios.get('/api/nfts')
    nftData = r.data
    renderNFTs(nftData)
  } catch(e) {}
}

function renderNFTs(data) {
  const el = document.getElementById('nftGrid')
  if (!el) return
  const rarityClass = { Legendary: 'badge-legendary', Epic: 'badge-epic', Mythic: 'badge-mythic', Rare: 'badge-rare', Common: 'badge-common' }
  el.innerHTML = data.map(n => \`<div class="nft-card card rounded-xl overflow-hidden cursor-pointer" onclick="showNFTDetail(\${n.id})">
    <div class="flex items-center justify-center text-6xl py-8" style="background:linear-gradient(135deg,#1a1400,#2a2000)">\${n.image}</div>
    <div class="p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs px-2 py-0.5 rounded-full font-bold text-black \${rarityClass[n.rarity]||'badge-common'}">\${n.rarity}</span>
        <span class="text-xs text-gray-500">\${n.category}</span>
      </div>
      <div class="font-semibold text-sm mb-1 truncate">\${n.name}</div>
      <div class="text-xs text-gray-500 mb-3">\${n.yield}</div>
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xs text-gray-500">地板價</div>
          <div class="font-bold gold">\${n.price} BNB</div>
        </div>
        <div class="text-right">
          <div class="text-xs text-gray-500">持有者</div>
          <div class="text-sm text-white">\${n.holders}</div>
        </div>
      </div>
      <button class="btn-primary w-full mt-3 py-2 rounded-lg text-xs font-bold" onclick="event.stopPropagation();buyNFT(\${n.id})">
        <i class="fas fa-shopping-cart mr-1"></i>立即購買
      </button>
    </div>
  </div>\`).join('')
}

function filterNFTs() {
  const cat = document.getElementById('nftFilter').value
  const sort = document.getElementById('nftSort').value
  let filtered = cat === 'all' ? [...nftData] : nftData.filter(n => n.category === cat)
  if (sort === 'price-asc') filtered.sort((a,b) => parseFloat(a.price) - parseFloat(b.price))
  else if (sort === 'price-desc') filtered.sort((a,b) => parseFloat(b.price) - parseFloat(a.price))
  else if (sort === 'holders') filtered.sort((a,b) => b.holders - a.holders)
  renderNFTs(filtered)
}

function showNFTDetail(id) {
  const nft = nftData.find(n => n.id === id)
  if (!nft) return
  const rarityClass = { Legendary: 'badge-legendary', Epic: 'badge-epic', Mythic: 'badge-mythic', Rare: 'badge-rare', Common: 'badge-common' }
  document.getElementById('nftModalTitle').textContent = nft.name
  document.getElementById('nftModalContent').innerHTML = \`
    <div class="text-center text-8xl py-6">\${nft.image}</div>
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs px-3 py-1 rounded-full font-bold text-black \${rarityClass[nft.rarity]}">\${nft.rarity}</span>
        <span class="text-sm text-gray-400">\${nft.category}</span>
      </div>
      <div class="text-xl font-black">\${nft.name}</div>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="card p-3 rounded-lg"><div class="text-gray-500 text-xs mb-1">地板價</div><div class="font-bold gold">\${nft.price} BNB</div></div>
        <div class="card p-3 rounded-lg"><div class="text-gray-500 text-xs mb-1">持有者</div><div class="font-bold">\${nft.holders}</div></div>
        <div class="card p-3 col-span-2 rounded-lg"><div class="text-gray-500 text-xs mb-1">收益類型</div><div class="font-medium text-green">\${nft.yield}</div></div>
      </div>
      <button onclick="buyNFT(\${nft.id})" class="btn-primary w-full py-3 rounded-xl font-bold mt-2">
        <i class="fas fa-shopping-cart mr-2"></i>以 \${nft.price} BNB 購買
      </button>
    </div>
  \`
  document.getElementById('nftModal').classList.remove('hidden')
}

function buyNFT(id) {
  if (!walletConnected) { connectWallet(); return }
  toast('✅', '購買請求已發送至 BSC 鏈，等待確認...', 'green')
}

// ═══════════════════ PROPOSALS ═══════════════════
async function loadProposals() {
  try {
    const r = await axios.get('/api/proposals')
    const el = document.getElementById('proposalList')
    if (!el) return
    el.innerHTML = r.data.map(p => {
      const total = p.votes.yes + p.votes.no
      const yesPct = total > 0 ? (p.votes.yes / total * 100).toFixed(1) : 0
      const noPct = total > 0 ? (p.votes.no / total * 100).toFixed(1) : 0
      const statusColors = { active: 'text-green bg-green-900 bg-opacity-30', passed: 'text-blue-400 bg-blue-900 bg-opacity-30', pending: 'text-yellow-400 bg-yellow-900 bg-opacity-30' }
      const statusLabels = { active: '投票中', passed: '已通過', pending: '待開始' }
      return \`<div class="card rounded-xl p-5">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs px-2 py-0.5 rounded-full font-medium \${statusColors[p.status]}">\${statusLabels[p.status]}</span>
              <span class="text-xs text-gray-500">\${p.category}</span>
            </div>
            <div class="font-bold">\${p.title}</div>
          </div>
          <div class="text-right text-xs text-gray-500 flex-shrink-0 ml-4">結束：\${p.endTime}</div>
        </div>
        \${total > 0 ? \`<div class="space-y-1 mb-3">
          <div class="flex justify-between text-xs mb-0.5"><span class="text-green">贊成 \${yesPct}%</span><span class="text-red">反對 \${noPct}%</span></div>
          <div class="vote-bar"><div class="vote-yes h-full" style="width:\${yesPct}%"></div></div>
          <div class="flex justify-between text-xs text-gray-500"><span>\${p.votes.yes.toLocaleString()} 票</span><span>\${p.votes.no.toLocaleString()} 票</span></div>
        </div>\` : '<div class="text-sm text-gray-500 mb-3">投票尚未開始</div>'}
        \${p.status === 'active' ? \`<div class="flex gap-2">
          <button onclick="vote(\${p.id},'yes')" class="flex-1 py-2 rounded-lg text-sm font-bold bg-green-500 bg-opacity-20 text-green hover:bg-opacity-30 transition-all border border-green-800"><i class="fas fa-thumbs-up mr-1"></i>贊成</button>
          <button onclick="vote(\${p.id},'no')" class="flex-1 py-2 rounded-lg text-sm font-bold bg-red-500 bg-opacity-20 text-red hover:bg-opacity-30 transition-all border border-red-800"><i class="fas fa-thumbs-down mr-1"></i>反對</button>
        </div>\` : ''}
      </div>\`
    }).join('')
  } catch(e) {}
}

function vote(id, side) {
  if (!walletConnected) { connectWallet(); return }
  toast(side === 'yes' ? '✅' : '❌', \`您的投票已記錄到 BSC 鏈上！\`, side === 'yes' ? 'green' : 'red')
}

function showNewProposal() {
  if (!walletConnected) { connectWallet(); return }
  toast('📋', '提案功能需持有 BYB 治理 NFT', 'yellow')
}

// ═══════════════════ WALLET ═══════════════════
function connectWallet(type) {
  if (type) {
    connectWalletType(type)
    return
  }
  document.getElementById('walletModal').classList.remove('hidden')
}

async function connectWalletType(type) {
  document.getElementById('walletModal').classList.add('hidden')
  
  if (type === 'MetaMask' && typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      
      if (chainId !== '0x38') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }]
          })
        } catch(switchErr) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: '0x38', chainName: 'Binance Smart Chain', nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }, rpcUrls: ['https://bsc-dataseed.binance.org/'], blockExplorerUrls: ['https://bscscan.com/'] }]
          })
        }
      }
      
      walletAddress = accounts[0]
      walletConnected = true
      onWalletConnected(walletAddress, type)
    } catch(err) {
      toast('❌', '錢包連接被拒絕', 'red')
    }
  } else {
    const mockAddr = '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0')
    walletAddress = mockAddr
    walletConnected = true
    onWalletConnected(mockAddr, type)
  }
}

function onWalletConnected(addr, type) {
  const short = addr.slice(0, 6) + '...' + addr.slice(-4)
  const btn = document.getElementById('connectBtn')
  btn.innerHTML = \`<i class="fas fa-check-circle mr-1 text-green-400"></i>\${short}\`
  btn.style.background = 'rgba(14,203,129,0.1)'
  btn.style.border = '1px solid rgba(14,203,129,0.3)'
  btn.style.color = '#0ECB81'
  toast('🎉', \`\${type} 連接成功！BSC 網絡已確認\`, 'green')
}

// ═══════════════════ TRADE ═══════════════════
function setPair(pair) {
  currentPair = pair
  document.querySelectorAll('.pair-btn').forEach(b => {
    b.classList.toggle('border-yellow-500', b.dataset.pair === pair)
    b.classList.toggle('text-yellow-400', b.dataset.pair === pair)
    b.classList.toggle('text-gray-400', b.dataset.pair !== pair)
  })
}

function setTradeTab(tab) {
  currentTab = tab
  const buyBtn = document.getElementById('tabBuy')
  const sellBtn = document.getElementById('tabSell')
  const submitBtn = document.getElementById('tradeSubmitBtn')
  if (tab === 'buy') {
    buyBtn.className = 'flex-1 py-2 text-sm font-bold bg-green-500 bg-opacity-20 text-green-400 border-b-2 border-green-400'
    sellBtn.className = 'flex-1 py-2 text-sm font-bold text-gray-500'
    submitBtn.textContent = '買入 BYB'
    submitBtn.style.background = '#0ECB81'
    submitBtn.style.color = '#000'
  } else {
    buyBtn.className = 'flex-1 py-2 text-sm font-bold text-gray-500'
    sellBtn.className = 'flex-1 py-2 text-sm font-bold bg-red-500 bg-opacity-20 text-red-400 border-b-2 border-red-400'
    submitBtn.textContent = '賣出 BYB'
    submitBtn.style.background = '#F6465D'
    submitBtn.style.color = '#fff'
  }
}

function setOrderType(type) {
  currentOrderType = type
  document.querySelectorAll('.order-type-btn').forEach(b => {
    const isActive = b.dataset.type === type
    b.className = 'order-type-btn text-xs px-3 py-1.5 rounded card ' + (isActive ? 'border border-yellow-500 text-yellow-400' : 'text-gray-500')
  })
}

function setTimeframe(tf) {
  document.querySelectorAll('.timeframe-btn').forEach(b => {
    b.className = 'timeframe-btn text-xs px-2 py-1 rounded ' + (b.textContent === tf ? 'gold-bg text-black font-bold' : 'text-gray-500 hover:text-white')
  })
  priceData = generateChartData(60, 0.002850, 0.0002)
  if (priceChart) { priceChart.data.datasets[0].data = priceData; priceChart.update() }
}

function setPercent(pct) {
  const balance = 1000
  const num = parseInt(pct)
  const price = parseFloat(document.getElementById('tradeInputPrice').value) || 0.00285
  const total = balance * num / 100
  const amount = (total / price).toFixed(0)
  document.getElementById('tradeInputAmount').value = amount
  document.getElementById('tradeInputTotal').value = total.toFixed(2)
}

document.addEventListener('input', function(e) {
  if (e.target.id === 'tradeInputAmount' || e.target.id === 'tradeInputPrice') {
    const price = parseFloat(document.getElementById('tradeInputPrice').value) || 0
    const amount = parseFloat(document.getElementById('tradeInputAmount').value) || 0
    document.getElementById('tradeInputTotal').value = (price * amount).toFixed(4)
  }
})

function placeOrder() {
  if (!walletConnected) { connectWallet(); return }
  const price = document.getElementById('tradeInputPrice').value
  const amount = document.getElementById('tradeInputAmount').value
  if (!price || !amount) { toast('⚠️', '請填寫價格和數量', 'yellow'); return }
  toast('✅', \`\${currentTab === 'buy' ? '買入' : '賣出'}訂單已提交到 BSC 鏈，等待成交...\`, 'green')
}

// ═══════════════════ STAKING ═══════════════════
function selectStakePeriod(period) {
  currentStakePeriod = period
  document.querySelectorAll('.stake-period-btn').forEach(b => {
    b.className = 'stake-period-btn card p-3 rounded-lg text-center transition-all ' + (b.dataset.period === period ? 'border-2 border-yellow-500' : 'hover:border-yellow-500')
  })
  updateStakeEstimate()
}

function updateStakeEstimate() {
  const amount = parseFloat(document.getElementById('stakeAmount').value) || 0
  const apyMap = { '30天': 0.085, '60天': 0.142, '90天': 0.198, '180天': 0.285 }
  const daysMap = { '30天': 30, '60天': 60, '90天': 90, '180天': 180 }
  const price = 0.00285
  const apy = apyMap[currentStakePeriod] || 0.198
  const days = daysMap[currentStakePeriod] || 90
  const reward = amount * price * apy * (days / 365)
  const unlockDate = new Date(Date.now() + days * 86400000).toLocaleDateString('zh-TW')
  setEl('estReward', reward > 0 ? '$' + reward.toFixed(4) : '-- USDT')
  setEl('unlockDate', amount > 0 ? unlockDate : '--')
}

document.addEventListener('input', function(e) {
  if (e.target.id === 'stakeAmount') updateStakeEstimate()
})

function stakeTokens() {
  if (!walletConnected) { connectWallet(); return }
  const amount = document.getElementById('stakeAmount').value
  if (!amount || amount < 1000) { toast('⚠️', '最少質押 1,000 BYB', 'yellow'); return }
  toast('🔒', \`\${parseFloat(amount).toLocaleString()} BYB 質押成功！收益將於每季度發放\`, 'green')
}

// ═══════════════════ HELPERS ═══════════════════
function setEl(id, text, cls) {
  const el = document.getElementById(id)
  if (!el) return
  el.textContent = text
  if (cls) el.className = cls
}

function shortenNum(n) {
  const num = typeof n === 'string' ? parseFloat(n.replace(/,/g,'')) : n
  if (num >= 1e9) return '$' + (num/1e9).toFixed(2) + 'B'
  if (num >= 1e6) return '$' + (num/1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num/1e3).toFixed(1) + 'K'
  return num.toString()
}

function toast(icon, msg, color) {
  const el = document.getElementById('toast')
  const colors = { green: '#0ECB81', yellow: '#F0B90B', red: '#F6465D' }
  document.getElementById('toastIcon').textContent = icon
  document.getElementById('toastMsg').textContent = msg
  document.getElementById('toastMsg').style.color = colors[color] || '#fff'
  el.classList.remove('hidden')
  setTimeout(() => el.classList.add('hidden'), 4000)
}

function closeModal(e, id) {
  if (e.target.id === id) document.getElementById(id).classList.add('hidden')
}

function showNotification() {
  toast('🔔', '暫無新通知，請關注官方 Telegram 獲取最新消息', 'yellow')
}
</script>
</body>
</html>`)
})

export default app
