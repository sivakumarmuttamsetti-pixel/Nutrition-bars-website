// NutriBar Pro - Professional Cart System
'use strict';

// Global variables
let cart = [];
const STORAGE_KEY = 'nutribar-cart';
const CHECKOUT_KEY = 'nutribar-checkout';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 NutriBar Pro cart system initializing...');
    
    // Load cart from storage
    loadCartFromStorage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update cart display
    updateCartDisplay();
    
    // Initialize page-specific features
    initializePageFeatures();
    
    // Add scroll effect to navbar
    setupScrollEffects();
    
    console.log('✅ Cart system ready!');
});

// Load cart from localStorage
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem(STORAGE_KEY);
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('📦 Cart loaded:', cart);
        }
    } catch (error) {
        console.error('❌ Error loading cart:', error);
        cart = [];
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        console.log('💾 Cart saved successfully');
    } catch (error) {
        console.error('❌ Error saving cart:', error);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Handle add to cart
function handleAddToCart(e) {
    e.preventDefault();
    
    const button = e.target.closest('.add-to-cart');
    const productName = button.getAttribute('data-name');
    const productPrice = parseFloat(button.getAttribute('data-price'));
    
    if (!productName || !productPrice) {
        showNotification('❌ Product information missing', 'error');
        return;
    }
    
    // Add loading state
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Adding...';
    
    // Simulate network delay for better UX
    setTimeout(() => {
        addToCart(productName, productPrice);
        
        // Reset button
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-cart-plus me-2"></i>Add to Cart';
        
        // Add success animation
        button.classList.add('btn-success');
        setTimeout(() => {
            button.classList.remove('btn-success');
        }, 1000);
        
    }, 500);
}

// Add item to cart
function addToCart(name, price) {
    console.log('🛒 Adding to cart:', name, '₹' + price);
    
    // Check if item already exists
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('📈 Updated quantity:', existingItem.quantity);
    } else {
        cart.push({
            id: Date.now(),
            name: name,
            price: price,
            quantity: 1
        });
        console.log('🆕 New item added');
    }
    
    // Save and update display
    saveCartToStorage();
    updateCartDisplay();
    
    // Show success notification
    showNotification(`✅ ${name} added to cart!`, 'success');
    
    // Animate cart icon
    animateCartIcon();
}

// Update cart display
function updateCartDisplay() {
    updateCartCounter();
    updateCartPage();
}

// Update cart counter in navigation
function updateCartCounter() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCounters = document.querySelectorAll('#cart-count');
    
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
        
        // Add animation when count changes
        if (totalItems > 0) {
            counter.classList.add('animate__animated', 'animate__bounce');
            setTimeout(() => {
                counter.classList.remove('animate__animated', 'animate__bounce');
            }, 1000);
        }
    });
}

// Update cart page content
function updateCartPage() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-5">
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                        <h4>Your cart is empty</h4>
                        <p class="text-muted">Start shopping to add items to your cart</p>
                        <a href="products.html" class="btn btn-primary btn-lg">
                            <i class="fas fa-shopping-bag me-2"></i>Start Shopping
                        </a>
                    </div>
                </td>
            </tr>
        `;
        updateCartSummary(0);
        return;
    }
    
    // Generate cart items HTML
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        html += `
            <tr class="cart-item-row">
                <td>
                    <div class="d-flex align-items-center">
                        <div class="product-image-small me-3">
                            <img src="https://via.placeholder.com/60x60/28a745/ffffff?text=${item.name.charAt(0)}" 
                                 alt="${item.name}" class="rounded">
                        </div>
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">Natural • Premium Quality</small>
                        </div>
                    </div>
                </td>
                <td class="text-center">
                    <span class="fw-bold text-success">₹${item.price}</span>
                </td>
                <td class="text-center">
                    <div class="quantity-controls">
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td class="text-center">
                    <span class="fw-bold">₹${subtotal}</span>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    updateCartSummary(total);
}

// Update cart summary
function updateCartSummary(total) {
    const elements = {
        subtotal: document.getElementById('subtotal'),
        cartTotal: document.getElementById('cart-total'),
        itemsCount: document.getElementById('items-count')
    };
    
    Object.entries(elements).forEach(([key, element]) => {
        if (element) {
            if (key === 'itemsCount') {
                element.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            } else {
                element.textContent = `₹${total}`;
            }
        }
    });
}

// Update quantity
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
            return;
        }
        
        saveCartToStorage();
        updateCartDisplay();
        
        showNotification(`📊 Quantity updated`, 'info');
    }
}

// Remove item from cart
function removeFromCart(index) {
    if (cart[index]) {
        const itemName = cart[index].name;
        cart.splice(index, 1);
        
        saveCartToStorage();
        updateCartDisplay();
        
        showNotification(`🗑️ ${itemName} removed from cart`, 'warning');
    }
}

// Clear entire cart
function clearCart() {
    if (cart.length === 0) {
        showNotification('Cart is already empty', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.removeItem(STORAGE_KEY);
        updateCartDisplay();
        showNotification('🧹 Cart cleared', 'info');
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const checkoutData = {
        items: cart,
        total: total,
        timestamp: new Date().toISOString(),
        orderId: generateOrderId()
    };
    
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(checkoutData));
    
    // Show loading state
    showNotification('🔄 Redirecting to checkout...', 'info');
    
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 1000);
}

// Generate order ID
function generateOrderId() {
    return 'NB' + Date.now().toString(36).toUpperCase();
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${getAlertClass(type)} alert-dismissible`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        border-radius: 0.75rem;
        animation: slideInRight 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <span class="me-2">${getIcon(type)}</span>
            <span class="flex-grow-1">${message}</span>
            <button type="button" class="btn-close ms-2" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Get alert class for notification
function getAlertClass(type) {
    const classes = {
        success: 'success',
        error: 'danger',
        warning: 'warning',
        info: 'info'
    };
    return classes[type] || 'info';
}

// Get icon for notification
function getIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

// Animate cart icon
function animateCartIcon() {
    const cartLinks = document.querySelectorAll('.cart-link');
    cartLinks.forEach(link => {
        link.style.animation = 'bounce 0.6s ease-in-out';
        setTimeout(() => {
            link.style.animation = '';
        }, 600);
    });
}

// Setup scroll effects
function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize page-specific features
function initializePageFeatures() {
    // Add loading animation to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
    });
    
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Handle newsletter submission
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate newsletter signup
    showNotification('📧 Thank you for subscribing!', 'success');
    emailInput.value = '';
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
        }
        40%, 43% {
            transform: translate3d(0, -10px, 0);
        }
        70% {
            transform: translate3d(0, -5px, 0);
        }
        90% {
            transform: translate3d(0, -2px, 0);
        }
    }
    
    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: center;
    }
    
    .quantity-display {
        min-width: 40px;
        text-align: center;
        font-weight: 600;
        padding: 0.25rem;
        border: 1px solid #dee2e6;
        border-radius: 0.25rem;
        background: #f8f9fa;
    }
    
    .product-image-small img {
        width: 60px;
        height: 60px;
        object-fit: cover;
    }
    
    .empty-cart {
        padding: 3rem;
    }
    
    .cart-item-row {
        border-bottom: 1px solid #e9ecef;
        transition: background-color 0.3s ease;
    }
    
    .cart-item-row:hover {
        background-color: #f8f9fa;
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;

// Add some fun console messages
console.log('%c🥜 NutriBar Pro', 'color: #27ae60; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to our premium nutrition experience!', 'color: #2c3e50; font-size: 14px;');

// Performance monitoring
const startTime = performance.now();
window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
});
