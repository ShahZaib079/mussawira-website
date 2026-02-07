// Wait for page to load completely
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Contact form script loaded!');
    
    const API_URL = 'http://localhost:5000/api';
    const submitBtn = document.getElementById('submitBtn');
    const contactForm = document.getElementById('contactForm');
    
    // Check if elements exist
    if (!submitBtn || !contactForm) {
        console.error('❌ Form elements not found!');
        return;
    }
    
    console.log('✅ Form elements found!');
    
    // Add click event to button
    submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🔵 Submit button clicked!');
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        console.log('Form data:', { name, email, subject, message });
        
        // Validate
        if (!name || !email || !subject || !message) {
            alert('❌ Please fill in all fields!');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('❌ Please enter a valid email address!');
            return;
        }
        
        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        submitBtn.style.cursor = 'wait';
        
        try {
            console.log('🔵 Sending to backend...');
            
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                })
            });
            
            console.log('🔵 Response received:', response.status);
            
            const data = await response.json();
            console.log('🔵 Response data:', data);
            
            if (data.success) {
                alert('✅ ' + data.message);
                
                // Clear form
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('subject').value = '';
                document.getElementById('message').value = '';
                
                console.log('✅ Form submitted successfully!');
            } else {
                alert('❌ Error: ' + data.message);
            }
            
        } catch (error) {
            console.error('❌ Error:', error);
            alert('❌ Could not send message. Make sure backend is running at http://localhost:5000');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            submitBtn.style.cursor = 'pointer';
        }
    });
    
    console.log('✅ Event listener attached to submit button!');
});