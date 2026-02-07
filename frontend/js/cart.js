// Shopping Cart Manager
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartUI();
    }

    // Load cart from localStorage
    loadCart() {
        const saved = localStorage.getItem('mussawira_cart');
        return saved ? JSON.parse(saved) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('mussawira_cart', JSON.stringify(this.items));
        this.updateCartUI();
    }

    // Add item to cart
    addItem(painting) {
        const existingItem = this.items.find(item => item._id === painting._id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                _id: painting._id,
                title: painting.title,
                price: painting.price,
                imageUrl: painting.imageUrl,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showNotification(`✅ "${painting.title}" added to cart!`);
    }

    // Remove item from cart
    removeItem(paintingId) {
        this.items = this.items.filter(item => item._id !== paintingId);
        this.saveCart();
    }

    // Update quantity
    updateQuantity(paintingId, quantity) {
        const item = this.items.find(item => item._id === paintingId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
        }
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveCart();
    }

    // Get total items count
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Get total price
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Update cart UI (badge)
    updateCartUI() {
        const cartBadge = document.getElementById('cart-count');
        if (cartBadge) {
            const count = this.getItemCount();
            cartBadge.textContent = count;
            cartBadge.style.display = count > 0 ? 'block' : 'none';
        }
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize cart
const cart = new ShoppingCart();