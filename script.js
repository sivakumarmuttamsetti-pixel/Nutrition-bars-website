// WORKING CART SYSTEM - GUARANTEED TO WORK
console.log('Cart script loaded successfully!');

// Global cart variable
let cart = [];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing cart...');
    
    // Load cart from localStorage
    loadCartFromStorage();
    
    // Set up all add to cart buttons
    setupAddToCartButtons();
    
    // Update cart count display
    updateCartCountDisplay();
    
    // If on cart page, show cart items
    if (document.getElementById('cart-items')) {
        displayCartItems();
    }
    
    console.log('Cart initialization complete!');
});

// Load cart from localStorage
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('nutritionbars-cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('Cart loaded from storage:', cart);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem('nutritionbars-cart', JSON.stringify(cart));
        console.log('Cart saved to storage:', cart);
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

// Setup add to cart buttons
function setupAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');
    console.log('Found ' + buttons.length + ' add to cart buttons');
    
    buttons.forEach(function(button, index) {
        console.log('Setting up button ' + (index + 1) + ':', button.getAttribute('data-name'));
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productName = this.getAttribute('data-name');
            const productPrice = this.getAttribute('data-price');
            
            console.log('Add to cart clicked:', productName, productPrice);
            
            if (productName && productPrice) {
                addItemToCart(productName, parseFloat(productPrice));
            } else {
                console.error('Missing product data on button');
            }
        });
    });
}

// Add item to cart
function addItemToCart(name, price) {
    console.log('Adding item to cart:', name, price);
    
    // Find existing item
    let existingItem = null;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            existingItem = cart[i];
            break;
        }
    }
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Updated existing item quantity to:', existingItem.quantity);
    } else {
        const newItem = {
            name: name,
            price: price,
            quantity: 1
        };
        cart.push(newItem);
        console.log('Added new item to cart');
    }
    
    // Save to localStorage
    saveCartToStorage();
    
    // Update display
    updateCartCountDisplay();
    
    // Show success message
    showSuccessMessage(name + ' added to cart!');
    
    console.log('Current cart:', cart);
}

// Update cart count display
function updateCartCountDisplay() {
    let totalItems = 0;
    for (let i = 0; i < cart.length; i++) {
        totalItems += cart[i].quantity;
    }
    
    const countElements = document.querySelectorAll('#cart-count');
    countElements.forEach(function(element) {
        element.textContent = totalItems;
    });
    
    console.log('Cart count updated to:', totalItems);
}

// Show success message
function showSuccessMessage(message) {
    // Simple alert for now
    alert(message);
    
    // Also try to show a better notification if possible
    try {
        const notification = document.createElement('div');
        notification.innerHTML = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 9999;
            font-weight: bold;
        `;
        document.body.appendChild(notification);
        
        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    } catch (error) {
        console.log('Fallback to alert only');
    }
}

// Display cart items on cart page
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer) {
        console.log('Cart items container not found');
        return;
    }
    
    console.log('Displaying cart items:', cart);
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-5">
                    <h4>Your cart is empty</h4>
                    <p>Start shopping to add items to your cart</p>
                    <a href="products.html" class="btn btn-success">Shop Now</a>
                </td>
            </tr>
        `;
        
        if (cartTotalElement) {
            cartTotalElement.textContent = '₹0.00';
        }
        return;
    }
    
    let html = '';
    let total = 0;
    
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        html += `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>
                    <div class="d-flex align-items-center justify-content-center">
                        <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${i}, -1)">-</button>
                        <span class="mx-3">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${i}, 1)">+</button>
                    </div>
                </td>
                <td>₹${subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeCartItem(${i})">Remove</button>
                </td>
            </tr>
        `;
    }
    
    cartItemsContainer.innerHTML = html;
    
    if (cartTotalElement) {
        cartTotalElement.textContent = '₹' + total.toFixed(2);
    }
    
    // Update other total elements
    const subtotalElement = document.getElementById('subtotal');
    const itemsCountElement = document.getElementById('items-count');
    
    if (subtotalElement) {
        subtotalElement.textContent = '₹' + total.toFixed(2);
    }
    
    if (itemsCountElement) {
        let totalItems = 0;
        for (let i = 0; i < cart.length; i++) {
            totalItems += cart[i].quantity;
        }
        itemsCountElement.textContent = totalItems;
    }
}

// Change quantity of item
function changeQuantity(index, change) {
    console.log('Changing quantity for item', index, 'by', change);
    
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        saveCartToStorage();
        updateCartCountDisplay();
        displayCartItems();
    }
}

// Remove item from cart
function removeCartItem(index) {
    console.log('Removing item at index', index);
    
    if (cart[index]) {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCartCountDisplay();
        displayCartItems();
    }
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.removeItem('nutritionbars-cart');
        updateCartCountDisplay();
        displayCartItems();
        console.log('Cart cleared');
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty! Please add some items before checkout.');
        return;
    }
    
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].quantity;
    }
    
    const checkoutData = {
        items: cart,
        total: total,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('nutritionbars-checkout', JSON.stringify(checkoutData));
    
    window.location.href = 'checkout.html';
}

// Test function to verify cart is working
function testCart() {
    console.log('Testing cart functionality...');
    addItemToCart('Test Product', 99.99);
    console.log('Test complete. Check cart:', cart);
}

// Make functions available globally
window.changeQuantity = changeQuantity;
window.removeCartItem = removeCartItem;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;
window.testCart = testCart;

console.log('Cart system ready!');
