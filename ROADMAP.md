# TradeWatch - Vibe Coding Roadmap

> Monad Hackathon MVP - Faz faz geliştirme rehberi
> Her fazda ilgili prompt'u kopyala, Claude'a yapıştır, sonucu kontrol et, sonraki faza geç.

---

## FAZ 0 - Proje Altyapısı ve Bağımlılıklar

**Amaç:** Tüm gerekli paketleri kur, klasör yapısını oluştur, Monad testnet chain config'ini ayarla.

### Prompt 0.1 - Bağımlılıkları Kur

```
Projeye aşağıdaki bağımlılıkları kur:

Frontend:
- wagmi (Ethereum React hooks)
- viem (Ethereum client)
- @tanstack/react-query (wagmi peer dependency)
- @rainbow-me/rainbowkit (cüzdan bağlantısı)
- lucide-react (ikonlar)
- recharts (grafik/chart)

Smart Contract (ayrı klasör):
- Proje kökünde "contracts" klasörü oluştur
- Hardhat veya Foundry değil, sade Solidity dosyaları olsun (compile ve deploy için sonra script yazacağız)

Klasör yapısı şu şekilde olsun:
/app
  /components (UI bileşenleri)
  /config (chain config, contract addresses, ABI'ler)
  /hooks (custom React hooks)
  /lib (utility fonksiyonlar)
  /types (TypeScript tipleri)
/contracts (Solidity dosyaları)
/public (statik dosyalar, logo vs.)

Tailwind zaten kurulu, dokunma. globals.css'e koyu tema (dark mode) için Monad'ın marka renklerini ekle:
- Primary: #836EF9 (Monad mor)
- Secondary: #1A1B23 (koyu arkaplan)
- Accent: #00D4AA (yeşil/teal vurgu)
- Danger: #FF4757 (kırmızı)
- Surface: #12131A (kart arkaplanı)
```

### Prompt 0.2 - Wagmi ve Monad Testnet Config

```
app/config/wagmi.ts dosyasını oluştur:

1. Monad testnet chain tanımı yap (viem'in defineChain fonksiyonu ile):
   - Chain ID: 10143
   - Adı: Monad Testnet
   - RPC: https://testnet-rpc.monad.xyz
   - Block Explorer: https://testnet.monadexplorer.com
   - Native currency: MON (decimals: 18)

2. Wagmi config oluştur:
   - Transport olarak http kullan
   - RainbowKit için getDefaultConfig kullan
   - projectId: "tradewatch-hackathon" (placeholder)

3. app/providers.tsx oluştur:
   - WagmiProvider, QueryClientProvider, RainbowKitProvider'ı wrap et
   - darkTheme kullan

4. app/layout.tsx'i güncelle:
   - Providers component'ini ekle
   - Font olarak Inter veya Geist kullan
   - HTML'de dark class ekle
   - Sayfa title: "TradeWatch | Parallel Copy Trading on Monad"
```

---

## FAZ 1 - Landing Page (Ana Sayfa)

**Amaç:** Etkileyici, modern bir landing page. Jüri ilk bunu görecek.

### Prompt 1.1 - Hero Section ve Layout

```
app/page.tsx dosyasını sıfırdan yaz. TradeWatch için etkileyici bir landing page oluştur.

Genel tasarım: Koyu tema, Monad mor (#836EF9) vurgulu, modern DeFi protokol estetiği.

Bileşenler:

1. Navbar (app/components/Navbar.tsx):
   - Sol: TradeWatch logosu (text logo yeterli, kalın font)
   - Orta: Linkler -> "Leaderboard", "How It Works", "Docs" (hepsi # link)
   - Sağ: RainbowKit ConnectButton (cüzdan bağla butonu)
   - Sticky, blur arkaplan (backdrop-blur)

2. Hero Section:
   - Büyük başlık: "Copy the Best. Trade in Parallel."
   - Alt başlık: "TradeWatch leverages Monad's 10,000 TPS parallel execution to mirror top traders' strategies — instantly, with zero state conflicts."
   - CTA butonları: "Start Copying" (mor, parlak) ve "Become a Leader" (outline)
   - Sağ tarafta veya altta: Basit bir animasyonlu görsel veya grid pattern

3. Stats Bar:
   - 3-4 metrik yan yana: "10,000 TPS", "Parallel Execution", "$0.001 Gas", "Real-time Analytics"
   - Hafif border ile ayrılmış, ikon + rakam + açıklama

4. "How It Works" Section:
   - 3 adımlı yatay kart:
     - Adım 1: "Choose a Leader" - Liderlik tablosundan en iyi traderları incele
     - Adım 2: "Set Your Limits" - Risk toleransını ve sermayeni belirle
     - Adım 3: "Auto-Copy Trades" - Lider trade açtığında senin kasan paralel olarak aynı işlemi yapar
   - Her kartta basit bir ikon (lucide-react)

5. Footer:
   - Basit, "Built for Monad Hackathon 2025" + sosyal linkler (placeholder)

Tüm bileşenler responsive olsun (mobile-first). Tailwind kullan, ekstra CSS yazma.
```

---

## FAZ 2 - Leaderboard Sayfası

**Amaç:** Lider traderların sıralandığı, filtrelendiği ana sayfa. Mock data ile çalışacak.

### Prompt 2.1 - Leaderboard UI

```
app/leaderboard/page.tsx oluştur. Lider traderların listelendiği tam bir leaderboard sayfası yap.

1. app/lib/mock-data.ts dosyası oluştur. 10 adet sahte lider trader verisi:
   - address (kısaltılmış cüzdan adresi: 0x1234...abcd)
   - username (opsiyonel takma ad)
   - avatar (gradient veya placeholder)
   - totalPnL (toplam kar/zarar, USD)
   - winRate (% kazanma oranı)
   - totalTrades (toplam işlem sayısı)
   - followers (takipçi sayısı)
   - maxDrawdown (% en büyük düşüş)
   - weeklyROI (haftalık getiri %)
   - isVerified (doğrulanmış mı)
   - riskLevel ("Low" | "Medium" | "High")

   Verileri çeşitli yap: bazıları çok karlı, bazıları orta, bazıları yüksek riskli.

2. Sayfa yapısı:
   - Üstte: Sayfa başlığı "Leaderboard" + kısa açıklama
   - Filtre bar: Zaman aralığı (7d/30d/All), Risk seviyesi (Low/Med/High), Sıralama (PnL/WinRate/Followers)
   - Filtreler çalışsın (useState ile client-side filtreleme)

3. Lider kartları (app/components/LeaderCard.tsx):
   - Her lider bir kart olarak gösterilsin (grid layout, 1-2-3 kolon responsive)
   - Üst kısım: Avatar (renkli gradient daire) + username/address + verified badge
   - Orta kısım: PnL (yeşil/kırmızı renkli), Win Rate, Followers
   - Alt kısım: Küçük sparkline chart (recharts ile basit çizgi grafik - son 7 günlük sahte PnL verisi)
   - CTA: "Copy This Trader" butonu (mor, her kartta)

4. Kart hover efekti: border glow (Monad mor)

"use client" direktifini unutma. Tüm filtreleme client-side olacak.
```

---

## FAZ 3 - Trader Detay ve Vault Sayfası

**Amaç:** Bir lidere tıklayınca açılan detay sayfası + takipçinin vault oluşturma/yönetme arayüzü.

### Prompt 3.1 - Trader Detay Sayfası

```
app/trader/[address]/page.tsx oluştur. Bir lider trader'ın detay sayfası.

Sayfa dinamik route ile çalışsın. address parametresinden mock-data'daki ilgili trader'ı bul.

Bölümler:

1. Trader Header:
   - Büyük avatar + isim/adres + verified badge
   - Yanında: Toplam PnL, Win Rate, Takipçi sayısı, Aktif gün sayısı
   - "Copy This Trader" büyük CTA butonu

2. Performance Chart (app/components/PerformanceChart.tsx):
   - recharts ile büyük bir alan grafiği (AreaChart)
   - Son 30 günlük kümülatif PnL verisi (mock, rastgele ama yukarı trendli)
   - Zaman filtresi: 7D / 30D / 90D / ALL (butonlar, tıklanınca state değişsin)
   - Yeşil gradient fill

3. Stats Grid:
   - 6 metrik kartı (2x3 grid):
     - Total PnL | Win Rate | Total Trades
     - Avg Trade Size | Max Drawdown | Sharpe Ratio
   - Her kart: ikon + değer + label

4. Recent Trades Tablosu (app/components/TradeHistory.tsx):
   - Mock trade verileri (10 adet):
     - Pair (MON/USDC, WETH/MON vs.)
     - Side (Long/Short - yeşil/kırmızı)
     - Entry Price, Exit Price
     - PnL ($ ve %)
     - Tarih
   - Basit tablo, zebra stripe satırlar

5. Copy Trading Panel (sağ sidebar veya alt bölüm):
   - "Deposit Amount" input (MON cinsinden)
   - "Max Slippage" slider (%0.1 - %2.0)
   - "Stop Loss" input (% cinsinden, opsiyonel)
   - "Start Copying" butonu (şimdilik sadece UI, fonksiyon bağlamayacağız)
   - Küçük bilgi: "Performance fee: 10% of profits"
```

---

## FAZ 4 - Dashboard (Takipçi Paneli)

**Amaç:** Cüzdan bağladıktan sonra kullanıcının kendi vault'larını ve aktif kopyalarını gördüğü panel.

### Prompt 4.1 - Kullanıcı Dashboard

```
app/dashboard/page.tsx oluştur. Cüzdan bağlı kullanıcının kendi paneli.

Cüzdan bağlı değilse: "Connect your wallet to view your dashboard" mesajı + ConnectButton göster.
Cüzdan bağlıysa: Dashboard içeriğini göster.

Bileşenler:

1. Portfolio Overview (üst kısım):
   - Toplam portföy değeri (büyük rakam)
   - Toplam PnL (yeşil/kırmızı)
   - Aktif vault sayısı
   - Mini çizgi grafik (portfolio değeri son 7 gün)

2. Active Vaults (app/components/VaultCard.tsx):
   - Kullanıcının takip ettiği liderlerle bağlı vault kartları
   - Mock olarak 2-3 vault göster:
     - Lider adı/adresi
     - Yatırılan miktar
     - Güncel PnL ($ ve %)
     - Vault durumu: "Active" (yeşil badge) veya "Paused"
     - Butonlar: "Add Funds", "Withdraw", "Stop Copying"
   - Her vault kartı hafif bir border ve surface background ile

3. Transaction History:
   - Son işlemler listesi (mock):
     - Tarih, Tür (Deposit/Withdraw/Copy Trade), Miktar, Durum
   - Basit liste, en fazla 10 öğe

4. Quick Actions (sağ sidebar veya üst):
   - "Find New Leaders" butonu (leaderboard'a link)
   - "Create Leader Profile" butonu (lider olmak isteyen kullanıcılar için)

Sayfa "use client" olsun. useAccount() hook'u ile cüzdan durumunu kontrol et.
```

---

## FAZ 5 - Akıllı Sözleşmeler (Solidity)

**Amaç:** Core protokol kontratlarını yaz. Basit ama çalışan.

### Prompt 5.1 - CopyVault ve TradeRouter Kontratları

```
contracts/ klasöründe Solidity akıllı sözleşmelerini oluştur. Solidity 0.8.20 kullan.

1. contracts/interfaces/ITradeRouter.sol:
   - executeCopyTrade(address vault, address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) external
   - Event: CopyTradeExecuted(address indexed vault, address indexed leader, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut)

2. contracts/CopyVault.sol:
   - Her takipçi için ayrı deploy edilen izole kasa
   - State değişkenleri:
     - owner (takipçi adresi)
     - leader (takip edilen lider adresi)
     - router (TradeRouter adresi)
     - depositedAmount (yatırılan MON/token miktarı)
     - isActive (vault aktif mi)
     - maxSlippage (bps cinsinden, örn: 50 = %0.5)
     - stopLossPercentage (bps cinsinden)
   - Fonksiyonlar:
     - deposit() external payable - MON yatır
     - withdraw(uint256 amount) external - sadece owner çekebilir
     - executeTrade(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) external - sadece router çağırabilir
     - setMaxSlippage(uint256 _slippage) external - sadece owner
     - pause() / unpause() external - sadece owner
     - getVaultInfo() external view - tüm bilgileri döndür
   - Modifier: onlyOwner, onlyRouter, whenActive
   - Events: Deposited, Withdrawn, TradeExecuted, VaultPaused, VaultUnpaused

3. contracts/TradeRouter.sol:
   - Lider trade yaptığında tüm bağlı vault'lara emri dağıtan kontrat
   - State:
     - factory (factory adresi)
     - mapping(address => address[]) leaderToVaults (lider -> bağlı vault listesi)
     - mapping(address => bool) authorizedLeaders
   - Fonksiyonlar:
     - registerVault(address leader, address vault) external - factory çağırır
     - removeVault(address leader, address vault) external
     - executeMirrorTrade(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) external - sadece authorized leader çağırır. Tüm bağlı vault'larda executeTrade çağırır (loop).
     - getVaultsForLeader(address leader) external view
   - Events: VaultRegistered, VaultRemoved, MirrorTradeInitiated

4. contracts/TradeWatchFactory.sol:
   - Vault deploy eden factory kontrat
   - Fonksiyonlar:
     - createVault(address leader, uint256 maxSlippage) external payable returns (address) - Yeni CopyVault deploy et, msg.value'yu deposit et, router'a register et
     - getVaultsForUser(address user) external view returns (address[])
     - getVaultCount() external view returns (uint256)
   - State:
     - router (TradeRouter adresi)
     - mapping(address => address[]) userVaults
   - Events: VaultCreated(address indexed owner, address indexed leader, address vault)

5. contracts/LeaderRegistry.sol:
   - Lider kayıt ve performans takibi
   - Fonksiyonlar:
     - registerAsLeader(string calldata name, uint256 performanceFee) external
     - updateStats(address leader, int256 pnl, bool isWin) external - sadece router çağırabilir
     - getLeaderInfo(address leader) external view
     - getAllLeaders() external view returns (address[])
     - isRegisteredLeader(address leader) external view returns (bool)
   - Struct LeaderInfo:
     - name, performanceFee, totalPnL, totalTrades, winCount, followerCount, isActive, registeredAt
   - Events: LeaderRegistered, LeaderStatsUpdated

Kontratlar arası ilişki:
- Factory, CopyVault deploy eder ve TradeRouter'a register eder
- TradeRouter, LeaderRegistry'den lider doğrulaması yapar
- Lider executeMirrorTrade çağırınca TradeRouter tüm vault'larda trade execute eder

Her kontrat yorum satırlarıyla açıklamalı olsun. Güvenlik: reentrancy guard yok (basitlik için), ama access control kesin olsun.
```

### Prompt 5.2 - ABI ve Config Dosyaları

```
Smart contract'lar için frontend config dosyalarını oluştur:

1. app/config/contracts.ts:
   - Her kontrat için ABI array'leri (Solidity dosyalarından türet)
   - Kontrat adresleri için placeholder'lar (deploy sonrası güncellenecek)
   - Export: COPY_VAULT_ABI, TRADE_ROUTER_ABI, FACTORY_ABI, LEADER_REGISTRY_ABI
   - Export: CONTRACT_ADDRESSES objesi { factory, router, leaderRegistry }

2. app/types/contracts.ts:
   - TypeScript tipleri:
     - LeaderInfo { address, name, performanceFee, totalPnL, totalTrades, winCount, followerCount, isActive }
     - VaultInfo { address, owner, leader, depositedAmount, isActive, maxSlippage, currentPnL }
     - TradeRecord { id, pair, side, entryPrice, exitPrice, pnl, timestamp }

ABI'ler kontrat fonksiyonlarıyla birebir eşleşsin.
```

---

## FAZ 6 - Frontend-Kontrat Entegrasyonu

**Amaç:** Mock data yerine gerçek kontrat okuma/yazma işlemleri.

### Prompt 6.1 - Custom Hooks

```
Kontrat etkileşimi için custom React hook'ları oluştur (wagmi kullanarak):

1. app/hooks/useLeaderboard.ts:
   - LeaderRegistry kontratından tüm liderleri çek
   - useReadContract ile getAllLeaders ve her lider için getLeaderInfo
   - Return: { leaders: LeaderInfo[], isLoading, error }
   - Fallback: Kontrat bağlantısı yoksa mock-data kullan

2. app/hooks/useCreateVault.ts:
   - Factory kontratına createVault çağrısı
   - useWriteContract kullan
   - Input: leader address, maxSlippage, deposit amount
   - Return: { createVault, isPending, isSuccess, hash }

3. app/hooks/useVaultInfo.ts:
   - Belirli bir vault'un bilgilerini çek
   - useReadContract ile getVaultInfo
   - Return: { vault: VaultInfo, isLoading }

4. app/hooks/useUserVaults.ts:
   - Bağlı cüzdanın tüm vault'larını çek
   - Factory'den getVaultsForUser, sonra her vault için getVaultInfo
   - Return: { vaults: VaultInfo[], isLoading }

5. app/hooks/useVaultActions.ts:
   - Vault üzerinde işlem yapma: deposit, withdraw, pause, unpause
   - Her biri için ayrı useWriteContract
   - Return: { deposit, withdraw, pause, unpause, isPending }

Her hook'ta kontrat bağlantısı başarısız olursa graceful fallback yap (hata göster, crash etme).
Mevcut sayfalardaki mock data kullanımını bu hook'larla değiştir ama mock-data'yı fallback olarak koru.
```

### Prompt 6.2 - Sayfalara Entegrasyon

```
Mevcut sayfaları hook'larla entegre et:

1. app/leaderboard/page.tsx:
   - useLeaderboard hook'unu kullan
   - Loading state: Skeleton kartlar göster
   - Error state: "Could not load leaders" mesajı + mock data'ya fallback

2. app/trader/[address]/page.tsx:
   - "Start Copying" butonuna useCreateVault bağla
   - Butona tıklayınca: vault oluştur tx'i gönder
   - Tx pending: buton disabled + spinner
   - Tx success: "Vault created! Redirecting to dashboard..." mesajı

3. app/dashboard/page.tsx:
   - useUserVaults hook'unu kullan
   - VaultCard'lardaki "Withdraw" ve "Stop Copying" butonlarına useVaultActions bağla
   - Gerçek vault verileri gösterilsin

Toast/notification sistemi ekle (basit bir custom component yeterli, kütüphane ekleme):
- app/components/Toast.tsx: Başarı (yeşil), hata (kırmızı), bilgi (mor) toast'lar
- Sağ üstte görünsün, 3 saniye sonra kaybolsun
```

---

## FAZ 7 - Kontrat Deploy (Monad Testnet)

**Amaç:** Kontratları Monad testnet'e deploy et.

### Prompt 7.1 - Deploy Script

```
Kontratları Monad testnet'e deploy etmek için bir script oluştur:

1. scripts/deploy.ts oluştur (ts-node veya viem ile çalışan):
   - Sırasıyla deploy et:
     a. LeaderRegistry
     b. TradeRouter (LeaderRegistry adresini constructor'a ver)
     c. TradeWatchFactory (TradeRouter adresini constructor'a ver)
     d. TradeRouter'a Factory adresini set et
   - Her deploy'dan sonra adresi console'a yaz
   - Tüm adresleri app/config/contracts.ts'e yazacak format

2. Hardhat config (hardhat.config.ts):
   - Monad testnet network config
   - Chain ID: 10143
   - RPC: https://testnet-rpc.monad.xyz
   - Compiler: solc 0.8.20

3. package.json'a script ekle:
   - "compile": "npx hardhat compile"
   - "deploy": "npx hardhat run scripts/deploy.ts --network monad-testnet"

Gerekli paketleri de kur: hardhat, @nomicfoundation/hardhat-toolbox

NOT: Private key'i .env dosyasından oku. .env.example oluştur ama .env'yi .gitignore'a ekle.
```

---

## FAZ 8 - Polish ve Demo Hazırlığı

**Amaç:** Son rötuşlar, animasyonlar, demo senaryosu.

### Prompt 8.1 - UI Polish

```
Projeye son görsel dokunuşları ekle:

1. Loading States:
   - Tüm sayfalara skeleton loader ekle (Tailwind animate-pulse ile)
   - Buton tıklamalarında spinner göster

2. Animasyonlar (CSS only, kütüphane ekleme):
   - Kart hover: scale(1.02) + border-color transition
   - Sayfa geçişleri: fade-in (opacity 0->1, transform translateY)
   - Rakamlar: tabular-nums font feature
   - Stats bar'daki rakamlar için count-up efekti (basit useState + useEffect)

3. Responsive kontrol:
   - Mobile'da navbar hamburger menü olsun
   - Kartlar mobile'da tek kolon
   - Dashboard'da sidebar mobile'da collapse olsun

4. Empty States:
   - Dashboard'da vault yoksa: "You haven't started copy trading yet. Find a leader to get started!" + CTA
   - Leaderboard boşsa: "No leaders found" + "Be the first leader" CTA

5. Favicon ve Meta:
   - public/favicon.ico güncelle (basit "TW" ikonu veya placeholder)
   - Open Graph meta tag'leri layout.tsx'e ekle
```

### Prompt 8.2 - Demo Seed Data ve Senaryo

```
Demo için seed data ve senaryo hazırla:

1. scripts/seed.ts oluştur:
   - Deploy edilmiş kontratlarla etkileşim:
     a. 3 lider trader kaydet (LeaderRegistry'ye)
     b. Her lidere farklı isim ve performans ücreti ver
     c. 1-2 örnek vault oluştur (Factory ile)
   - Bu script demo öncesi bir kez çalıştırılacak

2. Demo senaryosu (DEMO.md dosyası):
   Jüriye gösterilecek akış:

   Adım 1: Landing page'i göster, "Built on Monad" vurgusunu yap
   Adım 2: Leaderboard'a git, liderleri göster
   Adım 3: Bir lidere tıkla, performans grafiğini göster
   Adım 4: Cüzdan bağla (MetaMask + Monad testnet)
   Adım 5: "Copy This Trader" tıkla, vault oluştur tx'ini imzala
   Adım 6: Dashboard'a git, oluşan vault'u göster
   Adım 7: Lider bir trade yaptığında (script ile simüle et) vault'un otomatik kopyaladığını göster

   Her adım için yaklaşık süre ve konuşma notu
```

---

## FAZ 9 - Son Kontroller ve Push

**Amaç:** Her şeyin çalıştığından emin ol, GitHub'a push'a hazırlan.

### Prompt 9.1 - Final Check

```
Projeyi son kez kontrol et ve push'a hazırla:

1. Build kontrolü:
   - "npm run build" çalışsın, hata olmasın
   - TypeScript hataları varsa düzelt
   - ESLint uyarıları varsa kritik olanları düzelt

2. README.md güncelle:
   - Proje adı ve kısa açıklama
   - Mimari diyagramı (ASCII art)
   - Teknoloji stack'i listesi
   - Kurulum adımları (npm install, .env setup, npm run dev)
   - Demo linki (varsa Vercel deploy)
   - Ekran görüntüleri bölümü (placeholder)
   - Ekip bilgisi
   - Lisans

3. .gitignore kontrolü:
   - node_modules, .env, .next, artifacts, cache

4. Gereksiz dosyaları temizle:
   - Next.js default dosyalarını (varsa kalan) sil
   - Kullanılmayan import'ları temizle
   - Console.log'ları kaldır

5. Vercel deploy (opsiyonel):
   - vercel.json oluştur (gerekirse)
   - Environment variable'ları not et
```

---

## Faz Sırası ve Tahmini Süreler

| Faz | İçerik | Tahmini Süre |
|-----|--------|-------------|
| 0 | Altyapı ve Config | 30-45 dk |
| 1 | Landing Page | 1-2 saat |
| 2 | Leaderboard | 1-2 saat |
| 3 | Trader Detay + Vault UI | 1.5-2 saat |
| 4 | Dashboard | 1-1.5 saat |
| 5 | Smart Contracts | 1.5-2 saat |
| 6 | Frontend-Kontrat Entegrasyonu | 2-3 saat |
| 7 | Deploy | 1-1.5 saat |
| 8 | Polish + Demo | 1.5-2 saat |
| 9 | Final Check + Push | 30-45 dk |
| **TOPLAM** | | **~12-18 saat** |

---

## Notlar

- Her faz sonunda `npm run dev` ile kontrol et, hata varsa hemen düzelt
- Faz 1-4 arası mock data ile çalışacak, kontrat entegrasyonu Faz 6'da olacak
- Sıkışırsan fazı ikiye böl, daha küçük prompt'lar at
- Her fazda "önceki fazlardaki dosyalara dokunma" demeyi unutma (gereksiz refactor'u önler)
- Push öncesi tüm fazları local'de bitir ve test et
