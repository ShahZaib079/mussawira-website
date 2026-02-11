const API_URL = 'https://mussawira-backend.vercel.app/api';

// Add painting to cart from gallery
async function addToCartFromGallery(paintingId) {
    try {
        const response = await fetch(`${API_URL}/gallery/${paintingId}`);
        const data = await response.json();
        
        if (data.success) {
            cart.addItem(data.data);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Could not add to cart');
    }
}

// Open cart modal
function openCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'block';
    renderCartItems();
}

// Close cart modal
function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

// Render cart items
function renderCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');
    
    if (cart.items.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>';
        cartTotalDiv.textContent = 'PKR 0';
        return;
    }
    
    cartItemsDiv.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <img src="${API_URL.replace('/api', '')}${item.imageUrl}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>PKR ${item.price.toLocaleString()}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateCartQuantity('${item._id}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartQuantity('${item._id}', ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-total">
                <p>PKR ${(item.price * item.quantity).toLocaleString()}</p>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart('${item._id}')">🗑️</button>
        </div>
    `).join('');
    
    cartTotalDiv.textContent = `PKR ${cart.getTotal().toLocaleString()}`;
}

// Update cart quantity
function updateCartQuantity(paintingId, newQuantity) {
    if (newQuantity < 1) return;
    cart.updateQuantity(paintingId, newQuantity);
    renderCartItems();
}

// Remove from cart
function removeFromCart(paintingId) {
    if (confirm('Remove this item from cart?')) {
        cart.removeItem(paintingId);
        renderCartItems();
    }
}

// Clear cart
function clearCartConfirm() {
    if (confirm('Clear all items from cart?')) {
        cart.clearCart();
        renderCartItems();
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.items.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    closeCart();
    
    const checkoutModal = document.getElementById('checkout-modal');
    checkoutModal.style.display = 'block';
    
    renderCheckoutSummary();
}

// Close checkout
function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// Render checkout summary
function renderCheckoutSummary() {
    const checkoutItemsDiv = document.getElementById('checkout-items');
    const checkoutTotalDiv = document.getElementById('checkout-total');
    
    checkoutItemsDiv.innerHTML = cart.items.map(item => `
        <div class="checkout-item">
            <span>${item.title} x ${item.quantity}</span>
            <span>PKR ${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');
    
    checkoutTotalDiv.textContent = `PKR ${cart.getTotal().toLocaleString()}`;
}

// Handle checkout form submission
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const orderData = {
                customerName: document.getElementById('checkout-name').value,
                customerEmail: document.getElementById('checkout-email').value,
                customerPhone: document.getElementById('checkout-phone').value,
                shippingAddress: document.getElementById('checkout-address').value,
                paymentMethod: document.getElementById('payment-method').value,
                notes: document.getElementById('checkout-notes').value,
                items: cart.items.map(item => ({
                    paintingId: item._id,
                    quantity: item.quantity
                }))
            };
            
            const submitBtn = checkoutForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';
            
            try {
                const response = await fetch(`${API_URL}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('✅ ' + data.message + '\n\nOrder ID: ' + data.data._id);
                    cart.clearCart();
                    closeCheckout();
                    checkoutForm.reset();
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