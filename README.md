# Nutrition Bars Website

A complete e-commerce website for nutrition bars and peanut butter products with full shopping cart functionality.

## Features

### 🛒 Shopping Cart System
- Add items to cart from any product page
- Real-time cart count in navigation
- Quantity adjustment (+ and - buttons)
- Remove individual items
- Clear entire cart
- Persistent cart storage (localStorage)
- Cart total calculation

### 📱 Responsive Design
- Mobile-first approach
- Bootstrap 5 framework
- Modern CSS Grid and Flexbox
- Smooth animations and transitions
- Touch-friendly interface

### 🎨 Modern UI/UX
- Professional color scheme
- Gradient backgrounds
- Card-based product layout
- Hover effects and animations
- Clean typography
- Intuitive navigation

### 💳 Complete Checkout Process
- Billing information form
- Multiple payment options (COD, Card, UPI)
- Order summary with tax calculation
- Order confirmation with tracking number
- Processing animation

## File Structure

```
/workspace/
├── index.html          # Homepage with featured products
├── products.html       # Nutrition bars catalog
├── peanutbutter.html   # Peanut butter products
├── combo.html          # Special combo offers
├── cart.html           # Shopping cart page
├── checkout.html       # Checkout process
├── contact.html        # Contact form and info
├── script.js           # Main JavaScript functionality
├── style.css           # Complete CSS styling
└── images/             # Product images directory
```

## Pages Overview

### 🏠 Home Page (index.html)
- Hero section with call-to-action
- Featured products showcase
- Navigation with cart counter
- Company branding

### 🍫 Products Page (products.html)
- 6 nutrition bar varieties
- Product cards with images
- Add to cart functionality
- Detailed product descriptions

### 🥜 Peanut Butter Page (peanutbutter.html)
- 8 peanut butter flavors
- Grid layout for easy browsing
- Price display and cart buttons
- Flavor descriptions

### 🎁 Combo Offers Page (combo.html)
- 3 special combo deals
- Savings calculations
- Attractive pricing display
- Benefits section

### 🛒 Cart Page (cart.html)
- Complete cart management
- Quantity controls
- Item removal
- Order summary
- Recommended products
- Checkout button

### 💳 Checkout Page (checkout.html)
- Billing information form
- Payment method selection
- Order summary display
- Tax calculation
- Security indicators
- Order processing

### 📞 Contact Page (contact.html)
- Contact form with validation
- Company information
- FAQ section
- Business hours
- Multiple contact methods

## JavaScript Features

### Cart Management
- `addToCart(name, price)` - Add item to cart
- `getCart()` - Retrieve cart from localStorage
- `saveCart(cart)` - Save cart to localStorage
- `updateCartCount()` - Update navigation counter
- `loadCartItems()` - Display cart items
- `removeItem(index)` - Remove specific item
- `clearCart()` - Empty entire cart

### User Interface
- `showNotification(message, type)` - Display success/error messages
- `proceedToCheckout()` - Handle checkout process
- `updateQuantity(index, change)` - Adjust item quantities
- Form validation and submission handlers

### Utility Functions
- `formatCurrency(amount)` - Format price display
- `generateOrderId()` - Create unique order numbers
- `processOrder(orderData)` - Handle order completion

## CSS Features

### Modern Design System
- CSS Custom Properties (variables)
- Consistent color palette
- Typography hierarchy
- Spacing system
- Shadow system

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly buttons
- Responsive images
- Adaptive navigation

### Animations
- Smooth transitions
- Hover effects
- Loading animations
- Notification slides
- Card transformations

## Setup Instructions

1. **Clone or download** all files to your web server
2. **Ensure** all files are in the same directory
3. **Create** an `images/` folder with product images
4. **Open** `index.html` in your web browser
5. **Start shopping!**

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Framework**: Bootstrap 5.3.3
- **Storage**: localStorage for cart persistence
- **Icons**: Bootstrap Icons
- **Fonts**: System fonts (Segoe UI, etc.)

## Product Catalog

### Nutrition Bars (₹99 each)
1. Almond Cocoa Crunch
2. Vanilla Walnut Delight
3. Cashew Berry Boost
4. Pistachio Oat Bar
5. Date & Nut Energy Bar
6. Protein Power Bar (₹109)

### Peanut Butter Varieties
1. Creamy (₹149)
2. Crunchy (₹149)
3. Chocolate (₹159)
4. Honey (₹159)
5. Coconut (₹159)
6. Almond Blend (₹169)
7. Spicy (₹159)
8. Classic (₹139)

### Combo Offers
1. Peanut Butter Combo - Any 2 jars (₹262)
2. Nutrition Bar Combo - 5 bars (₹425)
3. Mixed Combo - 3 bars + 1 peanut butter (₹379)

## Future Enhancements

- User authentication
- Order history
- Product reviews
- Wishlist functionality
- Real payment integration
- Inventory management
- Admin dashboard

## License

This project is for educational purposes. All rights reserved.

---

**Built with ❤️ for healthy living**