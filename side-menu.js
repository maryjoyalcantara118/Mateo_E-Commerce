// Run initial setup once the document DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
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
    // Fallback price parsing if a string is passed
    const parsedPrice = typeof price === 'number' ? price : parseFloat(price) || 0;

    // Check if item already exists in cart
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
            cartItemsContainer.innerHTML = '<p>Your cart is currently empty.</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalAmount += itemTotal;
                totalItems += item.quantity;

                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.style.display = 'flex';
                itemDiv.style.justifyContent = 'space-between';
                itemDiv.style.alignItems = 'center';
                itemDiv.style.marginBottom = '10px';
                itemDiv.innerHTML = `
                    <div>
                        <h4 style="margin: 0; font-size: 1rem;">${item.name}</h4>
                        <p style="margin: 2px 0 0; color: #666;">Quantity: ${item.quantity}</p>
                    </div>
                    <span class="item-price" style="font-weight: bold;">₱${itemTotal.toFixed(2)}</span>
                `;
                cartItemsContainer.appendChild(itemDiv);
            });
        }
    } else {
        // Calculate totals even if cart section isn't active/rendered yet
        cart.forEach(item => {
            totalAmount += item.price * item.quantity;
            totalItems += item.quantity;
        });
    }

    // Update Total Price and Cart Counter Badge
    if (cartTotalElement) {
        cartTotalElement.textContent = `₱${totalAmount.toFixed(2)}`;
    }
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
}

// Wishlist icon toggle
function toggleWishlist(button) {
    if (!button) return;
    const icon = button.querySelector('i');
    if (!icon) return;

    if (icon.classList.contains('fa-regular')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        icon.style.color = '#8C1D40';
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        icon.style.color = '#666666';
    }
}

// Logout confirmation
function confirmLogout() {
    if (confirm("Are you sure you want to log out?")) {
        alert("Logged out successfully.");
    }
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const ordersTableBody = document.querySelector('#my-orders tbody');
    
    if (ordersTableBody) {
        // Transfer each item from cart into the My Orders table
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const newRow = document.createElement('tr');
            
            const quantityText = item.quantity > 1 ? ` (x${item.quantity})` : '';
            
            newRow.innerHTML = `
                <td>${item.name}${quantityText}</td>
                <td>GCash</td>
                <td><span class="status-badge processing">Processing</span></td>
                <td>₱${itemTotal.toFixed(2)}</td>
            `;
            
            ordersTableBody.appendChild(newRow);
        });
    }

    // Empty the cart array and update cart UI
    cart = [];
    updateCartUI();

    alert("Order placed successfully! Redirecting to My Orders...");

    // Automatically switch view to My Orders tab
    const ordersMenuItem = document.querySelector('.menu-item[data-target="my-orders"]');
    if (ordersMenuItem) {
        setActive(ordersMenuItem);
    }
}
