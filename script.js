// Complete Cart Management System
(function() {
  'use strict';

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart system initialized');
    
    // Initialize cart functionality
    initializeCart();
    
    // Update cart count in navigation
    updateCartCount();
    
    // Load cart items if on cart page
    if (document.getElementById('cart-items')) {
      loadCartItems();
    }
  });

  // Initialize cart functionality
  function initializeCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        
        if (name && price) {
          addToCart(name, price);
        }
      });
    });
  }

  // Add item to cart
  function addToCart(name, price) {
    try {
      let cart = getCart();
      
      // Check if item already exists
      const existingItem = cart.find(item => item.name === name);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          name: name,
          price: price,
          quantity: 1
        });
      }
      
      saveCart(cart);
      updateCartCount();
      
      // Show success message
      showNotification(`${name} added to cart!`, 'success');
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Error adding item to cart', 'error');
    }
  }

  // Get cart from localStorage
  function getCart() {
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart:', error);
      return [];
    }
  }

  // Save cart to localStorage
  function saveCart(cart) {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  // Update cart count in navigation
  function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
      element.textContent = totalItems;
    });
  }

  // Load cart items on cart page
  function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const subtotalElement = document.getElementById('subtotal');
    const itemsCountElement = document.getElementById('items-count');
    
    if (!cartItemsContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4">
            <h5 class="text-muted">Your cart is empty</h5>
            <p class="text-muted">Start shopping to add items to your cart</p>
            <a href="products.html" class="btn btn-success">Shop Now</a>
          </td>
        </tr>
      `;
      
      if (cartTotalElement) cartTotalElement.textContent = '₹0.00';
      if (subtotalElement) subtotalElement.textContent = '₹0.00';
      if (itemsCountElement) itemsCountElement.textContent = '0';
      
      return;
    }
    
    let cartHTML = '';
    let total = 0;
    let totalItems = 0;
    
    cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      totalItems += item.quantity;
      
      cartHTML += `
        <tr>
          <td>
            <strong>${item.name}</strong>
          </td>
          <td>₹${item.price.toFixed(2)}</td>
          <td>
            <div class="d-flex align-items-center">
              <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateQuantity(${index}, -1)">-</button>
              <span class="mx-2">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary ms-2" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
          </td>
          <td>₹${subtotal.toFixed(2)}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">Remove</button>
          </td>
        </tr>
      `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    
    if (cartTotalElement) cartTotalElement.textContent = `₹${total.toFixed(2)}`;
    if (subtotalElement) subtotalElement.textContent = `₹${total.toFixed(2)}`;
    if (itemsCountElement) itemsCountElement.textContent = totalItems;
  }

  // Update item quantity
  function updateQuantity(index, change) {
    let cart = getCart();
    
    if (index >= 0 && index < cart.length) {
      cart[index].quantity += change;
      
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      
      saveCart(cart);
      loadCartItems();
      updateCartCount();
    }
  }

  // Remove item from cart
  function removeItem(index) {
    let cart = getCart();
    
    if (index >= 0 && index < cart.length) {
      const itemName = cart[index].name;
      cart.splice(index, 1);
      
      saveCart(cart);
      loadCartItems();
      updateCartCount();
      
      showNotification(`${itemName} removed from cart`, 'info');
    }
  }

  // Clear entire cart
  function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      localStorage.removeItem('cart');
      loadCartItems();
      updateCartCount();
      showNotification('Cart cleared', 'info');
    }
  }

  // Show notification
  function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.cart-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `cart-notification alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} position-fixed`;
    notification.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    notification.innerHTML = `
      <div class="d-flex align-items-center">
        <span class="me-2">
          ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
        </span>
        <span>${message}</span>
        <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
  }

  // Export functions to global scope
  window.updateQuantity = updateQuantity;
  window.removeItem = removeItem;
  window.clearCart = clearCart;
  window.loadCartItems = loadCartItems;
  window.getCart = getCart;
  window.saveCart = saveCart;
  window.addToCart = addToCart;

})();

// Additional utility functions
function formatCurrency(amount) {
  return `₹${amount.toFixed(2)}`;
}

function generateOrderId() {
  return 'NB' + Date.now().toString().slice(-8);
}

// Handle checkout process
function proceedToCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    alert('Your cart is empty! Please add some items before checkout.');
    return;
  }
  
  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Save checkout data
  const checkoutData = {
    items: cart,
    total: total,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
  
  // Redirect to checkout page
  window.location.href = 'checkout.html';
}

// Handle form submissions
document.addEventListener('DOMContentLoaded', function() {
  // Contact form handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Simulate form submission
      setTimeout(() => {
        alert('Thank you for your message! We will get back to you within 24 hours.');
        this.reset();
      }, 1000);
    });
  }
  
  // Checkout form handler
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
      const missing = requiredFields.filter(field => !data[field]);
      
      if (missing.length > 0) {
        alert('Please fill in all required fields: ' + missing.join(', '));
        return;
      }
      
      // Process order
      processOrder(data);
    });
  }
});

function processOrder(orderData) {
  // Show processing modal
  const processingHTML = `
    <div class="modal fade" id="processingModal" tabindex="-1" data-bs-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body text-center py-4">
            <div class="spinner-border text-success mb-3" role="status"></div>
            <h5>Processing your order...</h5>
            <p class="text-muted">Please wait while we process your payment</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', processingHTML);
  const modal = new bootstrap.Modal(document.getElementById('processingModal'));
  modal.show();
  
  // Simulate processing time
  setTimeout(() => {
    modal.hide();
    
    // Generate order number
    const orderNumber = generateOrderId();
    
    // Clear cart and checkout data
    localStorage.removeItem('cart');
    localStorage.removeItem('checkoutData');
    
    // Show success message
    alert(`Order placed successfully! Your order number is: ${orderNumber}. You will receive a confirmation email shortly.`);
    
    // Redirect to home page
    window.location.href = 'index.html';
  }, 3000);
}
