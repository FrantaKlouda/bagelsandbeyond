// Simple price list
var prices = {
    'Plain Bagel': 2.50,
    'Everything Bagel': 3.25,
    'Sesame Bagel': 2.75,
    'Blueberry Bagel': 3.00,
    'Cinnamon Raisin Bagel': 3.00,
    'Cream Cheese – Plain': 1.25,
    'Cream Cheese – Veggie': 1.50,
    'Coffee – Small': 2.50,
    'Iced Coffee – Large': 3.25,
    'Hash Brown': 2.00,
    'Side Salad': 3.50
};

var orders = [];
var currentFilter = 'all';
var selectedOrder = null;

// Get item price safely
function getPrice(item) {
    if (item.price !== undefined && item.price !== null && item.price !== '') {
        return parseFloat(item.price);
    }
    if (prices[item.name] !== undefined) {
        return prices[item.name];
    }
    return 0;
}

// Make sure total is a number
function getTotal(order) {
    if (order.total !== undefined && order.total !== null && order.total !== '') {
        return parseFloat(order.total);
    }
    var total = 0;
    for (var i = 0; i < order.cart.length; i++) {
        var item = order.cart[i];
        total = total + getPrice(item) * item.qty;
    }
    return total;
}

// Sample orders for demo
function getSampleOrders() {
    return [
        {
            orderNumber: 'BB-1024',
            firstName: 'John',
            lastName: 'Smith',
            phone: '(555) 123-4567',
            date: '2025-01-15',
            total: 15.43,
            status: 'pending',
            cart: [
                { name: 'Everything Bagel', price: 3.25, qty: 2, options: ['Toasted'] },
                { name: 'Coffee – Small', price: 2.50, qty: 1, options: [] },
                { name: 'Hash Brown', price: 2.00, qty: 1, options: [] }
            ]
        },
        {
            orderNumber: 'BB-1023',
            firstName: 'Sarah',
            lastName: 'Johnson',
            phone: '(555) 987-6543',
            date: '2025-01-15',
            total: 8.67,
            status: 'ready',
            cart: [
                { name: 'Plain Bagel', price: 2.50, qty: 1, options: ['Toasted'] },
                { name: 'Iced Coffee – Large', price: 3.25, qty: 1, options: [] }
            ]
        },
        {
            orderNumber: 'BB-1022',
            firstName: 'Michael',
            lastName: 'Brown',
            phone: '(555) 456-7890',
            date: '2025-01-15',
            total: 12.89,
            status: 'preparing',
            cart: [
                { name: 'Sesame Bagel', price: 2.75, qty: 2, options: [] },
                { name: 'Blueberry Bagel', price: 3.00, qty: 1, options: [] }
            ]
        },
        {
            orderNumber: 'BB-1021',
            firstName: 'Emily',
            lastName: 'Davis',
            phone: '(555) 321-0987',
            date: '2025-01-14',
            total: 6.42,
            status: 'completed',
            cart: [
                { name: 'Plain Bagel', price: 2.50, qty: 1, options: [] }
            ]
        }
    ];
}

// Load orders from storage or use sample data
function loadOrders() {
    var saved = localStorage.getItem('staffOrders');
    if (saved) {
        try {
            orders = JSON.parse(saved);
        } catch (e) {
            orders = getSampleOrders();
        }
    } else {
        orders = getSampleOrders();
    }

    // Check for new customer order from payment.js (fake data from site)
    var newOrderText = localStorage.getItem('orderInfo');
    if (newOrderText) {
        try {
            var orderData = JSON.parse(newOrderText);
            if (orderData.cart && orderData.cart.length > 0) {
                var exists = false;
                for (var i = 0; i < orders.length; i++) {
                    if (orders[i].orderNumber === orderData.orderNumber) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    orders.unshift({
                        orderNumber: orderData.orderNumber,
                        firstName: orderData.firstName,
                        lastName: orderData.lastName,
                        phone: orderData.phone,
                        date: orderData.date,
                        total: parseFloat(orderData.total),
                        status: 'pending',
                        cart: orderData.cart
                    });
                }
            }
        } catch (e2) {
            // ignore bad data
        }
    }

    saveOrders();
    updateStats();
    showOrders();
}

// Save orders to storage
function saveOrders() {
    localStorage.setItem('staffOrders', JSON.stringify(orders));
}

// Update statistics at the top
function updateStats() {
    var total = orders.length;
    var pending = 0;
    var preparing = 0;
    var ready = 0;
    var completed = 0;

    for (var i = 0; i < orders.length; i++) {
        var status = orders[i].status;
        if (status === 'pending') pending++;
        else if (status === 'preparing') preparing++;
        else if (status === 'ready') ready++;
        else if (status === 'completed') completed++;
    }

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-preparing').textContent = preparing;
    document.getElementById('stat-ready').textContent = ready;
    document.getElementById('stat-completed').textContent = completed;
}

// Show all orders in the list (left column)
function showOrders() {
    var container = document.getElementById('orders-list');
    if (!container) return;

    container.innerHTML = '';

    // Sort so completed orders go to the bottom
    var sorted = orders.slice(); // copy array
    sorted.sort(function(a, b) {
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        return 0;
    });

    // Filter by currentFilter
    var filtered = [];
    for (var i = 0; i < sorted.length; i++) {
        if (currentFilter === 'all' || sorted[i].status === currentFilter) {
            filtered.push(sorted[i]);
        }
    }

    // If no orders after filter
    if (filtered.length === 0) {
        container.innerHTML = '<div class="no-orders">No orders found</div>';
        return;
    }

    // Build each order card
    for (var j = 0; j < filtered.length; j++) {
        var order = filtered[j];
        var card = document.createElement('div');
        card.className = 'order-item';
        if (selectedOrder === order.orderNumber) {
            card.className += ' selected';
        }

        // header
        var header = document.createElement('div');
        header.className = 'order-header';
        header.innerHTML =
            '<span class="order-number">Order #' + order.orderNumber + '</span>' +
            '<span class="order-status ' + order.status + '">' + capitalize(order.status) + '</span>';
        card.appendChild(header);

        // details
        var details = document.createElement('div');
        details.className = 'order-details';
        var totalNumber = getTotal(order);
        details.innerHTML =
            '<strong>Customer:</strong> ' + order.firstName + ' ' + order.lastName + '<br>' +
            '<strong>Phone:</strong> ' + order.phone + '<br>' +
            '<strong>Total:</strong> $' + totalNumber.toFixed(2);
        card.appendChild(details);

        // item summary
        var itemsDiv = document.createElement('div');
        itemsDiv.className = 'order-items';
        var itemsHtml = '<strong>Items (' + order.cart.length + '):</strong><ul>';
        for (var k = 0; k < order.cart.length; k++) {
            var it = order.cart[k];
            itemsHtml += '<li>' + it.name + ' × ' + it.qty + '</li>';
        }
        itemsHtml += '</ul>';
        itemsDiv.innerHTML = itemsHtml;
        card.appendChild(itemsDiv);

        // actions
        var actions = document.createElement('div');
        actions.className = 'order-actions';

        // main status button
        if (order.status === 'pending') {
            var btn1 = document.createElement('button');
            btn1.className = 'action-btn';
            btn1.textContent = 'Start Preparing';
            btn1.onclick = (function(orderNumber) {
                return function(e) {
                    e.stopPropagation();
                    changeStatus(orderNumber, 'preparing');
                };
            })(order.orderNumber);
            actions.appendChild(btn1);
        } else if (order.status === 'preparing') {
            var btn2 = document.createElement('button');
            btn2.className = 'action-btn';
            btn2.textContent = 'Mark as Ready';
            btn2.onclick = (function(orderNumber) {
                return function(e) {
                    e.stopPropagation();
                    changeStatus(orderNumber, 'ready');
                };
            })(order.orderNumber);
            actions.appendChild(btn2);
        } else if (order.status === 'ready') {
            var btn3 = document.createElement('button');
            btn3.className = 'action-btn';
            btn3.textContent = 'Mark as Completed';
            btn3.onclick = (function(orderNumber) {
                return function(e) {
                    e.stopPropagation();
                    changeStatus(orderNumber, 'completed');
                };
            })(order.orderNumber);
            actions.appendChild(btn3);
        }

        // cancel button
        if (order.status !== 'completed') {
            var cancelBtn = document.createElement('button');
            cancelBtn.className = 'action-btn secondary';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = (function(orderNumber) {
                return function(e) {
                    e.stopPropagation();
                    cancelOrder(orderNumber);
                };
            })(order.orderNumber);
            actions.appendChild(cancelBtn);
        }

        card.appendChild(actions);

        // clicking the whole card selects it
        card.onclick = (function(orderNumber) {
            return function() {
                selectOrder(orderNumber);
            };
        })(order.orderNumber);

        container.appendChild(card);
    }
}

// When an order is clicked
function selectOrder(orderNumber) {
    selectedOrder = orderNumber;
    showOrders();
    showOrderDetails(orderNumber);
}

// Show details on the right panel
function showOrderDetails(orderNumber) {
    var panel = document.getElementById('order-details-panel');
    if (!panel) return;

    var order = null;
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].orderNumber === orderNumber) {
            order = orders[i];
            break;
        }
    }
    if (!order) {
        panel.innerHTML = '<div class="no-selection"><p>Order not found</p></div>';
        return;
    }

    // Calculate subtotal, tax, total
    var subtotal = 0;
    for (var j = 0; j < order.cart.length; j++) {
        var item = order.cart[j];
        subtotal = subtotal + getPrice(item) * item.qty;
    }
    var tax = subtotal * 0.07;
    var total = subtotal + tax;

    // Build simple HTML, but in small pieces
    var html = '';

    // header
    html += '<div class="detail-section">';
    html += '<h3>Order #' + order.orderNumber + '</h3>';
    html += '<span class="order-status ' + order.status + '">' + capitalize(order.status) + '</span>';
    html += '</div>';

    // customer info
    html += '<div class="detail-section">';
    html += '<h3>Customer Information</h3>';
    html += '<div class="detail-row"><span class="detail-label">Name:</span> ' + order.firstName + ' ' + order.lastName + '</div>';
    html += '<div class="detail-row"><span class="detail-label">Phone:</span> ' + order.phone + '</div>';
    html += '<div class="detail-row"><span class="detail-label">Date:</span> ' + order.date + '</div>';
    html += '</div>';

    // items
    html += '<div class="detail-section">';
    html += '<h3>Order Items (' + order.cart.length + ')</h3>';
    html += '<ul class="items-list">';
    for (var k = 0; k < order.cart.length; k++) {
        var it = order.cart[k];
        var itemTotal = getPrice(it) * it.qty;
        html += '<li>';
        html += '<div class="item-name-qty"><span>' + it.name + ' × ' + it.qty + '</span>';
        html += '<span class="item-price">$' + itemTotal.toFixed(2) + '</span></div>';
        if (it.options && it.options.length > 0) {
            html += '<div class="item-options">• ' + it.options.join(', ') + '</div>';
        }
        html += '</li>';
    }
    html += '</ul></div>';

    // summary
    html += '<div class="detail-section">';
    html += '<h3>Order Summary</h3>';
    html += '<div class="detail-row">Subtotal: <span style="float:right;">$' + subtotal.toFixed(2) + '</span></div>';
    html += '<div class="detail-row">Tax (7%): <span style="float:right;">$' + tax.toFixed(2) + '</span></div>';
    html += '<div class="detail-row" style="font-weight:700;font-size:1.1rem;color:#8a6540;margin-top:10px;padding-top:10px;border-top:2px solid #e0d6c8;">';
    html += 'Total: <span style="float:right;">$' + total.toFixed(2) + '</span>';
    html += '</div></div>';

    panel.innerHTML = html;
}

// Change order status (pending -> preparing -> ready -> completed)
function changeStatus(orderNumber, newStatus) {
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].orderNumber === orderNumber) {
            orders[i].status = newStatus;
            break;
        }
    }
    saveOrders();
    updateStats();
    showOrders();
    if (selectedOrder === orderNumber) {
        showOrderDetails(orderNumber);
    }
}

// Cancel an order
function cancelOrder(orderNumber) {
    if (!confirm('Cancel this order?')) {
        return;
    }

    var newList = [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].orderNumber !== orderNumber) {
            newList.push(orders[i]);
        }
    }
    orders = newList;

    if (selectedOrder === orderNumber) {
        selectedOrder = null;
        var panel = document.getElementById('order-details-panel');
        if (panel) {
            panel.innerHTML = '<div class="no-selection"><p>Select an order to view details</p></div>';
        }
    }

    saveOrders();
    updateStats();
    showOrders();
}

// Capitalize first letter of status
function capitalize(str) {
    if (!str || str.length === 0) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Setup filter buttons
var filterButtons = document.querySelectorAll('.filter-btn');
for (var i = 0; i < filterButtons.length; i++) {
    filterButtons[i].onclick = function() {
        for (var j = 0; j < filterButtons.length; j++) {
            filterButtons[j].classList.remove('active');
        }
        this.classList.add('active');
        currentFilter = this.getAttribute('data-filter');
        showOrders();
    };
}

// Start when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadOrders);
} else {
    loadOrders();
}
