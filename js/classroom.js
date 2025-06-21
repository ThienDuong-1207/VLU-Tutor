// Handle chat messages
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        const chatMessages = document.getElementById('chatMessages');
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageHTML = `
            <div class="message student">
                <div class="message-avatar">
                    <img src="https://ui-avatars.com/api/?name=Student&background=4CAF50&color=fff" alt="Student">
                </div>
                <div class="message-content">
                    <div class="message-info">
                        <span class="message-sender">Bạn</span>
                        <span class="message-time">${currentTime}</span>
                    </div>
                    <div class="message-text">
                        ${message}
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        input.value = '';
    }
}

// Handle Enter key in chat input
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

// Handle end class button
document.getElementById('endClassBtn').addEventListener('click', function() {
    const ratingModal = document.getElementById('ratingModal');
    ratingModal.classList.add('active');
});

// Handle star ratings
document.querySelectorAll('.stars').forEach(starsContainer => {
    const stars = starsContainer.querySelectorAll('i');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            const parentStars = this.parentElement.querySelectorAll('i');
            
            parentStars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });

        star.addEventListener('mouseover', function() {
            const rating = this.getAttribute('data-rating');
            const parentStars = this.parentElement.querySelectorAll('i');
            
            parentStars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('hover');
                }
            });
        });

        star.addEventListener('mouseout', function() {
            const parentStars = this.parentElement.querySelectorAll('i');
            parentStars.forEach(s => s.classList.remove('hover'));
        });
    });
});

// Handle rating submission
function submitRating() {
    // Get all ratings
    const ratings = {};
    document.querySelectorAll('.rating-category').forEach(category => {
        const label = category.querySelector('label').textContent;
        const activeStars = category.querySelectorAll('.stars i.active').length;
        ratings[label] = activeStars;
    });

    const overallRating = document.querySelector('.rating-stars .stars i.active:last-child');
    const overallScore = overallRating ? overallRating.getAttribute('data-rating') : 0;
    
    const comment = document.querySelector('textarea').value;

    // TODO: Send ratings to server
    console.log('Ratings:', {
        overall: overallScore,
        categories: ratings,
        comment: comment
    });

    // Show success message
    alert('Cảm ơn bạn đã đánh giá! Bạn sẽ được chuyển về trang chủ.');
    
    // Redirect to student dashboard
    window.location.href = 'student.html';
}

// Handle Teams meeting controls (demo only)
document.querySelectorAll('.btn-control').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        
        if (this.classList.contains('active')) {
            if (icon.classList.contains('fa-video')) {
                icon.classList.replace('fa-video', 'fa-video-slash');
            } else if (icon.classList.contains('fa-microphone')) {
                icon.classList.replace('fa-microphone', 'fa-microphone-slash');
            }
        } else {
            if (icon.classList.contains('fa-video-slash')) {
                icon.classList.replace('fa-video-slash', 'fa-video');
            } else if (icon.classList.contains('fa-microphone-slash')) {
                icon.classList.replace('fa-microphone-slash', 'fa-microphone');
            }
        }
    });
}); 