// Show cart on payment page
function displayCart() {
    var cartText = localStorage.getItem('cart') || '[]';
    var cart = JSON.parse(cartText);
    var cartDisplay = document.getElementById('cart-display');
    
    if (cart.length === 0) {
        cartDisplay.innerHTML = '<p>Your cart is empty. <a href="order.html">Go back to order</a></p>';
        var form = document.getElementById('payment-form');
        if (form) {
            form.style.display = 'none';
        }
        return;
    }
    
    var subtotal = 0;
    var html = '<h3>Your Order</h3>';
    
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var itemTotal = item.price * item.qty;
        subtotal = subtotal + itemTotal;
        
        html += '<div class="cart-item-row">';
        html += '<span>' + item.name + ' × ' + item.qty + '</span>';
        html += '<span style="float:right;">$' + itemTotal.toFixed(2) + '</span>';
        html += '</div>';
    }
    
    var tax = subtotal * 0.07;
    var total = subtotal + tax;
    
    html += '<hr style="margin:12px 0;border:none;border-top:1px solid #e0d6c8;">';
    html += '<div class="cart-item-row">Subtotal: <span style="float:right;">$' + subtotal.toFixed(2) + '</span></div>';
    html += '<div class="cart-item-row">Tax (7%): <span style="float:right;">$' + tax.toFixed(2) + '</span></div>';
    html += '<div class="cart-total">Total: $' + total.toFixed(2) + '</div>';
    
    cartDisplay.innerHTML = html;
}

// Format card number with spaces
var cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function () {
        var value = this.value.replace(/\s/g, '');
        var formatted = '';
        
        for (var i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        
        this.value = formatted;
    });
}

// Format expiry date
var expiryInput = document.getElementById('cardExpiry');
if (expiryInput) {
    expiryInput.addEventListener('input', function () {
        var value = this.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        this.value = value;
    });
}

// Handle form submission
var form = document.getElementById('payment-form');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        var cartText = localStorage.getItem('cart') || '[]';
        var cart = JSON.parse(cartText);
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Calculate totals
        var subtotal = 0;
        for (var i = 0; i < cart.length; i++) {
            subtotal = subtotal + (cart[i].price * cart[i].qty);
        }
        var tax = subtotal * 0.07;
        var total = subtotal + tax;
        
        // Get card last 4 digits
        var cardNumber = document.getElementById('cardNumber').value;
        var lastFour = cardNumber.replace(/\s/g, '').slice(-4);

        // Get pickup time
        var pickupTimeValue = document.getElementById('pickupTime').value; // "HH:MM"
        
        // Create order info
        var orderNumber = 'BB-' + Math.floor(1000 + Math.random() * 9000);
        var orderInfo = {
            orderNumber: orderNumber,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            date: new Date().toISOString().slice(0, 10),
            pickupTime: pickupTimeValue,              // <-- new
            cart: cart,
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
            paymentMethod: 'Card ending in ' + lastFour
        };
        
        // Save order for receipt
        localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
        
        // Also save to staff orders so staff portal can see it
        var staffOrdersText = localStorage.getItem('staffOrders') || '[]';
        var staffOrders = JSON.parse(staffOrdersText);
        staffOrders.push({
            orderNumber: orderNumber,
            firstName: orderInfo.firstName,
            lastName: orderInfo.lastName,
            phone: orderInfo.phone,
            date: orderInfo.date,
            pickupTime: orderInfo.pickupTime,       // <-- new
            total: parseFloat(orderInfo.total),
            status: 'pending',
            cart: orderInfo.cart
        });
        localStorage.setItem('staffOrders', JSON.stringify(staffOrders));
        
        // Clear cart after order
        localStorage.removeItem('cart');
        
        // Go to receipt
        window.location.href = 'receipt.html';
    });
}

// Run when page loads
displayCart();
