// Run initial setup once the document DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Security check: Ensure user is logged in as a customer
    if (!currentUser || currentUser.role !== 'customer') {
        window.location.href = 'index.html';
        return;
    }

    updateCartUI();
    updateWishlistUI();
    loadCustomerOrders();
});

// Navigation tab click handler
function setActive(element, event) {
    if (event) event.preventDefault();
    if (!element) return;

    // Reset all menu items to inactive
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));

    // Highlight selected item
    element.classList.add('active');

    // Switch section view
    const targetId = element.getAttribute('data-target');
    if (!targetId) return;

    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === targetId) {
            section.classList.add('active');
        }
    });
}

// Sidebar toggle button
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// Array to store cart items
let cart = [];

function addToCart(productName, price) {
    const parsedPrice = typeof price === 'number' ? price : parseFloat(price.toString().replace('₱', '')) || 0;

    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: parsedPrice,
            quantity: 1
        });
    }

    updateCartUI();
    alert(productName + ' has been added to your cart!');
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartBadge = document.getElementById('cart-badge') || document.querySelector('.shopping-badge') || document.querySelector('.badge');

    let totalAmount = 0;
    let totalItems = 0;

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="color: #666; font-style: italic;">Your cart is currently empty.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                totalAmount += itemTotal;
                totalItems += item.quantity;

                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; background: #fff; border-radius: 10px; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.03);";
                itemDiv.innerHTML = `
                    <div>
                        <h4 style="margin: 0 0 4px 0; font-size: 1rem; color: #8C1D40;">${item.name}</h4>
                        <p style="margin: 0; color: #666; font-size: 0.85rem;">Quantity: ${item.quantity}</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span class="item-price" style="font-weight: bold; color: #333;">₱${itemTotal.toFixed(2)}</span>
                        <button onclick="removeFromCart(${index})" style="background-color: #8C1D40; color: white; border: none; padding: 6px 12px; border-radius: 15px; cursor: pointer; font-size: 0.75rem; font-weight: 600;">Delete</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemDiv);
            });
        }
    } else {
        cart.forEach(item => {
            totalAmount += item.price * item.quantity;
            totalItems += item.quantity;
        });
    }

    if (cartTotalElement) {
        cartTotalElement.textContent = `₱${totalAmount.toFixed(2)}`;
    }
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

/* ----------------------------------------------------
   WISHLIST FUNCTIONALITY
---------------------------------------------------- */
let wishlist = [];

function toggleWishlist(button, productName, price) {
    if (!button) return;
    const icon = button.querySelector('i');
    if (!icon) return;

    if (!productName) {
        const card = button.closest('.product-card') || button.parentElement;
        const nameEl = card.querySelector('h3') || card.querySelector('.product-title');
        const priceEl = card.querySelector('.price') || card.querySelector('span[style*="color"]');
        productName = nameEl ? nameEl.textContent.trim() : 'Cosmetic Item';
        price = priceEl ? priceEl.textContent.trim() : '₱199.00';
    }

    const isCurrentlyLiked = icon.classList.contains('fa-solid');

    if (isCurrentlyLiked) {
        wishlist = wishlist.filter(item => item.name !== productName);
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        icon.style.color = '#666666';
        alert(productName + ' removed from your wishlist.');
    } else {
        if (!wishlist.some(item => item.name === productName)) {
            wishlist.push({ name: productName, price: price });
        }
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        icon.style.color = '#8C1D40';
        alert(productName + ' added to your wishlist!');
    }

    updateWishlistUI();
}

function updateWishlistUI() {
    const wishlistContainer = document.getElementById('wishlist-items') || document.querySelector('#wishlist .content-body') || document.querySelector('#wishlist');
    if (!wishlistContainer) return;

    let listWrapper = document.getElementById('wishlist-list-container');
    if (!listWrapper) {
        listWrapper = document.createElement('div');
        listWrapper.id = 'wishlist-list-container';
        listWrapper.style.cssText = "display: flex; flex-direction: column; gap: 15px; margin-top: 20px;";
        wishlistContainer.appendChild(listWrapper);
    }

    listWrapper.innerHTML = '';

    if (wishlist.length === 0) {
        listWrapper.innerHTML = '<p style="color: #666; font-style: italic;">Your wishlist is currently empty.</p>';
        return;
    }

    wishlist.forEach((item, index) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'card';
        itemCard.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);";
        
        itemCard.innerHTML = `
            <div>
                <h4 style="margin: 0 0 4px 0; color: #8C1D40; font-size: 1rem;">${item.name}</h4>
                <p style="margin: 0; font-weight: 600; color: #333;">${item.price}</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="addToCart('${item.name}', '${item.price}')" class="btn-action" style="padding: 6px 14px; font-size: 0.8rem;">Add to Cart</button>
                <button onclick="removeFromWishlist(${index})" class="btn-danger" style="padding: 6px 14px; font-size: 0.8rem; background-color: #E53935; color: white; border: none; border-radius: 20px; cursor: pointer;">Delete</button>
            </div>
        `;
        listWrapper.appendChild(itemCard);
    });
}

function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    updateWishlistUI();
}

/* ----------------------------------------------------
   LOGOUT FUNCTIONALITY (Only clears session data upon explicit logout)
---------------------------------------------------- */
function confirmLogout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sellerOrders');
        alert("Logged out successfully.");
        window.location.href = 'index.html';
    }
}

/* ----------------------------------------------------
   LOAD EXISTING CUSTOMER ORDERS ON REFRESH
---------------------------------------------------- */
function loadCustomerOrders() {
    const ordersTableBody = document.querySelector('#my-orders tbody');
    if (!ordersTableBody) return;

    const savedOrders = JSON.parse(localStorage.getItem('sellerOrders')) || [];
    ordersTableBody.innerHTML = '';

    if (savedOrders.length === 0) {
        ordersTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666; font-style: italic;">No orders placed yet.</td></tr>';
        return;
    }

    savedOrders.forEach((order, index) => {
        let badgeClass = 'processing';
        if (order.status === 'Completed') badgeClass = 'delivered';
        if (order.status === 'Cancelled') badgeClass = 'cancelled';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.product}</td>
            <td>${order.payment || 'GCash'}</td>
            <td><span class="status-badge ${badgeClass}">${order.status || 'Processing'}</span></td>
            <td>${order.total}</td>
            <td><button onclick="cancelOrder(${index})" style="background-color: #E53935; color: white; border: none; padding: 5px 12px; border-radius: 15px; cursor: pointer; font-size: 0.75rem; font-weight: 600;">Cancel</button></td>
        `;
        ordersTableBody.appendChild(row);
    });
}

/* ----------------------------------------------------
   AUTOMATIC CHECKOUT AND SELLER ORDER PERSISTENCE
---------------------------------------------------- */
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { email: 'customer@example.com' };
    let existingSellerOrders = JSON.parse(localStorage.getItem('sellerOrders')) || [];

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        const newOrder = {
            id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            customer: currentUser.email || currentUser.username || 'alcantaramateomarjorie@gmail.com',
            product: `${item.name} (x${item.quantity})`,
            payment: 'GCash',
            total: `₱${itemTotal.toFixed(2)}`,
            status: 'Processing'
        };

        existingSellerOrders.push(newOrder);
    });

    // Persist to localStorage so orders survive page reloads
    localStorage.setItem('sellerOrders', JSON.stringify(existingSellerOrders));

    cart = [];
    updateCartUI();
    loadCustomerOrders();

    alert("Order placed successfully! Redirecting to My Orders...");

    const ordersMenuItem = document.querySelector('.menu-item[data-target="my-orders"]');
    if (ordersMenuItem) {
        setActive(ordersMenuItem);
    }
}

function cancelOrder(index) {
    if (confirm("Are you sure you want to cancel this order?")) {
        let savedOrders = JSON.parse(localStorage.getItem('sellerOrders')) || [];
        if (savedOrders[index]) {
            savedOrders[index].status = 'Cancelled';
            localStorage.setItem('sellerOrders', JSON.stringify(savedOrders));
            loadCustomerOrders();
            alert("Order cancelled successfully.");
        }
    }
}