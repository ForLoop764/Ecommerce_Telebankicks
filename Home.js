document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page loaded');
    
 
    initSlider();
    initFeaturedProducts();
    initDisplay2();
    initCategoryButtons();
    initNewsletter();
    initScrollEffects();
    initProductHoverEffects();
    initBrandHoverEffects();
    initTouchSupport();

  
    window.TelebanKicks.setupSearch();
});


function initSlider() {
    const sliderWrapper = document.querySelector('.SliderWrapper');
    const sliderItems = document.querySelectorAll('.SliderItem');
    const dots = document.querySelectorAll('.dot');
    
    if (!sliderWrapper) return;

    let currentSlide = 0;
    const slideCount = sliderItems.length;
    let slideInterval;
    let isTransitioning = false;
    
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function goToSlide(slideIndex) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
      
        if (slideIndex >= slideCount) {
           
            currentSlide = 0;
            sliderWrapper.style.transition = 'none'; 
            sliderWrapper.style.transform = `translateX(-${currentSlide * 100}vw)`;
            
            
            sliderWrapper.offsetHeight;
            
            
            sliderWrapper.style.transition = 'transform 0.8s ease-in-out';
            updateDots();
            isTransitioning = false;
            return;
        } else if (slideIndex < 0) {
            slideIndex = slideCount - 1;
        }
        
        currentSlide = slideIndex;
        sliderWrapper.style.transform = `translateX(-${currentSlide * 100}vw)`;
        updateDots();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function startAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        slideInterval = setInterval(nextSlide, 4000);
    }
    
   
    sliderWrapper.style.transition = 'transform 0.8s ease-in-out';
    goToSlide(0);
    startAutoSlide();
    

    const slider = document.querySelector('.Slider');
    slider.addEventListener('mouseenter', function() {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', function() {
        startAutoSlide();
    });
    
  
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            goToSlide(slideIndex);
        });
    });
 
    const sliderButtons = document.querySelectorAll('.SliderButton');
    sliderButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = 'Shop.html';
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            goToSlide(currentSlide + 1);
        }
    });
}


function initFeaturedProducts() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    console.log('Found', addToCartButtons.length, 'add to cart buttons');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const productPrice = this.getAttribute('data-price');
            const productElement = this.closest('.product');
            const productImage = productElement.querySelector('img').src;
            
            
            const product = {
                name: productName,
                price: parseFloat(productPrice),
                quantity: 1,
                size: 'US 9',
                color: 'Default',
                image: productImage,
                addedAt: new Date().toISOString()
            };
            
          
            window.TelebanKicks.addToCart(product);
            
          
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
                this.style.transform = 'scale(1)';
            }, 2000);
        });
    });
}


function initDisplay2() {
    const colorOptions = document.querySelectorAll('.display2 .color-option');
    const productImages = document.querySelectorAll('.display2 .product-img');
    const buyButtons = document.querySelectorAll('.display2 .buy');

    if (colorOptions.length === 0) return;

    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const colorIndex = this.getAttribute('data-color');
            
            
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
           
            this.classList.add('active');
            
           
            productImages.forEach(img => img.classList.remove('active'));
            productImages.forEach(img => {
                if (img.getAttribute('data-index') === colorIndex) {
                    img.classList.add('active');
                }
            });
        });
    });

   
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const colorIndex = this.getAttribute('data-color');
            const colorNames = ['Black', 'White', 'Red'];
            const colorName = colorNames[colorIndex] || 'Default';
            
           
            const product = {
                name: `Nike Vaporfly 4 (${colorName})`,
                price: 13295.00,
                quantity: 1,
                size: 'US 9',
                color: colorName,
                image: `img/homepage/Vaporfly_${colorName}.avif`,
                addedAt: new Date().toISOString()
            };
            
          
            window.TelebanKicks.addToCart(product);
            
         
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
                this.style.transform = 'scale(1)';
            }, 2000);
        });
    });

    
    if (productImages.length > 0) {
        productImages[0].classList.add('active');
    }
}


function initCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.display .details button');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.parentElement.querySelector('h2').textContent;
            window.location.href = `Shop.html?category=${encodeURIComponent(category)}`;
        });
    });
}


function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email && window.TelebanKicks.validateEmail(email)) {
                const submitButton = this.querySelector('button');
                
               
                submitButton.textContent = 'SUBSCRIBED!';
                submitButton.style.background = '#10b981';
                submitButton.disabled = true;
                
                
                let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
                subscribers.push({
                    email: email,
                    date: new Date().toISOString()
                });
                localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
                
                setTimeout(() => {
                    submitButton.textContent = 'SUBSCRIBE';
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                    this.reset();
                    window.TelebanKicks.showNotification('Successfully subscribed to newsletter!');
                }, 2000);
            } else {
                window.TelebanKicks.showNotification('Please enter a valid email address!');
            }
        });
    }
}


function initScrollEffects() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}


function initProductHoverEffects() {
    const products = document.querySelectorAll('.product');
    
    products.forEach(product => {
        product.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'all 0.3s ease';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
        
        product.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}


function initBrandHoverEffects() {
    const brands = document.querySelectorAll('.brand');
    
    brands.forEach(brand => {
        brand.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        brand.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}


function initTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const slider = document.querySelector('.Slider');
    if (slider) {
        slider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const sliderWrapper = document.querySelector('.SliderWrapper');
        const sliderItems = document.querySelectorAll('.SliderItem');
        let currentSlide = 0;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            
            currentSlide = (currentSlide + 1) % sliderItems.length;
            sliderWrapper.style.transform = `translateX(-${currentSlide * 100}vw)`;
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            
            currentSlide = (currentSlide - 1 + sliderItems.length) % sliderItems.length;
            sliderWrapper.style.transform = `translateX(-${currentSlide * 100}vw)`;
        }
    }
}


window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

console.log('Home page functionality loaded successfully!');