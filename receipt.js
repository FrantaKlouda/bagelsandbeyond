function showReceipt() {
    var infoText = localStorage.getItem('orderInfo') || '{}';
    var info = JSON.parse(infoText);
    var receiptDiv = document.getElementById('receipt-details');
    
    if (!info.cart || info.cart.length === 0) {
        receiptDiv.innerHTML = '<p>No order found. <a href="order.html">Place a new order</a></p>';
        return;
    }
    
    var html = '';
    html += '<div class="receipt-box">';
    html += '<p><strong>Bagels &amp; Beyond</strong></p>';
    html += '<p>123 Campus Drive, Galloway, NJ</p>';
    html += '<p>Phone: (555) 555-0123</p>';
    html += '<hr>';
    html += '<p><strong>Order #:</strong> ' + info.orderNumber + '</p>';
    html += '<p><strong>Customer:</strong> ' + info.firstName + ' ' + info.lastName + '</p>';
    html += '<p><strong>Phone:</strong> ' + info.phone + '</p>';
    html += '<p><strong>Date:</strong> ' + info.date + '</p>';
    // show pickup time if saved
    if (info.pickupTime) {
        html += '<p><strong>Pickup Time:</strong> ' + info.pickupTime + '</p>';
    }
    html += '<hr>';
    html += '<p><strong>Items</strong></p>';
    html += '<table>';
    html += '<thead><tr><th>Item</th><th style="text-align:right;">Qty</th><th style="text-align:right;">Total</th></tr></thead>';
    html += '<tbody>';

    for (var i = 0; i < info.cart.length; i++) {
        var item = info.cart[i];
        var itemTotal = item.price * item.qty;
        html += '<tr>';
        html += '<td>' + item.name + '</td>';
        html += '<td style="text-align:right;">' + item.qty + '</td>';
        html += '<td style="text-align:right;">$' + itemTotal.toFixed(2) + '</td>';
        html += '</tr>';
    }

    html += '</tbody></table>';
    html += '<hr>';
    html += '<p style="text-align:right;">Subtotal: $' + info.subtotal + '</p>';
    html += '<p style="text-align:right;">Tax (7%): $' + info.tax + '</p>';
    html += '<p style="text-align:right;font-weight:700;">Total: $' + info.total + '</p>';
    html += '<p style="margin-top:10px;"><strong>Payment Method:</strong> ' + info.paymentMethod + '</p>';
    html += '<p style="margin-top:10px;">Thank you for choosing Bagels &amp; Beyond!</p>';
    html += '</div>';

    receiptDiv.innerHTML = html;
}

showReceipt();
