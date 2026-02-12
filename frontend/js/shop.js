const API_URL = 'https://mussawira-backend.vercel.app/api';

// Open cart modal
function openCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = 'block';
        renderCartItems();
    }
}

// Close cart modal
function closeCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Render cart items
function renderCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');
    
    if (!cartItemsDiv || !cartTotalDiv) return;
    
    const cart = JSON.parse(localStorage.getItem('mussawira_cart') || '[]');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🛒</div>
                <p style="color: var(--medium-text); font-size: 1.2rem;">Your cart is empty</p>
                <p style="color: var(--light-text); margin-top: 0.5rem;">Add some beautiful artworks!</p>
            </div>
        `;
        cartTotalDiv.textContent = 'PKR 0';
        return;
    }
    
    let total = 0;
    
    cartItemsDiv.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item" style="display: grid; grid-template-columns: 80px 1fr auto; gap: 1rem; align-items: center; padding: 1rem; background: #fff5f7; border-radius: 10px; margin-bottom: 1rem;">
                <img src="${item.imageUrl}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                <div>
                    <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${item.title}</h4>
                    <p style="margin: 0; color: #FFB6C1; font-weight: 600;">PKR ${item.price.toLocaleString()}</p>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                        <button onclick="updateCartQuantity('${item._id}', ${item.quantity - 1})" style="width: 30px; height: 30px; border: none; background: #FFB6C1; color: white; border-radius: 5px; cursor: pointer; font-size: 1.2rem;">-</button>
                        <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
                        <button onclick="updateCartQuantity('${item._id}', ${item.quantity + 1})" style="width: 30px; height: 30px; border: none; background: #FFB6C1; color: white; border-radius: 5px; cursor: pointer; font-size: 1.2rem;">+</button>
                    </div>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: 600; margin-bottom: 0.5rem;">PKR ${itemTotal.toLocaleString()}</p>
                    <button onclick="removeFromCart('${item._id}')" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; opacity: 0.6;">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotalDiv.textContent = `PKR ${total.toLocaleString()}`;
}

// Update cart quantity
function updateCartQuantity(id, newQuantity) {
    if (newQuantity < 1) return;
    
    let cart = JSON.parse(localStorage.getItem('mussawira_cart') || '[]');
    const item = cart.find(item => item._id === id);
    
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('mussawira_cart', JSON.stringify(cart));
        renderCartItems();
        updateCartBadge();
    }
}

// Remove from cart
function removeFromCart(id) {
    if (confirm('Remove this item from cart?')) {
        let cart = JSON.parse(localStorage.getItem('mussawira_cart') || '[]');
        cart = cart.filter(item => item._id !== id);
        localStorage.setItem('mussawira_cart', JSON.stringify(cart));
        renderCartItems();
        updateCartBadge();
    }
}

// Clear cart
function clearCartConfirm() {
    if (confirm('Clear all items from cart?')) {
        localStorage.setItem('mussawira_cart', '[]');
        renderCartItems();
        updateCartBadge();
    }
}

// Proceed to checkout
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('mussawira_cart') || '[]');
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    closeCart();
    
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) {
        checkoutModal.style.display = 'block';
        renderCheckoutSummary();
    }
}

// Close checkout
function closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Render checkout summary
function renderCheckoutSummary() {
    const checkoutItemsDiv = document.getElementById('checkout-items');
    const checkoutTotalDiv = document.getElementById('checkout-total');
    
    if (!checkoutItemsDiv || !checkoutTotalDiv) return;
    
    const cart = JSON.parse(localStorage.getItem('mussawira_cart') || '[]');
    let total = 0;
    
    checkoutItemsDiv.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #ffe8f0;">
                <span>${item.title} × ${item.quantity}</span>
                <span style="font-weight: 600;">PKR ${itemTotal.toLocaleString()}</span>
            </div>
        `;
    }).join('');
    
    checkoutTotalDiv.textContent = `PKR ${total.toLocaleString()}`;
}

// Update cart badge
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        const cart = JSON.parse(localStorage.getItem('mussawira_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Handle checkout form submission
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const cart = JSON.parse(localStorage.getItem('mussawira_cart') || '[]');
            
            const orderData = {
                customerName: document.getElementById('checkout-name').value,
                customerEmail: document.getElementById('checkout-email').value,
                customerPhone: document.getElementById('checkout-phone').value,
                shippingAddress: document.getElementById('checkout-address').value,
                paymentMethod: document.getElementById('payment-method').value,
                notes: document.getElementById('checkout-notes').value,
                items: cart.map(item => ({
                    paintingId: item._id,
                    quantity: item.quantity
                }))
            };
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Processing...';
            
            try {
                const response = await fetch(`${API_URL}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('✅ ' + data.message + '\n\nOrder ID: ' + data.data._id + '\n\nWe will contact you soon!');
                    
                    // Clear cart
                    localStorage.setItem('mussawira_cart', '[]');
                    updateCartBadge();
                    
                    // Close checkout
                    closeCheckout();
                    
                    // Reset form
                    this.reset();
                } else {
                    alert('❌ ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('❌ Could not place order. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Place Order';
            }
        });
    }
    
    // Update cart badge on page load
    updateCartBadge();
});

// Close modals when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    
    if (event.target == cartModal) {
        closeCart();
    }
    if (event.target == checkoutModal) {
        closeCheckout();
    }
}