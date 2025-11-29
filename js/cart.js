// Shopping Cart Management

class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.init();
  }

  init() {
    this.updateCartCount();
    this.setupCartButtons();
    this.renderCart();
  }

  loadCart() {
    const saved = localStorage.getItem('shoppingCart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    this.updateCartCount();
  }

  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    this.saveCart();
    this.showNotification(`${product.name} added to cart`);
    this.renderCart();
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.renderCart();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
      this.renderCart();
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    const count = this.getItemCount();
    
    countElements.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  setupCartButtons() {
    document.addEventListener('click', (e) => {
      // Add to cart button
      if (e.target.closest('.add-to-cart-btn')) {
        const btn = e.target.closest('.add-to-cart-btn');
        const productCard = btn.closest('.product-card');
        
        if (productCard) {
          const product = {
            id: productCard.dataset.productId || Date.now().toString(),
            name: productCard.querySelector('.product-title')?.textContent || 'Product',
            price: parseFloat(productCard.dataset.price || '0'),
            image: productCard.querySelector('.product-image')?.src || ''
          };
          
          this.addItem(product);
        }
      }
      
      // Remove from cart button
      if (e.target.closest('.remove-btn')) {
        const btn = e.target.closest('.remove-btn');
        const productId = btn.dataset.productId;
        if (productId) {
          this.removeItem(productId);
        }
      }
      
      // Quantity buttons
      if (e.target.closest('.qty-btn')) {
        const btn = e.target.closest('.qty-btn');
        const productId = btn.dataset.productId;
        const action = btn.dataset.action;
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
          if (action === 'increase') {
            this.updateQuantity(productId, item.quantity + 1);
          } else if (action === 'decrease') {
            this.updateQuantity(productId, item.quantity - 1);
          }
        }
      }
    });
  }

  renderCart() {
    const cartContainer = document.querySelector('.cart-items-list');
    const summaryContainer = document.querySelector('.cart-summary');
    
    if (!cartContainer) return;
    
    if (this.items.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart" style="text-align: center; padding: 3rem;">
          <p data-i18n="cart.empty">Your cart is empty</p>
          <a href="shop.html" class="btn btn-primary" style="margin-top: 1rem;" data-i18n="cart.continueShopping">
            Continue Shopping
          </a>
        </div>
      `;
      if (summaryContainer) summaryContainer.style.display = 'none';
      return;
    }
    
    cartContainer.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p class="cart-item-price">${item.price} NOK</p>
          <div class="quantity-selector">
            <button class="qty-btn" data-product-id="${item.id}" data-action="decrease">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" data-product-id="${item.id}" data-action="increase">+</button>
          </div>
          <button class="remove-btn" data-product-id="${item.id}" data-i18n="cart.remove">Remove</button>
        </div>
        <div class="cart-item-total">
          <strong>${item.price * item.quantity} NOK</strong>
        </div>
      </div>
    `).join('');
    
    if (summaryContainer) {
      summaryContainer.style.display = 'block';
      this.updateCartSummary();
    }
  }

  updateCartSummary() {
    const subtotal = this.getTotal();
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.25; // 25% Norwegian VAT
    const total = subtotal + shipping + tax;
    
    const summaryHTML = `
      <h3 data-i18n="cart.title">Order Summary</h3>
      <div class="summary-row">
        <span data-i18n="cart.subtotal">Subtotal</span>
        <span>${subtotal.toFixed(2)} NOK</span>
      </div>
      <div class="summary-row">
        <span data-i18n="cart.shipping">Shipping</span>
        <span>${shipping === 0 ? '<span data-i18n="cart.freeShipping">Free</span>' : shipping + ' NOK'}</span>
      </div>
      <div class="summary-row">
        <span data-i18n="cart.tax">Tax (25%)</span>
        <span>${tax.toFixed(2)} NOK</span>
      </div>
      <div class="summary-row total">
        <span data-i18n="cart.total">Total</span>
        <span>${total.toFixed(2)} NOK</span>
      </div>
      <button class="btn btn-primary btn-large" style="width: 100%; margin-top: 1rem;" data-i18n="cart.checkout">
        Checkout
      </button>
    `;
    
    document.querySelector('.cart-summary').innerHTML = summaryHTML;
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: ${document.querySelector('.header')?.offsetHeight + 20 || 100}px;
      right: 20px;
      background: var(--color-success);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.renderCart();
  }
}

// Initialize shopping cart
const cart = new ShoppingCart();
window.cart = cart;
