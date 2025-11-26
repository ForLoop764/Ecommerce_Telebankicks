// Function.js - Core shared functionality across all pages
class TelebanKicks {
    constructor() {
        this.cartItems = JSON.parse(localStorage.getItem('cartProducts')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupNavigation();
        this.injectNotificationStyles();
        console.log('TelebanKicks initialized with', this.cartItems.length, 'items in cart');
    }

    // ==================== CART MANAGEMENT ====================
    addToCart(product) {
        // Generate unique ID for the product
        product.id = 'product-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        product.addedAt = new Date().toISOString();
        
        // Check if product already exists in cart
        const existingItemIndex = this.cartItems.findIndex(item => 
            item.name === product.name && item.size === product.size && item.color === product.color
        );
        
        if (existingItemIndex > -1) {
            // Update quantity if product exists
            this.cartItems[existingItemIndex].quantity += product.quantity;
        } else {
            // Add new product
            this.cartItems.push(product);
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showEnhancedCartNotification(product);
        
        console.log('Added to cart:', product);
        console.log('Total cart items:', this.getTotalCartCount());
    }

    removeFromCart(itemId) {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Item removed from cart', 'info');
    }

    updateCartItemQuantity(itemId, newQuantity) {
        const item = this.cartItems.find(item => item.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartCount();
            }
        }
    }

    getCartItems() {
        return this.cartItems;
    }

    getCartTotal() {
        return this.cartItems.reduce((total, item) => total + (parseFloat(item.price) * parseInt(item.quantity)), 0);
    }

    getTotalCartCount() {
        return this.cartItems.reduce((count, item) => count + parseInt(item.quantity), 0);
    }

    clearCart() {
        this.cartItems = [];
        this.saveCart();
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('cartProducts', JSON.stringify(this.cartItems));
    }

    updateCartCount() {
        const cartCount = this.getTotalCartCount();
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = cartCount;
            if (cartCount > 0) {
                element.style.display = 'flex';
            } else {
                element.style.display = 'none';
            }
        });
    }

    // ==================== NAVIGATION ====================
    setupNavigation() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Cart icon active state
        const cartIcons = document.querySelectorAll('.cart-icon');
        if (currentPage === 'Cart.html') {
            cartIcons.forEach(icon => icon.classList.add('active'));
        }
    }

    // ==================== NOTIFICATION SYSTEM ====================
    injectNotificationStyles() {
        if (!document.querySelector('#telebankicks-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'telebankicks-notification-styles';
            style.textContent = `
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 20px;
                    position: relative;
                }
                
                .notification-content i:first-child {
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }
                
                .notification-content span {
                    flex: 1;
                    font-weight: 500;
                    font-size: 14px;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    opacity: 0.7;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }
                
                .notification-close:hover {
                    opacity: 1;
                    background: rgba(255,255,255,0.1);
                }

                .notification-details {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    flex: 1;
                }
                
                .notification-details strong {
                    font-size: 14px;
                    font-weight: 600;
                }
                
                .notification-details span {
                    font-size: 13px;
                    opacity: 0.9;
                }
                
                .notification-details small {
                    font-size: 12px;
                    opacity: 0.8;
                    font-weight: 500;
                }
            `;
            document.head.appendChild(style);
        }
    }

    showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.telebankicks-notification');
        existingNotifications.forEach(notification => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });

        const notification = document.createElement('div');
        notification.className = `telebankicks-notification notification-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icons[type]}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 0;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            max-width: 350px;
            overflow: hidden;
            border-left: 4px solid ${this.getNotificationBorderColor(type)};
        `;

        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 4 seconds
        const autoRemove = setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);

        // Pause auto-remove on hover
        notification.addEventListener('mouseenter', () => {
            clearTimeout(autoRemove);
        });

        notification.addEventListener('mouseleave', () => {
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 2000);
        });
    }

    showEnhancedCartNotification(product) {
        const notification = document.createElement('div');
        notification.className = 'telebankicks-notification notification-success';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <div class="notification-details">
                    <strong>Added to Cart!</strong>
                    <span>${product.name}</span>
                    <small>${this.formatPrice(product.price)}</small>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 0;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            max-width: 380px;
            overflow: hidden;
            border-left: 4px solid #059669;
        `;

        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 4 seconds
        const autoRemove = setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);

        notification.addEventListener('mouseenter', () => {
            clearTimeout(autoRemove);
        });

        notification.addEventListener('mouseleave', () => {
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 2000);
        });
    }

    getNotificationBorderColor(type) {
        const colors = {
            success: '#059669',
            error: '#dc2626',
            warning: '#d97706',
            info: '#2563eb'
        };
        return colors[type] || colors.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    // ==================== UTILITY FUNCTIONS ====================
    formatPrice(price) {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(price);
    }

    getProductImage(productName) {
        const imageMap = {
            'Nike Air Max TL 2.5': 'img/homepage/AIR+MAX+TL+2.5.avif',
            'Samba OG Shoes': 'img/homepage/Samba_OG_Shoes_White_B75806_01_00_standard.avif',
            'Scuderia Ferrari HP Monza Speedcat': 'img/homepage/Scuderia-Ferrari-HP-Monza-Speedcat-Sneakers-Unisex.avif',
            'New Balance 9060': 'img/homepage/u9060ccc_nb_03_i.webp',
            'Nike Vaporfly 4 (Black)': 'img/homepage/Vaporfly_Black.avif',
            'Nike Vaporfly 4 (White)': 'img/homepage/Vaporfly_White.avif',
            'Nike Vaporfly 4 (Red)': 'img/homepage/Vaporfly_Red.avif'
        };
        
        return imageMap[productName] || 'img/homepage/default-product.jpg';
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ==================== SEARCH FUNCTIONALITY ====================
    setupSearch() {
        const searchInputs = document.querySelectorAll('.search-input');
        
        searchInputs.forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const searchTerm = this.value.trim();
                    if (searchTerm) {
                        window.location.href = `Shop.html?search=${encodeURIComponent(searchTerm)}`;
                    }
                }
            });
        });
    }
}

// Initialize immediately
window.TelebanKicks = new TelebanKicks();