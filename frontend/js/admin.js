const API_URL = 'https://mussawira-backend.vercel.app/api';
const token = localStorage.getItem('adminToken');

if (token) {
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        
        if (data.success) {
            localStorage.setItem('adminToken', data.token);
            location.reload();
        } else {
            const err = document.getElementById('login-error');
            err.textContent = data.message;
            err.style.display = 'block';
        }
    } catch (error) {
        alert('Login failed. Is backend running?');
    }
});

function logout() {
    localStorage.removeItem('adminToken');
    location.reload();
}

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tab + '-tab').classList.add('active');
    
    if (tab === 'manage') loadPaintings();
    if (tab === 'inquiries') loadInquiries();
    if (tab === 'orders') loadOrders();
    if (tab === 'reviews') loadReviewsAdmin();
}

// Load orders
async function loadOrders() {
    try {
        const res = await fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        const data = await res.json();
        const list = document.getElementById('orders-list');
        
        if (data.success && data.data.length > 0) {
            list.innerHTML = data.data.map(order => `
                <div class="order-card">
                    <h3>Order #${order._id.substring(0, 8)}</h3>
                    <p><strong>Customer:</strong> ${order.customerName}</p>
                    <p><strong>Email:</strong> ${order.customerEmail}</p>
                    <p><strong>Phone:</strong> ${order.customerPhone}</p>
                    <p><strong>Address:</strong> ${order.shippingAddress}</p>
                    <p><strong>Total:</strong> PKR ${order.totalAmount.toLocaleString()}</p>
                    <p><strong>Payment:</strong> ${order.paymentMethod}</p>
                    <p><strong>Status:</strong> 
                        <select onchange="updateOrderStatus('${order._id}', this.value)" style="padding: 0.5rem;">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </p>
                    <h4>Items:</h4>
                    <ul>
                        ${order.items.map(item => `<li>${item.title} x ${item.quantity} - PKR ${(item.price * item.quantity).toLocaleString()}</li>`).join('')}
                    </ul>
                    <p><small>Ordered: ${new Date(order.createdAt).toLocaleString()}</small></p>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<p>No orders yet.</p>';
        }
    } catch (error) {
        console.error(error);
    }
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
    try {
        const res = await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        const data = await res.json();
        if (data.success) {
            alert('✅ Order status updated!');
        }
    } catch (error) {
        alert('❌ Error updating status');
    }
}

// Load reviews for admin
async function loadReviewsAdmin() {
    try {
        const res = await fetch(`${API_URL}/reviews`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        const data = await res.json();
        const list = document.getElementById('reviews-list');
        
        if (data.success && data.data.length > 0) {
            list.innerHTML = data.data.map(review => `
                <div class="review-admin-card" style="background: ${review.approved ? '#e8f5e9' : '#fff3e0'};">
                    <h3>${review.customerName} - ${'⭐'.repeat(review.rating)}</h3>
                    <p><strong>Email:</strong> ${review.customerEmail}</p>
                    <p><strong>Comment:</strong> ${review.comment}</p>
                    <p><strong>Status:</strong> ${review.approved ? '✅ Approved' : '⏳ Pending'}</p>
                    <p><small>${new Date(review.createdAt).toLocaleString()}</small></p>
                    ${!review.approved ? 
                        `<button onclick="approveReview('${review._id}')" style="background: #4CAF50; color: white; padding: 0.5rem 1rem; border: none; border-radius: 5px; cursor: pointer;">Approve</button>` : 
                        ''
                    }
                    <button onclick="deleteReview('${review._id}')" style="background: #f44336; color: white; padding: 0.5rem 1rem; border: none; border-radius: 5px; cursor: pointer; margin-left: 0.5rem;">Delete</button>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<p>No reviews yet.</p>';
        }
    } catch (error) {
        console.error(error);
    }
}

// Approve review
async function approveReview(reviewId) {
    try {
        const res = await fetch(`${API_URL}/reviews/${reviewId}/approve`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        const data = await res.json();
        if (data.success) {
            alert('✅ Review approved!');
            loadReviewsAdmin();
        }
    } catch (error) {
        alert('❌ Error approving review');
    }
}

// Delete review
async function deleteReview(reviewId) {
    if (!confirm('Delete this review?')) return;
    try {
        const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        const data = await res.json();
        if (data.success) {
            alert('✅ Review deleted!');
            loadReviewsAdmin();
        }
    } catch (error) {
        alert('❌ Error deleting review');
    }
}

document.getElementById('addPaintingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('available', document.getElementById('available').checked);
    formData.append('image', document.getElementById('image').files[0]);
    
    try {
        const res = await fetch(`${API_URL}/gallery`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
            body: formData
        });
        const data = await res.json();
        alert(data.success ? '✅ Painting added!' : '❌ ' + data.message);
        if (data.success) e.target.reset();
    } catch (error) {
        alert('Error adding painting');
    }
});

async function loadPaintings() {
    try {
        const res = await fetch(`${API_URL}/gallery`);
        const data = await res.json();
        const grid = document.getElementById('paintings-grid');
        
        if (data.success && data.data.length > 0) {
            grid.innerHTML = data.data.map(p => `
                <div class="painting-card">
                    <img src="${API_URL.replace('/api', '')}${p.imageUrl}" alt="${p.title}">
                    <div class="painting-card-body">
                        <h3>${p.title}</h3>
                        <p>${p.category}</p>
                        <p>PKR ${p.price.toLocaleString()}</p>
                        <button onclick="deletePainting('${p._id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        } else {
            grid.innerHTML = '<p>No paintings yet.</p>';
        }
    } catch (error) {
        console.error(error);
    }
}

async function deletePainting(id) {
    if (!confirm('Delete this painting?')) return;
    try {
        const res = await fetch(`${API_URL}/gallery/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        const data = await res.json();
        alert(data.success ? '✅ Deleted!' : '❌ ' + data.message);
        if (data.success) loadPaintings();
    } catch (error) {
        alert('Error deleting');
    }
}

async function loadInquiries() {
    try {
        const res = await fetch(`${API_URL}/contact/inquiries`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        const data = await res.json();
        const list = document.getElementById('inquiries-list');
        
        if (data.success && data.data.length > 0) {
            list.innerHTML = data.data.map(i => `
                <div class="inquiry-card">
                    <h3>${i.name}</h3>
                    <p><strong>Email:</strong> ${i.email}</p>
                    <p><strong>Subject:</strong> ${i.subject}</p>
                    <p><strong>Message:</strong> ${i.message}</p>
                    <p><small>${new Date(i.createdAt).toLocaleString()}</small></p>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<p>No inquiries yet.</p>';
        }
    } catch (error) {
        console.error(error);
    }
}
