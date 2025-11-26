document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart page loaded');
    
    displayCartItems();
    setupCartInteractions();
    updateCartSummary();
    setupPaymentModal();
    
    window.TelebanKicks.setupSearch();
});


function setupPaymentModal() {
    const paymentModal = document.getElementById('payment-modal');
    const closeModalBtn = document.getElementById('close-payment-modal');
    const cancelPaymentBtn = document.getElementById('cancel-payment');
    const confirmPaymentBtn = document.getElementById('confirm-payment');
    const checkoutBtn = document.getElementById('checkout-btn');

 
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (!this.disabled) {
                openPaymentModal();
            }
        });
    }


    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closePaymentModal);
    }

    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', closePaymentModal);
    }

   
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', confirmOrder);
    }

   
    if (paymentModal) {
        paymentModal.addEventListener('click', function(e) {
            if (e.target === paymentModal) {
                closePaymentModal();
            }
        });
    }
}


function openPaymentModal() {
    const paymentModal = document.getElementById('payment-modal');
    const modalSummaryItems = document.getElementById('modal-summary-items');
    const modalTotal = document.getElementById('modal-total');
    
    if (!paymentModal || !modalSummaryItems || !modalTotal) return;

  
    const cartItems = window.TelebanKicks.getCartItems();
    const total = window.TelebanKicks.getCartTotal() + 150 + (window.TelebanKicks.getCartTotal() * 0.12);

    
    let summaryHTML = '';
    cartItems.forEach(item => {
        const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
        summaryHTML += `
            <div class="summary-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">Size: ${item.size} | Qty: ${item.quantity}</div>
                </div>
                <div class="item-total">${window.TelebanKicks.formatPrice(itemTotal)}</div>
            </div>
        `;
    });
    
    modalSummaryItems.innerHTML = summaryHTML;
    modalTotal.textContent = window.TelebanKicks.formatPrice(total);
    

    paymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}


function closePaymentModal() {
    const paymentModal = document.getElementById('payment-modal');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (paymentModal) {
        paymentModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    
    if (checkoutBtn) {
        checkoutBtn.innerHTML = 'Proceed to Checkout';
        checkoutBtn.disabled = window.TelebanKicks.getCartItems().length === 0;
    }
}


function confirmOrder() {
    const confirmBtn = document.getElementById('confirm-payment');
    const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
    
    if (!selectedPaymentMethod) {
        window.TelebanKicks.showNotification('Please select a payment method!', 'warning');
        return;
    }

   
    if (confirmBtn) {
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        confirmBtn.disabled = true;
    }


    const cartItems = window.TelebanKicks.getCartItems();
    const total = window.TelebanKicks.getCartTotal() + 150 + (window.TelebanKicks.getCartTotal() * 0.12);
    const paymentMethod = selectedPaymentMethod.value;

   
    setTimeout(() => {
     
        showOrderSuccess(cartItems, total, paymentMethod);
        
       
        window.TelebanKicks.clearCart();
        displayCartItems();
        updateCartSummary();
        
        
        closePaymentModal();
       
        if (confirmBtn) {
            confirmBtn.innerHTML = 'Confirm Order';
            confirmBtn.disabled = false;
        }
    }, 3000);
}


function showOrderSuccess(cartItems, total, paymentMethod) {
    
    const successModal = document.createElement('div');
    successModal.className = 'success-modal active';
    successModal.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Order Confirmed!</h3>
            <p>Thank you for your purchase! Your order has been successfully placed.</p>
            <div class="order-details" style="text-align: left; background: #f8fafc; padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem;">
                <p><strong>Order Total:</strong> ${window.TelebanKicks.formatPrice(total)}</p>
                <p><strong>Payment Method:</strong> ${getPaymentMethodName(paymentMethod)}</p>
                <p><strong>Items:</strong> ${cartItems.length} product(s)</p>
            </div>
            <p><small>You will receive a confirmation email shortly. Order will be delivered within 3-5 business days.</small></p>
            <button class="btn btn-primary w-100" onclick="closeSuccessModal(this)">
                Continue Shopping
            </button>
        </div>
    `;
    
    document.body.appendChild(successModal);
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal(button) {
    const successModal = button.closest('.success-modal');
    if (successModal) {
        successModal.remove();
        document.body.style.overflow = 'auto';
    }
}


function getPaymentMethodName(method) {
    const methods = {
        'gcash': 'GCash',
        'card': 'Credit/Debit Card',
        'cod': 'Cash on Delivery'
    };
    return methods[method] || method;
}


function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartItems = window.TelebanKicks.getCartItems();

    console.log('Displaying cart items:', cartItems);

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '';
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        return;
    }

    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    
    let cartHTML = '';
    
    cartItems.forEach(item => {
        const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
        cartHTML += `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image || 'img/homepage/default-product.jpg'}" alt="${item.name}" onerror="this.src='img/homepage/default-product.jpg'">
                </div>
                <div class="cart-item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-size">Size: ${item.size}</div>
                    <div class="item-color">Color: ${item.color}</div>
                    <div class="item-price">${window.TelebanKicks.formatPrice(itemTotal)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-item-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" data-item-id="${item.id}">
                        <button class="quantity-btn plus" data-item-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item" data-item-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
}


function setupCartInteractions() {
 
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quantity-btn.minus')) {
            const button = e.target.closest('.quantity-btn.minus');
            const itemId = button.getAttribute('data-item-id');
            const input = document.querySelector(`.quantity-input[data-item-id="${itemId}"]`);
            if (input) {
                const currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    updateItemQuantity(itemId, currentValue - 1);
                }
            }
        }
    });

  
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quantity-btn.plus')) {
            const button = e.target.closest('.quantity-btn.plus');
            const itemId = button.getAttribute('data-item-id');
            const input = document.querySelector(`.quantity-input[data-item-id="${itemId}"]`);
            if (input) {
                const currentValue = parseInt(input.value);
                if (currentValue < 10) {
                    input.value = currentValue + 1;
                    updateItemQuantity(itemId, currentValue + 1);
                }
            }
        }
    });

    
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-item')) {
            const button = e.target.closest('.remove-item');
            const itemId = button.getAttribute('data-item-id');
            removeItem(itemId);
        }
    });

    
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const input = e.target;
            const itemId = input.getAttribute('data-item-id');
            const newQuantity = parseInt(input.value);
            
            if (newQuantity >= 1 && newQuantity <= 10) {
                updateItemQuantity(itemId, newQuantity);
            } else {
                
                const cartItems = window.TelebanKicks.getCartItems();
                const item = cartItems.find(item => item.id === itemId);
                if (item) {
                    input.value = item.quantity;
                }
            }
        }
    });
}

function updateItemQuantity(itemId, newQuantity) {
    window.TelebanKicks.updateCartItemQuantity(itemId, newQuantity);
    displayCartItems();
    updateCartSummary();
}

function removeItem(itemId) {
    
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        window.TelebanKicks.removeFromCart(itemId);
        displayCartItems();
        updateCartSummary();
        window.TelebanKicks.showNotification('Item removed from cart', 'success');
    }
}


function updateCartSummary() {
    const cartItems = window.TelebanKicks.getCartItems();
    const subtotal = window.TelebanKicks.getCartTotal();
    const shipping = subtotal > 0 ? 150 : 0;
    const tax = subtotal * 0.12;
    const total = subtotal + shipping + tax;

    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (subtotalElement) subtotalElement.textContent = window.TelebanKicks.formatPrice(subtotal);
    if (shippingElement) shippingElement.textContent = window.TelebanKicks.formatPrice(shipping);
    if (taxElement) taxElement.textContent = window.TelebanKicks.formatPrice(tax);
    if (totalElement) totalElement.textContent = window.TelebanKicks.formatPrice(total);

    if (checkoutBtn) {
        checkoutBtn.disabled = cartItems.length === 0;
    }
}


function proceedToCheckout() {
 
    openPaymentModal();
}

console.log('Cart page functionality loaded successfully!');