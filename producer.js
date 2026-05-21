// ==========================================================================
// LOGIN USER PROFILE LOAD ENGINE
// ==========================================================================

window.addEventListener("DOMContentLoaded", () => {

    const savedUser =
        sessionStorage.getItem("currentLoggedInUser");

    if (savedUser) {

        const userData = JSON.parse(savedUser);

        // =====================================================
        // PROFILE NAME
        // =====================================================

        const profileName =
            document.getElementById("sidebar-profile-name");

        if (profileName) {

            profileName.innerText = userData.name;

        }

        // =====================================================
        // PROFILE ROLE
        // =====================================================

        const profileRole =
            document.getElementById("sidebar-profile-role");

        if (profileRole) {

            profileRole.innerText = "Store Administrator";

        }

        // =====================================================
        // PROFILE AVATAR INITIALS
        // =====================================================

        const avatarInitials =
            document.getElementById("sidebar-avatar-initials");

        if (avatarInitials) {

            const initials = userData.name
                .split(" ")
                .map(word => word[0])
                .join("")
                .toUpperCase()
                .substring(0, 2);

            avatarInitials.innerText = initials;

        }

    }

});
// ==========================================================================
// CENTRALIZED DATABASE MASTER LOGS (30 MEDICINES + 15 SELF CARE = 45 PRODUCTS)
// ==========================================================================
let CENTRAL_MASTER_INVENTORY_DB = [
    { id: "MDS-M01", name: "Dolo 650mg Tablet", price: 30.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M02", name: "Crocin Fast Relief", price: 24.50, type: "Medicine", status: "In Stock" },
    { id: "MDS-M03", name: "Paracetamol 500mg", price: 20.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M04", name: "Ibuprofen 400mg", price: 18.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M05", name: "Brufen 200ml Syrup", price: 42.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M06", name: "Combiflam Analgesic Matrix", price: 26.70, type: "Medicine", status: "In Stock" },
    { id: "MDS-M07", name: "Benadryl Cough Liquid", price: 125.00, type: "Medicine", status: "Out of Stock" },
    { id: "MDS-M08", name: "Corex Congestion Care", price: 140.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M09", name: "Vicks Action 500", price: 45.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M10", name: "Amoxicillin 500mg Capsule", price: 72.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M11", name: "Azithromycin 500mg Strip", price: 118.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M12", name: "Limcee Vitamin C Chewable", price: 25.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M13", name: "Metformin 500mg Gluconorm", price: 48.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M14", name: "Pantocid 40mg Antacid", price: 95.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M15", name: "Omez Gastro Capsule", price: 60.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M16", name: "Cetrizine Allergy Relief", price: 15.00, type: "Medicine", status: "Out of Stock" },
    { id: "MDS-M17", name: "Montair-FX Anti-Allergy", price: 180.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M18", name: "Amlodipine 5mg Amlokind", price: 14.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M19", name: "Telma 40mg Hypertension", price: 110.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M20", name: "Atorva 10mg Cholesterol", price: 85.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M21", name: "Becosules B-Complex Capsule", price: 38.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M22", name: "Zantac 150mg Tablet", price: 28.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M23", name: "Digene Gel Antacid Liquid", price: 135.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M24", name: "Asprin 75mg Loprin", price: 12.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M25", name: "Clavam 625 Antibiotic", price: 210.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M26", name: "Panadol Rapid Advance", price: 35.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M27", name: "Avil 25mg Antihistamine", price: 11.50, type: "Medicine", status: "In Stock" },
    { id: "MDS-M28", name: "Neurobion Forte Injection", price: 14.70, type: "Medicine", status: "In Stock" },
    { id: "MDS-M29", name: "Saridon Headache Relief", price: 40.00, type: "Medicine", status: "In Stock" },
    { id: "MDS-M30", name: "Lipitor 20mg Cardiovascular", price: 245.00, type: "Medicine", status: "In Stock" },

    { id: "MDS-S01", name: "Dettol Liquid Antiseptic", price: 65.00, type: "Self Care", status: "In Stock" },
    { id: "MDS-S02", name: "Savlon Antiseptic Spray", price: 90.00, type: "Self Care", status: "In Stock" },
    { id: "MDS-S03", name: "Betadine Ointment 15g", price: 115.00, type: "Self Care", status: "In Stock" },
    { id: "MDS-S04", name: "Himalaya Neem Face Wash", price: 120.00, type: "Self Care", status: "In Stock" },
    { id: "MDS-S05", name: "Nivea Moisturizing Cream", price: 190.00, type: "Self Care", status: "In Stock" },
    { id: "MDS-S06", name: "Sebamed Baby Skin Cleanser", price: 410.00, type: "Self Care", status: "In Stock" },
    { id: "MDS-S07", name: "Sensodyne Fresh Mint Gel", price: 145.00, type: "Self Care", status: "In Stock" },
    { id: "MDS-S08", name: "Volini Pain Relief Spray", price: 130.00, type: "Self Care", status: "In Stock" },
    { id: "MDS-S09", name: "Moov Pain Relief Cream", price: 85.00, type: "Self Care", status: "In Stock" },
    { id: "MDS-S10", name: "Hansaplast Band-Aid Strips", price: 20.00, type: "Self Care", status: "Out of Stock" },
    { id: "MDS-S11", name: "Dr. Trust Digital Thermometer", price: 299.00, type: "Self Care", status: "In Stock" },
    { id: "MDS-S12", name: "Omron BP Blood Pressure Monitor", price: 1850.00, type: "Self Care", status: "In Stock" },
    { id: "MDS-S13", name: "Accu-Chek Glucometer Strips", price: 875.00, type: "Self Care", status: "In Stock" },
    { id: "MDS-S14", name: "Aloe Vera Hydration Skin Gel", price: 95.00, type: "Self Care", status: "In Stock" },
    { id: "MDS-S15", name: "Biotique Bio Kelp Shampoo", price: 155.00, type: "Self Care", status: "In Stock" }
];

let activeInvoiceItemsArray = [];

// ==========================================================================
// SYSTEM WORKSPACE CONTEXT LIFE CYCLE INIT
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    initializeConsumerOrdersStream();
    renderCentralStockRegistryRegistry();
    renderBillHistoryLedger();
    renderPaymentsStationLedger();
    checkInventoryForOutOfStockAlerts();
    recalculateMetricsSummary();

    window.addEventListener('storage', (e) => {
        if (e.key === 'medisync_submitted_orders') { 
            renderIncomingOrdersStream(); 
            renderPaymentsStationLedger();
        }
    });

    const clock = document.getElementById('live-telemetry-clock');
    if (clock) { setInterval(() => { clock.innerText = new Date().toLocaleString(); }, 1000); }

    const menuCards = document.querySelectorAll('.menu-link-card');
    const panels = document.querySelectorAll('.workspace-viewpanel');
    const headerChips = document.querySelectorAll('.header-chip');
    
    menuCards.forEach(card => {
        card.addEventListener('click', () => {
            menuCards.forEach(c => c.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            card.classList.add('active');
            const targetedId = card.getAttribute('data-target');
            const targetPane = document.getElementById(targetedId);
            if (targetPane) targetPane.classList.add('active');

            headerChips.forEach(chip => chip.classList.remove('active-chip'));
            if(targetedId === 'panel-manual-billing') headerChips[0].classList.add('active-chip');
            if(targetedId === 'panel-stock-management') headerChips[1].classList.add('active-chip');
            if(targetedId === 'panel-payments-tracker') headerChips[2].classList.add('active-chip');
        });
    });

    populateDropdownStockTray(CENTRAL_MASTER_INVENTORY_DB.filter(x => x.status === "In Stock"));
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown-container')) { hideDropdownTray(); }
    });
});

// ==========================================================================
// NEW: MASTER INVENTORY ENGINE OPERATIONS (ADD, REMOVE, RESTOCK)
// ==========================================================================
function renderCentralStockRegistryRegistry() {
    const tableBody = document.getElementById('central-stock-table-body-target');
    if(!tableBody) return;

    tableBody.innerHTML = CENTRAL_MASTER_INVENTORY_DB.map((product, index) => {
        const statusClass = product.status === "In Stock" ? "status-in" : "status-out";
        return `
            <tr>
                <td>${index + 1}</td>
                <td><code>${product.id}</code></td>
                <td><strong>${product.name}</strong></td>
                <td><span style="color:#4b5563; font-size:12px; font-weight:600;">${product.type}</span></td>
                <td>₹${product.price.toFixed(2)}</td>
                <td><span class="status-badge ${statusClass}">${product.status}</span></td>
                <td style="text-align: center; display: flex; gap: 6px; justify-content: center;">
                    <button onclick="executeRestockAsset('${product.id}')" style="background:#16a34a; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:700; cursor:pointer;" title="Order new stocks instantly (+50 Qty)"><i class="fa-solid fa-truck-ramp-box"></i> Restock</button>
                    <button onclick="executeDeleteStockAsset('${product.id}')" style="background:#dc2626; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:700; cursor:pointer;" title="Remove this record token completely"><i class="fa-solid fa-trash"></i> Delete</button>
                </td>
            </tr>`;
    }).join('');
}

function executeInsertNewStockAsset() {
    const pId = document.getElementById('add-stock-id').value.trim().toUpperCase();
    const pName = document.getElementById('add-stock-name').value.trim();
    const pType = document.getElementById('add-stock-type').value;
    const pPrice = parseFloat(document.getElementById('add-stock-price').value);

    if(!pId || !pName || isNaN(pPrice) || pPrice <= 0) {
        alert("Validation Fault: Please check product credential fields before parsing.");
        return;
    }

    // Check duplicate ID
    if(CENTRAL_MASTER_INVENTORY_DB.some(p => p.id === pId)) {
        alert("Operation Aborted: Product ID already mapped inside master matrix.");
        return;
    }

    CENTRAL_MASTER_INVENTORY_DB.unshift({ id: pId, name: pName, price: pPrice, type: pType, status: "In Stock" });
    
    // Clear Form inputs
    document.getElementById('add-stock-id').value = '';
    document.getElementById('add-stock-name').value = '';
    document.getElementById('add-stock-price').value = '';

    // Refresh core layout states
    renderCentralStockRegistryRegistry();
    filterDropdownTray();
    checkInventoryForOutOfStockAlerts();
    alert(`Asset ${pName} injected successfully into enterprise database context!`);
}

function executeRestockAsset(productId) {
    const target = CENTRAL_MASTER_INVENTORY_DB.find(p => p.id === productId);
    if(target) {
        target.status = "In Stock";
        renderCentralStockRegistryRegistry();
        filterDropdownTray();
        checkInventoryForOutOfStockAlerts();
        alert(`Restock successful: ${target.name} status updated to healthy 'In Stock'.`);
    }
}

function executeDeleteStockAsset(productId) {
    const target = CENTRAL_MASTER_INVENTORY_DB.find(p => p.id === productId);
    if(confirm(`Security Check: Completely purge ${target.name} data stream records?`)) {
        CENTRAL_MASTER_INVENTORY_DB = CENTRAL_MASTER_INVENTORY_DB.filter(p => p.id !== productId);
        renderCentralStockRegistryRegistry();
        filterDropdownTray();
        checkInventoryForOutOfStockAlerts();
    }
}

function checkInventoryForOutOfStockAlerts() {
    const outOfStockItems = CENTRAL_MASTER_INVENTORY_DB.filter(item => item.status === "Out of Stock");
    const alertBanner = document.getElementById('global-stock-alert-banner');
    if(alertBanner) alertBanner.style.display = outOfStockItems.length > 0 ? 'flex' : 'none';
}

// ==========================================================================
// CORE PLATFORM DATA CALCULATION MODULES
// ==========================================================================
function recalculateMetricsSummary() {
    const rawData = localStorage.getItem('medisync_billing_history');
    let logsArray = rawData ? JSON.parse(rawData) : [];
    
    let grossTotal = 0;
    let productFrequencyMapping = {};

    logsArray.forEach(log => {
        grossTotal += parseFloat(log.grandTotal || 0);
        if(log.medicinesList) {
            log.medicinesList.forEach(m => {
                productFrequencyMapping[m.name] = (productFrequencyMapping[m.name] || 0) + parseInt(m.qty || 0);
            });
        }
    });

    document.getElementById('metrics-total-sales-lbl').innerText = `₹${grossTotal.toFixed(2)}`;
    
    let topProduct = "None Registered";
    let maxQty = 0;
    for(let prod in productFrequencyMapping) {
        if(productFrequencyMapping[prod] > maxQty) {
            maxQty = productFrequencyMapping[prod];
            topProduct = `${prod} (x${maxQty})`;
        }
    }
    document.getElementById('metrics-top-product-lbl').innerText = topProduct;
}

function saveUserProfileConfigurations() {
    const newName = document.getElementById('settings-admin-name').value.trim();
    const newRole = document.getElementById('settings-admin-role').value.trim();

    if(!newName || !newRole) {
        alert("Configuration Error: Input values cannot be null.");
        return;
    }

    document.getElementById('sidebar-profile-name').innerText = newName;
    document.getElementById('sidebar-profile-role').innerText = newRole;

    const initials = newName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    document.getElementById('sidebar-avatar-initials').innerText = initials || "AD";

    alert("System Meta Nodes updated successfully!");
}

function renderPaymentsStationLedger() {
    const pBody = document.getElementById('payments-matrix-table-body');
    if (!pBody) return;

    const rawData = localStorage.getItem('medisync_submitted_orders');
    let ordersArray = rawData ? JSON.parse(rawData) : [];

    if (ordersArray.length === 0) {
        pBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px 0;">No active online orders to track settlements.</td></tr>`;
        return;
    }

    pBody.innerHTML = ordersArray.map((order, index) => {
        const statusBadge = order.isPaid ? 'pay-pill-settled' : 'pay-pill-pending';
        const statusText = order.isPaid ? 'Paid' : 'Unpaid';
        
        return `
            <tr>
                <td><span style="background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px;">${order.orderId}</span></td>
                <td><strong>${order.customerName}</strong><br><small style="color:var(--text-muted)">${order.phone}</small></td>
                <td><strong style="color:var(--brand-dark)">₹${parseFloat(order.grandTotal).toFixed(2)}</strong></td>
                <td><span style="font-weight:600; font-size:12px; color:#475569;"><i class="fa-solid fa-money-check-dollar"></i> ${order.payMode}</span></td>
                <td><span class="status-badge ${statusBadge}">${statusText}</span></td>
                <td>
                    ${!order.isPaid ? `<button onclick="forceCollectPayment(${index})" style="background:#0d9488; color:white; border:none; padding:4px 10px; border-radius:4px; font-size:11px; cursor:pointer; font-weight:700;"><i class="fa-solid fa-cash-register"></i> Collect Cash</button>` : `<span style="color:#16a34a; font-weight:700; font-size:12px;"><i class="fa-solid fa-shield-check"></i> Verified</span>`}
                </td>
            </tr>`;
    }).join('');
}

function forceCollectPayment(index) {
    let orders = JSON.parse(localStorage.getItem('medisync_submitted_orders'));
    orders[index].isPaid = true;
    orders[index].payMode = "Collected Cash (Store Counter)";
    localStorage.setItem('medisync_submitted_orders', JSON.stringify(orders));
    
    renderIncomingOrdersStream();
    renderPaymentsStationLedger();
}

// ==========================================================================
// ADVANCED PRINT & TRANSACTION HISTORICAL LOG SYSTEM
// ==========================================================================
function triggerInvoicePDFPrint() {
    if (activeInvoiceItemsArray.length === 0) { alert("Please insert medicines into pipeline before parsing print matrix."); return; }

    let clientName = document.getElementById('cust-input-name').value.trim();
    let clientPhone = document.getElementById('cust-input-phone').value.trim();

    if(!clientName) { clientName = "Walk-in Client"; }
    if(!clientPhone) { clientPhone = "N/A"; }

    const generatedInvID = "MS-INV-" + Math.floor(10000 + Math.random() * 90000);
    const compiledTimestamp = new Date().toLocaleString();
    const grandSumTotal = activeInvoiceItemsArray.reduce((sum, item) => sum + item.total, 0);

    document.getElementById('print-lbl-inv-id').innerText = generatedInvID;
    document.getElementById('print-lbl-timestamp').innerText = compiledTimestamp;
    document.getElementById('print-lbl-cust-name').innerText = clientName;
    document.getElementById('print-lbl-cust-phone').innerText = clientPhone;
    document.getElementById('print-lbl-grand-total').innerText = `₹${grandSumTotal.toFixed(2)}`;

    const printTbody = document.getElementById('print-receipt-tbody-rows');
    printTbody.innerHTML = activeInvoiceItemsArray.map(item => `
        <tr>
            <td style="text-align: left;"><strong>${item.name}</strong><br><small>Code: ${item.id}</small></td>
            <td style="text-align: center;">₹${item.unitPrice.toFixed(2)}</td>
            <td style="text-align: center;">${item.qty}</td>
            <td style="text-align: right; font-weight: bold;">₹${item.total.toFixed(2)}</td>
        </tr>
    `).join('');

    const savedItemsCopy = activeInvoiceItemsArray.map(i => ({ name: i.name, qty: i.qty }));

    const invoiceRecordDataNode = {
        invoiceId: generatedInvID,
        timestamp: compiledTimestamp,
        customerName: clientName,
        customerPhone: clientPhone,
        medicinesList: savedItemsCopy,
        grandTotal: grandSumTotal.toFixed(2)
    };

    let existingHistoryCollection = [];
    const localRawData = localStorage.getItem('medisync_billing_history');
    if(localRawData) { existingHistoryCollection = JSON.parse(localRawData); }

    existingHistoryCollection.unshift(invoiceRecordDataNode);
    localStorage.setItem('medisync_billing_history', JSON.stringify(existingHistoryCollection));

    renderBillHistoryLedger();
    recalculateMetricsSummary();

    window.print();
    
    activeInvoiceItemsArray = [];
    document.getElementById('cust-input-name').value = '';
    document.getElementById('cust-input-phone').value = '';
    renderInvoiceTableStructure();
}

function renderBillHistoryLedger() {
    const historyTbody = document.getElementById('bill-history-table-body-target');
    if(!historyTbody) return;

    const localRawData = localStorage.getItem('medisync_billing_history');
    let logsArray = localRawData ? JSON.parse(localRawData) : [];

    if(logsArray.length === 0) {
        historyTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px 0;">No logs compiled inside historical engine stack.</td></tr>`;
        return;
    }

    historyTbody.innerHTML = logsArray.map(log => {
        let medicationsHTML = '';
        if(log.medicinesList && log.medicinesList.length > 0) {
            medicationsHTML = log.medicinesList.map(m => `
                <span style="background: #f1f5f9; color: #334155; padding: 2px 6px; border-radius: 4px; display: inline-block; margin: 2px; font-size: 11px; border: 1px solid #e2e8f0; font-weight: 600;">
                    ${m.name} <span style="color: var(--brand-teal);">x${m.qty}</span>
                </span>
            `).join('');
        } else {
            medicationsHTML = `<span style="color: #94a3b8; font-style: italic;">No items trace</span>`;
        }

        return `
            <tr>
                <td><span style="background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px;">${log.invoiceId}</span></td>
                <td><small style="color: #475569; font-weight: 600; white-space: nowrap;">${log.timestamp}</small></td>
                <td>
                    <div style="font-size:13px; font-weight:700; color:var(--brand-dark);">${log.customerName}</div>
                    <div style="font-size:11px; color:var(--text-muted); margin-top: 2px;"><i class="fa-solid fa-phone" style="font-size: 10px;"></i> ${log.customerPhone}</div>
                </td>
                <td style="max-width: 280px; line-height: 1.4;">${medicationsHTML}</td>
                <td><strong style="color: var(--brand-teal); font-size: 14px;">₹${parseFloat(log.grandTotal).toFixed(2)}</strong></td>
                <td><span style="color: #16a34a; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 3px;"><i class="fa-solid fa-circle-check"></i> Saved</span></td>
            </tr>`;
    }).join('');
}

function clearAllBillHistoryLogs() {
    if(confirm("Wipe secure operational history log indexes? This data path cannot be reversed.")) {
        localStorage.setItem('medisync_billing_history', JSON.stringify([]));
        renderBillHistoryLedger();
        recalculateMetricsSummary();
    }
}

// ==========================================================================
// PRE-POPULATED 8 LIVE INCOMING ORDERS HUB DATA STREAM
// ==========================================================================
function initializeConsumerOrdersStream() {
    let currentOrders = localStorage.getItem('medisync_submitted_orders');
    if (!currentOrders || JSON.parse(currentOrders).length === 0) {
        const prePopulatedDummyQueue = [
            { orderId: "MS-ORD-881", timestamp: "18/05/2026, 10:15 PM", customerName: "Rahul Sharma", phone: "9876543201", address: "Flat 402, Green Avenue, Ludhiana", grandTotal: "105.00", isPaid: true, payMode: "UPI / Paytm", items: [{ name: "Dolo 650mg Tablet", qty: 2, price: 30.00 }, { name: "Vicks Action 500", qty: 1, price: 45.00 }] },
            { orderId: "MS-ORD-882", timestamp: "18/05/2026, 10:22 PM", customerName: "Ananya Kapoor", phone: "9112345678", address: "Sector 32-A, Chandigarh Highway", grandTotal: "240.00", isPaid: false, payMode: "Cash on Delivery (COD)", items: [{ name: "Himalaya Neem Face Wash", qty: 2, price: 120.00 }] },
            { orderId: "MS-ORD-883", timestamp: "18/05/2026, 10:30 PM", customerName: "Sardar Gurpreet Singh", phone: "9814099211", address: "Pind Road, near Gurudwara Sahib, Rajpura", grandTotal: "135.00", isPaid: true, payMode: "Credit Card", items: [{ name: "Digene Gel Antacid Liquid", qty: 1, price: 135.00 }] },
            { orderId: "MS-ORD-884", timestamp: "18/05/2026, 10:45 PM", customerName: "Mehak Preet", phone: "7009123455", address: "Chitkara Girls Hostel Block C, Punjab", grandTotal: "143.40", isPaid: false, payMode: "Cash on Delivery (COD)", items: [{ name: "Crocin Fast Relief", qty: 2, price: 24.50 }, { name: "Pantocid 40mg Antacid", qty: 1, price: 95.00 }] },
            { orderId: "MS-ORD-885", timestamp: "18/05/2026, 10:59 PM", customerName: "Vikram Malhotra", phone: "8872341100", address: "Model Town, Phase 1, Patiala", grandTotal: "299.00", isPaid: true, payMode: "Razorpay Gateway", items: [{ name: "Dr. Trust Digital Thermometer", qty: 1, price: 299.00 }] },
            { orderId: "MS-ORD-886", timestamp: "18/05/2026, 11:02 PM", customerName: "Dr. Amit Verma", phone: "9417032104", address: "Civil Lines, near Fortis Escorts, Amritsar", grandTotal: "420.00", isPaid: true, payMode: "Net Banking", items: [{ name: "Clavam 625 Antibiotic", qty: 2, price: 210.00 }] },
            { orderId: "MS-ORD-887", timestamp: "18/05/2026, 11:10 PM", customerName: "Riya Sen", phone: "9888432109", address: "Street No. 4, Jalandhar Cantt", grandTotal: "150.00", isPaid: false, payMode: "Cash on Delivery (COD)", items: [{ name: "Limcee Vitamin C Chewable", qty: 6, price: 25.00 }] },
            { orderId: "MS-ORD-888", timestamp: "18/05/2026, 11:14 PM", customerName: "Kabir Mehta", phone: "7508123999", address: "Urban Estate, Phase II, Jalandhar", grandTotal: "245.00", isPaid: true, payMode: "UPI / PhonePe", items: [{ name: "Lipitor 20mg Cardiovascular", qty: 1, price: 245.00 }] }
        ];
        localStorage.setItem('medisync_submitted_orders', JSON.stringify(prePopulatedDummyQueue));
    }
    renderIncomingOrdersStream();
    renderPaymentsStationLedger();
}

function renderIncomingOrdersStream() {
    const streamContainer = document.getElementById('live-orders-stream-container');
    if (!streamContainer) return;

    const rawData = localStorage.getItem('medisync_submitted_orders');
    let ordersArray = rawData ? JSON.parse(rawData) : [];

    if (ordersArray.length === 0) {
        streamContainer.innerHTML = `<div style="text-align: center; background: white; padding: 40px; border-radius: 12px; border: 1px dashed #cbd5e1; color: var(--text-muted); font-size: 13px;">No incoming request streams. All orders processed.</div>`;
        return;
    }

    streamContainer.innerHTML = ordersArray.map((order, index) => {
        const itemRowsHTML = order.items.map(item => `
            <div style="display:flex; justify-content:space-between; font-size:13px; border-bottom:1px solid #f1f5f9; padding: 6px 0;">
                <span>${item.name} <strong style="color:#0d9488;">x${item.qty}</strong></span>
                <span style="font-weight:700;">₹${(item.price * item.qty).toFixed(2)}</span>
            </div>`).join('');

        const payBadge = order.isPaid ? 'pay-pill-settled' : 'pay-pill-pending';
        const payText = order.isPaid ? 'Paid' : 'Unpaid';

        return `
            <div class="live-order-card">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
                    <div>
                        <span style="background: #ccfbf1; color: #0f766e; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px;">${order.orderId}</span>
                        <span style="font-size: 11px; color: #64748b; margin-left: 10px;"><i class="fa-regular fa-clock"></i> ${order.timestamp}</span>
                    </div>
                    <span class="status-badge ${payBadge}">${payText} (${order.payMode})</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f8fafc; padding: 10px; border-radius: 6px; font-size: 12px; margin-top:5px;">
                    <div><i class="fa-solid fa-user" style="color:var(--brand-teal);"></i> Patient: <strong>${order.customerName}</strong></div>
                    <div><i class="fa-solid fa-phone" style="color:var(--brand-teal);"></i> Contact: <strong>${order.phone}</strong></div>
                    <div style="grid-column: span 2;"><i class="fa-solid fa-location-dot" style="color:var(--brand-teal);"></i> Transit Dest: ${order.address}</div>
                </div>
                <div style="margin-top: 8px;">${itemRowsHTML}</div>
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px; padding-top:10px; border-top:1px dashed #e2e8f0;">
                    <div>Grand Total Value: <strong style="font-size:16px; color:#0d9488;">₹${parseFloat(order.grandTotal).toFixed(2)}</strong></div>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="processApproveConsumerOrder(${index})" style="background: #0d9488; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 12px;"><i class="fa-solid fa-file-signature"></i> Convert to Invoice</button>
                        <button onclick="directApproveOnlineOrder(${index})" style="background: #16a34a; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 12px;"><i class="fa-solid fa-circle-check"></i> Approve & Pack</button>
                        <button onclick="directRejectOnlineOrder(${index})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 12px;"><i class="fa-solid fa-trash-can"></i> Reject</button>
                    </div>
                </div>
            </div>`;
    }).join('');
}

function processApproveConsumerOrder(index) {
    const rawData = localStorage.getItem('medisync_submitted_orders');
    if(!rawData) return;
    let ordersArray = JSON.parse(rawData);
    const targetedOrder = ordersArray[index];
    
    document.getElementById('cust-input-name').value = targetedOrder.customerName;
    document.getElementById('cust-input-phone').value = targetedOrder.phone;

    activeInvoiceItemsArray = targetedOrder.items.map(item => {
        const match = CENTRAL_MASTER_INVENTORY_DB.find(m => m.name.toLowerCase().includes(item.name.toLowerCase()));
        return { id: match ? match.id : "MDS-M99", name: item.name, unitPrice: item.price, qty: item.qty, total: item.price * item.qty };
    });

    ordersArray.splice(index, 1);
    localStorage.setItem('medisync_submitted_orders', JSON.stringify(ordersArray));
    renderIncomingOrdersStream();
    renderPaymentsStationLedger();
    renderInvoiceTableStructure();

    document.querySelector('[data-target="panel-manual-billing"]').click();
}

function directApproveOnlineOrder(index) {
    const rawData = localStorage.getItem('medisync_submitted_orders');
    if(!rawData) return;
    let ordersArray = JSON.parse(rawData);
    const targetedOrder = ordersArray[index];
    const savedItemsCopy = targetedOrder.items.map(i => ({ name: i.name, qty: i.qty }));

    const invoiceRecordDataNode = {
        invoiceId: "MS-ONLINE-" + Math.floor(10000 + Math.random() * 90000),
        timestamp: new Date().toLocaleString(),
        customerName: targetedOrder.customerName,
        customerPhone: targetedOrder.phone,
        medicinesList: savedItemsCopy,
        grandTotal: parseFloat(targetedOrder.grandTotal).toFixed(2)
    };

    let existingHistoryCollection = [];
    const localRawData = localStorage.getItem('medisync_billing_history');
    if(localRawData) { existingHistoryCollection = JSON.parse(localRawData); }

    existingHistoryCollection.unshift(invoiceRecordDataNode);
    localStorage.setItem('medisync_billing_history', JSON.stringify(existingHistoryCollection));

    ordersArray.splice(index, 1);
    localStorage.setItem('medisync_submitted_orders', JSON.stringify(ordersArray));
    
    renderIncomingOrdersStream();
    renderPaymentsStationLedger();
    renderBillHistoryLedger();
    recalculateMetricsSummary();

    alert(`Order approved successfully. Saved inside transaction ledger history.`);
}

function directRejectOnlineOrder(index) {
    const rawData = localStorage.getItem('medisync_submitted_orders');
    if(!rawData) return;
    let ordersArray = JSON.parse(rawData);
    const targetedOrder = ordersArray[index];

    if(confirm(`Security Warning: Reject Order ${targetedOrder.orderId}?`)) {
        ordersArray.splice(index, 1);
        localStorage.setItem('medisync_submitted_orders', JSON.stringify(ordersArray));
        renderIncomingOrdersStream();
        renderPaymentsStationLedger();
    }
}

function clearAllConsumerOrders() {
    localStorage.setItem('medisync_submitted_orders', JSON.stringify([]));
    renderIncomingOrdersStream();
    renderPaymentsStationLedger();
}

// ==========================================================================
// INVENTORY SEARCH SELECTION PANEL CONTROL MODAL TRAY
// ==========================================================================
function populateDropdownStockTray(dataset) {
    const tray = document.getElementById('search-dropdown-tray');
    if (!tray) return;
    if (dataset.length === 0) {
        tray.innerHTML = `<div class="dropdown-item-row" style="color:#64748b;">No items match inventory criteria</div>`;
        return;
    }
    tray.innerHTML = dataset.map(med => `
        <div class="dropdown-item-row" onclick="injectMedicineDirectToInvoice('${med.id}')" style="display: flex; justify-content: space-between; font-size:13px;">
            <span><strong>${med.name}</strong> <small style="color:var(--brand-teal);">(${med.id})</small></span>
            <span style="font-weight: 700;">₹${med.price.toFixed(2)}</span>
        </div>`).join('');
}

function showDropdownTray() { filterDropdownTray(); const tray = document.getElementById('search-dropdown-tray'); if(tray) tray.style.display = 'block'; }
function hideDropdownTray() { const tray = document.getElementById('search-dropdown-tray'); if(tray) setTimeout(() => { tray.style.display = 'none'; }, 200); }
function filterDropdownTray() {
    const val = document.getElementById('billing-med-search').value.toLowerCase().trim();
    const filtered = CENTRAL_MASTER_INVENTORY_DB.filter(i => i.status === "In Stock" && (i.name.toLowerCase().includes(val) || i.id.toLowerCase().includes(val)));
    populateDropdownStockTray(filtered);
}

function injectMedicineDirectToInvoice(itemId) {
    const target = CENTRAL_MASTER_INVENTORY_DB.find(m => m.id === itemId);
    if (!target) return;

    const match = activeInvoiceItemsArray.find(r => r.id === itemId);
    if (match) {
        match.qty += 1; match.total = match.qty * match.unitPrice;
    } else {
        activeInvoiceItemsArray.push({ id: target.id, name: target.name, unitPrice: target.price, qty: 1, total: target.price });
    }
    renderInvoiceTableStructure();
    document.getElementById('billing-med-search').value = '';
}

function updateInvoiceRowQuantity(index, input) {
    let q = parseInt(input.value); if (isNaN(q) || q < 1) { q = 1; input.value = 1; }
    activeInvoiceItemsArray[index].qty = q; activeInvoiceItemsArray[index].total = q * activeInvoiceItemsArray[index].unitPrice;
    renderInvoiceTableStructure();
}

function removeMedicineRowFromInvoice(index) { activeInvoiceItemsArray.splice(index, 1); renderInvoiceTableStructure(); }

function renderInvoiceTableStructure() {
    const tbody = document.getElementById('invoice-table-body-target');
    const grandTotalSpan = document.getElementById('invoice-grand-total');
    if (!tbody) return;

    if (activeInvoiceItemsArray.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px 0;">No medicines added. Choose from dropdown.</td></tr>`;
        if (grandTotalSpan) grandTotalSpan.innerText = "₹0.00"; return;
    }

    let sum = 0;
    tbody.innerHTML = activeInvoiceItemsArray.map((row, idx) => {
        sum += row.total;
        return `
            <tr>
                <td><code>${row.id}</code></td>
                <td><strong>${row.name}</strong></td>
                <td>₹${row.unitPrice.toFixed(2)}</td>
                <td><input type="number" class="qty-spinner-input" min="1" value="${row.qty}" onchange="updateInvoiceRowQuantity(${idx}, this)"></td>
                <td><strong>₹${row.total.toFixed(2)}</strong></td>
                <td class="hide-on-print"><button class="row-delete-btn" onclick="removeMedicineRowFromInvoice(${idx})"><i class="fa-solid fa-trash-can"></i></button></td>
            </tr>`;
    }).join('');
    if (grandTotalSpan) grandTotalSpan.innerText = `₹${sum.toFixed(2)}`;
}
function exitWorkspacePortal() {

    // Optional session clear
    sessionStorage.removeItem("currentLoggedInUser");

    // Redirect to main landing page
    window.location.href = "pro1.html";

}
function saveUserProfileConfigurations() {

    const newName =
        document.getElementById("settings-admin-name").value;

    const newRole =
        document.getElementById("settings-admin-role").value;

    document.getElementById("sidebar-profile-name").innerText =
        newName;

    document.getElementById("sidebar-profile-role").innerText =
        newRole;

    const initials = newName
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

    document.getElementById("sidebar-avatar-initials").innerText =
        initials;
}
function addNewUserSidebar() {

    const userName =
        document.getElementById("new-user-name").value;

    const userRole =
        document.getElementById("new-user-role").value;

    // Sidebar Name
    document.getElementById("sidebar-profile-name").innerText =
        userName;

    // Sidebar Role
    document.getElementById("sidebar-profile-role").innerText =
        userRole;

    // Avatar Initials
    const initials = userName
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

    document.getElementById("sidebar-avatar-initials").innerText =
        initials;
}