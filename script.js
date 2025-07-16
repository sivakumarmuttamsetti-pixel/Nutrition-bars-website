// Cart functionality with improved error handling
(function() {
  'use strict';

  // Initialize cart functionality when DOM is ready
  document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM Content Loaded - Script is running");
    
    try {
      initializeCart();
      
      // Load cart items if on cart page
      if (document.getElementById("cart-items")) {
        console.log("Loading cart items for cart page");
        loadCartItems();
      }
    } catch (error) {
      console.error("Error initializing cart:", error);
    }
  });

  function initializeCart() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    console.log(`Found ${addToCartButtons.length} add-to-cart buttons`);

    if (addToCartButtons.length === 0) {
      console.log("No add-to-cart buttons found on this page");
      return;
    }

    addToCartButtons.forEach((button, index) => {
      const name = button.getAttribute("data-name");
      const price = button.getAttribute("data-price");
      
      console.log(`Setting up button ${index + 1}: ${name} - ₹${price}`);
      
      if (!name || !price) {
        console.error(`Button ${index + 1} missing required data attributes`);
        return;
      }
      
      button.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        try {
          addToCart(name, parseFloat(price));
        } catch (error) {
          console.error("Error adding to cart:", error);
          alert("Error adding item to cart. Please try again.");
        }
      });
    });
  }

  function addToCart(name, price) {
    console.log(`Adding to cart: ${name} at ₹${price}`);
    
    if (!name || isNaN(price) || price <= 0) {
      console.error("Invalid product data:", { name, price });
      return;
    }

    try {
      let cart = getCart();
      console.log("Current cart:", cart);

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.quantity += 1;
        console.log(`Updated existing item quantity to ${existing.quantity}`);
      } else {
        cart.push({ name, price, quantity: 1 });
        console.log("Added new item to cart");
      }

      saveCart(cart);
      console.log("Cart saved to localStorage:", cart);
      
      // Show success message
      showSuccessMessage(`${name} added to cart!`);
      
      // Update cart count if there's a cart counter in the navigation
      updateCartCount();
      
    } catch (error) {
      console.error("Error in addToCart:", error);
      alert("Error adding item to cart. Please try again.");
    }
  }

  function getCart() {
    try {
      const cartData = localStorage.getItem("cart");
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Error reading cart from localStorage:", error);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
      throw error;
    }
  }

  function showSuccessMessage(message) {
    // Create a more user-friendly notification
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
      <strong>Success!</strong> ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Remove the notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
    
    // Also show the traditional alert for now
    alert(message);
  }

  function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart count in navigation if element exists
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
  }

  // Load items into the cart page
  function loadCartItems() {
    const cartTable = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    
    if (!cartTable || !cartTotal) {
      console.error("Cart elements not found");
      return;
    }

    try {
      const cart = getCart();
      console.log("Loading cart items:", cart);
      
      cartTable.innerHTML = "";
      let total = 0;

      if (cart.length === 0) {
        cartTable.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
        cartTotal.textContent = "₹0";
        return;
      }

      cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.name}</td>
          <td>
            <button class="btn btn-sm btn-outline-secondary me-1" onclick="updateQuantity(${index}, -1)">-</button>
            ${item.quantity}
            <button class="btn btn-sm btn-outline-secondary ms-1" onclick="updateQuantity(${index}, 1)">+</button>
          </td>
          <td>₹${item.price.toFixed(2)}</td>
          <td>₹${subtotal.toFixed(2)}</td>
          <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Remove</button></td>
        `;
        cartTable.appendChild(row);
      });

      cartTotal.textContent = `₹${total.toFixed(2)}`;
      console.log(`Cart total: ₹${total.toFixed(2)}`);
      
    } catch (error) {
      console.error("Error loading cart items:", error);
      cartTable.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error loading cart</td></tr>';
    }
  }

  // Global functions for cart operations
  window.removeItem = function(index) {
    console.log(`Removing item at index ${index}`);
    try {
      let cart = getCart();
      if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCart(cart);
        loadCartItems();
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  window.updateQuantity = function(index, change) {
    console.log(`Updating quantity for item ${index} by ${change}`);
    try {
      let cart = getCart();
      if (index >= 0 && index < cart.length) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
        saveCart(cart);
        loadCartItems();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  window.clearCart = function() {
    console.log("Clearing cart");
    try {
      localStorage.removeItem("cart");
      loadCartItems();
      alert("Cart cleared successfully!");
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  window.loadCartItems = loadCartItems;
  window.getCart = getCart;
  window.saveCart = saveCart;

})();
