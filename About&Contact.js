// About&Contact.js - About Us and Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('About & Contact page loaded');
    
    // Initialize functionality
    initContactForm();
    initTeamMembers();
    initMap();
    initFAQs();
    
    // Setup search functionality
    window.TelebanKicks.setupSearch();
});

// ==================== CONTACT FORM FUNCTIONALITY ====================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('#name').value,
                email: this.querySelector('#email').value,
                subject: this.querySelector('#subject').value,
                message: this.querySelector('#message').value,
                timestamp: new Date().toISOString()
            };
            
            if (validateContactForm(formData)) {
                submitContactForm(formData);
            }
        });
    }
}

function validateContactForm(formData) {
    if (!formData.name.trim()) {
        window.TelebanKicks.showNotification('Please enter your name', 'error');
        return false;
    }
    
    if (!formData.email.trim() || !window.TelebanKicks.validateEmail(formData.email)) {
        window.TelebanKicks.showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!formData.subject.trim()) {
        window.TelebanKicks.showNotification('Please enter a subject', 'error');
        return false;
    }
    
    if (!formData.message.trim()) {
        window.TelebanKicks.showNotification('Please enter your message', 'error');
        return false;
    }
    
    return true;
}

function submitContactForm(formData) {
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Save to localStorage (in real app, this would be a server API call)
        let contactSubmissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
        contactSubmissions.push(formData);
        localStorage.setItem('contactSubmissions', JSON.stringify(contactSubmissions));
        
        // Show success message
        window.TelebanKicks.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        document.getElementById('contact-form').reset();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// ==================== TEAM MEMBERS FUNCTIONALITY ====================
function initTeamMembers() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ==================== MAP FUNCTIONALITY ====================
function initMap() {
    // This is a placeholder for map functionality
    // In a real implementation, you would integrate with Google Maps or similar
    console.log('Map functionality initialized');
    
    const mapElement = document.getElementById('store-map');
    if (mapElement) {
        // Simulate map loading
        mapElement.innerHTML = `
            <div style="background: #f8f9fa; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                <div class="text-center">
                    <i class="fas fa-map-marker-alt fa-3x text-primary mb-3"></i>
                    <p class="mb-2"><strong>TelebanKicks Store</strong></p>
                    <p class="text-muted">123 Sneaker Street, Manila, Philippines</p>
                </div>
            </div>
        `;
    }
}

// ==================== FAQ FUNCTIONALITY ====================
function initFAQs() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            
            // Toggle active class
            this.classList.toggle('active');
            
            // Toggle answer visibility
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    });
}

// ==================== SOCIAL MEDIA LINKS ====================
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').className.split(' ')[1];
            console.log(`Redirecting to ${platform}...`);
            // In real implementation, this would open the actual social media page
            window.TelebanKicks.showNotification(`Redirecting to ${platform}...`, 'info');
        });
    });
}

console.log('About & Contact page functionality loaded successfully!');