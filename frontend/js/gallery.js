const API_URL = 'https://mussawira-backend.vercel.app/api';

// Load and display gallery
async function loadGallery() {
    try {
        console.log('🎨 Loading gallery from:', API_URL);
        
        const response = await fetch(`${API_URL}/gallery`);
        const data = await response.json();
        
        console.log('Gallery response:', data);
        
        const galleryGrid = document.getElementById('galleryGrid');
        
        if (!galleryGrid) {
            console.error('Gallery grid element not found!');
            return;
        }
        
        if (data.success && data.data.length > 0) {
            console.log(`✅ Loaded ${data.data.length} paintings`);
            
            galleryGrid.innerHTML = '';
            
            data.data.forEach((painting, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.setAttribute('data-category', painting.category);
                galleryItem.style.animationDelay = `${index * 0.1}s`;
                
                // Use the base64 image directly
                const imageUrl = painting.imageUrl;
                
                galleryItem.innerHTML = `
                    <img src="${imageUrl}" 
                         alt="${painting.title}"
                         loading="lazy"
                         style="width: 100%; height: 100%; object-fit: cover;"
                         onerror="console.error('Image failed to load for:', '${painting.title}')">
                    <div class="gallery-overlay">
                        <h3>${painting.title}</h3>
                        <p>${painting.description}</p>
                        <p style="font-weight: 600; margin-top: 0.5rem; font-size: 1.2rem;">PKR ${painting.price.toLocaleString()}</p>
                        ${painting.available ? 
                            `<button class="add-to-cart-btn" onclick="addPaintingToCart('${painting._id}', '${painting.title.replace(/'/g, "\\'")}', ${painting.price}, '${imageUrl.substring(0, 100)}...'); event.stopPropagation();">
                                🛒 Add to Cart
                            </button>` : 
                            `<p style="color: #ff4444; font-weight: 600; margin-top: 1rem;">SOLD OUT</p>`
                        }
                    </div>
                `;
                
                galleryGrid.appendChild(galleryItem);
            });
            
        } else {
            galleryGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🎨</div>
                    <h3 style="color: var(--dark-text); margin-bottom: 1rem;">No Artworks Yet!</h3>
                    <p style="color: var(--medium-text);">New paintings will be added soon. Check back later!</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Error loading gallery:', error);
        const galleryGrid = document.getElementById('galleryGrid');
        if (galleryGrid) {
            galleryGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <p style="color: #ff4444;">⚠️ Unable to load gallery. Please refresh the page.</p>
                    <p style="color: var(--light-text); margin-top: 1rem;">Error: ${error.message}</p>
                </div>
            `;
        }
    }
}

// Add painting to cart - SIMPLIFIED VERSION
function addPaintingToCart(id, title, price, imageUrl) {
    console.log('🛒 Adding to cart:', { id, title, price });
    
    try {
        // Get existing cart or create new one
        let cart = JSON.parse(localStorage.getItem('mussawira_cart') || '[]');
        
        // Check if item already in cart
        const existingItem = cart.find(item => item._id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
            alert(`✅ Updated quantity of "${title}" in cart!`);
        } else {
            cart.push({
                _id: id,
                title: title,
                price: price,
                imageUrl: imageUrl,
                quantity: 1
            });
            alert(`✅ "${title}" added to cart!`);
        }
        
        // Save cart
        localStorage.setItem('mussawira_cart', JSON.stringify(cart));
        
        // Update cart badge
        updateCartBadge();
        
    } catch (error) {
        console.error('❌ Error adding to cart:', error);
        alert('❌ Could not add to cart. Please try again.');
    }
}

// Update cart badge count
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        const cart = JSON.parse(localStorage.getItem('mussawira_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Filter gallery by category
function filterGallery(category) {
    console.log('🔍 Filtering by:', category);
    
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        }
    });
    
    // Filter items
    items.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
        } else {
            item.style.display = 'none';
        }
    });
}

// Initialize gallery when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing gallery...');
    
    // Load gallery
    loadGallery();
    
    // Update cart badge
    updateCartBadge();
    
    // Add filter button listeners
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-filter');
            filterGallery(category);
        });
    });
    
    console.log('✅ Gallery initialized');
});