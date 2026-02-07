// ===================================
// Gallery - Load from Backend
// ===================================

// API Configuration
const API_URL = 'http://localhost:5000/api'; // Change this when deploying

// Load gallery items from backend
// Update loadGallery function
async function loadGallery() {
    try {
        const response = await fetch(`${API_URL}/gallery`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            const galleryGrid = document.getElementById('galleryGrid');
            galleryGrid.innerHTML = '';
            
            data.data.forEach((painting, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.setAttribute('data-category', painting.category);
                galleryItem.style.animationDelay = `${index * 0.1}s`;
                
                galleryItem.innerHTML = `
                    <img src="${API_URL.replace('/api', '')}${painting.imageUrl}" 
                         alt="${painting.title}"
                         loading="lazy"
                         onclick="viewPaintingDetails('${painting._id}')">
                    <div class="gallery-overlay">
                        <h3>${painting.title}</h3>
                        <p>${painting.description}</p>
                        <p style="font-weight: 600; margin-top: 0.5rem;">PKR ${painting.price.toLocaleString()}</p>
                        ${painting.available ? 
                            `<button class="add-to-cart-btn" onclick="addToCartFromGallery('${painting._id}'); event.stopPropagation();">
                                🛒 Add to Cart
                            </button>` : 
                            `<p style="color: #ff4444; font-weight: 600;">SOLD OUT</p>`
                        }
                    </div>
                `;
                
                galleryGrid.appendChild(galleryItem);
            });
            
            console.log(`✅ Loaded ${data.data.length} paintings`);
        }
    } catch (error) {
        console.error('❌ Error loading gallery:', error);
    }
}

// Load gallery when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to let the page render first
    setTimeout(loadGallery, 500);
});

// Optional: Refresh gallery every 30 seconds
// Uncomment if you want auto-refresh
// setInterval(loadGallery, 30000);
