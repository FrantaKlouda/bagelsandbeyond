// Get cart from browser storage
function getCart() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        return JSON.parse(cartData);
    }
    return [];
}

// Save cart to browser storage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Count total items in cart
function getCartCount() {
    const cart = getCart();
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total = total + cart[i].qty;
    }
    return total;
}

// Add item to cart
function addToCart(name, price) {
    const cart = getCart();
    
    // Check if item already exists
    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            cart[i].qty = cart[i].qty + 1;
            found = true;
            break;
        }
    }
    
    // If not found, add new item
    if (!found) {
        cart.push({ 
            name: name, 
            price: price, 
            qty: 1 
        });
    }
    
    saveCart(cart);
    renderCart();
}

// Remove item from cart
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

// Change item quantity
function changeQty(index, change) {
    const cart = getCart();
    cart[index].qty = cart[index].qty + change;
    
    // Don't let quantity go below 1
    if (cart[index].qty < 1) {
        cart[index].qty = 1;
    }
    
    saveCart(cart);
    renderCart();
}

// Clear entire cart
function clearCart() {
    if (confirm('Clear your cart?')) {
        localStorage.removeItem('cart');
        renderCart();
    }
}

// Display cart on page
function renderCart() {
    const cart = getCart();
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    // Update cart count badge
    if (cartCount) {
        cartCount.textContent = getCartCount();
    }
    
    // Stop if cart section doesn't exist on this page
    if (!cartItems) {
        return;
    }
    
    // Show empty message
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center;padding:20px;color:#7a6a5d;">Your cart is empty</p>';
        if (cartTotal) {
            cartTotal.innerHTML = '';
        }
        return;
    }
    
    // Build cart display
    let html = '';
    let total = 0;
    
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const itemTotal = item.price * item.qty;
        total = total + itemTotal;
        
        html += '<div style="background:#f8f2ea;padding:12px;border-radius:8px;margin-bottom:10px;">';
        html += '<div style="display:flex;justify-content:space-between;margin-bottom:8px;">';
        html += '<strong style="font-size:0.95rem;">' + item.name + '</strong>';
        html += '<button onclick="removeFromCart(' + i + ')" style="background:#e0d6c8;padding:4px 8px;font-size:0.8rem;border-radius:4px;cursor:pointer;border:none;">Remove</button>';
        html += '</div>';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
        html += '<div style="display:flex;gap:8px;align-items:center;">';
        html += '<button onclick="changeQty(' + i + ', -1)" style="width:24px;height:24px;border-radius:50%;background:#e0d6c8;padding:0;cursor:pointer;border:none;">−</button>';
        html += '<span style="min-width:20px;text-align:center;">' + item.qty + '</span>';
        html += '<button onclick="changeQty(' + i + ', 1)" style="width:24px;height:24px;border-radius:50%;background:#e0d6c8;padding:0;cursor:pointer;border:none;">+</button>';
        html += '</div>';
        html += '<strong>$' + itemTotal.toFixed(2) + '</strong>';
        html += '</div></div>';
    }
    
    cartItems.innerHTML = html;
    
    if (cartTotal) {
        cartTotal.innerHTML = '<div style="display:flex;justify-content:space-between;font-size:1.1rem;font-weight:bold;"><span>Total:</span><span>$' + total.toFixed(2) + '</span></div>';
    }
}

// Start when page loads
renderCart();
