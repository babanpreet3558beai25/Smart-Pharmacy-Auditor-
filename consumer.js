
// ========================================================
// LINE 381-450: CENTRAL AI ENGINE LOGIC & FUNCTIONS
// ========================================================
async function sendPromptToGemini() {
    const inputField = document.getElementById("ai-user-prompt-field");
    const userPrompt = inputField.value.trim();
    
    if (!userPrompt) return;

    appendUserChatLog(userPrompt);
    inputField.value = ""; 

    const botBubbleId = appendAITypingPlaceholder();

    // Combining arrays for unified model indexing context
    const fullStoreInventory = {
        medicines: MEDICINE_DATASET,
        selfCareProducts: SELF_CARE_DATASET
    };

    const systemContext = `
        You are the 'MediSync Smart Virtual Pharmacist', an advanced AI medical assistant modeled after platforms like Zomato and 1mg.
        
        Here is the store's current active product inventory database:
        ${JSON.stringify(fullStoreInventory)}
        
        STRICT OPERATIONAL DIRECTIVES:
        1. When a user asks about any product from the data above, extract its fields from the 'details' object ('uses', 'dosage', and 'side_effects').
        2. Format your output using bold headers: '**Primary Clinical Uses / Benefits:**', '**Recommended Dosage / Application:**', and '**Key Side Effects / Precautions:**'.
        3. Respond strictly in clear, professional English.
        4. If an item is not found within either dataset array, provide accurate general knowledge, but explicitly mention that it is currently out of stock in our database inventory.
        5. Conclude every single response with this mandatory footer: "*Disclaimer: Please consult a qualified professional before using any medication or treatment.*"
    `;

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${systemContext}\n\nUser Query: ${userPrompt}` }]
                }]
            })
        });

        if (!response.ok) throw new Error("API Connection Failed");

        const data = await response.json();
        let aiResponseText = data.candidates[0].content.parts[0].text;
        
        aiResponseText = formatAIResponseForHTML(aiResponseText);
        updateAITypingPlaceholder(botBubbleId, aiResponseText);

    } catch (error) {
        console.error("Gemini System Error:", error);
        updateAITypingPlaceholder(botBubbleId, "Unable to establish secure connection to the medical database server.");
    }
}

function handleAIViaKey(event) {
    if (event.key === "Enter") {
        sendPromptToGemini();
    }
}

// ========================================================
// LINE 451-510: CORE DOM LAYOUT CHAT UI HELPERS
// ========================================================
function appendUserChatLog(text) {
    const scroller = document.getElementById("ai-chat-scroller");
    const bubble = document.createElement("div");
    bubble.className = "msg-bubble user-pax"; 
    bubble.innerHTML = `<div class="msg-content"><p>${text}</p><span class="msg-time-stamp">You</span></div>`;
    scroller.appendChild(bubble);
    scroller.scrollTop = scroller.scrollHeight;
}

function appendAITypingPlaceholder() {
    const scroller = document.getElementById("ai-chat-scroller");
    const uniqueId = "bot-bubble-" + Date.now();
    const bubble = document.createElement("div");
    bubble.className = "msg-bubble system-bot";
    bubble.id = uniqueId;
    bubble.innerHTML = `
        <div class="msg-content">
            <p class="typing-animation-placeholder">Analyzing clinical logs...</p>
            <span class="msg-time-stamp">Virtual Pharmacist Engine</span>
        </div>
    `;
    scroller.appendChild(bubble);
    scroller.scrollTop = scroller.scrollHeight;
    return uniqueId;
}

function updateAITypingPlaceholder(id, newHTMLContent) {
    const bubble = document.getElementById(id);
    if (bubble) {
        const contentPara = bubble.querySelector(".msg-content p");
        if (contentPara) {
            contentPara.classList.remove("typing-animation-placeholder");
            contentPara.innerHTML = newHTMLContent;
        }
    }
    const scroller = document.getElementById("ai-chat-scroller");
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
}

function formatAIResponseForHTML(text) {
    let formatted = text.replace(/\n/g, "<br>");
    formatted = formatted.replace(/\*\*(.*?)\*\"/g, "<strong>$1</strong>");
    formatted = formatted.replace(/<br>\s*[\*\-]\s*/g, "<br>• ");
    return formatted;
}

// ========================================================
// LINE 511+ : DOM LIFECYCLE LISTENERS & GRID UI RENDERING
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
    // Call your grid rendering routines here
    // Example: renderMedicineGrid(MEDICINE_DATASET);
    // Example: renderSelfCareGrid(SELF_CARE_DATASET);
});
let localProductStorage = {};



// PROFILE SYSTEM
function refreshNavbarUserProfileDisplay() {
    const displayNode = document.getElementById("user-display-name");
    if (displayNode) {
        displayNode.textContent = `${userSessionProfile.name}, ${userSessionProfile.pincode}`;
    }
}

function openProfileSettingsModal() {
    document.getElementById("settings-user-name").value = userSessionProfile.name;
    document.getElementById("settings-user-phone").value = userSessionProfile.phone;
    document.getElementById("settings-user-pincode").value = userSessionProfile.pincode;
    document.getElementById("settings-user-address").value = userSessionProfile.address;
    document.getElementById("portal-settings-overlay").classList.remove("hidden");
}

function closeProfileSettingsModal() {
    document.getElementById("portal-settings-overlay").classList.add("hidden");
}

function saveUserProfileData(event) {
    event.preventDefault();
    userSessionProfile.name = document.getElementById("settings-user-name").value.trim();
    userSessionProfile.phone = document.getElementById("settings-user-phone").value.trim();
    userSessionProfile.pincode = document.getElementById("settings-user-pincode").value.trim();
    userSessionProfile.address = document.getElementById("settings-user-address").value.trim();

    refreshNavbarUserProfileDisplay();
    refreshAddressDropdown();
    appendSystemAuditorLog(`Profile updated. Active user: <strong>${userSessionProfile.name}</strong>.`);
    closeProfileSettingsModal();
}

// TAB MANAGEMENT
function switchActiveTab(event, targetTab) {
    SYSTEM_ACTIVE_TAB = targetTab;
    const triggers = { MEDS: "tab-meds-trigger", LABS: "tab-labs-trigger", CARE: "tab-care-trigger", ORDERS: "tab-orders-trigger" };
    const views = { MEDS: "medicines-view-section", LABS: "lab-tests-view-section", CARE: "self-care-view-section", ORDERS: "orders-history-view-section" };

    Object.keys(triggers).forEach(key => {
        const trigEl = document.getElementById(triggers[key]);
        const viewEl = document.getElementById(views[key]);
        if (key === targetTab) {
            if (trigEl) trigEl.classList.add("active");
            if (viewEl) viewEl.classList.remove("hidden");
        } else {
            if (trigEl) trigEl.classList.remove("active");
            if (viewEl) viewEl.classList.add("hidden");
        }
    });

    if (targetTab === "ORDERS") renderOrdersHistoryTab();
}

// GRID RENDER ENGINES
function renderMedicineGrid(targetDataset) {
    const container = document.getElementById("medicine-dashboard-grid");
    if (!container) return;
    container.innerHTML = "";
    targetDataset.forEach(med => {
        const qty = APPLICATION_CART[med.id] || 0;
        const card = document.createElement("div");
        card.className = "product-item-card";
        card.style.cursor = "pointer";

        card.onclick = (e) => {
            if (e.target.closest('.action-btn-cell') || e.target.closest('.quantity-modifier-widget')) return;
            fetchProductInsights(med.name, med.composition);
        };

        const btnMarkup = qty > 0
            ? `<div class="quantity-modifier-widget"><button class="widget-btn" onclick="modifyItemQuantity(${med.id}, -1, 'MED')">-</button><div class="widget-value">${qty}</div><button class="widget-btn" onclick="modifyItemQuantity(${med.id}, 1, 'MED')">+</button></div>`
            : `<button class="btn-card-add-cart action-btn-cell" onclick="initializeCartItem(${med.id}, 'MED')"><i class="fa-solid fa-plus"></i> Add</button>`;

        card.innerHTML = `
            <div class="card-top-info">
                <div class="med-icon-avatar ${med.otc ? 'otc-type' : ''}"><i class="${med.otc ? 'fa-solid fa-prescription-bottle' : 'fa-solid fa-pills'}"></i></div>
                <div class="med-details-block"><h4 class="prod-title-lbl">${med.name}</h4><p class="prod-desc-lbl">${med.composition}</p></div>
            </div>
            <div class="price-action-row"><span class="price-val">₹${med.price.toFixed(2)}</span><div id="action-wrapper-cell-${med.id}">${btnMarkup}</div></div>`;
        container.appendChild(card);
    });
}

function renderLabTestsGrid(targetDataset) {
    const container = document.getElementById("lab-tests-dashboard-grid");
    if (!container) return;
    container.innerHTML = "";
    targetDataset.forEach(test => {
        const qty = APPLICATION_CART[test.id] || 0;
        const card = document.createElement("div");
        card.className = "product-item-card";
        card.style.cursor = "pointer";

        card.onclick = (e) => {
            if (e.target.closest('.action-btn-cell') || e.target.closest('.quantity-modifier-widget')) return;
            fetchProductInsights(test.name, test.composition);
        };

        const btnMarkup = qty > 0
            ? `<div class="quantity-modifier-widget" style="background:#8b5cf6;"><button class="widget-btn" onclick="modifyItemQuantity(${test.id}, -1, 'LAB')">-</button><div class="widget-value">${qty}</div><button class="widget-btn" onclick="modifyItemQuantity(${test.id}, 1, 'LAB')">+</button></div>`
            : `<button class="btn-card-add-cart action-btn-cell" style="border-color:#8b5cf6; color:#8b5cf6;" onclick="initializeCartItem(${test.id}, 'LAB')"><i class="fa-solid fa-microscope"></i> Book Test</button>`;

        card.innerHTML = `
            <div class="card-top-info">
                <div class="med-icon-avatar lab-type"><i class="fa-solid fa-flask-vial"></i></div>
                <div class="med-details-block"><h4 class="prod-title-lbl">${test.name}</h4><p class="prod-desc-lbl">${test.composition}</p></div>
            </div>
            <div class="price-action-row"><span class="price-val">₹${test.price.toFixed(2)}</span><div id="action-wrapper-cell-${test.id}">${btnMarkup}</div></div>`;
        container.appendChild(card);
    });
}

function renderSelfCareGrid(targetDataset) {
    const container = document.getElementById("self-care-dashboard-grid");
    if (!container) return;
    container.innerHTML = "";
    targetDataset.forEach(care => {
        const qty = APPLICATION_CART[care.id] || 0;
        const card = document.createElement("div");
        card.className = "product-item-card";
        card.style.cursor = "pointer";

        card.onclick = (e) => {
            if (e.target.closest('.action-btn-cell') || e.target.closest('.quantity-modifier-widget')) return;
            fetchProductInsights(care.name, care.composition);
        };

        const btnMarkup = qty > 0
            ? `<div class="quantity-modifier-widget" style="background:var(--care-pink);"><button class="widget-btn" onclick="modifyItemQuantity(${care.id}, -1, 'CARE')">-</button><div class="widget-value">${qty}</div><button class="widget-btn" onclick="modifyItemQuantity(${care.id}, 1, 'CARE')">+</button></div>`
            : `<button class="btn-card-add-cart action-btn-cell" style="border-color:var(--care-pink); color:var(--care-pink);" onclick="initializeCartItem(${care.id}, 'CARE')"><i class="fa-solid fa-basket-shopping"></i> Add to Cart</button>`;

        card.innerHTML = `
            <div class="card-top-info">
                <div class="med-icon-avatar care-type sub-cat-${care.subCategory}"><i class="${care.icon}"></i></div>
                <div class="med-details-block"><h4 class="prod-title-lbl">${care.name}</h4><p class="prod-desc-lbl">${care.composition}</p></div>
            </div>
            <div class="price-action-row"><span class="price-val">₹${care.price.toFixed(2)}</span><div id="action-wrapper-cell-${care.id}">${btnMarkup}</div></div>`;
        container.appendChild(card);
    });
}

function renderOrdersHistoryTab() {
    const container = document.getElementById("orders-history-dashboard-grid");
    if (!container) return;
    container.innerHTML = "";

    if (PLACED_ORDERS_HISTORY.length === 0) {
        container.innerHTML = `
            <div style="grid-column: span 4; text-align:center; color:#64748b; padding:60px 20px;">
                <i class="fa-solid fa-box-open" style="font-size:3rem; color:#cbd5e1; margin-bottom:12px; display:block;"></i>
                <h4 style="color:#334155; font-size:1.1rem;">No orders found yet!</h4>
                <p style="font-size:0.85rem; color:#94a3b8; margin-top:4px;">Items purchased via your cart terminal will be archived right here.</p>
            </div>`;
        return;
    }

    PLACED_ORDERS_HISTORY.forEach(order => {
        const card = document.createElement("div");
        card.className = "order-receipt-card";
        let breakdownHTML = "";
        order.items.forEach(p => {
            breakdownHTML += `<div class="receipt-product-row"><span class="r-name"><i class="fa-solid fa-circle-dot" style="font-size:0.5rem; color:#00a599; margin-right:6px;"></i>${p.name} (x${p.quantity})</span><span class="r-price">₹${(p.price * p.quantity).toFixed(2)}</span></div>`;
        });

        card.innerHTML = `
            <div class="receipt-header-row"><div><span class="receipt-id-tag">ORDER #${order.orderID}</span><span class="receipt-timestamp-lbl">${order.timestamp}</span></div><span class="receipt-status-badge"><i class="fa-solid fa-circle-check"></i> Placed</span></div>
            <div class="receipt-items-container">${breakdownHTML}</div>
            <div class="receipt-calculation-ledger">
                <div class="ledger-row"><span>Cart Subtotal:</span><span>₹${order.rawTotal.toFixed(2)}</span></div>
                <div class="ledger-row discount-row"><span>15% Flat Discount:</span><span>-₹${order.discountAmount.toFixed(2)}</span></div>
                <div class="ledger-row grand-final"><span>Total Bill Paid:</span><span>₹${order.finalBill.toFixed(2)}</span></div>
            </div>`;
        container.appendChild(card);
    });
}

// CART QUANTITY MODIFIERS
function initializeCartItem(itemId, itemType) {
    APPLICATION_CART[itemId] = 1;
    synchronizeCartStateTotals();
    refreshSingleCardControl(itemId, itemType);
}

function modifyItemQuantity(itemId, delta, itemType) {
    if (!APPLICATION_CART[itemId]) return;
    APPLICATION_CART[itemId] += delta;
    if (APPLICATION_CART[itemId] <= 0) delete APPLICATION_CART[itemId];
    synchronizeCartStateTotals();
    refreshSingleCardControl(itemId, itemType);
}

function refreshSingleCardControl(itemId, itemType) {
    const cell = document.getElementById(`action-wrapper-cell-${itemId}`);
    if (!cell) return;
    const qty = APPLICATION_CART[itemId] || 0;

    if (itemType === "MED") {
        cell.innerHTML = qty > 0
            ? `<div class="quantity-modifier-widget"><button class="widget-btn" onclick="modifyItemQuantity(${itemId}, -1, 'MED')">-</button><div class="widget-value">${qty}</div><button class="widget-btn" onclick="modifyItemQuantity(${itemId}, 1, 'MED')">+</button></div>`
            : `<button class="btn-card-add-cart action-btn-cell" onclick="initializeCartItem(${itemId}, 'MED')"><i class="fa-solid fa-plus"></i> Add</button>`;
    } else if (itemType === "LAB") {
        cell.innerHTML = qty > 0
            ? `<div class="quantity-modifier-widget" style="background:#8b5cf6;"><button class="widget-btn" onclick="modifyItemQuantity(${itemId}, -1, 'LAB')">-</button><div class="widget-value">${qty}</div><button class="widget-btn" onclick="modifyItemQuantity(${itemId}, 1, 'LAB')">+</button></div>`
            : `<button class="btn-card-add-cart action-btn-cell" style="border-color:#8b5cf6; color:#8b5cf6;" onclick="initializeCartItem(${itemId}, 'LAB')"><i class="fa-solid fa-microscope"></i> Book Test</button>`;
    } else if (itemType === "CARE") {
        cell.innerHTML = qty > 0
            ? `<div class="quantity-modifier-widget" style="background:var(--care-pink);"><button class="widget-btn" onclick="modifyItemQuantity(${itemId}, -1, 'CARE')">-</button><div class="widget-value">${qty}</div><button class="widget-btn" onclick="modifyItemQuantity(${itemId}, 1, 'CARE')">+</button></div>`
            : `<button class="btn-card-add-cart action-btn-cell" style="border-color:var(--care-pink); color:var(--care-pink);" onclick="initializeCartItem(${itemId}, 'CARE')"><i class="fa-solid fa-basket-shopping"></i> Add to Cart</button>`;
    }
}

function synchronizeCartStateTotals() {
    let globalCount = 0, accumulator = 0.00;
    Object.keys(APPLICATION_CART).forEach(id => {
        const qty = APPLICATION_CART[id];
        let meta = MEDICINE_DATASET.find(m => m.id == id) || LAB_TESTS_DATASET.find(l => l.id == id) || SELF_CARE_DATASET.find(s => s.id == id);
        if (meta) { globalCount += qty; accumulator += (meta.price * qty); }
    });
    let discountedFloatingAmount = accumulator * 0.85;
    document.getElementById("nav-cart-count-badge").textContent = globalCount;
    document.getElementById("nav-cart-total-amount").textContent = `₹${discountedFloatingAmount.toFixed(2)}`;
}

function filterActiveWorkspace() {
    const entry = document.getElementById("dashboard-search-field").value.toLowerCase();
    if (SYSTEM_ACTIVE_TAB === "MEDS") renderMedicineGrid(MEDICINE_DATASET.filter(m => m.name.toLowerCase().includes(entry)));
    else if (SYSTEM_ACTIVE_TAB === "LABS") renderLabTestsGrid(LAB_TESTS_DATASET.filter(l => l.name.toLowerCase().includes(entry)));
    else if (SYSTEM_ACTIVE_TAB === "CARE") renderSelfCareGrid(SELF_CARE_DATASET.filter(c => c.name.toLowerCase().includes(entry)));
}

// MODAL WORKSPACE ACTIONS
function openInteractiveCartOverlay() {
    const modal = document.getElementById("application-cart-overlay");
    const container = document.getElementById("modal-cart-items-list-root");
    container.innerHTML = "";
    let sum = 0;
    const ids = Object.keys(APPLICATION_CART);

    if (ids.length === 0) {
        container.innerHTML = `<div style='text-align:center; padding:40px 20px; color:#64748b; font-size:0.9rem;'><i class='fa-solid fa-basket-shopping' style='font-size:2rem; margin-bottom:10px; display:block; color:#cbd5e1;'></i>Your cart is completely empty.</div>`;
    } else {
        ids.forEach(id => {
            const qty = APPLICATION_CART[id];
            const item = MEDICINE_DATASET.find(m => m.id == id) || LAB_TESTS_DATASET.find(l => l.id == id) || SELF_CARE_DATASET.find(s => s.id == id);
            if (item) {
                sum += (item.price * qty);
                const row = document.createElement("div");
                row.className = "cart-modal-row-item";
                row.innerHTML = `<div class="item-meta-details"><h5>${item.name}</h5><span>Unit Cost: ₹${item.price.toFixed(2)} | Qty: ${qty}</span></div><div class="item-right-price-block"><span class="modal-price-calc">₹${(item.price * qty).toFixed(2)}</span><button class="modal-remove-item-btn" onclick="directRemoveFromModal(${item.id}, '${item.type}')"><i class="fa-regular fa-trash-can"></i></button></div>`;
                container.appendChild(row);
            }
        });
    }

    document.getElementById("modal-raw-total-value").textContent = `₹${sum.toFixed(2)}`;
    document.getElementById("modal-discount-value").textContent = `-₹${(sum * 0.15).toFixed(2)}`;
    document.getElementById("modal-grand-total-value").textContent = `₹${(sum * 0.85).toFixed(2)}`;
    modal.classList.remove("hidden");
}

function closeInteractiveCartOverlay() { document.getElementById("application-cart-overlay").classList.add("hidden"); }

function directRemoveFromModal(id, type) {
    delete APPLICATION_CART[id];
    synchronizeCartStateTotals();
    openInteractiveCartOverlay();
    refreshSingleCardControl(id, type);
}

function executeOrderPlacementRoute() {
    const keys = Object.keys(APPLICATION_CART);
    if (keys.length === 0) { alert("Transaction Failed: Empty cart workspace."); return; }

    let currentOrderItems = [], rawTotalSum = 0;
    keys.forEach(id => {
        const qty = APPLICATION_CART[id];
        const item = MEDICINE_DATASET.find(m => m.id == id) || LAB_TESTS_DATASET.find(l => l.id == id) || SELF_CARE_DATASET.find(s => s.id == id);
        if (item) { rawTotalSum += (item.price * qty); currentOrderItems.push({ id: item.id, name: item.name, price: item.price, quantity: qty }); }
    });

    const payload = {
        orderID: Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        items: currentOrderItems,
        rawTotal: rawTotalSum,
        discountAmount: rawTotalSum * 0.15,
        finalBill: rawTotalSum * 0.85
    };

    PLACED_ORDERS_HISTORY.unshift(payload);
    localStorage.setItem(
    "MEDISYNC_ORDER_HISTORY",
    JSON.stringify(PLACED_ORDERS_HISTORY)
);
    alert(`🎉 Success! Order #${payload.orderID} cataloged under profile ${userSessionProfile.name}.`);

    APPLICATION_CART = {};
    synchronizeCartStateTotals();
    MEDICINE_DATASET.forEach(m => refreshSingleCardControl(m.id, "MED"));
    LAB_TESTS_DATASET.forEach(l => refreshSingleCardControl(l.id, "LAB"));
    SELF_CARE_DATASET.forEach(s => refreshSingleCardControl(s.id, "CARE"));
    closeInteractiveCartOverlay();
    switchActiveTab(null, "ORDERS");
}

// AI PRODUCT INSIGHTS
async function fetchProductInsights(productName, productComposition) {
    // Open AI panel if closed
    if (!isAIPanelOpen) toggleAIPanel();

    const aiBox = document.getElementById("ai-product-insights");
    const aiTitle = document.getElementById("ai-product-title");
    const aiDesc = document.getElementById("ai-product-description");

    aiBox.style.display = "block";
    aiTitle.innerText = productName;
    aiDesc.innerHTML = `<span style="color:#a855f7;"><i class="fa-solid fa-spinner fa-spin"></i> Fetching medical composition advantages...</span>`;

    if (localProductStorage[productName]) {
        aiDesc.innerHTML = localProductStorage[productName];
        return;
    }

    const clinicalPrompt = `You are an expert Medical Pharmacist. Provide accurate health insights for product: "${productName}" (${productComposition}). 
    Format with simple bullet tags containing:
    1. Primary Clinical Advantages & Uses
    2. Recommended Dosage or Frequency
    3. Essential Warning or Precautions
    Keep it professional, highly structured, and under 100 words. Use plain text formatting. No markdown stars.`;

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: clinicalPrompt }] }] })
        });
        if (!response.ok) throw new Error("API Outage");
        const data = await response.json();
        let cleanedResult = data.candidates[0].content.parts[0].text.replace(/\n/g, "<br>");

        localProductStorage[productName] = cleanedResult;
        aiDesc.innerHTML = cleanedResult;
    } catch (e) {
        aiDesc.innerHTML = `<span style="color:#ef4444;">Could not sync dynamic advantages. Ensure API Key is assigned.</span>`;
    }
}

// AI CHAT
function handleAIViaKey(e) { if (e.key === 'Enter') sendPromptToGemini(); }

async function sendPromptToGemini() {
    const field = document.getElementById("ai-user-prompt-field");
    const txt = field.value.trim();
    if (txt === "") return;

    const uBubble = document.createElement("div");
    uBubble.className = "msg-bubble user-node";
    uBubble.innerHTML = `<div class="msg-content"><p>${txt}</p><span class="msg-time-stamp">Just Now</span></div>`;
    const scroller = document.getElementById("ai-chat-scroller");
    scroller.appendChild(uBubble);
    field.value = "";
    scroller.scrollTop = scroller.scrollHeight;

    if (txt.toLowerCase().includes("audit my cart")) {
        setTimeout(() => {
            const ids = Object.keys(APPLICATION_CART);
            if (ids.length === 0) appendSystemAuditorLog("<strong>Gemini Workspace Audit:</strong> Your shopping cart workspace is empty.");
            else {
                let itemsList = "";
                ids.forEach(id => {
                    const item = MEDICINE_DATASET.find(m => m.id == id) || LAB_TESTS_DATASET.find(l => l.id == id) || SELF_CARE_DATASET.find(s => s.id == id);
                    itemsList += `<li>${item.name} (x${APPLICATION_CART[id]})</li>`;
                });
                appendSystemAuditorLog(`<strong>Gemini Audit Pipeline:</strong><br><ul>${itemsList}</ul><span style='color:#10b981;'><i class='fa-solid fa-shield-halved'></i> Promo Guard Cleared:</span> 15% automatic calculation enabled.`);
            }
        }, 500);
        return;
    }

    const typingNotifier = document.createElement("div");
    typingNotifier.className = "msg-bubble system-bot";
    typingNotifier.id = "gemini-live-loading-node";
    typingNotifier.innerHTML = `<div class="msg-content"><p style="color:#a855f7;"><i class="fa-solid fa-circle-notch fa-spin"></i> Gemini is thinking...</p></div>`;
    scroller.appendChild(typingNotifier);
    scroller.scrollTop = scroller.scrollHeight;

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: txt }] }] })
        });

        const loadNode = document.getElementById("gemini-live-loading-node");
        if (loadNode) loadNode.remove();

        if (!response.ok) throw new Error();
        const data = await response.json();
        let aiLiveResponse = data.candidates[0].content.parts[0].text.replace(/\n/g, "<br>");

        appendSystemAuditorLog(aiLiveResponse);
    } catch (err) {
        const loadNode = document.getElementById("gemini-live-loading-node");
        if (loadNode) loadNode.remove();
        appendSystemAuditorLog("<span style='color:#ef4444;'>Console unable to establish handshakes with remote cloud AI server. Verify system token configuration.</span>");
    }
}

function appendSystemAuditorLog(htmlContent) {
    const scroller = document.getElementById("ai-chat-scroller");
    if (!scroller) return;
    const bBubble = document.createElement("div");
    bBubble.className = "msg-bubble system-bot";
    bBubble.innerHTML = `<div class="msg-content"><p>${htmlContent}</p><span class="msg-time-stamp">Just Now</span></div>`;
    scroller.appendChild(bBubble);
    scroller.scrollTop = scroller.scrollHeight;
}

function clearAIChat() {
    document.getElementById("ai-chat-scroller").innerHTML = `<div class="msg-bubble system-bot"><div class="msg-content"><p>Conversation stream logs flushed.</p><span class="msg-time-stamp">System Cleared</span></div></div>`;
}
const exitBtn = document.getElementById("exitBtn");

if (exitBtn) {
    /*exitBtn.addEventListener("click", () => {

        window.location.href = "pro1.html";

    });*/
    function goBackProject() {
        // Optional session clear
    sessionStorage.removeItem("currentLoggedInUser");

    // Redirect to main landing page
    window.location.href = "pro1.html";
    //window.location.href = "pro1.html";
}
}
