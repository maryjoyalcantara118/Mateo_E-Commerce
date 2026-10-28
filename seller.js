document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Security check: Ensure user is logged in as seller
    if (!currentUser || currentUser.role !== 'seller') {
        window.location.href = 'index.html';
        return;
    }

    // Full product catalog matching all categories in Customer Portal
    const allProducts = [
        // Face Makeup
        { id: 1, name: 'Liquid Foundation', price: 199.00, category: 'Face Makeup', stock: 25 },
        { id: 2, name: 'Concealer', price: 549.00, category: 'Face Makeup', stock: 15 },
        { id: 3, name: 'Face Powder', price: 199.00, category: 'Face Makeup', stock: 30 },
        { id: 4, name: 'Blush', price: 220.00, category: 'Face Makeup', stock: 20 },

        // Eye Makeup
        { id: 5, name: 'Eyeliner', price: 300.00, category: 'Eye Makeup', stock: 18 },
        { id: 6, name: 'Mascara', price: 299.00, category: 'Eye Makeup', stock: 22 },
        { id: 7, name: 'Eyeshadow', price: 350.00, category: 'Eye Makeup', stock: 15 },

        // Lip Products
        { id: 8, name: 'Lipstick', price: 249.00, category: 'Lip Products', stock: 35 },
        { id: 9, name: 'Lip Tint', price: 199.00, category: 'Lip Products', stock: 40 },
        { id: 10, name: 'Lip Gloss', price: 179.00, category: 'Lip Products', stock: 28 },

        // Skincare
        { id: 11, name: 'Facial Cleanser', price: 289.00, category: 'Skincare', stock: 25 },
        { id: 12, name: 'Brightening Sunscreen', price: 349.00, category: 'Skincare', stock: 20 },
        { id: 13, name: 'Tone Up Sunscreen', price: 349.00, category: 'Skincare', stock: 15 },

        // Body Care
        { id: 14, name: 'Soothing Gel', price: 249.00, category: 'Body Care', stock: 30 },
        { id: 15, name: 'Shower Gel', price: 210.00, category: 'Body Care', stock: 24 },
        { id: 16, name: 'Body Lotion', price: 260.00, category: 'Body Care', stock: 18 },

        // Hair Care
        { id: 17, name: 'Dry Shampoo', price: 189.00, category: 'Hair Care', stock: 22 },
        { id: 18, name: 'Hair Serum', price: 299.00, category: 'Hair Care', stock: 16 },
        { id: 19, name: 'Hair Treatment', price: 299.00, category: 'Hair Care', stock: 14 },

        // Fragrance
        { id: 20, name: 'Daily Cologne', price: 180.00, category: 'Fragrance', stock: 30 },
        { id: 21, name: 'Body Mist', price: 225.00, category: 'Fragrance', stock: 25 }
    ];

    // ONLY initialize products if they don't exist yet (prevents overwriting on refresh)
    if (!localStorage.getItem('sellerProducts')) {
        localStorage.setItem('sellerProducts', JSON.stringify(allProducts));
    }

    const titleElem = document.getElementById('sellerContentTitle');
    const subElem = document.getElementById('sellerContentSub');
    const menuItems = document.querySelectorAll('.sidebar .menu-item');

    // Restore active tab and view from localStorage on load/refresh
    const savedTab = localStorage.getItem('sellerActiveTab') || 'dashboard overview';
    
    menuItems.forEach(item => {
        const itemText = item.textContent.trim().toLowerCase();
        if (itemText.includes(savedTab.toLowerCase())) {
            menuItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
        }
    });

    loadViewByTabName(savedTab, currentUser, titleElem, subElem);

    // Sidebar menu navigation handling
    menuItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const text = this.textContent.trim().toLowerCase();

            menuItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            // Save active tab so it stays after refresh
            localStorage.setItem('sellerActiveTab', text);

            loadViewByTabName(text, currentUser, titleElem, subElem);
        });
    });
});

// Helper function to render the correct view based on tab text
function loadViewByTabName(text, currentUser, titleElem, subElem) {
    if (text.includes('dashboard')) {
        if (titleElem) titleElem.textContent = "Joy Glow's Cosmetics";
        if (subElem) subElem.textContent = "Welcome to your seller dashboard. Manage store inventory and client orders.";
        renderSellerDashboard(currentUser);
    } else if (text.includes('manage products')) {
        if (titleElem) titleElem.textContent = "Manage Products Section";
        if (subElem) subElem.textContent = "View, edit, or remove store inventory items.";
        renderManageProductsView();
    } else if (text.includes('add product')) {
        if (titleElem) titleElem.textContent = "Add Product Section";
        if (subElem) subElem.textContent = "List a new cosmetics product to your store.";
        renderAddProductView();
    } else if (text.includes('customer orders') || text.includes('orders')) {
        if (titleElem) titleElem.textContent = "Customer Orders Section";
        if (subElem) subElem.textContent = "Track and process incoming customer orders.";
        renderCustomerOrdersView();
    } else if (text.includes('seller profile') || text.includes('profile')) {
        if (titleElem) titleElem.textContent = "Seller Profile";
        if (subElem) subElem.textContent = "Your administrative account information.";
        renderSellerProfileView(currentUser);
    } else if (text.includes('logout')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sellerOrders');
        localStorage.removeItem('sellerActiveTab');
        window.location.href = 'index.html';
    }
}

/* ----------------------------------------------------
   1. SELLER DASHBOARD OVERVIEW
---------------------------------------------------- */
function renderSellerDashboard(user) {
    const container = document.getElementById('sellerPageContent');
    if (!container) return;

    const products = JSON.parse(localStorage.getItem('sellerProducts')) || [];
    const savedOrders = JSON.parse(localStorage.getItem('sellerOrders')) || [];

    // Calculate total revenue ONLY from Completed customer orders
    let totalRevenue = 0;
    savedOrders.forEach(order => {
        if (order.status === 'Completed') {
            const num = parseFloat((order.total || '').toString().replace(/[^0-9.]/g, '')) || 0;
            totalRevenue += num;
        }
    });

    container.innerHTML = `
        <div class="promo-banner">
            <h2>Welcome back, ${user.email || 'Admin'}!</h2>
            <p>Here is a summary of your store's performance today.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-top: 20px;">
            <div class="card">
                <span class="group-title" style="padding: 0; margin-bottom: 8px;">Total Products</span>
                <p style="font-size: 1.8rem; font-weight: 700; color: #8C1D40; margin: 0;">${products.length}</p>
            </div>
            <div class="card">
                <span class="group-title" style="padding: 0; margin-bottom: 8px;">Total Customer Orders</span>
                <p style="font-size: 1.8rem; font-weight: 700; color: #8C1D40; margin: 0;">${savedOrders.length}</p>
            </div>
            <div class="card">
                <span class="group-title" style="padding: 0; margin-bottom: 8px;">Total Sales Summary</span>
                <p style="font-size: 1.8rem; font-weight: 700; color: #8C1D40; margin: 0;">₱${totalRevenue.toFixed(2)}</p>
            </div>
        </div>
    `;
}

/* ----------------------------------------------------
   2. MANAGE PRODUCTS SECTION
---------------------------------------------------- */
function renderManageProductsView() {
    const container = document.getElementById('sellerPageContent');
    if (!container) return;

    let products = JSON.parse(localStorage.getItem('sellerProducts')) || [];

    let rowsHTML = products.map((p) => `
        <tr>
            <td><strong>${p.name}</strong></td>
            <td style="color: #8C1D40; font-weight: 600;">₱${Number(p.price).toFixed(2)}</td>
            <td>${p.category}</td>
            <td>${p.stock}</td>
            <td style="text-align: right;">
                <button onclick="editProduct(${p.id})" class="btn-action" style="padding: 5px 12px; font-size: 0.78rem; margin-right: 5px;">Edit</button>
                <button onclick="deleteProduct(${p.id})" class="btn-danger" style="padding: 5px 12px; font-size: 0.78rem;">Delete</button>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="card" style="padding: 0; overflow: hidden;">
            <table class="orders-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Stock / Qty</th>
                        <th style="text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHTML || '<tr><td colspan="5" style="text-align: center; color: #888;">No products listed.</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

function deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem('sellerProducts')) || [];
    products = products.filter(p => p.id !== id);
    localStorage.setItem('sellerProducts', JSON.stringify(products));
    renderManageProductsView();
}

function editProduct(id) {
    let products = JSON.parse(localStorage.getItem('sellerProducts')) || [];
    let p = products.find(item => item.id === id);
    if (!p) return;

    let newName = prompt("Edit Product Name:", p.name);
    let newPrice = prompt("Edit Price (₱):", p.price);
    let newStock = prompt("Edit Stock Quantity:", p.stock);

    if (newName !== null && newPrice !== null && newStock !== null) {
        p.name = newName.trim();
        p.price = parseFloat(newPrice) || p.price;
        p.stock = parseInt(newStock) || p.stock;
        localStorage.setItem('sellerProducts', JSON.stringify(products));
        renderManageProductsView();
    }
}

/* ----------------------------------------------------
   3. ADD PRODUCT SECTION
---------------------------------------------------- */
function renderAddProductView() {
    const container = document.getElementById('sellerPageContent');
    if (!container) return;

    container.innerHTML = `
        <div class="card" style="max-width: 550px;">
            <h3 style="margin-bottom: 20px;">Add New Product</h3>
            
            <div class="form-group">
                <label>Product Name</label>
                <input type="text" id="addName" placeholder="e.g., Velvet Lip Tint">
            </div>

            <div class="form-group">
                <label>Price (₱)</label>
                <input type="number" id="addPrice" placeholder="199.00">
            </div>

            <div class="form-group">
                <label>Category</label>
                <input type="text" id="addCategory" placeholder="e.g., Lip Products">
            </div>

            <div class="form-group">
                <label>Stock or Quantity</label>
                <input type="number" id="addStock" placeholder="20">
            </div>

            <button id="saveProductBtn" class="btn-action" style="margin-top: 10px; width: 100%;">Add / Save Product</button>
        </div>
    `;

    document.getElementById('saveProductBtn').addEventListener('click', function() {
        const name = document.getElementById('addName').value.trim();
        const price = document.getElementById('addPrice').value.trim();
        const category = document.getElementById('addCategory').value.trim();
        const stock = document.getElementById('addStock').value.trim();

        if (!name || !price || !category || !stock) {
            alert('Please fill in all product fields.');
            return;
        }

        let products = JSON.parse(localStorage.getItem('sellerProducts')) || [];
        products.push({ id: Date.now(), name, price: parseFloat(price), category, stock: parseInt(stock) });
        localStorage.setItem('sellerProducts', JSON.stringify(products));
        alert('Product successfully added!');
        renderManageProductsView();
    });
}

/* ----------------------------------------------------
   4. CUSTOMER ORDERS SECTION
---------------------------------------------------- */
function renderCustomerOrdersView() {
    const container = document.getElementById('sellerPageContent');
    if (!container) return;

    const savedOrders = JSON.parse(localStorage.getItem('sellerOrders')) || [];

    if (savedOrders.length === 0) {
        container.innerHTML = `
            <div class="card">
                <p style="margin: 0; color: #666; font-style: italic;">No customer orders placed yet.</p>
            </div>
        `;
        return;
    }

    let ordersHTML = savedOrders.map((order, index) => {
        let badgeClass = 'processing';
        if (order.status === 'Completed') badgeClass = 'delivered';
        if (order.status === 'Cancelled') badgeClass = 'cancelled';

        return `
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div>
                    <h3 style="margin: 0 0 6px 0; color: #8C1D40;">Order #${order.id}</h3>
                    <p style="margin: 0 0 4px 0;"><strong>Customer:</strong> ${order.customer}</p>
                    <p style="margin: 0; color: #555;">${order.product}</p>
                    <p style="margin: 6px 0 0 0; font-weight: 700; color: #8C1D40;">Total: ${order.total}</p>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
                    <span class="status-badge ${badgeClass}">${order.status}</span>
                    <div>
                        <button onclick="updateSellerOrderStatus(${index}, 'Completed')" class="btn-action" style="padding: 5px 12px; font-size: 0.75rem; background-color: #4CAF50;">Complete</button>
                        <button onclick="updateSellerOrderStatus(${index}, 'Cancelled')" class="btn-danger" style="padding: 5px 12px; font-size: 0.75rem;">Cancel</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = ordersHTML;
}

function updateSellerOrderStatus(index, newStatus) {
    let savedOrders = JSON.parse(localStorage.getItem('sellerOrders')) || [];
    if (savedOrders[index]) {
        savedOrders[index].status = newStatus;
        localStorage.setItem('sellerOrders', JSON.stringify(savedOrders));
        renderCustomerOrdersView();
        alert(`Order status updated to ${newStatus}`);
    }
}

function renderSellerProfileView(user) {
    const container = document.getElementById('sellerPageContent');
    if (!container) return;

    container.innerHTML = `
        <div class="card" style="max-width: 500px;">
            <h3 style="margin-bottom: 15px;">Seller Profile Information</h3>
            <div class="profile-info" style="line-height: 1.8;">
                <p><strong>Seller Name:</strong> Joy Glow Admin</p>
                <p><strong>Store Name:</strong> Joy Glow's Cosmetics Official Store</p>
                <p><strong>Email:</strong> ${user.email || 'admin@joyglows.com'}</p>
                <p><strong>Contact Information:</strong> 09854712768 </p>
            </div>
        </div>
    `;
}