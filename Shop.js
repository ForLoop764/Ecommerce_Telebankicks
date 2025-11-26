document.addEventListener('DOMContentLoaded', function() {
    console.log('Shop page loaded');
    
    
    initShopFilters();
    initAddToCartButtons();
    initQuickView();
    initWishlist();
    initLoadMore();
    initNewsletter();
    
   
    window.TelebanKicks.setupSearch();
    
    console.log('Shop page functionality initialized successfully!');
});


function initShopFilters() {
    const brandFilters = document.querySelectorAll('.brand-filter');
    const productItems = document.querySelectorAll('.product-item');
    
    console.log('Found brand filters:', brandFilters.length);
    console.log('Found product items:', productItems.length);

   
    brandFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const brand = this.getAttribute('data-brand');
            
           
            brandFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
           
            productItems.forEach(item => {
                if (brand === 'all') {
                    item.style.display = 'block';
                } else {
                    if (item.getAttribute('data-brand') === brand) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
            
            console.log(`Filtered by brand: ${brand}`);
        });
    });
}


function initAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    console.log('Found add to cart buttons:', addToCartButtons.length);

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productCard = this.closest('.product-card');
            const productImage = productCard.querySelector('.product-image img').src;
            const sizeSelector = productCard.querySelector('.size-dropdown');
            const selectedSize = sizeSelector ? sizeSelector.value : 'US 9';
            
            console.log('Adding to cart:', productName, productPrice);

          
            const product = {
                name: productName,
                price: productPrice,
                quantity: 1,
                size: selectedSize,
                color: 'Default',
                image: productImage,
                addedAt: new Date().toISOString()
            };
            
            
            window.TelebanKicks.addToCart(product);
            
          
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            this.style.transform = 'scale(0.95)';
            
            
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                cartCount.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartCount.style.transform = 'scale(1)';
                }, 300);
            }
            
           
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
                this.style.transform = 'scale(1)';
            }, 2000);
            
           
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    });

   
    const sizeSelectors = document.querySelectorAll('.size-dropdown');
    sizeSelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            console.log('Size changed to:', this.value);
        });
    });
}


function initQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view');
    
    console.log('Found quick view buttons:', quickViewButtons.length);

    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productSlug = this.getAttribute('data-product');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productImage = productCard.querySelector('.product-image img').src;
            const productBrand = productCard.querySelector('.product-brand').textContent;
            const productDesc = productCard.querySelector('.product-desc').textContent;
            
            console.log('Opening quick view for:', productName);
            
            
            showQuickViewModal({
                name: productName,
                price: productPrice,
                image: productImage,
                brand: productBrand,
                description: productDesc,
                slug: productSlug
            });
        });
    });
}

function showQuickViewModal(product) {
 
    const existingModal = document.querySelector('.quick-view-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    
    const modalHTML = `
        <div class="quick-view-modal">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="product-image-modal">
                                <img src="${product.image}" alt="${product.name}">
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="product-details-modal">
                                <span class="product-brand">${product.brand}</span>
                                <h2 class="product-name">${product.name}</h2>
                                <p class="product-description">${product.description}</p>
                                
                                <div class="product-price-modal">
                                    ${product.price}
                                </div>
                                
                                <div class="size-selection-modal">
                                    <label>Select Size:</label>
                                    <div class="size-options">
                                        <button class="size-option active">US 8</button>
                                        <button class="size-option">US 9</button>
                                        <button class="size-option">US 10</button>
                                        <button class="size-option">US 11</button>
                                        <button class="size-option">US 12</button>
                                    </div>
                                </div>
                                
                                <div class="product-actions-modal">
                                    <button class="btn-add-to-cart-modal" 
                                            data-product="${product.name}" 
                                            data-price="${product.price.replace('₱', '').replace(',', '')}">
                                        <i class="fas fa-shopping-cart"></i>
                                        Add to Cart
                                    </button>
                                    <button class="btn-wishlist-modal">
                                        <i class="far fa-heart"></i>
                                        Add to Wishlist
                                    </button>
                                </div>
                                
                                <div class="product-features">
                                    <div class="feature-item">
                                        <i class="fas fa-shipping-fast"></i>
                                        <span>Free Shipping</span>
                                    </div>
                                    <div class="feature-item">
                                        <i class="fas fa-undo"></i>
                                        <span>30-Day Returns</span>
                                    </div>
                                    <div class="feature-item">
                                        <i class="fas fa-shield-alt"></i>
                                        <span>1-Year Warranty</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    
    addQuickViewStyles();
    

    initQuickViewModal();
}

function addQuickViewStyles() {
    if (!document.querySelector('#quick-view-styles')) {
        const styles = `
            <style id="quick-view-styles">
                .quick-view-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(5px);
                }
                
                .modal-content {
                    position: relative;
                    background: white;
                    border-radius: 12px;
                    max-width: 900px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    z-index: 10001;
                    animation: modalSlideIn 0.3s ease;
                }
                
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #666;
                    cursor: pointer;
                    z-index: 10002;
                    padding: 5px;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                .modal-close:hover {
                    background: #f8f9fa;
                    color: #333;
                }
                
                .modal-body {
                    padding: 30px;
                }
                
                .product-image-modal img {
                    width: 100%;
                    border-radius: 8px;
                }
                
                .product-details-modal {
                    padding-left: 30px;
                }
                
                .product-brand {
                    color: #666;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .product-name {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin: 10px 0;
                    color: #333;
                }
                
                .product-description {
                    color: #666;
                    margin-bottom: 20px;
                    line-height: 1.6;
                }
                
                .product-price-modal {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #e60023;
                    margin-bottom: 25px;
                }
                
                .size-selection-modal {
                    margin-bottom: 25px;
                }
                
                .size-selection-modal label {
                    display: block;
                    margin-bottom: 10px;
                    font-weight: 600;
                    color: #333;
                }
                
                .size-options {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                
                .size-option {
                    padding: 8px 16px;
                    border: 2px solid #e0e0e0;
                    background: white;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }
                
                .size-option.active,
                .size-option:hover {
                    border-color: #2563eb;
                    background: #2563eb;
                    color: white;
                }
                
                .product-actions-modal {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 25px;
                }
                
                .btn-add-to-cart-modal {
                    flex: 2;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .btn-add-to-cart-modal:hover {
                    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
                    transform: translateY(-2px);
                }
                
                .btn-wishlist-modal {
                    flex: 1;
                    padding: 12px 24px;
                    background: #f8f9fa;
                    color: #333;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .btn-wishlist-modal:hover {
                    background: #e9ecef;
                    border-color: #2563eb;
                }
                
                .product-features {
                    display: flex;
                    gap: 20px;
                    flex-wrap: wrap;
                }
                
                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #666;
                    font-size: 0.9rem;
                }
                
                .feature-item i {
                    color: #2563eb;
                }
                
                @media (max-width: 768px) {
                    .modal-content {
                        width: 95%;
                        max-height: 95vh;
                    }
                    
                    .modal-body {
                        padding: 20px;
                    }
                    
                    .product-details-modal {
                        padding-left: 0;
                        padding-top: 20px;
                    }
                    
                    .product-actions-modal {
                        flex-direction: column;
                    }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

function initQuickViewModal() {
    const modal = document.querySelector('.quick-view-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const addToCartBtn = modal.querySelector('.btn-add-to-cart-modal');
    const sizeOptions = modal.querySelectorAll('.size-option');
    
    
    function closeModal() {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
  
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
   
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = modal.querySelector('.product-image-modal img').src;
            const selectedSize = modal.querySelector('.size-option.active').textContent;
            
            const product = {
                name: productName,
                price: productPrice,
                quantity: 1,
                size: selectedSize,
                color: 'Default',
                image: productImage,
                addedAt: new Date().toISOString()
            };
            
            window.TelebanKicks.addToCart(product);
            closeModal();
        });
    }
    
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}


function initWishlist() {
    const wishlistButtons = document.querySelectorAll('.wishlist');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productImage = productCard.querySelector('.product-image img').src;
            
            
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                this.classList.remove('active');
                this.innerHTML = '<i class="far fa-heart"></i>';
                removeFromWishlist(productName);
                window.TelebanKicks.showNotification('Removed from wishlist', 'info');
            } else {
                this.classList.add('active');
                this.innerHTML = '<i class="fas fa-heart"></i>';
                addToWishlist({
                    name: productName,
                    price: productPrice,
                    image: productImage
                });
                window.TelebanKicks.showNotification('Added to wishlist!', 'success');
            }
        });
    });
}

function addToWishlist(product) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
  
    const existingIndex = wishlist.findIndex(item => item.name === product.name);
    
    if (existingIndex === -1) {
        wishlist.push({
            ...product,
            addedAt: new Date().toISOString()
        });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

function removeFromWishlist(productName) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.name !== productName);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}


function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
           
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            
            setTimeout(() => {
                
                window.TelebanKicks.showNotification('More products loaded!', 'success');
                
              
                this.innerHTML = originalText;
                this.disabled = false;
            }, 1500);
        });
    }
}


function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email && window.TelebanKicks.validateEmail(email)) {
                const submitButton = this.querySelector('button');
                
               
                submitButton.textContent = 'SUBSCRIBING...';
                submitButton.disabled = true;
                
                
                setTimeout(() => {
                    
                    let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
                    subscribers.push({
                        email: email,
                        date: new Date().toISOString()
                    });
                    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
                    
                 
                    submitButton.textContent = 'SUBSCRIBED!';
                    submitButton.style.background = '#10b981';
                    
                    setTimeout(() => {
                        submitButton.textContent = 'SUBSCRIBE';
                        submitButton.style.background = '';
                        submitButton.disabled = false;
                        this.reset();
                        window.TelebanKicks.showNotification('Successfully subscribed to newsletter!', 'success');
                    }, 2000);
                }, 1000);
            } else {
                window.TelebanKicks.showNotification('Please enter a valid email address!', 'error');
            }
        });
    }
}


function initProductHoverEffects() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}


initProductHoverEffects();