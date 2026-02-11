const API_URL = 'https://mussawira-backend.vercel.app/api';

// Load approved reviews
async function loadReviews() {
    try {
        const response = await fetch(`${API_URL}/reviews/approved`);
        const data = await response.json();
        
        const reviewsGrid = document.getElementById('reviews-grid');
        
        if (data.success && data.data.length > 0) {
            reviewsGrid.innerHTML = data.data.map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-avatar">${review.customerName.charAt(0).toUpperCase()}</div>
                        <div>
                            <h4>${review.customerName}</h4>
                            <div class="review-stars">${'⭐'.repeat(review.rating)}</div>
                        </div>
                    </div>
                    <p class="review-comment">${review.comment}</p>
                    <p class="review-date">${new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
            `).join('');
        } else {
            reviewsGrid.innerHTML = '<p style="text-align: center; padding: 2rem;">No reviews yet. Be the first to review!</p>';
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsGrid.innerHTML = '<p>Could not load reviews</p>';
    }
}

// Star rating interaction
document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star-rating .star');
    const ratingInput = document.getElementById('rating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            ratingInput.value = rating;
            
            // Update visual
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.opacity = '1';
                    s.style.transform = 'scale(1.2)';
                } else {
                    s.style.opacity = '0.3';
                    s.style.transform = 'scale(1)';
                }
            });
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = this.getAttribute('data-rating');
            stars.forEach((s, index) => {
                s.style.opacity = index < rating ? '1' : '0.3';
            });
        });
    });
    
    document.querySelector('.star-rating').addEventListener('mouseleave', function() {
        const currentRating = ratingInput.value;
        stars.forEach((s, index) => {
            s.style.opacity = index < currentRating ? '1' : '0.3';
        });
    });
    
    // Review form submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const reviewData = {
                customerName: document.getElementById('review-name').value,
                customerEmail: document.getElementById('review-email').value,
                rating: parseInt(document.getElementById('rating').value),
                comment: document.getElementById('review-comment').value
            };
            
            const submitBtn = reviewForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            try {
                const response = await fetch(`${API_URL}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reviewData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('✅ ' + data.message);
                    reviewForm.reset();
                    // Reset stars
                    stars.forEach(s => {
                        s.style.opacity = '1';
                        s.style.transform = 'scale(1)';
                    });
                    ratingInput.value = '5';
                } else {
                    alert('❌ ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('❌ Could not submit review');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Review';
            }
        });
    }
    
    // Load reviews on page load
    loadReviews();
});