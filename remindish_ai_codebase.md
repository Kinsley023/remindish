# Remindish.AI 專案原始碼

本檔案包含了 `remindish-ai` 專案的核心原始碼檔案（`index.html`、`style.css`、`app.js`），供匯入至其他 Antigravity 實例進行修正與開發。

---

## 1. index.html

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Remindish - 冰箱智慧食材管理與剩食救星</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet">
    <!-- FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body class="light-theme">
    
    <!-- Mobile App Root Container (Takes 100% width on phone, centered max-width on desktop) -->
    <div class="app-container">

        <!-- App Header -->
        <header class="app-header">
            <div class="logo-area">
                <div class="logo-icon"><img src="images/logo.svg" alt="logo" width="24" height="24"></div>
                <div class="logo-text">Remindish</div>
            </div>
            
            <div class="header-actions">
                <button class="pricing-btn" id="pricing-modal-trigger">
                    <img src="images/premium.svg" alt="premium" width="16" height="16" style="margin-right: 4px; vertical-align: middle;"> Premium
                </button>
            </div>
        </header>

        <!-- Scrollable Content Area -->
        <div class="app-content">
            
            <!-- Freemium Switcher Toggle (Floating/Sticky under header) -->
            <div class="tier-sticky-bar">
                <div class="tier-toggle-wrapper">
                    <span class="toggle-label Free">免費版</span>
                    <label class="switch">
                        <input type="checkbox" id="tier-toggle">
                        <span class="slider round"></span>
                    </label>
                    <span class="toggle-label Premium">Premium</span>
                </div>
            </div>

            <!-- Alert Banner (Magic Moment Trigger) -->
            <div class="magic-moment-banner" id="magic-banner">
                <div class="banner-icon">
                    <img src="images/alert.svg" alt="alert" width="24" height="24">
                </div>
                <div class="banner-content">
                    <h4>冰箱有食材即將過期！</h4>
                    <p>您有 <span class="highlight-count" id="expiring-count">3</span> 樣食材即將過期，快用一鍵推薦清空它們！</p>
                </div>
                <button class="banner-btn" id="magic-solve-btn">
                    解決它們！🔥
                </button>
            </div>

            <!-- Tab: 我的冰箱 -->
            <section id="tab-fridge" class="tab-section active">
                <div class="section-header">
                    <h2>我的冰箱</h2>
                    <button class="add-food-fab" id="open-add-modal">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>

                <!-- Folders (Category Selection) -->
                <div class="fridge-folders">
                    <div class="folder-list" id="fridge-folders-list">
                        <button class="folder-tab active" data-category="all">全部</button>
                        <button class="folder-tab" data-category="meat">肉類海鮮</button>
                        <button class="folder-tab" data-category="veg">蔬菜水果</button>
                        <button class="folder-tab" data-category="dairy">乳製品</button>
                        <button class="folder-tab" data-category="others">其他</button>
                        <button class="folder-tab add-folder-btn-lock" id="add-folder-btn">
                            新增分類 <img src="images/premium.svg" alt="lock" class="lock-icon" width="10" height="10" style="vertical-align: middle;">
                        </button>
                    </div>
                </div>

                <!-- Fridge Items Grid -->
                <div class="fridge-grid" id="fridge-grid">
                    <!-- JS Dynamic Render -->
                </div>
            </section>

            <!-- Tab: 保鮮日曆 -->
            <section id="tab-calendar" class="tab-section">
                <div class="section-header">
                    <h2>保鮮日曆</h2>
                </div>
                <div class="calendar-layout">
                    <div class="calendar-widget" id="calendar-widget">
                        <div class="calendar-header">
                            <button class="cal-nav-btn"><i class="fa-solid fa-chevron-left"></i></button>
                            <span class="cal-month-title">2026 年 6 月</span>
                            <button class="cal-nav-btn"><i class="fa-solid fa-chevron-right"></i></button>
                        </div>
                        <div class="calendar-weekdays">
                            <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
                        </div>
                        <div class="calendar-days" id="calendar-days-container">
                            <!-- Days rendered via JS -->
                        </div>
                    </div>
                    
                    <div class="calendar-expiry-box">
                        <h3 id="selected-date-info">2026年6月4日</h3>
                        <div class="expiry-items-list" id="expiry-items-list">
                            <!-- JS dynamic render -->
                        </div>
                    </div>
                </div>
            </section>

            <!-- Tab: 今天吃什麼 -->
            <section id="tab-recipes" class="tab-section">
                <div class="section-header">
                    <h2>今天吃什麼</h2>
                    <div class="recipe-mode-indicator">
                        <span class="mode-text" id="recipe-limit-text">免費版 (限推薦 2 道)</span>
                    </div>
                </div>

                <!-- Ingredient chips selector -->
                <div class="recipe-selector-box">
                    <p class="select-tip">選擇要使用的食材（預設已帶入過期食材）：</p>
                    <div class="ingredient-chips-container" id="recipe-ingredients-chips">
                        <!-- Chips rendered by JS -->
                    </div>
                    <button class="btn btn-primary btn-block" id="generate-recipes-btn">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> 智慧配對最佳食譜
                    </button>
                </div>

                <!-- Recipe Category Filters -->
                <div class="recipe-categories-container" id="recipe-categories-bar">
                    <div class="recipe-cat-header">
                        <span class="cat-label">食譜分類濾鏡</span>
                        <img src="images/premium.svg" alt="lock" class="lock-icon" width="12" height="12" style="vertical-align: middle;">
                    </div>
                    <div class="recipe-cat-tags locked">
                        <span class="recipe-tag active">全部</span>
                        <span class="recipe-tag">家常快炒</span>
                        <span class="recipe-tag">精緻湯品</span>
                        <span class="recipe-tag">低卡減脂</span>
                        <span class="recipe-tag">烤箱料理</span>
                    </div>
                </div>

                <!-- Recipes Grid -->
                <div class="recipes-grid" id="recipes-grid">
                    <!-- JS Dynamic Render -->
                </div>
            </section>

            <!-- Tab: 採買清單 -->
            <section id="tab-shopping" class="tab-section">
                <div class="section-header">
                    <h2>採買清單</h2>
                    <button class="btn btn-text" id="clear-shopping-btn">
                        <i class="fa-solid fa-trash-can"></i> 清除
                    </button>
                </div>
                <div class="shopping-layout">
                    <div class="shopping-input-bar">
                        <input type="text" id="shopping-item-input" placeholder="想要採買什麼食材...">
                        <button class="btn btn-primary" id="add-shopping-btn">新增</button>
                    </div>
                    
                    <ul class="shopping-list" id="shopping-list-ul">
                        <!-- JS dynamic render -->
                    </ul>
                    
                    <div class="shopping-actions">
                        <button class="btn btn-primary btn-block" id="go-to-shop-btn">
                            <i class="fa-solid fa-truck-fast"></i> 前往「即時補貨」商場
                        </button>
                    </div>
                </div>
            </section>

            <!-- Tab: 即時補貨 -->
            <section id="tab-shop" class="tab-section">
                <div class="section-header">
                    <h2>即時補貨</h2>
                    <div class="cart-badge-container">
                        <i class="fa-solid fa-basket-shopping text-pink"></i> 購物車 (<span id="cart-count">0</span>)
                    </div>
                </div>
                <div class="shop-mobile-layout">
                    <div class="shop-import-section">
                        <h3>從採買清單一鍵補貨</h3>
                        <div class="import-shopping-box" id="import-shopping-box">
                            <!-- Dynamic elements -->
                        </div>
                    </div>
                    <div class="shop-products-section">
                        <h3>推薦食材加購</h3>
                        <div class="products-grid" id="products-grid">
                            <!-- Dynamic render -->
                        </div>
                    </div>
                </div>
            </section>

            <!-- Tab: 智慧掃描 -->
            <section id="tab-scan" class="tab-section">
                <div class="section-header">
                    <h2>智慧掃描</h2>
                </div>
                
                <!-- Lock Screen if Free Tier -->
                <div class="scan-lock-screen" id="scan-lock-screen">
                    <div class="lock-icon-large"><img src="images/premium.svg" alt="lock" width="64" height="64"></div>
                    <h3>這是 Premium 付費版專屬功能</h3>
                    <p>升級為 Premium 用戶，即可享受拍照發票或食材照片自動辨識並快速建檔的便利體驗！</p>
                    <button class="btn btn-gold" id="scan-upgrade-btn">
                        <img src="images/premium.svg" alt="premium" width="16" height="16" style="margin-right: 4px; vertical-align: middle;"> 立即升級 Premium
                    </button>
                </div>

                <!-- Scan Functional UI (Visible only in Premium) -->
                <div class="scan-working-screen hidden" id="scan-working-screen">
                    <div class="scan-options">
                        <div class="scan-card" id="scan-receipt-card">
                            <img src="images/shopping.svg" alt="receipt" width="48" height="48" style="margin-bottom: 8px;">
                            <h3>模擬掃描超市發票</h3>
                            <p>模擬辨識發票條碼與食材明細，快速帶入到冰箱。</p>
                            <button class="btn btn-secondary btn-block">開始掃描發票</button>
                        </div>
                        <div class="scan-card" id="scan-fridge-card">
                            <img src="images/scan.svg" alt="camera" width="48" height="48" style="margin-bottom: 8px;">
                            <h3>模擬拍照辨識食材</h3>
                            <p>用相機拍照辨識冰箱剩食，並精準判斷保質期。</p>
                            <button class="btn btn-secondary btn-block">開始拍照辨識</button>
                        </div>
                    </div>
                    
                    <!-- Scanner Animation Overlay (Hidden initially) -->
                    <div class="scanner-simulation hidden" id="scanner-sim">
                        <div class="scanner-line"></div>
                        <div class="scanner-text" id="scanner-sim-text">正在分析發票條碼與食材明細...</div>
                    </div>
                </div>
            </section>

        </div>

        <!-- Bottom Navigation Bar (Phone Tab Bar) -->
        <nav class="bottom-nav">
            <button class="nav-item active" data-tab="fridge">
                <img src="images/fridge.svg" alt="我的冰箱" width="20" height="20">
                <span>我的冰箱</span>
            </button>
            <button class="nav-item" data-tab="calendar">
                <img src="images/calendar.svg" alt="保鮮日曆" width="20" height="20">
                <span>保鮮日曆</span>
            </button>
            <button class="nav-item" data-tab="recipes">
                <img src="images/recipes.svg" alt="今天吃什麼" width="20" height="20">
                <span>今天吃什麼</span>
            </button>
            <button class="nav-item" data-tab="shopping">
                <img src="images/shopping.svg" alt="採買清單" width="20" height="20">
                <span>採買清單</span>
            </button>
            <button class="nav-item" data-tab="shop">
                <img src="images/shop.svg" alt="即時補貨" width="20" height="20">
                <span>即時補貨</span>
            </button>
            <button class="nav-item" data-tab="scan">
                <img src="images/scan.svg" alt="智慧掃描" width="20" height="20">
                <span>智慧掃描</span>
            </button>
        </nav>

    </div>

    <!-- Modal: 新增食材 -->
    <div class="modal-overlay" id="add-item-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>新增食材到冰箱</h3>
                <button class="close-btn" id="close-add-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="input-name">食材名稱</label>
                    <input type="text" id="input-name" placeholder="例如：青花菜、牛肉片">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="input-category">食材分類</label>
                        <select id="input-category">
                            <option value="meat">肉類海鮮</option>
                            <option value="veg">蔬菜水果</option>
                            <option value="dairy">乳製品</option>
                            <option value="others">其他</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="input-days">保鮮天數</label>
                        <input type="number" id="input-days" value="3" min="1">
                    </div>
                </div>
                <div class="form-group">
                    <label for="input-quantity">數量 / 單位</label>
                    <input type="text" id="input-quantity" value="1 包" placeholder="例如：1 包、500g">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancel-add-btn">取消</button>
                <button class="btn btn-primary" id="save-add-btn">新增</button>
            </div>
        </div>
    </div>

    <!-- Modal: 訂閱方案 -->
    <div class="modal-overlay" id="pricing-modal">
        <div class="modal-content pricing-modal-content">
            <div class="modal-header">
                <h3>💎 訂閱 Premium 計劃</h3>
                <button class="close-btn" id="close-pricing-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="pricing-cards-container">
                    
                    <!-- Free Plan Card -->
                    <div class="pricing-card free-plan">
                        <div class="plan-badge">Starter</div>
                        <h4>免費版</h4>
                        <div class="price">NT$0 <span>/ 永久免費</span></div>
                        <p class="plan-desc">適合輕度使用者、初次體驗</p>
                        <ul class="plan-features">
                            <li><i class="fa-solid fa-check"></i> 手動輸入食材</li>
                            <li><i class="fa-solid fa-check"></i> 剩菜食譜限 2 道</li>
                            <li><i class="fa-solid fa-xmark text-red"></i> 觀看 5 秒廣告</li>
                            <li><i class="fa-solid fa-xmark text-red"></i> 無法新增分類/自訂分類</li>
                        </ul>
                        <button class="btn btn-secondary btn-block" id="choose-free-btn">目前方案</button>
                    </div>
                    
                    <!-- Monthly Plan Card -->
                    <div class="pricing-card premium-plan monthly recommended">
                        <div class="plan-badge">最受歡迎</div>
                        <h4>Premium 月訂閱</h4>
                        <div class="price">NT$120 <span>/ 月</span></div>
                        <p class="plan-desc">經常下廚、想減少食材浪費的個人</p>
                        <ul class="plan-features">
                            <li><i class="fa-solid fa-check"></i> <strong>AI 智慧發票/照片掃描</strong></li>
                            <li><i class="fa-solid fa-check"></i> <strong>無廣告干擾</strong> 流暢體驗</li>
                            <li><i class="fa-solid fa-check"></i> 剩食食譜擴增至 <strong>4~5 道</strong></li>
                            <li><i class="fa-solid fa-check"></i> 解鎖食材分類與資料夾</li>
                        </ul>
                        <button class="btn btn-gold btn-block" id="upgrade-monthly-btn">立即訂閱</button>
                    </div>

                    <!-- Yearly Plan Card -->
                    <div class="pricing-card premium-plan yearly">
                        <div class="plan-badge-gold">超值首選</div>
                        <h4>Premium 年訂閱</h4>
                        <div class="price">NT$1320 <span>/ 年</span></div>
                        <p class="plan-desc">長期管理省心首選，每月僅約 NT$110</p>
                        <ul class="plan-features">
                            <li><i class="fa-solid fa-check"></i> 享有 Monthly 所有功能</li>
                            <li><i class="fa-solid fa-percent"></i> 年繳省下 <strong>10%</strong> 費用</li>
                            <li><i class="fa-solid fa-shield-halved"></i> 隨時可取消</li>
                        </ul>
                        <button class="btn btn-gold btn-block" id="upgrade-yearly-btn">年度訂閱 (最划算)</button>
                    </div>
                </div>

                <!-- Exporter section for JPG assets -->
                <div class="download-assets-section" style="margin: 1.5rem 0; text-align: center; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                    <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.35rem;">📦 開發資源下載 (自行使用)</h4>
                    <p style="font-size: 0.75rem; color: var(--color-text-secondary); margin-bottom: 0.85rem;">可一鍵將所有的功能模組圖示與 App Logo 匯出為高畫質 JPG 格式圖檔</p>
                    <button class="btn btn-primary" id="download-jpg-btn" style="padding: 0.55rem 1.5rem;">
                        <i class="fa-solid fa-download"></i> 一鍵下載全套 JPG 圖檔
                    </button>
                </div>

                <!-- Why Subscribe -->
                <div class="why-subscribe-section">
                    <h4>為什麼選擇 Premium 訂閱制？</h4>
                    <div class="why-grid">
                        <div class="why-item">
                            <h5><i class="fa-solid fa-clock-rotate-left"></i> 需求具有持續性</h5>
                            <p>食材管理與料理規劃是每天重複發生的剛需，訂閱讓我們能為您提供不間斷的提醒服務。</p>
                        </div>
                        <div class="why-item">
                            <h5><i class="fa-solid fa-chart-line"></i> 使用價值持續累積</h5>
                            <p>使用越久，您的飲食偏好、食材分類與常備清單越完整，AI 推薦也越貼切。</p>
                        </div>
                        <div class="why-item">
                            <h5><i class="fa-solid fa-bolt"></i> 大幅節省時間</h5>
                            <p>一鍵拍照或掃描發票，5 秒自動辨識輸入，免去手動打字記錄的繁瑣過程。</p>
                        </div>
                        <div class="why-item">
                            <h5><i class="fa-solid fa-server"></i> 支撐服務維護</h5>
                            <p>您的訂閱金能直接支持我們在 AI 影像辨識、智慧食譜運算伺服器與資料庫之維護開銷。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Ad Overlay Container (Free tier only) -->
    <div class="ad-overlay" id="ad-overlay">
        <div class="ad-box">
            <div class="ad-header">
                <span class="ad-badge">廣告</span>
                <span class="ad-timer" id="ad-timer-text">廣告將於 5 秒後結束</span>
                <button class="ad-skip-btn hidden" id="ad-skip-btn">跳過廣告 &times;</button>
            </div>
            <div class="ad-body">
                <h2>🍏 Remindish Premium 享無廣告體驗</h2>
                <p>升級為 Premium 會員，不僅能去廣告，還能解鎖 **AI 發票掃描** 與 **多重食譜推薦**！</p>
                <div class="ad-visual">
                    <i class="fa-solid fa-gem animated-gem"></i>
                    <span>年訂閱平均每月只要 NT$110！</span>
                </div>
                <button class="btn btn-gold" id="ad-upgrade-btn">升級並跳過廣告</button>
            </div>
        </div>
    </div>

    <!-- Recipe Detail Modal -->
    <div class="modal-overlay" id="recipe-detail-modal">
        <div class="modal-content recipe-modal-content">
            <div class="modal-header">
                <h3 id="recipe-detail-title">食譜詳情</h3>
                <button class="close-btn" id="close-recipe-detail">&times;</button>
            </div>
            <div class="modal-body" id="recipe-detail-body">
                <!-- JS dynamic content -->
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast" id="toast">提示訊息</div>

    <script src="app.js"></script>
</body>
</html>
```

---

## 2. style.css

```css
/* ==========================================================================
   Remindish.AI MVP - Mobile Web App Sizing (No Phone Bezel/Simulator)
   ========================================================================== */

:root {
    --bg-desktop: #f1f5f9;
    --bg-phone: #f8fafc;
    --bg-card: #ffffff;
    
    --color-text-primary: #0f172a;
    --color-text-secondary: #475569;
    --color-text-muted: #94a3b8;
    
    --border-color: #e2e8f0;
    
    /* Clean, Consumer Colors */
    --primary: #10b981; /* Healthy Fresh Green */
    --primary-light: #e6f4ea;
    --primary-hover: #059669;
    
    --accent-orange: #f59e0b; /* Expiry Warning */
    --accent-orange-light: #fffbeb;
    
    --accent-red: #ef4444; /* High Expiry Danger */
    --accent-red-light: #fef2f2;
    
    --accent-cyan: #06b6d4;
    --accent-cyan-light: #ecfeff;
    
    --accent-pink: #ec4899;
    --accent-pink-light: #fdf2f8;
    
    --accent-gold: #fbbf24;
    --accent-gold-light: #fffbeb;
    
    --font-sans: 'Inter', 'Noto Sans TC', sans-serif;
    --shadow-soft: 0 2px 12px rgba(0, 0, 0, 0.04);
    --shadow-premium: 0 10px 30px rgba(15, 23, 42, 0.08);
    --transition-smooth: all 0.2s ease-in-out;
}

/* Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: var(--bg-desktop);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

/* App Container - Acts as the mobile page layout container */
.app-container {
    width: 100%;
    max-width: 480px; /* Real mobile app width when viewed on desktop */
    min-height: 100vh;
    height: 100vh;
    background-color: var(--bg-phone);
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: var(--shadow-premium);
    overflow: hidden;
}

/* Scrollable Content Area */
.app-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    padding-bottom: 84px; /* Room for bottom navigation */
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Header */
.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.85rem 1.25rem;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border-color);
}

.logo-area {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.logo-icon {
    font-size: 1.25rem;
    color: var(--primary);
}

.logo-text {
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.02em;
}

.logo-text span {
    color: var(--primary);
}

/* Sticky Freemium Toggle under Header */
.tier-sticky-bar {
    background: var(--bg-card);
    padding: 0.5rem;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-soft);
    display: flex;
    justify-content: center;
}

.tier-toggle-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: #f1f5f9;
    padding: 0.35rem 0.75rem;
    border-radius: 50px;
}

.toggle-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-text-secondary);
}

.toggle-label.Free {
    color: var(--color-text-primary);
}

/* Toggle Switch slider styles */
.switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 22px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-text-muted);
    transition: .3s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--accent-gold);
}

input:checked + .slider:before {
    transform: translateX(22px);
}

/* Pricing Header Button */
.pricing-btn {
    background: linear-gradient(135deg, var(--accent-gold), #d97706);
    color: #ffffff;
    border: none;
    padding: 0.35rem 0.75rem;
    border-radius: 50px;
    font-weight: 700;
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    transition: var(--transition-smooth);
}

.pricing-btn:hover {
    transform: translateY(-1px);
}

/* Bottom Navigation Bar (Tab Bar) */
.bottom-nav {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 68px;
    background: var(--bg-card);
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-bottom: 8px;
    z-index: 100;
}

.bottom-nav .nav-item {
    background: transparent;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    color: var(--color-text-muted);
    font-size: 0.65rem; /* Adjusted for full feature names */
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-smooth);
    flex: 1;
}

.bottom-nav .nav-item img {
    width: 20px;
    height: 20px;
    margin-bottom: 2px;
}

.bottom-nav .nav-item:hover {
    color: var(--color-text-secondary);
}

.bottom-nav .nav-item.active {
    color: var(--primary);
    font-weight: 700;
}

/* Section transitions */
.tab-section {
    display: none;
}

.tab-section.active {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: slideUp 0.25s ease-out;
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
}

.section-header h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text-primary);
}

/* Expiry Magic Banner */
.magic-moment-banner {
    background: var(--accent-red-light);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 16px;
    padding: 0.85rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow: var(--shadow-soft);
    transition: var(--transition-smooth);
}

.magic-moment-banner.fade-out {
    display: none !important;
}

.banner-content {
    flex: 1;
}

.banner-content h4 {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--accent-red);
    margin-bottom: 0.15rem;
}

.banner-content p {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    line-height: 1.3;
}

.highlight-count {
    font-weight: 700;
    color: var(--accent-red);
}

.banner-btn {
    background: var(--accent-red);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 0.45rem 0.85rem;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition-smooth);
}

/* FAB button for adding food */
.add-food-fab {
    background: var(--primary);
    color: #ffffff;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.1rem;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
    transition: var(--transition-smooth);
}

/* Folders category select bar */
.fridge-folders {
    overflow-x: auto;
    margin-bottom: 0.25rem;
    padding-bottom: 0.25rem;
    -webkit-overflow-scrolling: touch;
}

.fridge-folders::-webkit-scrollbar {
    display: none;
}

.folder-list {
    display: flex;
    gap: 0.5rem;
    white-space: nowrap;
}

.folder-tab {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    color: var(--color-text-secondary);
    padding: 0.4rem 0.85rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
}

.folder-tab.active {
    background: var(--primary);
    color: #ffffff;
    border-color: var(--primary);
}

.add-folder-btn-lock {
    background: var(--accent-gold-light);
    border: 1px dashed var(--accent-gold);
    color: #b45309;
}

.lock-icon {
    font-size: 0.7rem;
    margin-left: 0.2rem;
}

/* Food Inventory Grid */
.fridge-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.food-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 0.9rem 1.1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    box-shadow: var(--shadow-soft);
}

.food-card::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 5px;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
}

.food-card.expiry-danger::before { background: var(--accent-red); }
.food-card.expiry-warning::before { background: var(--accent-orange); }
.food-card.expiry-safe::before { background: var(--primary); }

.food-card-left {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-left: 0.5rem;
}

.food-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text-primary);
}

.food-qty {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
}

.food-expiry-info {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.food-card.expiry-danger .expiry-days-text { color: var(--accent-red); font-weight: 700; }
.food-card.expiry-warning .expiry-days-text { color: var(--accent-orange); font-weight: 700; }
.food-card.expiry-safe .expiry-days-text { color: var(--primary); font-weight: 700; }

.action-icon-btn {
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    font-size: 0.85rem;
    transition: var(--transition-smooth);
    padding: 0.25rem;
}

.action-icon-btn:hover {
    color: var(--accent-red);
}

/* Button styles */
.btn {
    border: none;
    border-radius: 8px;
    padding: 0.55rem 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
}

.btn-primary {
    background: var(--primary);
    color: #ffffff;
}

.btn-primary:hover {
    background: var(--primary-hover);
}

.btn-secondary {
    background: #f1f5f9;
    color: var(--color-text-primary);
    border: 1px solid var(--border-color);
}

.btn-gold {
    background: linear-gradient(135deg, var(--accent-gold), #d97706);
    color: #ffffff;
}

.btn-block {
    width: 100%;
}

.btn-text {
    background: transparent;
    color: var(--color-text-secondary);
    padding: 0.25rem;
}

/* Modal Drawer (iOS drawer pop style) */
.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: var(--transition-smooth);
}

.modal-overlay.active {
    opacity: 1;
    pointer-events: auto;
}

.modal-content {
    background: var(--bg-card);
    width: 100%;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    padding: 1.5rem;
    box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(100%);
    transition: var(--transition-smooth);
    max-height: 85%;
    overflow-y: auto;
}

.modal-overlay.active .modal-content {
    transform: translateY(0);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
    font-size: 1.1rem;
    font-weight: 700;
}

.close-btn {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    color: var(--color-text-muted);
    cursor: pointer;
}

/* Form layouts */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1rem;
}

.form-group label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-secondary);
}

.form-group input, .form-group select {
    background: #f8fafc;
    border: 1px solid var(--border-color);
    padding: 0.65rem 0.85rem;
    border-radius: 8px;
    font-size: 0.85rem;
    color: var(--color-text-primary);
    outline: none;
}

.form-group input:focus, .form-group select:focus {
    border-color: var(--primary);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
}

.modal-footer {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.25rem;
}

/* Pricing plan view layout */
.pricing-modal-content {
    max-height: 90%;
}

.pricing-cards-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.pricing-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1.25rem;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.pricing-card.recommended {
    border-color: var(--accent-gold);
    background: var(--accent-gold-light);
}

.plan-badge {
    background: #f1f5f9;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    align-self: flex-start;
}

.recommended .plan-badge {
    background: var(--accent-gold);
    color: #92400e;
}

.plan-badge-gold {
    background: #fbbf24;
    color: #92400e;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    align-self: flex-start;
}

.pricing-card h4 {
    font-size: 1rem;
    font-weight: 700;
}

.pricing-card .price {
    font-size: 1.35rem;
    font-weight: 800;
}

.pricing-card .price span {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    font-weight: 400;
}

.plan-desc {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
}

.plan-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.75rem;
}

.plan-features li {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--color-text-secondary);
}

.plan-features li i.fa-check {
    color: var(--primary);
}

.plan-features li i.fa-xmark {
    color: var(--accent-red);
}

/* Why subscribe grid */
.why-subscribe-section {
    border-top: 1px solid var(--border-color);
    padding-top: 1.25rem;
}

.why-subscribe-section h4 {
    font-size: 0.95rem;
    margin-bottom: 0.85rem;
    font-weight: 700;
    text-align: center;
}

.why-grid {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
}

.why-item h5 {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.why-item h5 i {
    color: var(--primary);
}

.why-item p {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    line-height: 1.4;
    padding-left: 1.1rem;
}

/* Recipes Layout */
.recipe-mode-indicator {
    font-size: 0.75rem;
    background: var(--primary-light);
    color: var(--primary-hover);
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
}

.recipe-selector-box {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1rem;
    box-shadow: var(--shadow-soft);
}

.select-tip {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin-bottom: 0.5rem;
}

.ingredient-chips-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.85rem;
}

.ingredient-chip {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.ingredient-chip.selected {
    background: var(--primary-light);
    border-color: var(--primary);
    color: var(--primary-hover);
}

.recipe-categories-container {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.recipe-cat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.cat-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-secondary);
}

.recipe-cat-tags {
    display: flex;
    gap: 0.35rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;
}

.recipe-cat-tags::-webkit-scrollbar {
    display: none;
}

.recipe-cat-tags.locked {
    opacity: 0.5;
    pointer-events: none;
}

.recipe-tag {
    background: #f1f5f9;
    border: 1px solid var(--border-color);
    padding: 0.3rem 0.7rem;
    border-radius: 12px;
    font-size: 0.75rem;
    cursor: pointer;
    white-space: nowrap;
}

.recipe-tag.active {
    background: var(--accent-gold);
    color: #78350f;
    font-weight: 700;
    border-color: var(--accent-gold);
}

.recipes-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.recipe-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    box-shadow: var(--shadow-soft);
}

.recipe-image-placeholder {
    width: 100px;
    background: #f1f5f9;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.recipe-image-placeholder i {
    font-size: 2rem;
    color: var(--color-text-muted);
}

.recipe-tag-badge {
    position: absolute;
    top: 5px;
    left: 5px;
    background: var(--accent-gold);
    color: #78350f;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
}

.recipe-card-content {
    flex: 1;
    padding: 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.recipe-card-content h3 {
    font-size: 0.95rem;
    font-weight: 700;
}

.recipe-match-info {
    font-size: 0.7rem;
    color: var(--primary-hover);
    background: var(--primary-light);
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    align-self: flex-start;
}

.recipe-ingredients-preview {
    font-size: 0.7rem;
    color: var(--color-text-secondary);
}

.recipe-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.25rem;
}

.recipe-cook-time {
    font-size: 0.7rem;
    color: var(--color-text-muted);
}

/* 5s Ad Simulation screen */
.ad-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.98);
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: var(--transition-smooth);
}

.ad-overlay.active {
    opacity: 1;
    pointer-events: auto;
}

.ad-box {
    width: 90%;
    padding: 1.5rem;
    border-radius: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.ad-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ad-badge {
    background: #f1f5f9;
    font-size: 0.65rem;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
}

.ad-timer {
    font-size: 0.75rem;
    color: var(--accent-orange);
    font-weight: 600;
}

.ad-skip-btn {
    background: transparent;
    border: none;
    color: var(--color-text-primary);
    cursor: pointer;
    font-weight: 700;
    font-size: 0.8rem;
}

.ad-skip-btn.hidden {
    display: none;
}

.ad-body h2 {
    font-size: 1.15rem;
}

.ad-visual {
    background: var(--accent-gold-light);
    border: 1px dashed var(--accent-gold);
    padding: 1rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.animated-gem {
    font-size: 2rem;
    color: var(--accent-gold);
    animation: bounceGem 2s infinite ease-in-out;
}

@keyframes bounceGem {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
}

/* Calendar Styling */
.calendar-layout {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.calendar-widget {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1rem;
    box-shadow: var(--shadow-soft);
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.85rem;
}

.cal-nav-btn {
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    font-size: 0.85rem;
    cursor: pointer;
}

.cal-month-title {
    font-weight: 700;
    font-size: 0.95rem;
}

.calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: 700;
    color: var(--color-text-muted);
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
}

.calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    row-gap: 0.35rem;
}

.calendar-day-cell {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.8rem;
    position: relative;
}

.calendar-day-cell:hover {
    background: #f1f5f9;
}

.calendar-day-cell.active {
    background: var(--primary);
    color: #ffffff;
    font-weight: 700;
}

.calendar-day-cell.other-month {
    color: var(--color-text-muted);
    opacity: 0.3;
}

.event-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    position: absolute;
    bottom: 3px;
}

.event-dot.danger { background: var(--accent-red); }
.event-dot.warning { background: var(--accent-orange); }
.event-dot.safe { background: var(--primary); }

.calendar-expiry-box {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1rem;
}

.calendar-expiry-box h3 {
    font-size: 0.9rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.expiry-items-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.expiry-list-item {
    display: flex;
    justify-content: space-between;
    background: #f8fafc;
    border: 1px solid var(--border-color);
    padding: 0.65rem;
    border-radius: 8px;
    font-size: 0.8rem;
}

/* Shopping layouts */
.shopping-layout {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.shopping-input-bar {
    display: flex;
    gap: 0.5rem;
}

.shopping-input-bar input {
    flex: 1;
    background: #ffffff;
    border: 1px solid var(--border-color);
    padding: 0.6rem 0.85rem;
    border-radius: 8px;
    font-size: 0.85rem;
    outline: none;
}

.shopping-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.shopping-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
}

.shopping-list li.completed {
    opacity: 0.5;
}

.shopping-list li.completed span {
    text-decoration: line-through;
}

.shopping-list-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

/* Shop styles */
.shop-mobile-layout {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.shop-import-section {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    padding: 1rem;
    border-radius: 16px;
}

.shop-import-section h3 {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
}

.import-shopping-box {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.import-shop-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8fafc;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
}

.product-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 0.85rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.product-image {
    height: 80px;
    background: #f1f5f9;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    color: var(--accent-pink);
}

.product-title {
    font-size: 0.8rem;
    font-weight: 700;
}

.product-price {
    font-size: 0.75rem;
    color: var(--accent-pink);
    font-weight: 700;
}

/* Scan section screen UI */
.scan-lock-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 1rem;
    padding: 3rem 1rem;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
}

.lock-icon-large {
    font-size: 3rem;
    color: var(--accent-gold);
}

.scan-lock-screen p {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
}

.scan-working-screen {
    position: relative;
    min-height: 400px;
}

.scan-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.scan-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
}

.icon-large {
    font-size: 2.5rem;
}

.scan-card h3 {
    font-size: 0.95rem;
    font-weight: 700;
}

.scan-card p {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin-bottom: 0.25rem;
}

.scanner-simulation {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
}

.scanner-line {
    width: 80%;
    height: 3px;
    background: var(--primary);
    box-shadow: 0 0 10px var(--primary);
    animation: scannerScan 2s infinite ease-in-out;
}

@keyframes scannerScan {
    0%, 100% { transform: translateY(-80px); }
    50% { transform: translateY(80px); }
}

.scanner-text {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--primary-hover);
}

/* Toast alert */
.toast {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translate(-50%, 100px);
    background: #1e293b;
    color: #ffffff;
    padding: 0.6rem 1.2rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    z-index: 3000;
    opacity: 0;
    transition: var(--transition-smooth);
    pointer-events: none;
    white-space: nowrap;
}

.toast.active {
    transform: translate(-50%, 0);
    opacity: 1;
}

/* Recipe Steps inside Drawer */
.recipe-modal-content {
    max-height: 85%;
}

.recipe-detail-group {
    margin-bottom: 1.25rem;
}

.recipe-detail-group h4 {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
    color: #b45309;
}

.recipe-detail-group p {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
}

.recipe-ingredients-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.recipe-ingredients-list li {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
}

.missing-ingredient {
    color: var(--accent-red);
}

.recipe-step-item {
    font-size: 0.8rem;
    margin-bottom: 0.4rem;
    line-height: 1.5;
}

/* Media screen query overrides for full mobile screen representation on desktop browsers */
@media (max-width: 480px) {
    .app-container {
        max-width: 100%;
        box-shadow: none;
    }
}

/* Custom Checkbox Styles */
.custom-checkbox {
    width: 14px;
    height: 14px;
    border: 1.5px solid var(--color-text-secondary);
    border-radius: 3px;
    display: inline-block;
    position: relative;
    transition: var(--transition-smooth);
}

.custom-checkbox.checked {
    background-color: var(--primary);
    border-color: var(--primary);
}

.custom-checkbox.checked::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 1px;
    width: 3px;
    height: 7px;
    border: solid white;
    border-width: 0 1.5px 1.5px 0;
    transform: rotate(45deg);
}
```

---

## 3. app.js

```javascript
/* ==========================================================================
   Remindish.AI MVP - Core Logic & Interactive Simulation
   ========================================================================== */

// --- Data Store ---
const STATE = {
    isPremium: false,
    currentTab: 'fridge',
    fridgeItems: [
        { id: 1, name: '新鮮牛奶', category: 'dairy', expiryDays: 1, qty: '1 瓶', status: 'danger' },
        { id: 2, name: '牛番茄', category: 'veg', expiryDays: 2, qty: '3 顆', status: 'danger' },
        { id: 3, name: '雞胸肉', category: 'meat', expiryDays: 1, qty: '200g', status: 'danger' },
        { id: 4, name: '青花菜', category: 'veg', expiryDays: 6, qty: '1 朵', status: 'safe' },
        { id: 5, name: '雞蛋', category: 'dairy', expiryDays: 14, qty: '8 顆', status: 'safe' },
        { id: 6, name: '蘋果', category: 'veg', expiryDays: 10, qty: '2 顆', status: 'safe' }
    ],
    recipes: [
        {
            id: 1,
            title: '番茄燉雞胸肉',
            tag: '家常快炒',
            cookTime: '20 分鐘',
            matches: ['雞胸肉', '牛番茄'],
            allIngredients: [
                { name: '雞胸肉', qty: '200g', available: true },
                { name: '牛番茄', qty: '2 顆', available: true },
                { name: '洋蔥', qty: '0.5 顆', available: false } // missing
            ],
            steps: [
                '1. 將雞胸肉切丁，番茄切塊，洋蔥切絲備用。',
                '2. 熱鍋下油，先將洋蔥絲炒至軟化飄香。',
                '3. 加入雞胸肉丁炒至變色。',
                '4. 倒入番茄塊與少許水，加蓋小火悶煮 10 分鐘直至雞肉軟嫩、番茄成糊狀。',
                '5. 加鹽與黑胡椒調味即可起鍋。'
            ]
        },
        {
            id: 2,
            title: '奶油蘑菇燉菜 (含牛奶)',
            tag: '精緻湯品',
            cookTime: '25 分鐘',
            matches: ['新鮮牛奶', '青花菜'],
            allIngredients: [
                { name: '新鮮牛奶', qty: '200ml', available: true },
                { name: '青花菜', qty: '0.5 朵', available: true },
                { name: '蘑菇', qty: '100g', available: false } // missing
            ],
            steps: [
                '1. 青花菜切小朵汆燙備用，蘑菇切片。',
                '2. 鍋中融化奶油，爆香蒜末，下蘑菇片炒軟。',
                '3. 加入少許麵粉拌炒，再分次緩慢倒入鮮奶攪拌均勻。',
                '4. 放入青花菜，小火煮至醬汁濃稠。',
                '5. 加鹽、起司粉調味即可。'
            ]
        },
        {
            id: 3,
            title: '番茄炒蛋',
            tag: '家常快炒',
            cookTime: '10 分鐘',
            matches: ['牛番茄', '雞蛋'],
            allIngredients: [
                { name: '牛番茄', qty: '2 顆', available: true },
                { name: '雞蛋', qty: '3 顆', available: true },
                { name: '蔥花', qty: '少許', available: false }
            ],
            steps: [
                '1. 雞蛋打散加少許鹽；番茄切滾刀塊。',
                '2. 熱鍋下油，倒入蛋液快速翻炒至半熟，盛出備用。',
                '3. 鍋內補少許油，放入番茄塊翻炒，加少許糖與水，煮至番茄出汁變軟。',
                '4. 倒回炒好的雞蛋，快速翻炒均勻，撒上蔥花即可。'
            ]
        },
        {
            id: 4,
            title: '清炒蒜香青花菜',
            tag: '低卡減脂',
            cookTime: '10 分鐘',
            matches: ['青花菜'],
            allIngredients: [
                { name: '青花菜', qty: '1 朵', available: true },
                { name: '蒜頭', qty: '3 瓣', available: true }
            ],
            steps: [
                '1. 青花菜切小朵，蒜頭切片。',
                '2. 燒一鍋水，加少許鹽，將青花菜汆燙 1 分鐘後撈出瀝乾。',
                '3. 熱鍋下油，放入蒜片爆香。',
                '4. 倒入青花菜快速大火翻炒。',
                '5. 加入適量鹽調味即可上桌。'
            ]
        },
        {
            id: 5,
            title: '香煎雞胸肉溫沙拉',
            tag: '低卡減脂',
            cookTime: '15 分鐘',
            matches: ['雞胸肉', '蘋果'],
            allIngredients: [
                { name: '雞胸肉', qty: '200g', available: true },
                { name: '蘋果', qty: '0.5 顆', available: true },
                { name: '生菜', qty: '100g', available: false }
            ],
            steps: [
                '1. 雞胸肉用鹽、黑胡椒、橄欖油醃製 10 分鐘。',
                '2. 蘋果切薄片備用。',
                '3. 熱平底鍋，將雞胸肉煎至兩面金黃熟透（每面約3-4分鐘），取出切片。',
                '4. 盤中鋪上生菜與蘋果片。',
                '5. 放上雞胸肉片，淋上喜愛的沙拉醬汁（推薦油醋醬）。'
            ]
        }
    ],
    shoppingList: [
        { name: '洋蔥', completed: false },
        { name: '蒜頭', completed: true }
    ],
    cart: [],
    selectedFridgeCategory: 'all',
    selectedRecipeIngredients: [1, 2, 3] // Default selected expiring items (Milk, Tomato, Chicken)
};

// --- DOM Cache ---
const DOM = {
    tierToggle: document.getElementById('tier-toggle'),
    pricingModalTrigger: document.getElementById('pricing-modal-trigger'),
    pricingModal: document.getElementById('pricing-modal'),
    closePricingModal: document.getElementById('close-pricing-modal'),
    
    // Tabs
    navItems: document.querySelectorAll('.nav-item'),
    tabSections: document.querySelectorAll('.tab-section'),
    
    // Magic Banner
    magicBanner: document.getElementById('magic-banner'),
    magicSolveBtn: document.getElementById('magic-solve-btn'),
    expiringCount: document.getElementById('expiring-count'),
    
    // Fridge
    fridgeGrid: document.getElementById('fridge-grid'),
    fridgeFoldersList: document.getElementById('fridge-folders-list'),
    openAddModal: document.getElementById('open-add-modal'),
    addItemModal: document.getElementById('add-item-modal'),
    closeAddModal: document.getElementById('close-add-modal'),
    cancelAddBtn: document.getElementById('cancel-add-btn'),
    saveAddBtn: document.getElementById('save-add-btn'),
    inputName: document.getElementById('input-name'),
    inputCategory: document.getElementById('input-category'),
    inputDays: document.getElementById('input-days'),
    inputQuantity: document.getElementById('input-quantity'),
    addFolderBtn: document.getElementById('add-folder-btn'),
    
    // Calendar
    calendarDaysContainer: document.getElementById('calendar-days-container'),
    selectedDateInfo: document.getElementById('selected-date-info'),
    expiryItemsList: document.getElementById('expiry-items-list'),
    
    // Recipe
    recipeLimitText: document.getElementById('recipe-limit-text'),
    recipeIngredientsChips: document.getElementById('recipe-ingredients-chips'),
    generateRecipesBtn: document.getElementById('generate-recipes-btn'),
    recipeCategoriesBar: document.getElementById('recipe-categories-bar'),
    recipesGrid: document.getElementById('recipes-grid'),
    recipeDetailModal: document.getElementById('recipe-detail-modal'),
    closeRecipeDetail: document.getElementById('close-recipe-detail'),
    recipeDetailBody: document.getElementById('recipe-detail-body'),
    recipeDetailTitle: document.getElementById('recipe-detail-title'),
    
    // Shopping
    shoppingItemInput: document.getElementById('shopping-item-input'),
    addShoppingBtn: document.getElementById('add-shopping-btn'),
    shoppingListUl: document.getElementById('shopping-list-ul'),
    clearShoppingBtn: document.getElementById('clear-shopping-btn'),
    goToShopBtn: document.getElementById('go-to-shop-btn'),
    
    // Shop
    importShoppingBox: document.getElementById('import-shopping-box'),
    productsGrid: document.getElementById('products-grid'),
    cartCount: document.getElementById('cart-count'),
    
    // Scan
    scanLockScreen: document.getElementById('scan-lock-screen'),
    scanWorkingScreen: document.getElementById('scan-working-screen'),
    scanReceiptCard: document.getElementById('scan-receipt-card'),
    scanFridgeCard: document.getElementById('scan-fridge-card'),
    scannerSim: document.getElementById('scanner-sim'),
    scannerSimText: document.getElementById('scanner-sim-text'),
    scanUpgradeBtn: document.getElementById('scan-upgrade-btn'),
    
    // Ad
    adOverlay: document.getElementById('ad-overlay'),
    adTimerText: document.getElementById('ad-timer-text'),
    adSkipBtn: document.getElementById('ad-skip-btn'),
    adUpgradeBtn: document.getElementById('ad-upgrade-btn'),
    
    // General
    toast: document.getElementById('toast'),
    chooseFreeBtn: document.getElementById('choose-free-btn'),
    upgradeMonthlyBtn: document.getElementById('upgrade-monthly-btn'),
    upgradeYearlyBtn: document.getElementById('upgrade-yearly-btn'),
    downloadJpgBtn: document.getElementById('download-jpg-btn')
};

// --- Toast helper ---
function showToast(message) {
    DOM.toast.innerText = message;
    DOM.toast.classList.add('active');
    setTimeout(() => {
        DOM.toast.classList.remove('active');
    }, 2500);
}

// --- Initialize App ---
function init() {
    registerEventListeners();
    renderFridge();
    renderCalendar();
    renderRecipeIngredientsChips();
    renderRecipes();
    renderShoppingList();
    renderShopProducts();
    updateUIForTier();
}

// --- Render Functions ---

// Render Fridge items
function renderFridge() {
    DOM.fridgeGrid.innerHTML = '';
    const filtered = STATE.fridgeItems.filter(item => {
        if (STATE.selectedFridgeCategory === 'all') return true;
        return item.category === STATE.selectedFridgeCategory;
    });
    
    if (filtered.length === 0) {
        DOM.fridgeGrid.innerHTML = `<div class="selected-date-info">此分類下沒有食材。</div>`;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = `food-card expiry-${item.status}`;
        
        let statusText = '';
        if (item.status === 'danger') statusText = '快過期了！';
        else if (item.status === 'warning') statusText = '建議盡快使用';
        else statusText = '新鮮安全';
        
        card.innerHTML = `
            <div class="food-card-left">
                <span class="food-title">${item.name}</span>
                <span class="food-qty">數量：${item.qty}</span>
                <div class="food-expiry-info">
                    <i class="fa-regular fa-clock"></i>
                    <span>保鮮剩餘 <span class="expiry-days-text">${item.expiryDays} 天</span> (${statusText})</span>
                </div>
            </div>
            <button class="action-icon-btn remove-food-btn" data-id="${item.id}" title="取出食材">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        `;
        
        // Remove item listener
        card.querySelector('.remove-food-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            STATE.fridgeItems = STATE.fridgeItems.filter(i => i.id !== item.id);
            showToast(`已從冰箱取出 ${item.name}`);
            renderFridge();
            renderCalendar();
            renderRecipeIngredientsChips();
            updateExpiringCount();
        });
        
        DOM.fridgeGrid.appendChild(card);
    });
}

// Render Calendar
function renderCalendar() {
    DOM.calendarDaysContainer.innerHTML = '';
    
    // We mock June 2026. June 1st is a Monday.
    // 0 is Sunday, 1 is Monday.
    // We add empty slots for Sun (May 31st)
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day-cell other-month';
    emptyCell.innerText = '31';
    DOM.calendarDaysContainer.appendChild(emptyCell);
    
    for (let day = 1; day <= 30; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day-cell';
        cell.innerText = day;
        
        // Check if any ingredient expires on 2026/06/(day)
        // Today is mock 2026/06/04.
        // item.expiryDays is relative to today (4th).
        // e.g. expiryDays = 1 means expires on 5th.
        const expiryDate = 4 + 0; // Today is 4th.
        const itemsExpiring = STATE.fridgeItems.filter(item => {
            const expDay = 4 + item.expiryDays;
            return expDay === day;
        });
        
        if (itemsExpiring.length > 0) {
            // Find highest risk status
            let dotType = 'safe';
            if (itemsExpiring.some(i => i.status === 'danger')) dotType = 'danger';
            else if (itemsExpiring.some(i => i.status === 'warning')) dotType = 'warning';
            
            const dot = document.createElement('span');
            dot.className = `event-dot ${dotType}`;
            cell.appendChild(dot);
        }
        
        // Highlight active date (default today is June 4th)
        if (day === 4) {
            cell.classList.add('active');
        }
        
        cell.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day-cell').forEach(c => c.classList.remove('active'));
            cell.classList.add('active');
            renderExpiryItemsForDay(day);
        });
        
        DOM.calendarDaysContainer.appendChild(cell);
    }
    
    // Initial display for today (June 4th)
    renderExpiryItemsForDay(4);
}

function renderExpiryItemsForDay(day) {
    DOM.selectedDateInfo.innerText = `2026年6月${day}日`;
    DOM.expiryItemsList.innerHTML = '';
    
    const items = STATE.fridgeItems.filter(item => {
        const expDay = 4 + item.expiryDays;
        return expDay === day;
    });
    
    if (items.length === 0) {
        DOM.expiryItemsList.innerHTML = '<div class="selected-date-info">這一天沒有即將到期的食材 🎉</div>';
        return;
    }
    
    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'expiry-list-item';
        itemEl.innerHTML = `
            <span class="expiry-list-item-title">${item.name}</span>
            <span class="food-qty expiry-${item.status}">${item.qty}</span>
        `;
        DOM.expiryItemsList.appendChild(itemEl);
    });
}

// Render Recipe Ingredient Selector Chips
function renderRecipeIngredientsChips() {
    DOM.recipeIngredientsChips.innerHTML = '';
    STATE.fridgeItems.forEach(item => {
        const chip = document.createElement('div');
        const isSelected = STATE.selectedRecipeIngredients.includes(item.id);
        chip.className = `ingredient-chip ${isSelected ? 'selected' : ''}`;
        chip.innerHTML = `
            <span class="custom-checkbox ${isSelected ? 'checked' : ''}"></span>
            <span>${item.name}</span>
        `;
        
        chip.addEventListener('click', () => {
            if (isSelected) {
                STATE.selectedRecipeIngredients = STATE.selectedRecipeIngredients.filter(id => id !== item.id);
            } else {
                STATE.selectedRecipeIngredients.push(item.id);
            }
            renderRecipeIngredientsChips();
        });
        
        DOM.recipeIngredientsChips.appendChild(chip);
    });
}

// Render Recipes Results
function renderRecipes() {
    DOM.recipesGrid.innerHTML = '';
    
    // Gather names of selected items
    const selectedNames = STATE.fridgeItems
        .filter(item => STATE.selectedRecipeIngredients.includes(item.id))
        .map(item => item.name);
        
    // Score & match recipes based on how many selected ingredients match
    const scoredRecipes = STATE.recipes.map(recipe => {
        const matched = recipe.matches.filter(m => {
            return selectedNames.some(name => name.includes(m) || m.includes(name));
        });
        return {
            ...recipe,
            matchCount: matched.length
        };
    }).sort((a, b) => b.matchCount - a.matchCount);
    
    // Filter limit: Free shows max 2 recipes, Premium shows all
    const displayLimit = STATE.isPremium ? scoredRecipes.length : 2;
    const recipesToDisplay = scoredRecipes.slice(0, displayLimit);
    
    recipesToDisplay.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        
        const matchedBadge = recipe.matchCount > 0 
            ? `<div class="recipe-match-info">配對冰箱剩食: ${recipe.matches.join(', ')}</div>` 
            : '';
            
        card.innerHTML = `
            <div class="recipe-image-placeholder">
                <span class="recipe-tag-badge">${recipe.tag}</span>
                <i class="fa-solid fa-pizza-slice"></i>
            </div>
            <div class="recipe-card-content">
                <h3>${recipe.title}</h3>
                ${matchedBadge}
                <p class="recipe-ingredients-preview">
                    <strong>食材清單：</strong> ${recipe.allIngredients.map(i => i.name).join('、')}
                </p>
            </div>
            <div class="recipe-card-footer">
                <span class="recipe-cook-time"><i class="fa-regular fa-clock"></i> ${recipe.cookTime}</span>
                <button class="btn btn-secondary btn-recipe-view" data-id="${recipe.id}">查看作法</button>
            </div>
        `;
        
        card.querySelector('.btn-recipe-view').addEventListener('click', () => {
            viewRecipeSteps(recipe);
        });
        
        DOM.recipesGrid.appendChild(card);
    });
}

// Handle Recipe Steps (Ad simulation for Free tier)
function viewRecipeSteps(recipe) {
    if (!STATE.isPremium) {
        // Show Ad modal for 5 seconds
        DOM.adOverlay.classList.add('active');
        DOM.adSkipBtn.classList.add('hidden');
        
        let secondsLeft = 5;
        DOM.adTimerText.innerText = `廣告將於 ${secondsLeft} 秒後結束`;
        
        const adInterval = setInterval(() => {
            secondsLeft--;
            if (secondsLeft > 0) {
                DOM.adTimerText.innerText = `廣告將於 ${secondsLeft} 秒後結束`;
            } else {
                clearInterval(adInterval);
                DOM.adTimerText.innerText = '廣告已播放完畢';
                DOM.adSkipBtn.classList.remove('hidden');
            }
        }, 1000);
        
        // Handle skip button
        const skipHandler = () => {
            DOM.adOverlay.classList.remove('active');
            DOM.adSkipBtn.removeEventListener('click', skipHandler);
            showRecipeDetailModal(recipe);
        };
        DOM.adSkipBtn.addEventListener('click', skipHandler);
        
    } else {
        // Directly show recipe
        showRecipeDetailModal(recipe);
    }
}

function showRecipeDetailModal(recipe) {
    DOM.recipeDetailTitle.innerText = recipe.title;
    DOM.recipeDetailBody.innerHTML = '';
    
    // Ingredients block
    const ingredientsGroup = document.createElement('div');
    ingredientsGroup.className = 'recipe-detail-group';
    ingredientsGroup.innerHTML = `<h4>需要的食材</h4>`;
    
    const ingList = document.createElement('ul');
    ingList.className = 'recipe-ingredients-list';
    
    recipe.allIngredients.forEach(ing => {
        const li = document.createElement('li');
        if (ing.available) {
            li.innerHTML = `<span>${ing.name}</span> <span class="text-green"><i class="fa-solid fa-circle-check"></i> 冰箱已有 (${ing.qty})</span>`;
        } else {
            // Find if already in shopping list
            const inShopping = STATE.shoppingList.some(s => s.name === ing.name);
            const actionIcon = inShopping 
                ? '<span class="text-cyan"><i class="fa-solid fa-circle-check"></i> 已在清單</span>' 
                : `<button class="btn btn-secondary add-to-shop-btn" data-name="${ing.name}" style="padding: 0.15rem 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-plus"></i> 加入採買清單</button>`;
                
            li.innerHTML = `
                <span class="missing-ingredient">${ing.name} (缺)</span> 
                <span>${actionIcon}</span>
            `;
            
            if (!inShopping) {
                li.querySelector('.add-to-shop-btn').addEventListener('click', () => {
                    STATE.shoppingList.push({ name: ing.name, completed: false });
                    showToast(`已將 ${ing.name} 加入採買清單`);
                    showRecipeDetailModal(recipe); // reload view
                    renderShoppingList();
                });
            }
        }
        ingList.appendChild(li);
    });
    
    ingredientsGroup.appendChild(ingList);
    DOM.recipeDetailBody.appendChild(ingredientsGroup);
    
    // Steps block
    const stepsGroup = document.createElement('div');
    stepsGroup.className = 'recipe-detail-group';
    stepsGroup.innerHTML = `<h4>烹飪步驟</h4>`;
    
    recipe.steps.forEach(step => {
        const stepEl = document.createElement('p');
        stepEl.className = 'recipe-step-item';
        stepEl.innerText = step;
        stepsGroup.appendChild(stepEl);
    });
    
    DOM.recipeDetailBody.appendChild(stepsGroup);
    DOM.recipeDetailModal.classList.add('active');
}

// Render Shopping List
function renderShoppingList() {
    DOM.shoppingListUl.innerHTML = '';
    
    if (STATE.shoppingList.length === 0) {
        DOM.shoppingListUl.innerHTML = '<li class="selected-date-info">採買清單目前是空的 ✨</li>';
        return;
    }
    
    STATE.shoppingList.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = item.completed ? 'completed' : '';
        li.innerHTML = `
            <div class="shopping-list-checkbox">
                <i class="fa-regular ${item.completed ? 'fa-square-check text-green' : 'fa-square'}"></i>
                <span>${item.name}</span>
            </div>
            <button class="action-icon-btn remove-shop-item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
        `;
        
        // Toggle completed
        li.querySelector('.shopping-list-checkbox').addEventListener('click', () => {
            item.completed = !item.completed;
            renderShoppingList();
            renderShopImportBox();
        });
        
        // Delete item
        li.querySelector('.remove-shop-item').addEventListener('click', (e) => {
            e.stopPropagation();
            STATE.shoppingList = STATE.shoppingList.filter((_, i) => i !== index);
            renderShoppingList();
            renderShopImportBox();
        });
        
        DOM.shoppingListUl.appendChild(li);
    });
    
    renderShopImportBox();
}

// Render Shopping List Import Box in Shop tab
function renderShopImportBox() {
    DOM.importShoppingBox.innerHTML = '';
    const pendingItems = STATE.shoppingList.filter(item => !item.completed);
    
    if (pendingItems.length === 0) {
        DOM.importShoppingBox.innerHTML = '<p class="select-tip">無待採買食材</p>';
        return;
    }
    
    pendingItems.forEach(item => {
        const row = document.createElement('div');
        row.className = 'import-shop-item';
        row.innerHTML = `
            <span>${item.name}</span>
            <button class="btn btn-secondary quick-buy-btn" data-name="${item.name}" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;">加入購物車</button>
        `;
        
        row.querySelector('.quick-buy-btn').addEventListener('click', () => {
            addToCart(item.name, 35); // mock price 35
        });
        
        DOM.importShoppingBox.appendChild(row);
    });
}

// Render Shop Tab Products
function renderShopProducts() {
    const products = [
        { name: '新鮮牛番茄', price: 49, icon: 'fa-apple-whole' },
        { name: '冷藏鮮乳', price: 89, icon: 'fa-prescription-bottle-milk' },
        { name: '新鮮雞胸肉', price: 99, icon: 'fa-drumstick-bite' },
        { name: '有機青花菜', price: 39, icon: 'fa-seedling' },
        { name: '嚴選土雞蛋', price: 75, icon: 'fa-egg' },
        { name: '新鮮蘑菇', price: 45, icon: 'fa-mushroom' }
    ];
    
    DOM.productsGrid.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image"><i class="fa-solid ${p.icon}"></i></div>
            <div class="product-title">${p.name}</div>
            <div class="product-price">NT$ ${p.price}</div>
            <button class="btn btn-secondary btn-block add-product-cart-btn">加入購物車</button>
        `;
        
        card.querySelector('.add-product-cart-btn').addEventListener('click', () => {
            addToCart(p.name, p.price);
        });
        
        DOM.productsGrid.appendChild(card);
    });
}

function addToCart(name, price) {
    STATE.cart.push({ name, price });
    DOM.cartCount.innerText = STATE.cart.length;
    showToast(`🛒 已加入購物車: ${name}`);
    
    // Mark as completed in shopping list if matches
    const shopIndex = STATE.shoppingList.findIndex(s => s.name === name || name.includes(s.name));
    if (shopIndex !== -1) {
        STATE.shoppingList[shopIndex].completed = true;
        renderShoppingList();
    }
}

// --- Freemium Interface Switcher ---
function updateUIForTier() {
    if (STATE.isPremium) {
        DOM.recipeLimitText.innerText = 'Premium版 (已解鎖 4~5 道菜，無廣告)';
        DOM.recipeCategoriesBar.querySelector('.recipe-cat-tags').classList.remove('locked');
        DOM.recipeCategoriesBar.querySelector('.lock-icon').classList.add('hidden');
        
        // Fridge folders lock
        DOM.addFolderBtn.innerHTML = '<i class="fa-solid fa-folder-plus"></i> 新增分類';
        DOM.addFolderBtn.className = 'folder-tab';
        
        // Scan Lock screen toggle
        DOM.scanLockScreen.classList.add('hidden');
        DOM.scanWorkingScreen.classList.remove('hidden');
        
        showToast('🚀 已成功切換至 Premium 訂閱版功能！');
    } else {
        DOM.recipeLimitText.innerText = '免費版 (限推薦 2 道菜)';
        DOM.recipeCategoriesBar.querySelector('.recipe-cat-tags').classList.add('locked');
        DOM.recipeCategoriesBar.querySelector('.lock-icon').classList.remove('hidden');
        
        // Fridge folders lock
        DOM.addFolderBtn.innerHTML = '<i class="fa-solid fa-folder-plus"></i> 新增分類 <i class="fa-solid fa-lock lock-icon"></i>';
        DOM.addFolderBtn.className = 'folder-tab add-folder-btn-lock';
        
        // Scan Lock screen toggle
        DOM.scanLockScreen.classList.remove('hidden');
        DOM.scanWorkingScreen.classList.add('hidden');
    }
    
    renderRecipes();
}

// Update banner expiring count
function updateExpiringCount() {
    const dangerCount = STATE.fridgeItems.filter(i => i.status === 'danger').length;
    DOM.expiringCount.innerText = dangerCount;
    if (dangerCount === 0) {
        DOM.magicBanner.classList.add('fade-out');
    } else {
        DOM.magicBanner.classList.remove('fade-out');
    }
}

// --- Event Listeners Register ---
function registerEventListeners() {
    
    // Premium Toggle Switch
    DOM.tierToggle.addEventListener('change', (e) => {
        STATE.isPremium = e.target.checked;
        updateUIForTier();
    });
    
    // Modal Toggles
    DOM.pricingModalTrigger.addEventListener('click', () => DOM.pricingModal.classList.add('active'));
    DOM.closePricingModal.addEventListener('click', () => DOM.pricingModal.classList.remove('remove', DOM.pricingModal.classList.remove('active')));
    
    // Tabs Navigation
    DOM.navItems.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.navItems.forEach(n => n.classList.remove('active'));
            btn.classList.add('active');
            
            const targetTab = btn.getAttribute('data-tab');
            STATE.currentTab = targetTab;
            
            DOM.tabSections.forEach(sec => {
                sec.classList.remove('active');
                if (sec.id === `tab-${targetTab}`) {
                    sec.classList.add('active');
                }
            });
        });
    });
    
    // Magic Moment solving button
    DOM.magicSolveBtn.addEventListener('click', () => {
        // Go to recipe tab
        const recipeNav = Array.from(DOM.navItems).find(n => n.getAttribute('data-tab') === 'recipes');
        if (recipeNav) recipeNav.click();
        
        // Highlight logic
        const expiringItemIds = STATE.fridgeItems.filter(i => i.status === 'danger').map(i => i.id);
        STATE.selectedRecipeIngredients = expiringItemIds;
        renderRecipeIngredientsChips();
        renderRecipes();
        showToast('🔥 已帶入即將過期食材，並自動為您配對最佳剩食食譜！');
        
        // Close banner after action
        DOM.magicBanner.classList.add('fade-out');
    });
    
    // Fridge Category Folder Switch
    DOM.fridgeFoldersList.addEventListener('click', (e) => {
        const tab = e.target.closest('.folder-tab');
        if (!tab) return;
        
        if (tab.classList.contains('add-folder-btn-lock') && !STATE.isPremium) {
            // Trigger subscription pricing modal
            DOM.pricingModal.classList.add('active');
            showToast('🔒 該功能為 Premium 會員專屬，請先升級');
            return;
        }
        
        if (tab.id === 'add-folder-btn' && STATE.isPremium) {
            const folderName = prompt('請輸入自訂分類資料夾名稱：');
            if (folderName) {
                // Mock add folder
                const newBtn = document.createElement('button');
                newBtn.className = 'folder-tab';
                newBtn.setAttribute('data-category', 'custom');
                newBtn.innerText = folderName;
                DOM.fridgeFoldersList.insertBefore(newBtn, DOM.addFolderBtn);
                showToast(`已建立資料夾: ${folderName}`);
            }
            return;
        }
        
        document.querySelectorAll('.folder-tab').forEach(f => f.classList.remove('active'));
        tab.classList.add('active');
        
        STATE.selectedFridgeCategory = tab.getAttribute('data-category');
        renderFridge();
    });
    
    // Manual Food Add modals
    DOM.openAddModal.addEventListener('click', () => DOM.addItemModal.classList.add('active'));
    DOM.closeAddModal.addEventListener('click', () => DOM.addItemModal.classList.remove('active'));
    DOM.cancelAddBtn.addEventListener('click', () => DOM.addItemModal.classList.remove('active'));
    
    DOM.saveAddBtn.addEventListener('click', () => {
        const name = DOM.inputName.value.trim();
        const category = DOM.inputCategory.value;
        const days = parseInt(DOM.inputDays.value);
        const qty = DOM.inputQuantity.value.trim() || '1 份';
        
        if (!name) {
            showToast('⚠️ 請輸入食材名稱！');
            return;
        }
        
        let status = 'safe';
        if (days <= 2) status = 'danger';
        else if (days <= 4) status = 'warning';
        
        const newItem = {
            id: Date.now(),
            name,
            category,
            expiryDays: days,
            qty,
            status
        };
        
        STATE.fridgeItems.unshift(newItem);
        renderFridge();
        renderCalendar();
        renderRecipeIngredientsChips();
        updateExpiringCount();
        
        DOM.addItemModal.classList.remove('active');
        DOM.inputName.value = '';
        showToast(`已手動新增食材: ${name}`);
    });
    
    // Close Recipe steps modal
    DOM.closeRecipeDetail.addEventListener('click', () => DOM.recipeDetailModal.classList.remove('active'));
    
    // Shopping Tab Actions
    DOM.addShoppingBtn.addEventListener('click', () => {
        const val = DOM.shoppingItemInput.value.trim();
        if (!val) return;
        
        STATE.shoppingList.push({ name: val, completed: false });
        DOM.shoppingItemInput.value = '';
        renderShoppingList();
        showToast(`已將 ${val} 新增至採買清單`);
    });
    
    DOM.clearShoppingBtn.addEventListener('click', () => {
        STATE.shoppingList = STATE.shoppingList.filter(item => !item.completed);
        renderShoppingList();
        showToast('已清除已採買食材項目');
    });
    
    DOM.goToShopBtn.addEventListener('click', () => {
        const shopNav = Array.from(DOM.navItems).find(n => n.getAttribute('data-tab') === 'shop');
        if (shopNav) shopNav.click();
    });
    
    // Premium scan tab mock simulators
    DOM.scanUpgradeBtn.addEventListener('click', () => {
        DOM.pricingModal.classList.add('active');
    });
    
    DOM.scanReceiptCard.addEventListener('click', () => {
        simulateScan('正在掃描並解析全聯發票...', [
            { name: '產銷履歷豬梅花肉片', category: 'meat', expiryDays: 2, qty: '1 盒', status: 'danger' },
            { name: '有機小菠菜', category: 'veg', expiryDays: 3, qty: '1 包', status: 'warning' },
            { name: '瑞穗全脂鮮乳', category: 'dairy', expiryDays: 5, qty: '930ml', status: 'safe' }
        ]);
    });
    
    DOM.scanFridgeCard.addEventListener('click', () => {
        simulateScan('正在用 AI 影像模型分析食材照片...', [
            { name: '新鮮牛番茄', category: 'veg', expiryDays: 4, qty: '4 顆', status: 'warning' },
            { name: '優質大雞蛋', category: 'dairy', expiryDays: 12, qty: '6 顆', status: 'safe' }
        ]);
    });
    
    // Mock simulation scanner
    function simulateScan(text, mockResultItems) {
        DOM.scannerSimText.innerText = text;
        DOM.scannerSim.classList.remove('hidden');
        
        setTimeout(() => {
            DOM.scannerSim.classList.add('hidden');
            
            // Add items to state
            mockResultItems.forEach(item => {
                item.id = Date.now() + Math.random();
                STATE.fridgeItems.unshift(item);
            });
            
            renderFridge();
            renderCalendar();
            renderRecipeIngredientsChips();
            updateExpiringCount();
            
            showToast(`🎉 AI 辨識成功！自動匯入 ${mockResultItems.length} 項食材到您的冰箱。`);
            
            // Switch back to Fridge tab to show the result
            const fridgeNav = Array.from(DOM.navItems).find(n => n.getAttribute('data-tab') === 'fridge');
            if (fridgeNav) fridgeNav.click();
            
        }, 2200);
    }
    
    // Pricing Upgrade buttons handler inside billing modal
    DOM.chooseFreeBtn.addEventListener('click', () => {
        STATE.isPremium = false;
        DOM.tierToggle.checked = false;
        updateUIForTier();
        DOM.pricingModal.classList.remove('active');
    });
    
    DOM.upgradeMonthlyBtn.addEventListener('click', () => {
        STATE.isPremium = true;
        DOM.tierToggle.checked = true;
        updateUIForTier();
        DOM.pricingModal.classList.remove('active');
        showToast('🎉 成功訂閱 Premium 月計劃 (NT$120/月)！無廣告與 AI 功能已解鎖。');
    });
    
    DOM.upgradeYearlyBtn.addEventListener('click', () => {
        STATE.isPremium = true;
        DOM.tierToggle.checked = true;
        updateUIForTier();
        DOM.pricingModal.classList.remove('active');
        showToast('🎉 成功訂閱 Premium 年計劃 (NT$1320/年)！恭喜解鎖全部進階功能，年繳超值划算。');
    });
    
    DOM.adUpgradeBtn.addEventListener('click', () => {
        DOM.adOverlay.classList.remove('active');
        DOM.pricingModal.classList.add('active');
    });
    
    // Download assets listener
    DOM.downloadJpgBtn.addEventListener('click', triggerJpgDownloads);
}

// Browser-based SVG-to-JPEG exporter
function triggerJpgDownloads() {
    const icons = [
        { name: 'remindish_logo', url: 'images/logo.svg' },
        { name: 'premium_icon', url: 'images/premium.svg' },
        { name: 'alert_icon', url: 'images/alert.svg' },
        { name: 'fridge_icon', url: 'images/fridge.svg' },
        { name: 'calendar_icon', url: 'images/calendar.svg' },
        { name: 'recipes_icon', url: 'images/recipes.svg' },
        { name: 'shopping_icon', url: 'images/shopping.svg' },
        { name: 'shop_icon', url: 'images/shop.svg' },
        { name: 'scan_icon', url: 'images/scan.svg' }
    ];

    icons.forEach((icon, index) => {
        setTimeout(() => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 512;
                const ctx = canvas.getContext('2d');
                
                // Draw white background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw SVG icon centered with padding
                const size = 384;
                const offset = (512 - size) / 2;
                ctx.drawImage(img, offset, offset, size, size);
                
                // Convert to JPG data URL
                const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                
                // Trigger download
                const link = document.createElement('a');
                link.download = `${icon.name}.jpg`;
                link.href = dataUrl;
                link.click();
            };
            img.crossOrigin = 'anonymous';
            img.src = icon.url;
        }, index * 400); // 400ms delay per download
    });
    
    showToast('📦 開始下載全套高解析度 JPG 圖檔！');
}

// Window load trigger
window.addEventListener('load', init);
DOM.pricingModal.addEventListener('click', (e) => {
    if (e.target === DOM.pricingModal) DOM.pricingModal.classList.remove('active');
});
DOM.addItemModal.addEventListener('click', (e) => {
    if (e.target === DOM.addItemModal) DOM.addItemModal.classList.remove('active');
});
DOM.recipeDetailModal.addEventListener('click', (e) => {
    if (e.target === DOM.recipeDetailModal) DOM.recipeDetailModal.classList.remove('active');
});
```
