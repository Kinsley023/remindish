/* ==========================================================================
   Remindish MVP - Core Logic & Interactive Simulation
   ========================================================================== */

const GEMINI_API_KEY = ""; // 👈 想要測試真實 AI 時，可在此填入您的 Gemini API 金鑰

// --- Data Store ---
const STATE = {
    isPremium: false,
    geminiKey: GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '',
    scanImageData: null,
    cameraStreamObj: null,
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
    selectedRecipeIngredients: [1, 2, 3], // Default selected expiring items (Milk, Tomato, Chicken)
    selectedRecipeCategory: '全部'
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
    recipeSearchInput: document.getElementById('recipe-search-input'),
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
    scanCameraTrigger: document.getElementById('scan-camera-trigger'),
    scanUploadTrigger: document.getElementById('scan-upload-trigger'),
    cameraPreviewBox: document.getElementById('camera-preview-box'),
    cameraStream: document.getElementById('camera-stream'),
    closeCameraBtn: document.getElementById('close-camera-btn'),
    capturePhotoBtn: document.getElementById('capture-photo-btn'),
    imagePreviewBox: document.getElementById('image-preview-box'),
    scannedImagePreview: document.getElementById('scanned-image-preview'),
    recaptureBtn: document.getElementById('recapture-btn'),
    analyzePhotoBtn: document.getElementById('analyze-photo-btn'),
    scanOptionsPanel: document.getElementById('scan-options-panel'),
    scanFileInput: document.getElementById('scan-file-input'),
    scanCanvas: document.getElementById('scan-canvas'),
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
    
    // Get search query
    const searchQuery = DOM.recipeSearchInput ? DOM.recipeSearchInput.value.trim().toLowerCase() : '';
    
    // Gather names of selected items
    const selectedNames = STATE.fridgeItems
        .filter(item => STATE.selectedRecipeIngredients.includes(item.id))
        .map(item => item.name);
        
    // Score & match recipes based on how many selected ingredients match
    let scoredRecipes = STATE.recipes.map(recipe => {
        const matched = recipe.matches.filter(m => {
            return selectedNames.some(name => name.includes(m) || m.includes(name));
        });
        return {
            ...recipe,
            matchCount: matched.length
        };
    });
    
    // Filter by search query if present
    if (searchQuery) {
        scoredRecipes = scoredRecipes.filter(recipe => {
            const matchTitle = recipe.title.toLowerCase().includes(searchQuery);
            const matchIngredients = recipe.allIngredients.some(ing => ing.name.toLowerCase().includes(searchQuery));
            return matchTitle || matchIngredients;
        });
    }

    // Filter by recipe category tag if premium
    if (STATE.isPremium && STATE.selectedRecipeCategory && STATE.selectedRecipeCategory !== '全部') {
        scoredRecipes = scoredRecipes.filter(recipe => recipe.tag === STATE.selectedRecipeCategory);
    }
    
    // Sort by match count descending
    scoredRecipes.sort((a, b) => b.matchCount - a.matchCount);
    
    // Filter limit: Free shows max 2 recipes, Premium shows all
    const displayLimit = STATE.isPremium ? scoredRecipes.length : 2;
    const recipesToDisplay = scoredRecipes.slice(0, displayLimit);
    
    if (recipesToDisplay.length === 0) {
        DOM.recipesGrid.innerHTML = `<div class="selected-date-info" style="grid-column: 1 / -1; text-align: center; margin-top: 2rem; color: var(--color-text-secondary);">找不到符合搜尋條件的食譜 🍳</div>`;
        return;
    }
    
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
        
        // Reset recipe category filter tags to '全部'
        const tags = DOM.recipeCategoriesBar.querySelectorAll('.recipe-tag');
        tags.forEach(t => t.classList.remove('active'));
        if (tags[0]) tags[0].classList.add('active');
        STATE.selectedRecipeCategory = '全部';
        
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
        if (STATE.currentTab === 'scan') {
            if (STATE.isPremium) {
                startCameraStream();
            } else {
                stopCameraStream();
            }
        }
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

            if (targetTab === 'scan') {
                if (STATE.isPremium) {
                    startCameraStream();
                }
            } else {
                stopCameraStream();
            }
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

    // Recipe Category Tags Switch
    const recipeTagsContainer = DOM.recipeCategoriesBar.querySelector('.recipe-cat-tags');
    recipeTagsContainer.addEventListener('click', (e) => {
        const tag = e.target.closest('.recipe-tag');
        if (!tag) return;
        
        if (!STATE.isPremium) {
            // Free user: show pricing modal
            DOM.pricingModal.classList.add('active');
            showToast('🔒 篩選食譜分類為 Premium 專屬功能，請先升級');
            return;
        }
        
        // Active visual state toggle
        recipeTagsContainer.querySelectorAll('.recipe-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        
        STATE.selectedRecipeCategory = tag.innerText.trim();
        renderRecipes();
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
    
    // Recipe Search Input Listener
    DOM.recipeSearchInput.addEventListener('input', () => {
        renderRecipes();
    });
    
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
    
    // Premium scan tab event listeners
    DOM.scanUpgradeBtn.addEventListener('click', () => {
        DOM.pricingModal.classList.add('active');
    });

    // Start Camera Stream function
    async function startCameraStream() {
        DOM.scanOptionsPanel.classList.add('hidden');
        DOM.cameraPreviewBox.classList.remove('hidden');
        DOM.imagePreviewBox.classList.add('hidden');
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast("❌ 瀏覽器不支援或封鎖相機（請確認使用 http://localhost:8000 且開啟權限）");
            DOM.cameraPreviewBox.classList.add('hidden');
            DOM.scanOptionsPanel.classList.remove('hidden');
            return;
        }
        
        try {
            let stream;
            try {
                // Try back camera first (perfect for mobile scanning)
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
            } catch (err) {
                console.warn("Environment camera not found, falling back to default camera:", err);
                // Fallback to any default webcam (for PC/Laptop)
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true
                });
            }
            STATE.cameraStreamObj = stream;
            DOM.cameraStream.srcObject = stream;
        } catch (error) {
            console.error("Camera access error: ", error);
            showToast("❌ 相機開啟失敗：" + error.message);
            DOM.cameraPreviewBox.classList.add('hidden');
            DOM.scanOptionsPanel.classList.remove('hidden');
        }
    }

    // Start Camera Stream trigger
    DOM.scanCameraTrigger.addEventListener('click', startCameraStream);

    // Close Camera
    DOM.closeCameraBtn.addEventListener('click', stopCameraStream);

    function stopCameraStream() {
        if (STATE.cameraStreamObj) {
            STATE.cameraStreamObj.getTracks().forEach(track => track.stop());
            STATE.cameraStreamObj = null;
        }
        DOM.cameraStream.srcObject = null;
        DOM.cameraPreviewBox.classList.add('hidden');
        DOM.scanOptionsPanel.classList.remove('hidden');
    }

    // Capture photo from video stream
    DOM.capturePhotoBtn.addEventListener('click', () => {
        if (!STATE.cameraStreamObj) return;

        const video = DOM.cameraStream;
        const canvas = DOM.scanCanvas;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        STATE.scanImageData = dataUrl;
        DOM.scannedImagePreview.src = dataUrl;

        stopCameraStream();

        DOM.cameraPreviewBox.classList.add('hidden');
        DOM.imagePreviewBox.classList.remove('hidden');
    });

    // Album upload click trigger
    DOM.scanUploadTrigger.addEventListener('click', () => {
        DOM.scanFileInput.click();
    });

    // File input listener
    DOM.scanFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target.result;
            STATE.scanImageData = dataUrl;
            DOM.scannedImagePreview.src = dataUrl;

            DOM.scanOptionsPanel.classList.add('hidden');
            DOM.imagePreviewBox.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    });

    // Reset scanner view
    DOM.recaptureBtn.addEventListener('click', resetScannerView);

    function resetScannerView() {
        stopCameraStream();
        STATE.scanImageData = null;
        DOM.scannedImagePreview.src = '';
        DOM.imagePreviewBox.classList.add('hidden');
        DOM.scanOptionsPanel.classList.remove('hidden');
        DOM.scanFileInput.value = '';
    }

    // Trigger AI Analysis
    DOM.analyzePhotoBtn.addEventListener('click', () => {
        if (!STATE.scanImageData) return;

        if (STATE.geminiKey) {
            callGeminiAPI(STATE.scanImageData);
        } else {
            showToast("ℹ️ 未偵測到金鑰，啟動離線仿真模擬辨識...");
            DOM.scannerSimText.innerText = '正在以 AI 仿真影像模型分析食材...';
            DOM.scannerSim.classList.remove('hidden');
            setTimeout(() => {
                triggerMockScan();
            }, 2000);
        }
    });

    // Fallback Mock Scan items generator
    function triggerMockScan() {
        const mockItems = [
            { name: '嫩豆腐', category: 'others', expiryDays: 5, qty: '1 盒' },
            { name: '產銷履歷豬梅花肉片', category: 'meat', expiryDays: 2, qty: '1 盒' },
            { name: '嚴選大雞蛋', category: 'dairy', expiryDays: 14, qty: '10 顆' },
            { name: '有機菠菜', category: 'veg', expiryDays: 3, qty: '1 包' }
        ];
        importScannedItems(mockItems);
    }

    // Gemini API caller
    async function callGeminiAPI(base64Image) {
        DOM.scannerSimText.innerText = '正在傳送影像至 Gemini AI 分析中...';
        DOM.scannerSim.classList.remove('hidden');
        
        const base64Data = base64Image.split(',')[1] || base64Image;
        
        const requestPayload = {
            contents: [{
                parts: [
                    { text: "請幫我分析這張冰箱食材照片或發票。列出圖片中包含的生鮮食物明細。以繁體中文 JSON 陣列格式回傳，結構為： [ { \"name\": \"食材名稱\", \"category\": \"meat(肉海鮮)|veg(蔬果)|dairy(乳製品)|others(其他)\", \"qty\": \"數量單位，如1包、3顆\", \"expiryDays\": 推估保鮮天數(整數，如雞肉為2, 蔬菜為3) } ]。請直接回傳 JSON 陣列，不要包含 Markdown ```json 外框或任何其他說明的廢話文字。" },
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: base64Data
                        }
                    }
                ]
            }]
        };
        
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${STATE.geminiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestPayload)
                }
            );
            
            if (!response.ok) {
                throw new Error(`API 錯誤碼: ${response.status}`);
            }
            
            const resData = await response.json();
            const responseText = resData.candidates[0].content.parts[0].text.trim();
            
            // Clean up Gemini Markdown response if any
            const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const items = JSON.parse(cleanText);
            
            if (Array.isArray(items)) {
                importScannedItems(items);
            } else {
                throw new Error("回傳格式非 JSON 陣列");
            }
            
        } catch (error) {
            console.error("Gemini API Error: ", error);
            showToast("❌ Real Gemini 辨識失敗！將自動啟用備用模擬辨識...");
            setTimeout(() => {
                triggerMockScan();
            }, 1500);
        }
    }

    // Helper to import scanned items into State
    function importScannedItems(items) {
        DOM.scannerSim.classList.add('hidden');
        
        items.forEach(item => {
            let status = 'safe';
            const days = parseInt(item.expiryDays) || 3;
            if (days <= 2) status = 'danger';
            else if (days <= 4) status = 'warning';
            
            const newItem = {
                id: Date.now() + Math.random(),
                name: item.name,
                category: item.category || 'others',
                expiryDays: days,
                qty: item.qty || '1 份',
                status: status
            };
            
            STATE.fridgeItems.unshift(newItem);
        });
        
        renderFridge();
        renderCalendar();
        renderRecipeIngredientsChips();
        updateExpiringCount();
        
        showToast(`🎉 辨識成功！自動匯入 ${items.length} 項食材到您的冰箱。`);
        
        // Switch to Fridge Tab
        const fridgeNav = Array.from(DOM.navItems).find(n => n.getAttribute('data-tab') === 'fridge');
        if (fridgeNav) fridgeNav.click();
        
        resetScannerView();
    }
    
    // Pricing Upgrade buttons handler inside billing modal
    DOM.chooseFreeBtn.addEventListener('click', () => {
        STATE.isPremium = false;
        DOM.tierToggle.checked = false;
        updateUIForTier();
        DOM.pricingModal.classList.remove('active');
        if (STATE.currentTab === 'scan') {
            stopCameraStream();
        }
    });
    
    DOM.upgradeMonthlyBtn.addEventListener('click', () => {
        STATE.isPremium = true;
        DOM.tierToggle.checked = true;
        updateUIForTier();
        DOM.pricingModal.classList.remove('active');
        showToast('🎉 成功訂閱 Premium 月計劃 (NT$120/月)！無廣告與 AI 功能已解鎖。');
        if (STATE.currentTab === 'scan') {
            startCameraStream();
        }
    });
    
    DOM.upgradeYearlyBtn.addEventListener('click', () => {
        STATE.isPremium = true;
        DOM.tierToggle.checked = true;
        updateUIForTier();
        DOM.pricingModal.classList.remove('active');
        showToast('🎉 成功訂閱 Premium 年計劃 (NT$1320/年)！恭喜解鎖全部進階功能，年繳超值划算。');
        if (STATE.currentTab === 'scan') {
            startCameraStream();
        }
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
        { name: 'remindish_logo', url: 'images/logo_fully_transparent.png' },
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
