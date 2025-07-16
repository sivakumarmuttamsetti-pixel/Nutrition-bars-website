// SIMPLE WORKING CART SYSTEM
console.log('Cart script loading...');

// Global cart
let cart = [];

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, setting up cart...');
    
    // Load saved cart
    loadCart();
    
    // Set up buttons
    setupButtons();
    
    // Update counter
    updateCounter();
    
    // Show cart items if on cart page
    if (window.location.pathname.includes('cart.html')) {
        showCartItems();
    }
    
    console.log('Cart setup complete!');
});

// Load cart from storage
function loadCart() {
    try {
        const saved = localStorage.getItem('cart');
        if (saved) {
            cart = JSON.parse(saved);
            console.log('Loaded cart:', cart);
        }
    } catch (e) {
        console.error('Error loading cart:', e);
        cart = [];
    }
}

// Save cart to storage
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart saved:', cart);
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

// Set up all add to cart buttons
function setupButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');
    console.log('Found buttons:', buttons.length);
    
    buttons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            
            console.log('Button clicked:', name, price);
            
            if (name && price) {
                addToCart(name, parseFloat(price));
            } else {
                console.error('Missing data on button:', this);
            }
        });
    });
}

// Add item to cart
function addToCart(name, price) {
    console.log('Adding to cart:', name, price);
    
    // Find existing item
    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            cart[i].quantity += 1;
            found = true;
            break;
        }
    }
    
    // If not found, add new item
    if (!found) {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    // Save cart
    saveCart();
    
    // Update counter
    updateCounter();
    
    // Show message
    alert(name + ' added to cart!');
    
    console.log('Cart after adding:', cart);
}

// Update cart counter
function updateCounter() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].quantity;
    }
    
    const counters = document.querySelectorAll('#cart-count');
    counters.forEach(function(counter) {
        counter.textContent = total;
    });
    
    console.log('Counter updated to:', total);
}

// Show cart items (for cart page)
function showCartItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    
    console.log('Showing cart items:', cart);
    
    if (cart.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <h4>Your cart is empty</h4>
                    <a href="products.html" class="btn btn-success">Shop Now</a>
                </td>
            </tr>
        `;
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
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>
                    <button onclick="changeQty(${i}, -1)" class="btn btn-sm btn-outline-secondary">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button onclick="changeQty(${i}, 1)" class="btn btn-sm btn-outline-secondary">+</button>
                </td>
                <td>₹${subtotal}</td>
                <td>
                    <button onclick="removeItem(${i})" class="btn btn-sm btn-danger">Remove</button>
                </td>
            </tr>
        `;
    }
    
    container.innerHTML = html;
    
    // Update total
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = '₹' + total;
    }
    
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = '₹' + total;
    }
}

// Change quantity
function changeQty(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        saveCart();
        updateCounter();
        showCartItems();
    }
}

// Remove item
function removeItem(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        saveCart();
        updateCounter();
        showCartItems();
    }
}

// Clear cart
function clearCart() {
    if (confirm('Clear cart?')) {
        cart = [];
        localStorage.removeItem('cart');
        updateCounter();
        showCartItems();
    }
}

// Checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].quantity;
    }
    
    localStorage.setItem('checkout', JSON.stringify({
        items: cart,
        total: total
    }));
    
    window.location.href = 'checkout.html';
}

// Test function
function testCart() {
    console.log('Testing cart...');
    addToCart('Test Item', 99);
}

// Make functions global
window.changeQty = changeQty;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;
window.testCart = testCart;

console.log('Cart script loaded!');
